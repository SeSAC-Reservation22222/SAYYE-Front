"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/common/Header";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import AdminGuard from "@/components/common/AdminGuard";
import type { AdminRole } from "@/types";

export default function AdminPage() {
  const [role, setRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedRole = localStorage.getItem("role") as AdminRole | null;
    setRole(storedRole);
  }, []);

  const adminMenus = useMemo(
    () => [
      {
        title: "관리자 관리",
        description: "관리자 계정을 추가, 수정 또는 삭제하고 역할을 관리합니다.",
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
        title: "클래스 관리",
        description: "강의(클래스)를 생성, 수정 또는 삭제하고 관리합니다.",
        icon: "class",
        href: "/admin/classes",
        active: true,
      },
      {
        title: "예약 현황 관리",
        description: "전체 회의실의 예약 현황을 확인하고 필요시 수정 또는 취소합니다.",
        icon: "event_available",
        href: "/admin/reservations",
        active: true,
      },
      {
        title: "공지사항 관리",
        description: "사용자에게 보여줄 공지사항을 작성하고 관리합니다.",
        icon: "campaign",
        href: "/admin/notices",
        active: true,
      },
      {
        title: "통계 및 보고서",
        description: "회의실 사용률 및 예약 통계를 확인하고 보고서를 생성합니다.",
        icon: "analytics",
        href: "/admin/statistics",
        active: false,
      },
      {
        title: "시스템 설정",
        description: "애플리케이션의 전반적인 설정을 변경합니다.",
        icon: "settings",
        href: "/admin/settings",
        active: false,
      },
      
      
    ],
    []
  );

  const visibleMenus = useMemo(
    () =>
      adminMenus.filter((menu) => {
        if (role === "ADMIN" && menu.href === "/admin/users") {
          return false;
        }
        return true;
      }),
    [adminMenus, role]
  );

  return (
    <AdminGuard>
      <div className="relative flex min-h-screen w-full flex-col">
        <Header
          showLogout
          variant="page"
          rightContent={
            <div className="flex flex-1 justify-end items-center gap-4 sm:gap-6">
              <Link
                className="text-sm font-medium hover:text-primary transition-colors"
                href="/rooms"
              >
                회의실 예약
              </Link>
              <div className="relative flex items-center justify-center size-10 rounded-full overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="사용자 프로필"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          }
        />
        <main className="flex flex-1 justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
          <div className="flex w-full max-w-7xl flex-col">
            <main className="flex flex-col gap-10 mt-8">
              <div className="px-2">
                <h2 className="text-4xl font-black tracking-tighter">관리자 페이지</h2>
                <p className="mt-2 text-text-light-secondary dark:text-dark-secondary">
                  SeSAC Book 시스템을 관리하고 설정을 변경합니다.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                {visibleMenus.map((menu) => (
                  <Card key={menu.title} className="flex flex-col gap-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-10 rounded-lg bg-primary-light p-1.5">
                        <Image
                          src="/logo.png"
                          alt={menu.title}
                          width={40}
                          height={40}
                          className="h-full w-full object-contain"
                        />
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
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="secondary" fullWidth disabled>
                        <span>{menu.title}</span>
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </main>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}


