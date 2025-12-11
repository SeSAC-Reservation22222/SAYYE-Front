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

  const getTimeSlotPosition = (time: string) => {
    const [hours] = time.split(":").map(Number);
    return hours - 9; // 9시부터 시작
  };

  const getTimeSlotSpan = (startTime: string, endTime: string) => {
    const start = getTimeSlotPosition(startTime);
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const duration = (endHours * 60 + endMinutes - (startHours * 60 + startMinutes)) / 30;
    return Math.max(1, duration);
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
              <span className="material-symbols-outlined !text-[18px]">add</span>
              <span className="truncate">새 예약</span>
            </Link>
          </div>
        }
      />
      <main className="flex flex-1 justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
        <div className="flex w-full max-w-7xl flex-col">
          <main className="flex flex-col gap-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2">
              <p className="text-4xl font-black tracking-tighter">회의실 현황</p>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-background-dark dark:border dark:border-border-dark pl-4 pr-3 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                />
              </div>
            </div>
            <div className="px-2 py-3 overflow-x-auto">
              <div className="inline-block min-w-full overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark shadow-sm">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-white/5">
                      <th className="sticky left-0 z-10 px-4 py-3 text-left w-40 bg-gray-50 dark:bg-white/5 text-sm font-medium"></th>
                      {Array.from({ length: 28 }, (_, i) => {
                        const hour = 9 + Math.floor(i / 2);
                        const minute = i % 2 === 0 ? "00" : "30";
                        return (
                          <th
                            key={i}
                            className="px-2 py-3 text-center w-24 text-text-light-secondary dark:text-dark-secondary text-sm font-medium"
                          >
                            {i % 2 === 0 ? `${hour}:00` : ""}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="relative">
                    {rooms.map((room) => {
                      const roomReservations = reservations[room.id] || [];
                      return (
                        <tr
                          key={room.id}
                          className="border-t border-t-border-light dark:border-t-border-dark group"
                        >
                          <td className="sticky left-0 z-10 h-[72px] px-4 py-2 w-40 text-sm font-semibold bg-white dark:bg-background-dark group-hover:bg-gray-50 dark:group-hover:bg-white/5 transition-colors">
                            {room.roomName}
                          </td>
                          {Array.from({ length: 28 }, (_, i) => {
                            const hour = 9 + Math.floor(i / 2);
                            const minute = i % 2 === 0 ? "00" : "30";
                            const timeString = `${hour.toString().padStart(2, "0")}:${minute}:00`;
                            
                            const reservation = roomReservations.find((r) => {
                              const [startHour, startMin] = r.startTime.split(":").map(Number);
                              const [endHour, endMin] = r.endTime.split(":").map(Number);
                              const slotStart = startHour * 60 + startMin;
                              const slotEnd = endHour * 60 + endMin;
                              const currentSlot = hour * 60 + (minute === "00" ? 0 : 30);
                              return currentSlot >= slotStart && currentSlot < slotEnd;
                            });

                            if (reservation && i % 2 === 0) {
                              const span = getTimeSlotSpan(reservation.startTime, reservation.endTime);
                              return (
                                <td
                                  key={i}
                                  className="p-1"
                                  colSpan={span}
                                >
                                  <div className="group/tooltip relative flex flex-col justify-center h-full rounded-lg bg-primary text-white p-2 cursor-pointer">
                                    <p className="text-xs font-bold truncate">{reservation.userName}</p>
                                    <p className="text-xs truncate opacity-80">
                                      {reservation.startTime} ~ {reservation.endTime}
                                    </p>
                                  </div>
                                </td>
                              );
                            }

                            if (!reservation) {
                              return (
                                <td
                                  key={i}
                                  className="h-[72px] px-2 py-2 hover:bg-primary-light/50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                />
                              );
                            }

                            return null;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
    </div>
  );
}

