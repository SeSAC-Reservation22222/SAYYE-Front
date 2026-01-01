"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/common/Header";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { roomApi } from "@/lib/api/room";
import type { RoomResponse } from "@/types";

export default function RoomSelectPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // 회의실 location에 따라 이미지 경로를 반환하는 함수
  const getRoomImagePath = (location: number | null): string => {
    if (location === 1) return "/room-image/1F-room.jpeg";
    if (location === 2) return "/room-image/2F-room.jpeg";
    // 기본 이미지 (location이 없거나 다른 경우)
    return "/room-image/1F-room.jpeg";
  };

  useEffect(() => {
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

    fetchRooms();
  }, []);

  const handleSelect = (roomId: number) => {
    router.push(`/rooms/reserve?roomId=${roomId}`);
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
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                원하는 회의실을 선택하고 예약을 진행하세요.
              </p>
              <h1 className="text-4xl font-black tracking-tight">회의실 선택</h1>
            </div>
          </div>

          {rooms.length === 0 ? (
            <Card>
              <p className="text-center text-text-light-secondary dark:text-text-dark-secondary">
                등록된 회의실이 없습니다.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <Card
                  key={room.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSelect(room.id)}
                >
                  {/* 이미지 영역 - 연두색 박스 대신 이미지 표시 */}
                  <div className="h-52 w-full relative rounded-xl overflow-hidden mb-4">
                    <Image
                      src={getRoomImagePath(room.location)}
                      alt={room.roomName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <h2 className="text-xl font-bold">{room.roomName}</h2>
                      <p className="text-sm text-primary font-semibold">수용 인원: 최대 {room.capacity}명</p>
                    </div>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary leading-relaxed">
                      {room.description || "밝은 공간과 최신 설비를 갖춘 회의실입니다."}
                    </p>
                    <div className="mt-4">
                      <Button type="button" fullWidth onClick={() => handleSelect(room.id)}>
                        회의실 예약하기
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

