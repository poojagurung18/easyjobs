import api from "./auth";

//admin api calls

export const adminService = {
  deleteOwnAccount: async () => {
    const response = await api.delete("/admin");
    return response.data;
  },

  resetRecruiterReport: async (recruiterId) => {
    const response = await api.put(
      `/admin/recruiter/${recruiterId}/reset-report`,
    );
    return response.data;
  },

  toggleBlockRecruiter: async (recruiterId) => {
    const response = await api.put(`/admin/recruiter/${recruiterId}/toggle-block`);
    return response.data;
  },

  deleteRecruiter: async (recruiterId) => {
    const response = await api.delete(`/admin/recruiter/${recruiterId}`);
    return response.data;
  },

  getReportedRecruiters: async () => {
    const response = await api.get(`/admin/recruiters/reported`);
    return response.data;
  },

  getUnverifiedRecruiters: async () => {
    const response = await api.get(`/admin/recruiters/unverified`);
    return response.data;
  },

  verifyRecruiter: async (recruiterId) => {
    const response = await api.put(`/admin/recruiter/${recruiterId}/verify`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getRecruiterProfile: async (recruiterId) => {
    const response = await api.get(`/admin/recruiter/${recruiterId}`);
    return response.data;
  },
};
