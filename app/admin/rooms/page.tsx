"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Input from "@/components/common/Input";
import AdminGuard from "@/components/common/AdminGuard";
import { roomApi } from "@/lib/api/room";
import type { RoomResponse, RoomRequest } from "@/types";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomResponse | null>(null);
  const [formData, setFormData] = useState<RoomRequest>({
    roomName: "",
    location: undefined,
    capacity: 1,
    description: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await roomApi.updateRoom(editingRoom.id, formData);
        alert("회의실 정보가 수정되었습니다.");
      } else {
        await roomApi.createRoom(formData);
        alert("회의실이 생성되었습니다.");
      }
      setShowForm(false);
      setEditingRoom(null);
      setFormData({
        roomName: "",
        location: undefined,
        capacity: 1,
        description: "",
      });
      fetchRooms();
    } catch (error: any) {
      alert(error.response?.data?.message || "작업에 실패했습니다.");
    }
  };

  const handleEdit = (room: RoomResponse) => {
    setEditingRoom(room);
    setFormData({
      roomName: room.roomName,
      location: room.location || undefined,
      capacity: room.capacity,
      description: room.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (roomId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await roomApi.deleteRoom(roomId);
      alert("회의실이 삭제되었습니다.");
      fetchRooms();
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
    <AdminGuard>
      <div className="relative flex min-h-screen w-full flex-col">
        <Header showLogout />
        <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-black tracking-tight">회의실 관리</h1>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "취소" : "새 회의실 추가"}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {editingRoom ? "회의실 수정" : "새 회의실 추가"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="회의실 이름"
                  value={formData.roomName}
                  onChange={(e) =>
                    setFormData({ ...formData, roomName: e.target.value })
                  }
                  required
                />
                <Input
                  label="위치 (선택)"
                  type="number"
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
                <Input
                  label="수용 인원"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: Number(e.target.value) })
                  }
                  required
                />
                <Input
                  label="설명 (선택)"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="primary">
                    {editingRoom ? "수정" : "생성"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingRoom(null);
                      setFormData({
                        roomName: "",
                        location: undefined,
                        capacity: 1,
                        description: "",
                      });
                    }}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id}>
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{room.roomName}</h3>
                    <div className="flex flex-col gap-1 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      {room.location && <p>위치: {room.location}층</p>}
                      <p>수용 인원: {room.capacity}명</p>
                      {room.description && <p>설명: {room.description}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(room)}
                      size="sm"
                    >
                      수정
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(room.id)}
                      size="sm"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

