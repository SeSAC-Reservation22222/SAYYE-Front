"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/common/Header";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Select from "@/components/common/Select";
import Input from "@/components/common/Input";
import AdminGuard from "@/components/common/AdminGuard";
import { reservationApi } from "@/lib/api/reservation";
import { roomApi } from "@/lib/api/room";
import type { ReservationAdminResponse, PaginatedResponse, RoomResponse } from "@/types";

export default function AdminReservationsPage() {
  const [rawReservations, setRawReservations] = useState<ReservationAdminResponse[]>([]);
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    roomId: "",
    status: "",
    userName: "",
    date: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [page]);

  const fetchRooms = async () => {
    try {
      const data = await roomApi.getRooms();
      setRooms(data);
    } catch (error) {
      console.error("회의실 조회 실패:", error);
    }
  };

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data: PaginatedResponse<ReservationAdminResponse> =
        await reservationApi.getAdminReservations(page);
      
      setRawReservations(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("예약 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = useMemo(() => {
    let filtered = [...rawReservations];
    
    if (filters.date) {
      filtered = filtered.filter(res => res.reservationDate === filters.date);
    }
    
    if (filters.roomId) {
      const selectedRoomName = rooms.find(r => r.id === Number(filters.roomId))?.roomName;
      if (selectedRoomName) {
        filtered = filtered.filter(res => res.roomName === selectedRoomName);
      }
    }
    if (filters.status) {
      filtered = filtered.filter(res => res.status === filters.status);
    }
    if (filters.userName) {
      filtered = filtered.filter(res => 
        res.userName.toLowerCase().includes(filters.userName.toLowerCase())
      );
    }
    return filtered;
  }, [rawReservations, filters, rooms]);

  const handleCancel = async (reservationId: number) => {
    if (!confirm("정말 예약을 취소하시겠습니까?")) return;
    try {
      await reservationApi.cancelReservation(reservationId);
      alert("예약이 취소되었습니다.");
      fetchReservations();
    } catch (error: any) {
      alert(error.response?.data?.message || "취소에 실패했습니다.");
    }
  };

  if (loading && rawReservations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="relative flex min-h-screen w-full flex-col">
        <Header showLogout />
        <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-black tracking-tight mb-8">예약 현황 관리</h1>

          {/* Filtering Bar */}
          <Card className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="날짜 필터"
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
              <Select
                label="회의실 필터"
                options={[
                  { value: "", label: "전체 회의실" },
                  ...rooms.map(room => ({ value: room.id.toString(), label: room.roomName }))
                ]}
                value={filters.roomId}
                onChange={(e) => setFilters({ ...filters, roomId: e.target.value })}
              />
              <Select
                label="상태 필터"
                options={[
                  { value: "", label: "전체 상태" },
                  { value: "예약", label: "예약" },
                  { value: "취소", label: "취소" },
                  { value: "완료", label: "완료" },
                ]}
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              />
              <Input
                label="예약자 검색"
                placeholder="이름을 입력하세요"
                value={filters.userName}
                onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
              />
            </div>
          </Card>

          <div className="flex flex-col gap-4 mb-8">
            {filteredReservations.length === 0 ? (
              <Card>
                <div className="py-12 flex flex-col items-center justify-center text-text-light-secondary dark:text-dark-secondary">
                  <p>조건에 맞는 예약 내역이 없습니다.</p>
                </div>
              </Card>
            ) : (
              filteredReservations.map((reservation) => (
                <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    {/* Left: Time & Date Side Badge */}
                    <div className="flex items-center gap-4 min-w-[150px]">
                      <div className="flex flex-col items-center justify-center size-16 rounded-xl bg-primary/10 text-primary">
                        <span className="text-xs font-bold">{new Date(reservation.reservationDate).getMonth() + 1}월</span>
                        <span className="text-2xl font-black">{new Date(reservation.reservationDate).getDate()}일</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-500">{new Date(reservation.reservationDate).toLocaleDateString("ko-KR", { weekday: 'short' })}요일</span>
                        <span className="text-base font-black text-primary">
                          {reservation.startTime.substring(0, 5)} - {reservation.endTime.substring(0, 5)}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Content */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 lg:max-w-2xl">
                      <div className="min-w-[120px]">
                        <p className="text-[10px] text-gray-400 font-medium mb-1">회의실</p>
                        <p className="text-sm font-bold truncate">{reservation.roomName}</p>
                      </div>
                      <div className="min-w-[150px]">
                        <p className="text-[10px] text-gray-400 font-medium mb-1">예약자 (클래스)</p>
                        <p className="text-sm font-bold truncate">
                          {reservation.userName} <span className="text-xs font-normal text-gray-500">({reservation.courseName})</span>
                        </p>
                      </div>
                      <div className="min-w-[100px]">
                        <p className="text-[10px] text-gray-400 font-medium mb-1">식별번호</p>
                        <p className="text-sm font-bold">
                          {reservation.userName === 'master' || !reservation.phoneLastNumber ? '-' : reservation.phoneLastNumber}
                        </p>
                      </div>
                    </div>

                    {/* Right: Status & Action */}
                    <div className="flex items-center gap-4 w-full lg:w-48 justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                        reservation.status === '예약' ? 'bg-green-100 text-green-600' :
                        reservation.status === '취소' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {reservation.status}
                      </span>
                      {reservation.status === '예약' && (
                        <Button
                          variant="secondary"
                          onClick={() => handleCancel(reservation.id)}
                          size="sm"
                          className="text-red-500 hover:text-red-600 shrink-0"
                        >
                          취소
                        </Button>
                      )}
                    </div>
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
              <span className="flex items-center px-4 text-sm font-medium">
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
    </AdminGuard>
  );
}

