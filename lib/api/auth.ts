import { apiClient } from "./client";
import type { SignupRequest, LoginRequest, RefreshTokenRequest, AdminResponse } from "@/types";

export const authApi = {
  signup: async (data: SignupRequest): Promise<AdminResponse> => {
    const response = await apiClient.post<AdminResponse>("/auth/signup", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<void> => {
    const response = await apiClient.post<string>("/auth/login", data);
    
    // 헤더에서 토큰 추출
    const accessToken = response.headers["authorization"]?.replace("Bearer ", "");
    const refreshToken = response.headers["refresh-token"];

    if (accessToken && typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  refresh: async (data: RefreshTokenRequest): Promise<void> => {
    const response = await apiClient.post("/auth/refresh", data);
    
    const newAccessToken = response.headers["authorization"]?.replace("Bearer ", "");
    const newRefreshToken = response.headers["refresh-token"];

    if (newAccessToken && typeof window !== "undefined") {
      localStorage.setItem("accessToken", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }
    }
  },
};

