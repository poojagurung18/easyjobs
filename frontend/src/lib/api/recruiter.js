import api from "./auth";

export const recruiterService = {
  createProfile: async (formData) => {
    const response = await api.post("/recruiter/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await api.put("/recruiter/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/recruiter/profile");
    return response.data;
  },

  deleteProfile: async () => {
    const response = await api.delete("/recruiter/profile");
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post("/recruiter/jobs", jobData);
    return response.data;
  },

  getJobs: async () => {
    const response = await api.get("/recruiter/jobs");
    return response.data;
  },

  getCredits: async () => {
    const response = await api.get("/recruiter/credits");
    return response.data;
  },

  getJob: async (jobId) => {
    const response = await api.get(`/recruiter/jobs/${jobId}`);
    return response.data;
  },

  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/recruiter/jobs/${jobId}`, jobData);
    return response.data;
  },

  deleteJob: async (jobId) => {
    const response = await api.delete(`/recruiter/jobs/${jobId}`);
    return response.data;
  },

  getApplications: async () => {
    const response = await api.get("/recruiter/applications");
    return response.data;
  },

  getJobApplications: async (jobId) => {
    const response = await api.get(`/recruiter/jobs/${jobId}/applications`);
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status, interviewDate) => {
    const response = await api.put(
      `/recruiter/applications/${applicationId}/status`,
      { status, interviewDate },
    );
    return response.data;
  },

  getSubscription: async () => {
    const response = await api.get("/recruiter/subscription");
    return response.data;
  },

  createPayment: async (planName) => {
    const response = await api.post("/payment/create", { planName });
    return response.data;
  },
};
