"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Card from "@/components/common/Card";
import { noticeApi } from "@/lib/api/notice";
import type { NoticeResponse } from "@/types";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notices, setNotices] = useState<NoticeResponse[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(Boolean(token));
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
        // 최신 공지사항 최대 5개만 표시
        setNotices(data.slice(0, 5));
      } catch (error) {
        console.error("공지사항 조회 실패:", error);
      } finally {
        setLoadingNotices(false);
      }
    };

    fetchNotices();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header variant="simple" />
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center px-4 py-5 sm:px-10 md:px-20 lg:px-40">
          <div className="layout-content-container flex w-full max-w-[960px] flex-1 flex-col">
            {/* 공지사항 섹션 */}
            {!loadingNotices && notices.length > 0 && (
              <section className="mb-8 w-full">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-black text-text-light-primary dark:text-text-dark-primary">
                    공지사항
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notices.map((notice) => (
                    <Card
                      key={notice.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        // 공지사항 상세 보기 (모달이나 별도 페이지로 확장 가능)
                        alert(`${notice.title}\n\n${notice.content}`);
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary line-clamp-1">
                          {notice.title}
                        </h3>
                        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary line-clamp-2">
                          {notice.content}
                        </p>
                        <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-2">
                          {formatDate(notice.createdAt)}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            <main className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="flex w-full flex-wrap justify-center gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-4xl font-black tracking-[-0.033em] text-text-light-primary dark:text-text-dark-primary sm:text-5xl">
                    Say Ye에 오신 것을 환영합니다
                  </p>
                  <p className="text-base font-normal text-text-light-secondary dark:text-text-dark-secondary">
                    회의실을 예약하거나 시스템을 관리하세요.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex w-full justify-center">
                <div className="flex w-full max-w-sm flex-col items-stretch gap-4 px-4 py-3">
                  <Link
                    href="/rooms"
                    className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-5 text-base font-bold text-text-light-primary shadow-lg shadow-primary/20 transition-transform hover:scale-105"
                  >
                    <span className="truncate">회의실 현황</span>
                  </Link>
                  {isLoggedIn ? (
                    <Link
                      href="/admin"
                      className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary/20 px-5 text-base font-bold text-text-light-primary transition-colors hover:bg-primary/30 dark:bg-primary/30 dark:text-text-dark-primary dark:hover:bg-primary/40"
                    >
                      <span className="truncate">관리자 페이지</span>
                    </Link>
                  ) : (
                    <Link
                      href="/my-reservations"
                      className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-5 text-base font-bold text-text-light-primary shadow-lg shadow-primary/20 transition-transform hover:scale-105"
                    >
                      <span className="truncate">내 예약</span>
                    </Link>
                  )}
                </div>
              </div>
            </main>
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                  Say Ye 서비스를 이용해보셨나요? 소중한 의견을 들려주세요!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* 사용자 가이드 버튼 */}
                  <a
                    className="group flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary/20 hover:scale-105 active:scale-95"
                    href="#" // TODO: 노션 링크로 교체 필요
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-lg">📖</span>
                    <span>사용자 가이드 보기</span>
                  </a>
                  
                  {/* 피드백 설문 버튼 */}
                  <a
                    className="group flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary/20 hover:scale-105 active:scale-95"
                    href="https://forms.gle/pWtC9qYhgL9EnJks7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-lg">📋</span>
                    <span>피드백 설문 참여하기</span>
                  </a>
                </div>
              </div>
              <p className="text-xs font-normal text-text-light-secondary dark:text-text-dark-secondary">
                © 2025 Say Ye. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}


