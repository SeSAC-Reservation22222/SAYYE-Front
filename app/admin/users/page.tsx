"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { adminApi } from "@/lib/api/admin";
import type { AdminResponse } from "@/types";

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
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

  const handlePasswordUpdate = async (userId: string) => {
    try {
      await adminApi.updatePassword(userId, passwordData);
      alert("비밀번호가 수정되었습니다.");
      setShowPasswordForm(null);
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error: any) {
      alert(error.response?.data?.message || "비밀번호 수정에 실패했습니다.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await adminApi.deleteAdmin(userId);
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
    <div className="relative flex min-h-screen w-full flex-col">
      <Header showLogout />
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-black tracking-tight mb-8">사용자 관리</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => (
            <Card key={admin.id}>
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{admin.name}</h3>
                  <div className="flex flex-col gap-1 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    <p>ID: {admin.userId}</p>
                    <p>이메일: {admin.email}</p>
                    <p>역할: {admin.role}</p>
                  </div>
                </div>
                {showPasswordForm === admin.userId ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      label="현재 비밀번호"
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, oldPassword: e.target.value })
                      }
                    />
                    <Input
                      label="새 비밀번호"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePasswordUpdate(admin.userId)}
                      >
                        수정
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setShowPasswordForm(null);
                          setPasswordData({ oldPassword: "", newPassword: "" });
                        }}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordForm(admin.userId)}
                      size="sm"
                    >
                      비밀번호 변경
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(admin.userId)}
                      size="sm"
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

