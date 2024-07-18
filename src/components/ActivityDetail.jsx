import React, { useEffect, useState } from 'react';
import Header from '../Header.jsx';
import { getDetailsById } from '../services/index.js';
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Box, IconButton, CircularProgress, Divider, Grid } from '@mui/material';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import CallIcon from '@mui/icons-material/Call';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';

export default function ActivityDetail(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activityDetail, setActivityDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const details = await getDetailsById(id);
                setActivityDetail(details.data);
            } catch (error) {
                console.error('Error fetching activity detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!activityDetail) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6" color="error">
                    Activity not found.
                </Typography>
            </Box>
        );
    }

    return (
        <div className='container'>
            <Header />
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                <Box sx={{ width: '100%', maxWidth: 500 }}>
                    <IconButton
                        sx={{ marginBottom: '16px' }}
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                                {phoneIcon(activityDetail)} <Box sx={{ marginLeft: '8px' }}>Call Details</Box>
                            </Typography>
                            <Divider sx={{ marginBottom: '16px' }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PersonIcon sx={{ marginRight: '8px' }} /><Typography variant="body2" color="textSecondary"><strong>From</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">{activityDetail.from}</Typography>
                                </Grid>

                                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PersonIcon sx={{ marginRight: '8px' }} /><Typography variant="body2" color="textSecondary"><strong>To</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">{activityDetail.to}</Typography>
                                </Grid>

                                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CallIcon sx={{ marginRight: '8px' }} /><Typography variant="body2" color="textSecondary"><strong>Via</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">{activityDetail.via}</Typography>
                                </Grid>

                                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PhoneInTalkIcon sx={{ marginRight: '8px' }} /><Typography variant="body2" color="textSecondary"><strong>Direction</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">{activityDetail.direction}</Typography>
                                </Grid>

                                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CallIcon sx={{ marginRight: '8px' }} /><Typography variant="body2" color="textSecondary"><strong>Call Type</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">{activityDetail.call_type}</Typography>
                                </Grid>

                                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTimeIcon sx={{ marginRight: '8px' }} /><Typography variant="body2" color="textSecondary"><strong>Duration</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">{activityDetail.duration} seconds</Typography>
                                </Grid>

                                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <EventIcon sx={{ marginRight: '8px' }} /><Typography variant="body2" color="textSecondary"><strong>Created At</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">{new Date(activityDetail.created_at).toLocaleString()}</Typography>
                                </Grid>

                                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                    {activityDetail.is_archived ? <ArchiveIcon sx={{ marginRight: '8px' }} /> : <UnarchiveIcon sx={{ marginRight: '8px' }} />}
                                    <Typography variant="body2" color="textSecondary"><strong>Archived</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">{activityDetail.is_archived ? 'Yes' : 'No'}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </div>
    );
}
