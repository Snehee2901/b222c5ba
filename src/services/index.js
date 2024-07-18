import axios from "axios";

export const getActivities = () => {
  return axios.get("https://aircall-backend.onrender.com/activities");
};

export const getDetailsById = (id) => {
  return axios.get(`https://aircall-backend.onrender.com/activities/${id}`);
};

export const updateDetail = (activity) => {
  return axios.patch(
    `https://aircall-backend.onrender.com/activities/${activity.id}`,
    {
      is_archived: !activity.is_archived,
    }
  );
};
export const resetActivities = () => {
  return axios.patch(`https://aircall-backend.onrender.com/reset`);
};
