"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { roomApi } from "@/lib/api/room";
import { reservationApi } from "@/lib/api/reservation";
import type { RoomResponse, ReservationResponse } from "@/types";

export default function RoomMonitorPage() {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  // 항상 오늘 날짜로 고정
  const [selectedDate] = useState<string>(
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

  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    // 9시부터 22시까지 총 13시간 기준
    const totalMinutesFromStart = (hours - 9) * 60 + minutes;
    const totalGridMinutes = 13 * 60;
    return (totalMinutesFromStart / totalGridMinutes) * 100;
  };

  const getTimeWidth = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    const totalGridMinutes = 13 * 60;
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
    <div className="relative flex min-h-screen w-full flex-col bg-zinc-200 dark:bg-black">
      <main className="flex flex-1 justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
        <div className="flex w-full max-w-7xl flex-col">
          <main className="flex flex-col gap-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2">
              <p className="text-4xl font-black tracking-tighter">금일 회의실 예약 현황</p>
              
              {/* QR Code Placeholder */}
              <div className="flex items-center gap-4">
                {/* Refresh Button */}
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-sm border border-border-light dark:border-border-dark group hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all active:scale-95 text-left"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-text-light-primary dark:text-text-dark-primary">
                      새로고침
                    </p>
                    <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                      화면을 새로고침 후<br />예약 현황을 확인해주세요
                    </p>
                  </div>
                  <div className="size-16 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center justify-center text-blue-500 group-hover:rotate-180 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/>
                      <path d="M3 3v9h9"/>
                    </svg>
                  </div>
                </button>

                {/* QR Code */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-text-light-primary dark:text-text-dark-primary">회의실 예약하기</p>
                    <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">QR을 스캔하세요</p>
                  </div>
                  <div className="relative size-16 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src="/rooms.jpeg"
                      alt="Booking QR Code"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
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
                  <div className="flex relative h-[1470px]"> {/* 13시간 * 90px = 1170px */}
                    
                    {/* Time Column (Left Sidebar) */}
                    <div className="sticky left-0 z-30 w-16 bg-white dark:bg-background-dark border-r border-border-light dark:border-border-dark flex-shrink-0 flex flex-col">
                      {Array.from({ length: 13 }, (_, i) => (
                        <div key={i} className="flex-1 border-b border-border-light/30 dark:border-border-dark/30 text-xs text-text-light-secondary dark:text-dark-secondary font-medium flex items-start justify-center pt-2">
                          {9 + i}:00
                        </div>
                      ))}
                    </div>

                    {/* Rooms Columns */}
                    <div className="flex flex-1 relative">
                      {/* Background Grid Lines (Horizontal) */}
                      <div className="absolute inset-0 flex flex-col z-0 pointer-events-none">
                         {Array.from({ length: 13 }, (_, i) => (
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
                                  
                                  // 예약 시간(분) 계산
                                  const [startH, startM] = res.startTime.split(":").map(Number);
                                  const [endH, endM] = res.endTime.split(":").map(Number);
                                  const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
                                  
                                  // 시간에 따른 텍스트 크기 결정
                                  const isShortReservation = durationMinutes <= 30;
                                  const nameTextSize = isShortReservation ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm";
                                  const courseTextSize = isShortReservation ? "text-[9px] sm:text-[10px]" : "text-[10px] sm:text-xs";
                                  
                                  return (
                                    <div
                                      key={res.id}
                                      onClick={() => setSelectedReservation(res)}
                                      className="absolute left-1 right-1 bg-green-100 dark:bg-green-900/80 rounded-lg text-green-900 dark:text-green-50 px-2 shadow-sm z-20 transition-all hover:brightness-95 dark:hover:brightness-110 cursor-pointer hover:z-30 overflow-hidden flex flex-col justify-center border border-green-200 dark:border-green-800"
                                      style={{
                                        top: `${top}%`,
                                        height: `calc(${height}% - 2px)`,
                                      }}
                                    >
                                      {/* 모든 예약에 대해 이름과 시간을 가로 배치(공간 부족 시 줄바꿈) 혹은 한 줄 유지 */}
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                                        <p className={`${nameTextSize} font-bold truncate shrink-0 mr-1`}>
                                          {res.userName}
                                        </p>
                                        <p className={`${courseTextSize} truncate opacity-75 shrink-0`}>
                                          {res.courseName}
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
