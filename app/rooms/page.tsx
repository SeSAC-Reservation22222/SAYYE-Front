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
      <Header />
      <main className="flex flex-1 justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
        <div className="flex w-full max-w-7xl flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-6 py-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="size-6 text-primary">
                <svg
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                    fillRule="evenodd"
                  />
                  <path
                    clipRule="evenodd"
                    d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold">Say Ye</h1>
            </div>
            <div className="flex flex-1 justify-end items-center gap-4 sm:gap-6">
              <a
                className="text-sm font-medium hover:text-primary transition-colors"
                href="#"
              >
                회의실 현황
              </a>
              <Link
                href="/rooms/reserve"
                className="flex items-center justify-center gap-2 min-w-[100px] h-10 px-4 bg-primary text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-all"
              >
                <span className="material-symbols-outlined !text-[18px]">add</span>
                <span className="truncate">새 예약</span>
              </Link>
            </div>
          </header>
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

