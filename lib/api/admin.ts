import { apiClient } from "./client";
import type { AdminResponse, PasswordUpdateRequest } from "@/types";

export const adminApi = {
  getAdmins: async (): Promise<AdminResponse[]> => {
    const response = await apiClient.get<AdminResponse[]>("/admins");
    return response.data;
  },

  getAdmin: async (userId: string): Promise<AdminResponse> => {
    const response = await apiClient.get<AdminResponse>(`/admins/${userId}`);
    return response.data;
  },

  updatePassword: async (userId: string, data: PasswordUpdateRequest): Promise<string> => {
    const response = await apiClient.patch<string>(`/admins/${userId}`, data);
    return response.data;
  },

  deleteAdmin: async (userId: string): Promise<void> => {
    await apiClient.delete(`/admins/${userId}`);
  },
};

