import Link from "next/link";
import Header from "@/components/common/Header";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center px-4 py-5 sm:px-10 md:px-20 lg:px-40">
          <div className="layout-content-container flex w-full max-w-[960px] flex-1 flex-col">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-4 py-3 sm:px-10">
              <div className="flex items-center gap-4 text-text-light-primary dark:text-text-dark-primary">
                <div className="text-primary size-6">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      fill="none"
                    />
                    <path d="M17.3,8.44A5.32,5.32,0,0,0,12,6.5a5.32,5.32,0,0,0-5.3,1.94,1,1,0,1,0,1.5,1.32A3.32,3.32,0,0,1,12,8.5a3.32,3.32,0,0,1,3.8,2.76,1,1,0,0,0,1,.84h.13a1,1,0,0,0,.87-1.16A5.31,5.31,0,0,0,17.3,8.44Z"></path>
                    <path d="M6.5,12A1.5,1.5,0,1,0,5,13.5,1.5,1.5,0,0,0,6.5,12Z"></path>
                    <path d="M17.5,12A1.5,1.5,0,1,0,16,13.5,1.5,1.5,0,0,0,17.5,12Z"></path>
                    <path
                      d="M15.41,16.59a1,1,0,0,0-1.41,0L12,18.59l-2-2a1,1,0,0,0-1.41,1.41L11.29,20.7a1,1,0,0,0,1.41,0L15.41,18A1,1,0,0,0,15.41,16.59Z"
                      fill="none"
                    />
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.67 12.47a1 1 0 0 1-1.42 0L12 10.24l-4.25 4.23a1 1 0 1 1-1.42-1.42L12 7.4l5.67 5.66a1 1 0 0 1 0 1.41zM12,20a8,8,0,0,1-5.66-2.34c.05-.66.36-1.89,1.7-2.94A5.51,5.51,0,0,1,12,13a5.51,5.51,0,0,1,3.95,1.72c1.35,1.05,1.65,2.28,1.71,2.94A8,8,0,0,1,12,20Z"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-bold tracking-[-0.015em]">Say Ye</h2>
              </div>
              <div className="flex flex-1 items-center justify-end gap-4">
                <Link
                  href="/login"
                  className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-bold text-text-light-primary transition-colors hover:bg-primary/30 dark:bg-primary/30 dark:text-text-dark-primary dark:hover:bg-primary/40"
                >
                  로그인
                </Link>
                <div className="aspect-square size-10 rounded-full bg-cover bg-center bg-no-repeat bg-gray-300" />
              </div>
            </header>
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
                  <Link
                    href="/admin"
                    className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary/20 px-5 text-base font-bold text-text-light-primary transition-colors hover:bg-primary/30 dark:bg-primary/30 dark:text-text-dark-primary dark:hover:bg-primary/40"
                  >
                    <span className="truncate">관리자 페이지</span>
                  </Link>
                </div>
              </div>
            </main>
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                <a
                  className="min-w-40 text-sm font-normal text-text-light-secondary hover:text-text-light-primary dark:text-text-dark-secondary dark:hover:text-text-dark-primary"
                  href="#"
                >
                  서비스 약관
                </a>
                <a
                  className="min-w-40 text-sm font-normal text-text-light-secondary hover:text-text-light-primary dark:text-text-dark-secondary dark:hover:text-text-dark-primary"
                  href="#"
                >
                  지원
                </a>
              </div>
              <p className="text-xs font-normal text-text-light-secondary dark:text-text-dark-secondary">
                © 2024 Say Ye. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

