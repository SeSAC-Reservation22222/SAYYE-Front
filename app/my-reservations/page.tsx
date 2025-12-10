"use client";

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Card from "@/components/common/Card";
import Select from "@/components/common/Select";
import { roomApi } from "@/lib/api/room";
import { reservationApi } from "@/lib/api/reservation";
import type { ReservationResponse, RoomResponse } from "@/types";

export default function MyReservationsPage() {
  const [searchData, setSearchData] = useState({
    userName: "",
    phoneLastNumber: "",
  });
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomApi.getRooms();
        setRooms(data);
        if (data.length > 0) {
          setSelectedRoom(data[0].id);
        }
      } catch (error) {
        console.error("회의실 목록 조회 실패:", error);
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) {
      alert("회의실을 선택해주세요.");
      return;
    }
    setLoading(true);
    setSearched(false);

    try {
      const data = await reservationApi.getReservations(selectedRoom, searchData);
      setReservations(data);
      setSearched(true);
    } catch (error: any) {
      alert(error.response?.data?.message || "예약 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId: number) => {
    if (!confirm("예약을 취소하시겠습니까?")) return;

    try {
      await reservationApi.deleteReservation(reservationId, searchData);
      alert("예약이 취소되었습니다.");
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    } catch (error: any) {
      alert(error.response?.data?.message || "예약 취소에 실패했습니다.");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-black tracking-tight mb-8">내 예약 조회</h1>
        <Card className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="회의실"
                value={selectedRoom?.toString() ?? ""}
                onChange={(e) => setSelectedRoom(Number(e.target.value))}
                options={rooms.map((room) => ({
                  value: room.id.toString(),
                  label: room.name,
                }))}
                required
                disabled={roomsLoading || rooms.length === 0}
              />
              <Input
                label="이름"
                placeholder="이름을 입력하세요"
                value={searchData.userName}
                onChange={(e) =>
                  setSearchData({ ...searchData, userName: e.target.value })
                }
                required
                minLength={2}
              />
              <Input
                label="연락처 뒷 4자리"
                placeholder="1234"
                type="tel"
                pattern="[0-9]{4}"
                value={searchData.phoneLastNumber}
                onChange={(e) =>
                  setSearchData({ ...searchData, phoneLastNumber: e.target.value })
                }
                required
                maxLength={4}
              />
            </div>
            <Button type="submit" fullWidth disabled={loading}>
              예약 조회
            </Button>
          </form>
        </Card>

        {searched && (
          <div className="flex flex-col gap-4">
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
                      <div className="flex flex-col gap-1 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                        <p>
                          날짜: {new Date(reservation.reservationDate).toLocaleDateString("ko-KR")}
                        </p>
                        <p>
                          시간: {reservation.startTime.split(":").slice(0, 2).join(":")} ~{" "}
                          {reservation.endTime.split(":").slice(0, 2).join(":")}
                        </p>
                        <p>예약자: {reservation.userName}</p>
                        <p>상태: {reservation.status}</p>
                      </div>
                    </div>
                    {reservation.status === "예약" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleCancel(reservation.id)}
                        >
                          취소
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

