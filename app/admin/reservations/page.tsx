"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { reservationApi } from "@/lib/api/reservation";
import type { ReservationAdminResponse, PaginatedResponse } from "@/types";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationAdminResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, [page]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data: PaginatedResponse<ReservationAdminResponse> =
        await reservationApi.getAdminReservations(page);
      setReservations(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("예약 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reservationId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      // 관리자용 삭제는 별도 API가 필요할 수 있습니다.
      // 현재는 사용자용 API를 사용합니다.
      alert("관리자용 삭제 기능은 별도 구현이 필요합니다.");
    } catch (error: any) {
      alert(error.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header showLogout />
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-black tracking-tight mb-8">예약 현황 관리</h1>

        <div className="flex flex-col gap-4 mb-8">
          {reservations.length === 0 ? (
            <Card>
              <p className="text-center text-text-light-secondary dark:text-text-dark-secondary">
                예약 내역이 없습니다.
              </p>
            </Card>
          ) : (
            reservations.map((reservation) => (
              <Card key={reservation.id}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{reservation.roomName}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      <p>
                        <span className="font-semibold">강의:</span> {reservation.courseName}
                      </p>
                      <p>
                        <span className="font-semibold">예약자:</span> {reservation.userName}
                      </p>
                      <p>
                        <span className="font-semibold">연락처:</span> {reservation.phoneLastNumber}
                      </p>
                      <p>
                        <span className="font-semibold">상태:</span> {reservation.status}
                      </p>
                      <p>
                        <span className="font-semibold">날짜:</span>{" "}
                        {new Date(reservation.reservationDate).toLocaleDateString("ko-KR")}
                      </p>
                      <p>
                        <span className="font-semibold">시간:</span>{" "}
                        {reservation.startTime.split(":").slice(0, 2).join(":")} ~{" "}
                        {reservation.endTime.split(":").slice(0, 2).join(":")}
                      </p>
                      <p>
                        <span className="font-semibold">생성일:</span>{" "}
                        {new Date(reservation.createdAt).toLocaleString("ko-KR")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => handleDelete(reservation.id)}
                    size="sm"
                  >
                    삭제
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              이전
            </Button>
            <span className="flex items-center px-4">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              다음
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

