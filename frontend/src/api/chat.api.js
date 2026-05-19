import { api } from "./user.api";

export const getOrCreateChatRoom = async (seekerUserId, jobId) => {
  const response = await api.post(
    `/api/chat/room?seekerUserId=${seekerUserId}&jobId=${jobId}`,
  );
  return response.data;
};

export const getUserChatRooms = async () => {
  const response = await api.get("/api/chat/rooms");
  return response.data;
};

export const getChatMessages = async (roomId, page = 0, size = 50) => {
  const response = await api.get(
    `/api/chat/rooms/${roomId}/messages?page=${page}&size=${size}`,
  );
  return response.data;
};
