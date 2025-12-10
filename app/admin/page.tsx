"use client";

import Link from "next/link";
import Header from "@/components/common/Header";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";

export default function AdminPage() {
  const adminMenus = [
    {
      title: "사용자 관리",
      description: "사용자 계정을 추가, 수정 또는 삭제하고 역할을 관리합니다.",
      icon: "group",
      href: "/admin/users",
      active: true,
    },
    {
      title: "회의실 관리",
      description: "새로운 회의실을 추가하거나 기존 회의실 정보를 수정합니다.",
      icon: "meeting_room",
      href: "/admin/rooms",
      active: true,
    },
    {
      title: "예약 현황 수정",
      description: "전체 회의실의 예약 현황을 확인하고 필요시 수정 또는 취소합니다.",
      icon: "event_available",
      href: "/admin/reservations",
      active: true,
    },
    {
      title: "시스템 설정",
      description: "애플리케이션의 전반적인 설정을 변경합니다.",
      icon: "settings",
      href: "/admin/settings",
      active: false,
    },
    {
      title: "통계 및 보고서",
      description: "회의실 사용률 및 예약 통계를 확인하고 보고서를 생성합니다.",
      icon: "analytics",
      href: "/admin/statistics",
      active: false,
    },
    {
      title: "공지사항 관리",
      description: "사용자에게 보여줄 공지사항을 작성하고 관리합니다.",
      icon: "campaign",
      href: "/admin/notices",
      active: false,
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header showLogout />
      <main className="flex flex-1 justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
        <div className="flex w-full max-w-7xl flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-6 py-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="size-6 text-primary">
                <svg
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                    fillRule="evenodd"
                  />
                  <path
                    clipRule="evenodd"
                    d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold">Say Ye</h1>
            </div>
            <div className="flex flex-1 justify-end items-center gap-4 sm:gap-6">
              <Link
                className="text-sm font-medium hover:text-primary transition-colors"
                href="/rooms"
              >
                회의실 예약
              </Link>
              <button className="relative flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined !text-[24px]">account_circle</span>
              </button>
            </div>
          </header>
          <main className="flex flex-col gap-10 mt-8">
            <div className="px-2">
              <h2 className="text-4xl font-black tracking-tighter">관리자 페이지</h2>
              <p className="mt-2 text-text-light-secondary dark:text-dark-secondary">
                Say Ye 시스템을 관리하고 설정을 변경합니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
              {adminMenus.map((menu) => (
                <Card key={menu.title} className="flex flex-col gap-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-primary-light">
                      <span className="material-symbols-outlined text-primary">{menu.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold">{menu.title}</h3>
                  </div>
                  <p className="text-sm text-text-light-secondary dark:text-dark-secondary">
                    {menu.description}
                  </p>
                  {menu.active ? (
                    <Link href={menu.href} className="mt-auto">
                      <Button variant="primary" fullWidth>
                        <span>{menu.title} 바로가기</span>
                        <span className="material-symbols-outlined !text-[18px]">arrow_forward</span>
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="secondary" fullWidth disabled>
                      <span>{menu.title}</span>
                      <span className="material-symbols-outlined !text-[18px]">arrow_forward</span>
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </main>
        </div>
      </main>
    </div>
  );
}

