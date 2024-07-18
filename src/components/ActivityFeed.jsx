import React, { useEffect, useState } from 'react';
import { getActivities, resetActivities, updateDetail } from '../services';
import { Card, CardContent, Typography, Box, Button, IconButton, Snackbar, Alert, CircularProgress } from '@mui/material';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import { useNavigate } from 'react-router-dom';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import RestoreIcon from '@mui/icons-material/Restore';

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingActivityId, setProcessingActivityId] = useState(null);

  const navigate = useNavigate();

  const fetchActivities = async () => {
    const activityData = await getActivities();
    setActivities(activityData.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const phoneIcon = (activity) => {
    if (activity.call_type === 'answered') {
      if (activity.direction === 'inbound') {
        return <PhoneCallbackIcon color="primary" />;
      } else {
        return <PhoneForwardedIcon color="primary" />;
      }
    } else {
      return <PhoneMissedIcon color="error" />;
    }
  };

  const callType = (activity) => {
    if (activity.call_type === 'answered') {
      if (activity.direction === 'inbound') {
        return 'tried to call';
      } else {
        return 'you called';
      }
    } else {
      return 'tried to call';
    }
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  const groupActivitiesByDate = (activities) => {
    const groups = activities.reduce((groups, activity) => {
      const date = new Date(activity.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    }, {});
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });

    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));

    return sortedDates.reduce((sortedGroups, date) => {
      sortedGroups[date] = groups[date];
      return sortedGroups;
    }, {});
  };

  const calculateDashes = (dateText, maxWidth) => {
    const dateWidth = dateText.length * 25;
    const dashesNeeded = Math.floor((maxWidth - dateWidth) / 10 / 2);
    return '-'.repeat(dashesNeeded);
  };

  const handleArchiveToggle = async (activity) => {
    setProcessingActivityId(activity.id);
    await updateDetail(activity);
    fetchActivities();
    setProcessingActivityId(null);
  };

  const resetArchivedCalls = async () => {
    setLoading(true);
    await resetActivities();
    setLoading(false);
    fetchActivities();
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const filteredActivities = showArchived
    ? activities.filter((activity) => activity.is_archived)
    : activities.filter((activity) => !activity.is_archived);

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', margin: '16px', alignItems: 'center', position: 'relative' }}>
      <Box sx={{ height: '80vh', width: '100%', maxWidth: 500 }}>
        <Box sx={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ArchiveOutlinedIcon />}
            onClick={() => setShowArchived(!showArchived)}
            sx={{ width: '48%', backgroundColor: '#f0f0f0' }}
          >
            {showArchived ? 'Show All' : 'Archived'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={resetArchivedCalls}
            sx={{ width: '48%', backgroundColor: '#f0f0f0' }}
          >
            Reset Calls
          </Button>
        </Box>

        {Object.keys(groupedActivities).length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center">
            {showArchived ? 'No archived activities.' : 'No active activities.'}
          </Typography>
        ) : (
          Object.keys(groupedActivities).map((date) => {
            const dashes = calculateDashes(date, 500);
            return (
              <Box key={date} sx={{ marginBottom: '16px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  <Typography variant="h5" sx={{ display: 'inline-block', backgroundColor: '#ffffff', padding: '0 8px' }}>
                    {`${dashes} ${formatDate(date)} ${dashes}`}
                  </Typography>
                </Box>
                {groupedActivities[date].map((activity) => (
                  <Card
                    key={activity.id}
                    sx={{
                      margin: '8px 0',
                      boxShadow: 3,
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      height: '15vh',
                      opacity: processingActivityId === activity.id ? 0.5 : 1,
                    }}
                    onClick={() => navigate(`/activityDetail/${activity.id}`)}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        {phoneIcon(activity)}
                        <Box sx={{ marginLeft: '8px' }}>
                          <Typography variant="body2" color="textSecondary">
                            {activity.from}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {callType(activity)} {activity.to}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="textSecondary" sx={{ marginRight: '8px' }}>
                          {formatTime(activity.created_at)}
                        </Typography>
                        <IconButton
                          onClick={(e) => { e.stopPropagation(); handleArchiveToggle(activity); }}
                          sx={{ marginLeft: 'auto' }}
                        >
                          {processingActivityId === activity.id ? (
                            <CircularProgress size={24} />
                          ) : activity.is_archived ? (
                            <UnarchiveIcon />
                          ) : (
                            <ArchiveIcon />
                          )}
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            );
          })
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            Archived calls reset successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
