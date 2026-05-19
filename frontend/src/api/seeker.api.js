import { api } from "./user.api";

/**
 * 🔖 Save a job
 */
export const saveJob = async (jobId) => {
  const response = await api.post(`/seeker/jobs/${jobId}/save`);
  return response.data;
};

/**
 * 🗑️ Unsave a job
 */
export const unsaveJob = async (jobId) => {
  const response = await api.delete(`/seeker/jobs/${jobId}/save`);
  return response.data;
};

/**
 * 📋 Get all saved jobs
 */
export const getSavedJobs = async () => {
  const response = await api.get("/seeker/jobs/saved");
  return response.data;
};

/**
 * ❓ Check if a job is saved
 */
export const checkIsSaved = async (jobId) => {
  const response = await api.get(`/seeker/jobs/${jobId}/is-saved`);
  return response.data;
};
