"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  showLogout?: boolean;
}

export default function Header({ showLogout = false }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <svg
                className="h-6 w-6 text-text-light dark:text-text-dark"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
                <path
                  clipRule="evenodd"
                  d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </Link>
            <h2 className="text-xl font-bold">Say Ye</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/rooms"
              className={`text-sm font-medium transition-colors ${
                pathname === "/rooms"
                  ? "text-primary"
                  : "hover:text-primary"
              }`}
            >
              회의실 예약
            </Link>
            <Link
              href="/my-reservations"
              className={`text-sm font-medium transition-colors ${
                pathname === "/my-reservations"
                  ? "text-primary"
                  : "hover:text-primary"
              }`}
            >
              내 예약
            </Link>
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors ${
                pathname === "/admin"
                  ? "text-primary"
                  : "hover:text-primary"
              }`}
            >
              관리자 페이지
            </Link>
          </nav>
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
        </div>
      </div>
    </header>
  );
}

