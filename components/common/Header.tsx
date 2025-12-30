"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { isAdmin } from "@/lib/utils/jwt";
import Modal from "./Modal";
import Card from "./Card";
import { noticeApi } from "@/lib/api/notice";
import type { NoticeResponse } from "@/types";

interface HeaderProps {
  showLogout?: boolean;
  showNav?: boolean;
  rightContent?: ReactNode;
  variant?: "default" | "simple" | "page";
}

export default function Header({
  showLogout = false,
  showNav = true,
  rightContent,
  variant = "default"
}: HeaderProps) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [notices, setNotices] = useState<NoticeResponse[]>([]);
  const [noticeCount, setNoticeCount] = useState(0);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [loadingNotices, setLoadingNotices] = useState(true);

  useEffect(() => {
    // 클라이언트에서만 토큰 확인
    const checkAuth = () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(Boolean(token));

      // 관리자 여부 확인
      const adminStatus = isAdmin();
      setIsAdminUser(adminStatus);
    };

    checkAuth();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", checkAuth);
      return () => window.removeEventListener("storage", checkAuth);
    }
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await noticeApi.getNotices();
        setNotices(data);
        setNoticeCount(data.length);
      } catch (error) {
        console.error("공지사항 조회 실패:", error);
      } finally {
        setLoadingNotices(false);
      }
    };

    fetchNotices();
  }, []);

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

  const handleLogout = async () => {
    try {
      const { authApi } = await import("@/lib/api/auth");
      await authApi.logout();
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // Simple variant for home page
  if (variant === "simple") {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-4 text-text-light-primary dark:text-text-dark-primary hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="SayYe 로고"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <h2 className="text-lg font-bold tracking-[-0.015em]">Say Ye</h2>
            </Link>
            {rightContent || (
              <div className="flex flex-1 items-center justify-end gap-4">
                {/* 공지사항 버튼 */}
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors dark:bg-primary/30 dark:hover:bg-primary/40"
                  title="공지사항"
                >
                  <span className="material-symbols-outlined text-text-light-primary dark:text-text-dark-primary">
                    campaign
                  </span>
                  {noticeCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
                      {noticeCount > 9 ? "9+" : noticeCount}
                    </span>
                  )}
                </button>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-bold text-text-light-primary transition-colors hover:bg-primary/30 dark:bg-primary/30 dark:text-text-dark-primary dark:hover:bg-primary/40"
                  >
                    로그아웃
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-bold text-text-light-primary transition-colors hover:bg-primary/30 dark:bg-primary/30 dark:text-text-dark-primary dark:hover:bg-primary/40"
                  >
                    로그인
                  </Link>
                )}
                <div className="aspect-square size-10 rounded-full bg-cover bg-center bg-no-repeat overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="사용자 프로필"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Page variant for rooms/admin pages with sub-header style
  if (variant === "page") {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="SayYe 로고"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <h2 className="text-xl font-bold">Say Ye</h2>
            </Link>
            {rightContent || (
              <div className="flex items-center gap-4">
                {/* 공지사항 버튼 */}
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors dark:bg-primary/30 dark:hover:bg-primary/40"
                  title="공지사항"
                >
                  <span className="material-symbols-outlined text-text-light-primary dark:text-text-dark-primary">
                    campaign
                  </span>
                  {noticeCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
                      {noticeCount > 9 ? "9+" : noticeCount}
                    </span>
                  )}
                </button>
                {showLogout && (
                  <button
                    onClick={async () => {
                      try {
                        const { authApi } = await import("@/lib/api/auth");
                        await authApi.logout();
                        window.location.href = "/login";
                      } catch (error) {
                        console.error("로그아웃 실패:", error);
                      }
                    }}
                    className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-bold text-text-light-primary transition-colors hover:bg-primary/30 dark:bg-primary/30 dark:text-text-dark-primary dark:hover:bg-primary/40"
                  >
                    로그아웃
                  </button>
                )}
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="사용자 프로필"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* 공지사항 모달 */}
      <Modal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        title="공지사항"
        showCloseButton={false}
      >
        <div className="max-h-[60vh] overflow-y-auto">
          {loadingNotices ? (
            <div className="py-8 text-center text-text-light-secondary dark:text-text-dark-secondary">
              로딩 중...
            </div>
          ) : notices.length === 0 ? (
            <div className="py-8 text-center text-text-light-secondary dark:text-text-dark-secondary">
              등록된 공지사항이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {notices.map((notice) => (
                <Card key={notice.id} className="border-l-4 border-l-primary">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary whitespace-pre-wrap">
                      {notice.content}
                    </p>
                    <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-2">
                      {formatDateTime(notice.createdAt)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowNoticeModal(false)}
            className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            닫기
          </button>
        </div>
      </Modal>
    );
  }

  // Default variant with navigation
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="SayYe 로고"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <h2 className="text-xl font-bold">Say Ye</h2>
            </Link>
            {showNav && (
              <nav className="hidden md:flex items-center gap-8">
                {pathname !== "/rooms" && pathname !== "/rooms/reserve" && pathname !== "/rooms/select" && (
                  <Link
                    href="/rooms"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    회의실 예약
                  </Link>
                )}
                {isAdminUser && pathname !== "/rooms/reserve" && pathname !== "/rooms/select" && (
                  <Link
                    href="/admin"
                    className={`text-sm font-medium transition-colors ${pathname === "/admin"
                      ? "text-primary"
                      : "hover:text-primary"
                      }`}
                  >
                    관리자 페이지
                  </Link>
                )}
              </nav>
            )}
          </div>
          {rightContent || (
            <div className="flex items-center gap-4">
              {/* 공지사항 버튼 */}
              <button
                onClick={() => setShowNoticeModal(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors dark:bg-primary/30 dark:hover:bg-primary/40"
                title="공지사항"
              >
                <span className="material-symbols-outlined text-text-light-primary dark:text-text-dark-primary">
                  campaign
                </span>
                {noticeCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
                    {noticeCount > 9 ? "9+" : noticeCount}
                  </span>
                )}
              </button>
              {showLogout && (
                <button
                  onClick={async () => {
                    try {
                      const { authApi } = await import("@/lib/api/auth");
                      await authApi.logout();
                      window.location.href = "/login";
                    } catch (error) {
                      console.error("로그아웃 실패:", error);
                    }
                  }}
                  className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-bold text-text-light-primary transition-colors hover:bg-primary/30 dark:bg-primary/30 dark:text-text-dark-primary dark:hover:bg-primary/40"
                >
                  로그아웃
                </button>
              )}
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="사용자 프로필"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 공지사항 모달 */}
      <Modal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        title="공지사항"
        showCloseButton={false}
      >
        <div className="max-h-[60vh] overflow-y-auto">
          {loadingNotices ? (
            <div className="py-8 text-center text-text-light-secondary dark:text-text-dark-secondary">
              로딩 중...
            </div>
          ) : notices.length === 0 ? (
            <div className="py-8 text-center text-text-light-secondary dark:text-text-dark-secondary">
              등록된 공지사항이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {notices.map((notice) => (
                <Card key={notice.id} className="border-l-4 border-l-primary">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary whitespace-pre-wrap">
                      {notice.content}
                    </p>
                    <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-2">
                      {formatDateTime(notice.createdAt)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowNoticeModal(false)}
            className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            닫기
          </button>
        </div>
      </Modal>
    </header>
  );
}

