import { apiClient } from "./client";
import type { CourseRequest, CourseResponse } from "@/types";

export const courseApi = {
  createCourse: async (data: CourseRequest): Promise<CourseResponse> => {
    const response = await apiClient.post<CourseResponse>("/classes", data);
    return response.data;
  },

  getCourses: async (): Promise<CourseResponse[]> => {
    const response = await apiClient.get<CourseResponse[]>("/classes");
    return response.data;
  },

  getCourse: async (courseId: number): Promise<CourseResponse> => {
    const response = await apiClient.get<CourseResponse>(`/classes/${courseId}`);
    return response.data;
  },

  updateCourse: async (courseId: number, data: CourseRequest): Promise<CourseResponse> => {
    const response = await apiClient.put<CourseResponse>(`/classes/${courseId}`, data);
    return response.data;
  },

  deleteCourse: async (courseId: number): Promise<void> => {
    await apiClient.delete(`/classes/${courseId}`);
  },
};

