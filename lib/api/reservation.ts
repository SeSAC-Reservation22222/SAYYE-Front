import { apiClient } from "./client";
import type {
  ReservationRequest,
  AdminReservationRequest,
  ReservationSearchRequest,
  ReservationUpdateRequest,
  ReservationResponse,
  ReservationAdminResponse,
  PaginatedResponse,
  CancelReservationRequest,
} from "@/types";

export const reservationApi = {
  createReservation: async (
    roomId: number,
    data: ReservationRequest
  ): Promise<ReservationResponse> => {
    const response = await apiClient.post<ReservationResponse>(
      `/rooms/${roomId}/reservations`,
      data
    );
    return response.data;
  },

  createAdminReservation: async (
    roomId: number,
    data: AdminReservationRequest
  ): Promise<ReservationResponse> => {
    const response = await apiClient.post<ReservationResponse>(
      `/admins/rooms/${roomId}/reservations`,
      data
    );
    return response.data;
  },

  getReservations: async (
    roomId: number,
    params: ReservationSearchRequest
  ): Promise<ReservationResponse[]> => {
    const response = await apiClient.post<ReservationResponse[]>(
      `/reservations`,
      {
        ...params,
        roomId
      }
    );
    return response.data;
  },

  getReservation: async (
    reservationId: number,
    data: ReservationSearchRequest
  ): Promise<ReservationResponse> => {
    const response = await apiClient.post<ReservationResponse>(
      `/reservations/${reservationId}`,
      data
    );
    return response.data;
  },

  updateReservation: async (
    reservationId: number,
    data: ReservationUpdateRequest
  ): Promise<ReservationResponse> => {
    const response = await apiClient.patch<ReservationResponse>(
      `/reservations/${reservationId}`,
      data
    );
    return response.data;
  },

  deleteReservation: async (
    reservationId: number,
    data: ReservationSearchRequest
  ): Promise<void> => {
    await apiClient.delete(`/reservations/${reservationId}`, { data });
  },

  cancelReservation: async (
    reservationId: number,
    data: CancelReservationRequest = {}
  ): Promise<void> => {
    // Axios delete 메서드의 두 번째 인자는 config 객체이며, body는 data 프로퍼티에 할당해야 함
    await apiClient.delete(`/reservations/${reservationId}`, { data });
  },

  getAdminReservations: async (page: number = 1): Promise<PaginatedResponse<ReservationAdminResponse>> => {
    const response = await apiClient.get<PaginatedResponse<ReservationAdminResponse>>(
      `/reservations?page=${page}`
    );
    return response.data;
  },

  getRoomReservations: async (
    roomId: number,
    reservationDate: string
  ): Promise<ReservationResponse[]> => {
    const response = await apiClient.get<ReservationResponse[]>(`/rooms/${roomId}/reservations`, {
      params: { reservationDate },
    });
    return response.data;
  },
};


