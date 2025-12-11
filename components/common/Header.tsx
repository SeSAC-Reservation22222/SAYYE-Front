"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

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

  useEffect(() => {
    // 클라이언트에서만 토큰 확인
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
                <div className="aspect-square size-10 rounded-full bg-cover bg-center bg-no-repeat bg-gray-300" />
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
                <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary/20 hover:bg-primary/30 transition-colors">
                  <span className="material-symbols-outlined text-text-light dark:text-text-dark">
                    notifications
                  </span>
                </button>
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-300" />
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Default variant with navigation
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
          {showNav && (
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/rooms"
                className={`text-sm font-medium transition-colors ${pathname === "/rooms"
                  ? "text-primary"
                  : "hover:text-primary"
                  }`}
              >
                회의실 예약
              </Link>
              <Link
                href="/my-reservations"
                className={`text-sm font-medium transition-colors ${pathname === "/my-reservations"
                  ? "text-primary"
                  : "hover:text-primary"
                  }`}
              >
                내 예약
              </Link>
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors ${pathname === "/admin"
                  ? "text-primary"
                  : "hover:text-primary"
                  }`}
              >
                관리자 페이지
              </Link>
            </nav>
          )}
          {rightContent || (
            <div className="flex items-center gap-4">
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
              <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary/20 hover:bg-primary/30 transition-colors">
                <span className="material-symbols-outlined text-text-light dark:text-text-dark">
                  notifications
                </span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-300" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

