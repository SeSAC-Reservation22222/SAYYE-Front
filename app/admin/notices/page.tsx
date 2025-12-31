"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Input from "@/components/common/Input";
import AdminGuard from "@/components/common/AdminGuard";
import { noticeApi } from "@/lib/api/notice";
import type { NoticeResponse, NoticeRequest } from "@/types";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeResponse | null>(null);
  const [formData, setFormData] = useState<NoticeRequest>({
    title: "",
    content: "",
    status: true,
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const data = await noticeApi.getNotices();
      setNotices(data);
    } catch (error) {
      console.error("공지사항 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      // 전송할 데이터 준비 (백엔드 필드명과 정확히 일치)
      const requestData: NoticeRequest = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        status: formData.status,
      };

      if (editingNotice) {
        await noticeApi.updateNotice(editingNotice.id, requestData);
        alert("공지사항이 수정되었습니다.");
      } else {
        await noticeApi.createNotice(requestData);
        alert("공지사항이 생성되었습니다.");
      }
      setShowForm(false);
      setEditingNotice(null);
      setFormData({
        title: "",
        content: "",
        status: true,
      });
      fetchNotices();
    } catch (error: any) {
      // 상세한 에러 메시지 표시
      console.error("공지사항 생성/수정 에러:", error);
      let errorMessage = "작업에 실패했습니다.";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'object') {
          // validation 에러인 경우
          const firstErrorKey = Object.keys(errorData)[0];
          if (firstErrorKey && errorData[firstErrorKey]) {
            errorMessage = Array.isArray(errorData[firstErrorKey]) 
              ? errorData[firstErrorKey][0] 
              : errorData[firstErrorKey];
          }
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleEdit = (notice: NoticeResponse) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      status: notice.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (noticeId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await noticeApi.deleteNotice(noticeId);
      alert("공지사항이 삭제되었습니다.");
      fetchNotices();
    } catch (error: any) {
      alert(error.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  const handleToggleStatus = async (noticeId: number) => {
    try {
      await noticeApi.updateNoticeStatus(noticeId);
      // 목록 새로고침 없이 로컬 상태 업데이트로 반응성 향상
      setNotices(prev => prev.map(notice => 
        notice.id === noticeId ? { ...notice, status: !notice.status } : notice
      ));
    } catch (error) {
      console.error("상태 변경 실패:", error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
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
            <h1 className="text-4xl font-black tracking-tight">공지사항 관리</h1>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "취소" : "새 공지사항 추가"}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {editingNotice ? "공지사항 수정" : "새 공지사항 추가"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="제목"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    내용
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    required
                    rows={10}
                    className="w-full mt-1 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed resize-y"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="status"
                    checked={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
                    게시하기 (체크 시 사용자에게 보입니다)
                  </label>
                </div>

                <div className="flex gap-2 mt-2">
                  <Button type="submit" variant="primary">
                    {editingNotice ? "수정" : "생성"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingNotice(null);
                      setFormData({
                        title: "",
                        content: "",
                        status: true,
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
            {notices.map((notice) => (
              <Card key={notice.id} className={!notice.status ? "opacity-75 bg-gray-50 dark:bg-gray-900" : ""}>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-xl font-bold">{notice.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full whitespace-nowrap ${
                        notice.status 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                          : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}>
                        {notice.status ? "게시중" : "숨김"}
                      </span>
                    </div>
                    <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-3 line-clamp-3">
                      {notice.content}
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-text-light-secondary dark:text-text-dark-secondary">
                      <p>작성일: {formatDateTime(notice.createdAt)}</p>
                      {notice.updatedAt !== notice.createdAt && (
                        <p>수정일: {formatDateTime(notice.updatedAt)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      onClick={() => handleToggleStatus(notice.id)}
                      size="sm"
                      className={!notice.status ? "text-primary border-primary hover:bg-primary/10" : ""}
                    >
                      {notice.status ? "숨기기" : "게시하기"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(notice)}
                      size="sm"
                    >
                      수정
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(notice.id)}
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