"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import { isAdmin } from "@/lib/utils/jwt";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(Boolean(token));
      setIsUserAdmin(isAdmin());
    };

    checkAuth();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", checkAuth);
      return () => window.removeEventListener("storage", checkAuth);
    }
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header variant="simple" />
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center px-4 py-5 sm:px-10 md:px-20 lg:px-40">
          <div className="layout-content-container flex w-full max-w-[960px] flex-1 flex-col">
            <main className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="flex w-full flex-wrap justify-center gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-4xl font-black tracking-[-0.033em] text-text-light-primary dark:text-text-dark-primary sm:text-5xl">
                    SeSAC Book 에 오신 것을 환영합니다
                  </p>
                  <p className="text-base font-normal text-text-light-secondary dark:text-text-dark-secondary">
                    회의실을 예약하거나{" "}
                    <Link
                      href="/login"
                      className="text-text-light-secondary dark:text-text-dark-secondary hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      시스템을 관리
                    </Link>
                    하세요.
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
                  SeSAC Book 서비스를 이용해보셨나요? 소중한 의견을 들려주세요!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* 사용자 가이드 버튼 */}
                  <a
                    className="group flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary/20 hover:scale-105 active:scale-95"
                    href="https://ringed-room-6d9.notion.site/2dbff06ad20f806e93f2dd4a6ed8b196?source=copy_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-lg">📖</span>
                    <span>사용자 가이드 보기</span>
                  </a>

                  {/* 관리자 가이드 버튼 */}
                  {isUserAdmin && (
                    <a
                      className="group flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary/20 hover:scale-105 active:scale-95"
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-lg">⚙️</span>
                      <span>관리자 가이드 보기</span>
                    </a>
                  )}

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
                © 2025 SeSAC Book. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}


