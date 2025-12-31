// 인증/인가 관련 타입
export interface SignupRequest {
  userId: string;
  password: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// 관리자 관련 타입
export type AdminRole = "MASTER" | "ADMIN";

export interface AdminResponse {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface PasswordUpdateRequest {
  oldPassword: string;
  newPassword: string;
}

// 강의(코스) 관련 타입
export interface CourseRequest {
  courseName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface CourseResponse {
  id: number;
  courseName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

// 회의실(룸) 관련 타입
export interface RoomRequest {
  roomName: string;
  location?: number;
  capacity: number;
  description?: string;
}

export interface RoomResponse {
  id: number;
  roomName: string;
  location: number | null;
  capacity: number;
  description: string | null;
}

// 예약 관련 타입
export type ReservationStatus = "예약" | "취소" | "완료";

export interface ReservationRequest {
  courseId: number;
  userName: string;
  phoneLastNumber: string; // ^[0-9]{4}$
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  reservationDate: string; // YYYY-MM-DD
}

export interface AdminReservationRequest {
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  reservationDate: string; // YYYY-MM-DD
}

export interface ReservationSearchRequest {
  userName: string;
  phoneLastNumber: string;
}

export interface ReservationUpdateRequest {
  userName: string;
  phoneLastNumber: string;
  startTime: string;
  endTime: string;
  reservationDate: string;
}

export interface CancelReservationRequest {
  // 백엔드 CancelReservationReqDto 구조에 맞춰 필드 추가 필요
  // 현재는 정보가 없어 빈 객체로 정의
}

export interface ReservationResponse {
  id: number;
  roomName: string;
  courseName: string;
  userName: string;
  status: ReservationStatus;
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  reservationDate: string; // YYYY-MM-DD
}

export interface ReservationAdminResponse {
  id: number;
  roomName: string;
  courseName: string;
  userName: string;
  phoneLastNumber: string;
  status: ReservationStatus;
  startTime: string;
  endTime: string;
  reservationDate: string;
  createdAt: string; // YYYY-MM-DDTHH:mm:ss
}

// 페이지네이션 관련 타입
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
  };
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// 공지사항 관련 타입
export interface NoticeRequest {
  title: string;
  content: string;
  status: boolean;
}

export interface NoticeResponse {
  id: number;
  title: string;
  content: string;
  status: boolean;
  createdAt: string; // ISO 8601 형식 (YYYY-MM-DDTHH:mm:ss)
  updatedAt: string; // ISO 8601 형식 (YYYY-MM-DDTHH:mm:ss)
}

// 에러 응답 타입
export interface ErrorResponse {
  status: number;
  message: string;
}


