import api from "./auth";

export const paymentService = {
  createPayment: async () => {
    const response = await api.post("/payment/create");
    return response.data;
  },
};
