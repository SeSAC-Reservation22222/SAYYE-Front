"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/common/Header";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import AdminGuard from "@/components/common/AdminGuard";
import { adminApi } from "@/lib/api/admin";
import { authApi } from "@/lib/api/auth";
import type { AdminResponse, SignupRequest } from "@/types";

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdmin, setNewAdmin] = useState<SignupRequest>({
    userId: "",
    password: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await adminApi.getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("관리자 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newAdmin.userId || !newAdmin.password || !newAdmin.name || !newAdmin.email) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    try {
      await authApi.signup(newAdmin);
      alert("관리자가 추가되었습니다.");
      setNewAdmin({ userId: "", password: "", name: "", email: "" });
      fetchAdmins();
    } catch (error: any) {
      alert(error.response?.data?.message || "관리자 추가에 실패했습니다.");
    }
  };

  const handleDelete = async (adminId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await adminApi.deleteAdmin(adminId);
      alert("관리자가 삭제되었습니다.");
      fetchAdmins();
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
          <h1 className="text-4xl font-black tracking-tight mb-8">관리자 관리</h1>

          <Card className="mb-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">관리자 추가</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Input
                  label="ID"
                  value={newAdmin.userId}
                  onChange={(e) => setNewAdmin({ ...newAdmin, userId: e.target.value })}
                  placeholder="admin id"
                  required
                />
                <Input
                  label="비밀번호"
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="비밀번호"
                  required
                />
                <Input
                  label="이름"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="이름"
                  required
                />
                <Input
                  label="이메일"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button variant="primary" onClick={handleCreate}>
                  관리자 추가
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins
              .filter((admin) => admin.role !== "MASTER")
              .map((admin) => (
              <Card key={admin.id}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 size-12 rounded-full overflow-hidden">
                      <Image
                        src="/logo.png"
                        alt={`${admin.name} 프로필`}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{admin.name}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    <p>ID: {admin.userId}</p>
                    <p>이메일: {admin.email}</p>
                    <p>역할: {admin.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleDelete(admin.id)} size="sm">
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

