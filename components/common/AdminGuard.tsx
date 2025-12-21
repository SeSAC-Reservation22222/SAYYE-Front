"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/utils/jwt";

interface AdminGuardProps {
    children: React.ReactNode;
}

/**
 * 관리자 전용 페이지 접근 제어 컴포넌트
 * MASTER 또는 ADMIN 역할이 아닌 경우 홈 페이지로 리다이렉트
 */
export default function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const hasChecked = useRef(false);

    useEffect(() => {
        // 이미 확인했으면 다시 실행하지 않음
        if (hasChecked.current) return;

        const checkAdminAccess = () => {
            const adminStatus = isAdmin();

            if (!adminStatus) {
                // 관리자가 아닌 경우 홈 페이지로 리다이렉트
                hasChecked.current = true;
                alert("관리자만 접근할 수 있는 페이지입니다.");
                router.push("/");
                return;
            }

            hasChecked.current = true;
            setIsAuthorized(true);
        };

        checkAdminAccess();
    }, [router]);

    // 권한 확인 중에는 아무것도 렌더링하지 않음
    if (!isAuthorized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-gray-500">권한 확인 중...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
