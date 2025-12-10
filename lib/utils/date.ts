/**
 * 날짜 관련 유틸리티 함수
 */

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleString("ko-KR");
};

export const formatTime = (timeString: string): string => {
  return timeString.split(":").slice(0, 2).join(":");
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const getWeekday = (dateString: string): string => {
  const date = new Date(dateString);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return weekdays[date.getDay()];
};

