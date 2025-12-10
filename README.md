# Say Ye - 회의실 예약 시스템 프론트엔드

Next.js 14와 TypeScript를 사용한 회의실 예약 시스템의 프론트엔드입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## 프로젝트 구조

```
frontend/
├── app/                    # Next.js App Router 페이지
│   ├── admin/             # 관리자 페이지
│   ├── login/             # 로그인 페이지
│   ├── rooms/             # 회의실 관련 페이지
│   ├── my-reservations/   # 내 예약 조회 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 전역 스타일
├── components/            # 공통 컴포넌트
│   └── common/           # 재사용 가능한 컴포넌트
│       ├── Header.tsx     # 헤더 컴포넌트
│       ├── Button.tsx     # 버튼 컴포넌트
│       ├── Input.tsx      # 입력 컴포넌트
│       ├── Select.tsx     # 셀렉트 컴포넌트
│       └── Card.tsx       # 카드 컴포넌트
├── lib/                   # 유틸리티 및 API 클라이언트
│   └── api/              # API 클라이언트
│       ├── client.ts     # Axios 인스턴스 설정
│       ├── auth.ts        # 인증 API
│       ├── admin.ts       # 관리자 API
│       ├── course.ts      # 강의(코스) API
│       ├── room.ts        # 회의실 API
│       └── reservation.ts # 예약 API
└── types/                 # TypeScript 타입 정의
    └── index.ts          # DTO 기반 타입 정의
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 주요 기능

### 인증/인가
- 회원가입
- 로그인/로그아웃
- 토큰 자동 갱신

### 회의실 관리
- 회의실 목록 조회
- 회의실별 예약 현황 확인
- 회의실 예약

### 예약 관리
- 예약 생성
- 내 예약 조회
- 예약 취소

### 관리자 기능
- 관리자 페이지
- 사용자 관리
- 회의실 관리
- 예약 현황 관리

## API 연동

모든 API 호출은 `lib/api/` 디렉토리의 클라이언트를 통해 이루어집니다. 

- **인증 토큰**: 자동으로 헤더에 추가됩니다.
- **토큰 갱신**: 401 에러 발생 시 자동으로 토큰을 갱신합니다.
- **에러 처리**: API 에러는 각 페이지에서 처리됩니다.

## 스타일링

Tailwind CSS를 사용하며, 다크 모드를 지원합니다. 색상 및 폰트 설정은 `tailwind.config.ts`에서 관리됩니다.

## 빌드

```bash
npm run build
npm start
```

## 라이선스

이 프로젝트는 비공개 프로젝트입니다.

