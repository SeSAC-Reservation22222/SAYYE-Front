import { apiClient } from "./client";
import type { RoomRequest, RoomResponse } from "@/types";

export const roomApi = {
  createRoom: async (data: RoomRequest): Promise<RoomResponse> => {
    const response = await apiClient.post<RoomResponse>("/rooms", data);
    return response.data;
  },

  getRooms: async (): Promise<RoomResponse[]> => {
    const response = await apiClient.get<RoomResponse[]>("/rooms");
    return response.data;
  },

  getRoom: async (roomId: number): Promise<RoomResponse> => {
    const response = await apiClient.get<RoomResponse>(`/rooms/${roomId}`);
    return response.data;
  },

  updateRoom: async (roomId: number, data: RoomRequest): Promise<RoomResponse> => {
    const response = await apiClient.put<RoomResponse>(`/rooms/${roomId}`, data);
    return response.data;
  },

  deleteRoom: async (roomId: number): Promise<string> => {
    const response = await apiClient.delete<string>(`/rooms/${roomId}`);
    return response.data;
  },
};


