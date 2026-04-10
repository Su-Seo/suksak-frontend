# 개인정보 슥삭

> 사진 속 개인정보(위치·일시·기기 정보 등)를 브라우저에서 바로 제거해주는 EXIF 클리너

## 개요

- **문제/목표** : 당근마켓·커뮤니티에 사진을 올릴 때 GPS 좌표, 촬영 일시, 기기 정보 등 민감한 메타데이터가 함께 노출되는 문제를 해결
- **핵심 기능** : 사진 업로드 → EXIF 메타데이터 탐지 → 제거된 파일 다운로드
- **대상 사용자** : 사진을 온라인에 공유하는 누구나
- **완전한 로컬 처리** : 파일이 서버로 전송되지 않으며 브라우저 안에서만 동작

## 🚀 주요 기능

### 핵심

- **EXIF 메타데이터 탐지** : GPS 위치, 촬영 일시, 기기 모델, 카메라 설정, 소프트웨어 정보를 카테고리별 뱃지로 시각화
- **메타데이터 완전 제거** : Canvas API를 이용해 EXIF가 없는 새 이미지 파일 생성
- **드래그 & 드롭 / 클릭 업로드** : 여러 파일 동시 처리, 모바일에서는 탭으로 선택
- **개별 다운로드** : `슥삭_원본파일명.jpg` 형식으로 즉시 저장
- **ZIP 일괄 다운로드** : 처리 완료된 파일이 2개 이상일 때 `슥삭_모음.zip`으로 한 번에 다운로드

### UX

- **다크 모드 토글** : 시스템 설정 자동 감지 + 수동 전환, `localStorage`에 설정 저장
- **대용량 파일 경고** : 20MB 초과 파일 업로드 시 처리 속도 경고 토스트 표시
- **지원 형식 외 파일 경고** : 지원하지 않는 파일 업로드 시 파일명과 함께 오류 토스트 표시
- **처리 실패 재시도** : 오류 발생 파일에 재시도 버튼 제공
- **모바일 최적화** : 터치 타겟 확대, 반응형 레이아웃, 다운로드 버튼 위치 최적화

## 🛠 기술 스택

### Frontend

- **React 19** + **TypeScript** : 사용자 인터페이스 및 타입 안전성
- **Vite** : 빠른 개발 환경 및 빌드 도구
- **Tailwind CSS 4** : 스타일링 프레임워크

### State Management

- **Zustand** : 경량 클라이언트 상태 관리
- **TanStack Query** : 서버 상태 관리

### UI Components

- **Lucide React** : 아이콘
- **Radix UI / CVA** : 접근성 기반 UI 컴포넌트 및 variant 스타일링
- **Sonner** : 토스트 알림

### 핵심 라이브러리

- **exifr** : EXIF 메타데이터 파싱
- **Canvas API** : 메타데이터 없는 이미지 재생성
- **JSZip** : ZIP 파일 생성

## 📁 프로젝트 구조

```text
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트 (Button 등)
│   ├── DropZone.tsx    # 드래그 & 드롭 업로드 영역
│   ├── FileCard.tsx    # 파일별 처리 결과 카드
│   └── ExifTagBadge.tsx # EXIF 태그 카테고리 뱃지
├── hooks/              # 커스텀 React 훅
│   └── useDarkMode.ts  # 다크 모드 상태 및 localStorage 동기화
├── lib/                # 유틸리티 라이브러리
│   ├── exifUtils.ts    # EXIF 읽기·제거·다운로드·ZIP 유틸
│   └── router.tsx      # 라우터 설정
├── models/             # 타입 정의
│   └── exif.ts         # ProcessedFile, ExifTag 등
├── pages/              # 페이지 컴포넌트
│   └── HomePage.tsx    # 메인 페이지
├── providers/          # React Context Provider
├── stores/             # Zustand 상태 관리
└── styles/
    ├── index.css       # 글로벌 스타일
    └── tokens.css      # 디자인 토큰 (라이트/다크 CSS 변수)
```

## 🎮 주요 페이지

- **홈 (`/`)** : 파일 업로드, 메타데이터 탐지 결과 확인, 정제된 파일 개별/일괄 다운로드

## 🔧 설치 및 실행

### 필수 요구사항

- Node.js: 22.x
- pnpm: 10.14.x (package.json의 `packageManager` 기준)

### 설치

```bash
corepack enable && corepack prepare pnpm --activate
pnpm i
pnpm dev
```

### 환경 변수

이 프로젝트는 외부 API를 사용하지 않으므로 별도의 환경 변수가 필요하지 않습니다.

### 스크립트

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "type-check": "tsc --noEmit",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

## 🎯 주요 기능 상세

### EXIF 메타데이터 탐지

탐지되는 메타데이터를 카테고리별 뱃지로 표시합니다.

|카테고리|색상|포함 정보|
|---|---|---|
|📍 위치|빨강|GPS 위도·경도, 고도|
|🕐 촬영 일시|주황|DateTimeOriginal, DateTime|
|📱 기기|파랑|제조사(Make), 모델(Model)|
|📷 카메라 설정|보라|렌즈, 초점거리, 조리개, ISO, 노출 시간|
|💻 소프트웨어|회색|편집 소프트웨어 정보|

### 메타데이터 제거 방식

`exifr`로 메타데이터를 읽은 뒤, HTML Canvas에 이미지를 다시 그려 EXIF가 없는 새 파일을 생성합니다. 파일은 브라우저 메모리에서만 처리되며 외부로 전송되지 않습니다.

### 지원 파일 형식

JPEG, PNG, WebP, HEIC, HEIF

### 다크 모드

페이지 우상단 토글 버튼으로 전환하며, 시스템의 `prefers-color-scheme` 설정을 초기값으로 사용합니다. 선택한 테마는 `localStorage`에 저장되어 다음 방문 시에도 유지됩니다.

## 🚀 배포

Vite 정적 빌드 결과물(`dist/`)을 Vercel, Cloudflare Pages, Netlify 등 정적 호스팅 어디서나 배포할 수 있습니다. 서버 사이드 처리가 없으므로 별도 백엔드가 필요하지 않습니다.

## 컨벤션 / 워크플로우

- **커밋 규칙** : Conventional Commits (Commitlint 적용)
- **PR 템플릿** : `.github/pull_request_template.md`
- **코드 스타일** : ESLint + Prettier 규칙 준수 (pre-commit hook 자동 실행)

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
