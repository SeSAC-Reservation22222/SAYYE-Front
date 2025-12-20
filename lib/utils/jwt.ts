export interface JWTPayload {
    sub: string; // 사용자 ID
    email?: string;
    role?: string;
    name?: string;
    phoneLastNumber?: string;
    exp?: number;
    iat?: number;
}

/**
 * JWT 토큰을 디코딩하여 페이로드를 반환합니다.
 * @param token JWT 토큰
 * @returns 디코딩된 페이로드 또는 null
 */
export function decodeJWT(token: string): JWTPayload | null {
    try {
        // JWT는 header.payload.signature 형식
        const parts = token.split(".");
        if (parts.length !== 3) {
            return null;
        }

        // Base64 URL 디코딩
        const payload = parts[1];
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("JWT 디코딩 실패:", error);
        return null;
    }
}

/**
 * 로컬 스토리지에서 액세스 토큰을 가져와 디코딩합니다.
 * @returns 디코딩된 페이로드 또는 null
 */
export function getDecodedToken(): JWTPayload | null {
    if (typeof window === "undefined") {
        return null;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
        return null;
    }

    return decodeJWT(token);
}

/**
 * 현재 사용자의 역할을 가져옵니다.
 * @returns 사용자 역할 또는 null
 */
export function getUserRole(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    // 먼저 localStorage에서 role 확인
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
        return storedRole;
    }

    // JWT 토큰에서 role 추출
    const payload = getDecodedToken();
    return payload?.role || null;
}

/**
 * 사용자가 관리자인지 확인합니다.
 * @returns 관리자 여부
 */
export function isAdmin(): boolean {
    const role = getUserRole();
    return role === "ADMIN" || role === "MASTER";
}
