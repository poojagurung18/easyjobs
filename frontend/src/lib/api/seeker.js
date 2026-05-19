import api from "./auth";

export const seekerService = {
  // Profile
  createProfile: async (data) => {
    const response = await api.post("/seeker/profile", data);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/seeker/profile", data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/seeker/profile");
    return response.data;
  },

  // Jobs
  getAllJobs: async () => {
    const response = await api.get("/seeker/jobs");
    return response.data;
  },

  getJob: async (jobId) => {
    const response = await api.get(`/seeker/jobs/${jobId}`);
    return response.data;
  },

  getRecommendedJobs: async () => {
    const response = await api.get("/seeker/recommended-jobs");
    return response.data;
  },

  searchJobs: async (keyword, location, minSalary) => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (location) params.append("location", location);
    if (minSalary) params.append("minSalary", minSalary.toString());
    const response = await api.get(`/seeker/search?${params.toString()}`);
    return response.data;
  },

  // Applications
  getApplications: async () => {
    const response = await api.get("/seeker/applications");
    return response.data;
  },

  applyForJob: async (jobId, resumeFile, coverLetter = "", additionalDocuments = []) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    if (coverLetter) {
      formData.append("coverLetter", coverLetter);
    }
    
    if (additionalDocuments && additionalDocuments.length > 0) {
      additionalDocuments.forEach(doc => {
        if (doc.file) {
          formData.append("additionalFiles", doc.file);
          formData.append("additionalFileNames", doc.name);
        }
      });
    }

    const response = await api.post(`/seeker/apply/${jobId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Recruiter
  getRecruiterProfile: async (recruiterId) => {
    const response = await api.get(`/seeker/recruiter/${recruiterId}`);
    return response.data;
  },

  reportRecruiter: async (recruiterId, reason) => {
    const response = await api.post(`/seeker/report/${recruiterId}`, {
      reason,
    });
    return response.data;
  },
};
