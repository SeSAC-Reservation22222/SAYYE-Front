import { apiClient } from "./client";
import type { NoticeRequest, NoticeResponse } from "@/types";

export const noticeApi = {
  createNotice: async (data: NoticeRequest): Promise<NoticeResponse> => {
    const response = await apiClient.post<NoticeResponse>("/notices", data);
    return response.data;
  },

  getNotices: async (): Promise<NoticeResponse[]> => {
    const response = await apiClient.get<NoticeResponse[]>("/notices");
    return response.data;
  },

  getNotice: async (noticeId: number): Promise<NoticeResponse> => {
    const response = await apiClient.get<NoticeResponse>(`/notices/${noticeId}`);
    return response.data;
  },

  updateNotice: async (noticeId: number, data: NoticeRequest): Promise<NoticeResponse> => {
    const response = await apiClient.put<NoticeResponse>(`/notices/${noticeId}`, data);
    return response.data;
  },

  deleteNotice: async (noticeId: number): Promise<void> => {
    await apiClient.delete(`/notices/${noticeId}`);
  },
};
