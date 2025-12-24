"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import { roomApi } from "@/lib/api/room";
import { reservationApi } from "@/lib/api/reservation";
import type { RoomResponse, ReservationResponse } from "@/types";
import Link from "next/link";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [reservations, setReservations] = useState<Record<number, ReservationResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<ReservationResponse | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      fetchReservations();
    }
  }, [rooms, selectedDate]);

  const fetchRooms = async () => {
    try {
      const data = await roomApi.getRooms();
      setRooms(data);
    } catch (error) {
      console.error("회의실 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const reservationsMap: Record<number, ReservationResponse[]> = {};
      for (const room of rooms) {
        const data = await reservationApi.getRoomReservations(room.id, selectedDate);
        reservationsMap[room.id] = data;
      }
      setReservations(reservationsMap);
    } catch (error) {
      console.error("예약 조회 실패:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}요일`;
  };

  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    // 9시부터 23시까지 총 14시간 기준 (28개 슬롯)
    const totalMinutesFromStart = (hours - 9) * 60 + minutes;
    const totalGridMinutes = 14 * 60;
    return (totalMinutesFromStart / totalGridMinutes) * 100;
  };

  const getTimeWidth = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    const totalGridMinutes = 14 * 60;
    return (durationMinutes / totalGridMinutes) * 100;
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
      <Header 
        variant="page"
        rightContent={
          <div className="flex flex-1 justify-end items-center gap-4 sm:gap-6">
            <Link
              href="/rooms/select"
              className="flex items-center justify-center gap-2 min-w-[100px] h-10 px-4 bg-primary text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-all"
            >
              <span className="truncate">새 예약</span>
            </Link>
          </div>
        }
      />
      <main className="flex flex-1 justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
        <div className="flex w-full max-w-7xl flex-col">
          <main className="flex flex-col gap-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2">
              <p className="text-4xl font-black tracking-tighter">회의실 예약 현황</p>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark dark:border dark:border-border-dark pl-4 pr-3 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                />
              </div>
            </div>
            <div className="py-3 overflow-x-auto sm:px-2">
              <div className="min-w-full w-fit rounded-none sm:rounded-xl border-y sm:border border-border-light dark:border-border-dark bg-white dark:bg-background-dark shadow-sm">
                <div className="relative min-w-fit">
                  {/* Table Header (Rooms) */}
                  <div className="flex border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-white/5 sticky top-0 z-30">
                    <div className="sticky left-0 z-40 w-16 bg-gray-50 dark:bg-white/5 border-r border-border-light dark:border-border-dark flex-shrink-0" />
                    <div className="flex flex-1">
                      {rooms.map((room) => (
                        <div key={room.id} className="flex-1 min-w-[100px] sm:min-w-[120px] h-12 flex items-center justify-center text-xs sm:text-sm font-bold text-text-light dark:text-text-dark border-r border-border-light/50 dark:border-border-dark/50 last:border-r-0">
                          {room.roomName}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Table Body (Time & Content) */}
                  <div className="flex relative h-[840px]"> {/* 14시간 * 60px = 840px */}
                    
                    {/* Time Column (Left Sidebar) */}
                    <div className="sticky left-0 z-30 w-16 bg-white dark:bg-background-dark border-r border-border-light dark:border-border-dark flex-shrink-0 flex flex-col">
                      {Array.from({ length: 14 }, (_, i) => (
                        <div key={i} className="flex-1 border-b border-border-light/30 dark:border-border-dark/30 text-xs text-text-light-secondary dark:text-dark-secondary font-medium flex items-start justify-center pt-2">
                          {9 + i}:00
                        </div>
                      ))}
                    </div>

                    {/* Rooms Columns */}
                    <div className="flex flex-1 relative">
                      {/* Background Grid Lines (Horizontal) */}
                      <div className="absolute inset-0 flex flex-col z-0 pointer-events-none">
                         {Array.from({ length: 14 }, (_, i) => (
                           <div key={i} className="flex-1 border-b border-border-light/30 dark:border-border-dark/30" />
                         ))}
                      </div>

                      {/* Room Columns with Reservations */}
                      {rooms.map((room) => {
                        const roomReservations = reservations[room.id] || [];
                        return (
                          <div key={room.id} className="flex-1 min-w-[100px] sm:min-w-[120px] relative border-r border-border-light/30 dark:border-border-dark/30 last:border-r-0 z-10 group hover:bg-gray-50/30 dark:hover:bg-white/5 transition-colors">
                            {(() => {
                                // 겹치는 예약 중 가장 최신(ID가 큰 것)만 필터링
                                const filteredReservations = [...roomReservations]
                                  .sort((a, b) => b.id - a.id) // ID 내림차순 (최신순)
                                  .reduce((acc: ReservationResponse[], current) => {
                                    const isOverlapped = acc.some(existing => {
                                      return (current.startTime < existing.endTime && current.endTime > existing.startTime);
                                    });
                                    if (!isOverlapped) acc.push(current);
                                    return acc;
                                  }, []);

                                return filteredReservations.map((res) => {
                                  // 기존 함수 재사용: getTimePosition -> top %, getTimeWidth -> height %
                                  const top = getTimePosition(res.startTime);
                                  const height = getTimeWidth(res.startTime, res.endTime);
                                  
                                  return (
                                    <div
                                      key={res.id}
                                      onClick={() => setSelectedReservation(res)}
                                      className="absolute left-1 right-1 bg-primary rounded-lg text-white px-2 shadow-sm z-20 transition-all hover:brightness-110 cursor-pointer hover:z-30 overflow-hidden flex flex-col justify-center"
                                      style={{
                                        top: `${top}%`,
                                        height: `calc(${height}% - 2px)`,
                                      }}
                                    >
                                      {/* 모든 예약에 대해 이름과 시간을 가로 배치(공간 부족 시 줄바꿈) 혹은 한 줄 유지 */}
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                                        <p className="text-[10px] sm:text-xs font-bold truncate shrink-0 mr-1">
                                          {res.userName}
                                        </p>
                                        <p className="text-[9px] sm:text-[10px] truncate opacity-90 shrink-0">
                                          {res.startTime.substring(0, 5)} - {res.endTime.substring(0, 5)}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-6 px-4 py-2 text-sm text-text-light-secondary dark:text-dark-secondary">
              <div className="flex items-center gap-2">
                <div className="size-4 rounded bg-primary"></div>
                <span>예약됨</span>
              </div>
            </div>
          </main>
        </div>
      </main>
      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedReservation(null)}>
          <div className="bg-white dark:bg-background-dark w-full max-w-sm rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold">예약 상세 정보</h3>
              <button 
                onClick={() => setSelectedReservation(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-text-light-secondary dark:text-dark-secondary font-medium">회의실</span>
                <span className="text-base font-semibold">{selectedReservation.roomName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-light-secondary dark:text-dark-secondary font-medium">소속 클래스</span>
                <span className="text-base font-semibold">{selectedReservation.courseName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-light-secondary dark:text-dark-secondary font-medium">예약자</span>
                <span className="text-base font-semibold">{selectedReservation.userName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-light-secondary dark:text-dark-secondary font-medium">예약 시간</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-bold">
                    {selectedReservation.startTime.substring(0, 5)}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-bold">
                    {selectedReservation.endTime.substring(0, 5)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-light-secondary dark:text-dark-secondary font-medium">상태</span>
                <span className={`text-sm font-bold mt-1 ${
                  selectedReservation.status === "예약" ? "text-green-500" : "text-red-500"
                }`}>
                  ● {selectedReservation.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReservation(null)}
              className="mt-4 w-full h-11 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


