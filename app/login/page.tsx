"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Card from "@/components/common/Card";
import { authApi } from "@/lib/api/auth";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.login(formData);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/">
            <h1 className="text-3xl font-black mb-2 cursor-pointer hover:text-primary transition-colors">SeSAC Book</h1>
          </Link>
          <p className="text-text-light-secondary dark:text-text-dark-secondary">
            회의실 예약 시스템에 로그인하세요
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="사용자 ID"
            placeholder="사용자 ID를 입력하세요"
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            required
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" fullWidth disabled={loading}>
            로그인
          </Button>
          
          {/* 홈으로 돌아가기 링크 */}
          <div className="text-center mt-2">
            <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1">
              홈으로 돌아가기
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}


