# 개인정보 슥삭

> 사진 속 개인정보(위치·일시·기기 정보 등)를 브라우저에서 바로 제거해주는 EXIF 클리너

## 개요

- 문제/목표: 당근마켓·커뮤니티에 사진을 올릴 때 GPS 좌표, 촬영 일시, 기기 정보 등 민감한 메타데이터가 함께 노출되는 문제를 해결
- 핵심 기능: 사진 업로드 → EXIF 메타데이터 탐지 → 제거된 파일 다운로드
- 대상 사용자: 사진을 온라인에 공유하는 누구나

## 🚀 주요 기능

- **EXIF 메타데이터 탐지** : GPS 위치, 촬영 일시, 기기 모델, 카메라 설정, 소프트웨어 정보를 카테고리별 뱃지로 시각화
- **메타데이터 완전 제거** : Canvas API를 이용해 EXIF가 없는 새 이미지 파일을 생성
- **드래그 & 드롭 업로드** : 여러 파일을 동시에 드래그하거나 클릭으로 선택
- **즉시 다운로드** : `슥삭_원본파일명.jpg` 형식으로 바로 저장
- **완전한 로컬 처리** : 파일이 서버로 전송되지 않으며 브라우저 안에서만 동작

## 🛠 기술 스택

### Frontend

- **React 19** : 사용자 인터페이스 구축
- **TypeScript** : 타입 안전성 보장
- **Vite** : 빠른 개발 환경 및 빌드 도구
- **Tailwind CSS** : 스타일링 프레임워크

### State Management

- **Zustand** : 경량 상태 관리 라이브러리
- **TanStack Query** : 서버 상태 관리

### UI Components

- **Lucide React** : 아이콘
- **Radix UI / CVA** : 접근성 기반 UI 컴포넌트 및 variant 스타일링

### 핵심 라이브러리

- **exifr** : EXIF 메타데이터 파싱
- **Canvas API** : 메타데이터 없는 이미지 재생성

## 📁 프로젝트 구조

```text
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트 (Button 등)
│   ├── DropZone.tsx    # 드래그 & 드롭 업로드 영역
│   ├── FileCard.tsx    # 파일별 처리 결과 카드
│   └── ExifTagBadge.tsx # EXIF 태그 카테고리 뱃지
├── lib/                # 유틸리티 라이브러리
│   ├── exifUtils.ts    # EXIF 읽기·제거·다운로드 유틸
│   └── router.tsx      # 라우터 설정
├── models/             # 타입 정의
│   └── exif.ts         # ProcessedFile, ExifTag 등
├── pages/              # 페이지 컴포넌트
│   └── HomePage.tsx    # 메인 페이지
├── providers/          # React Context Provider
├── stores/             # Zustand 상태 관리
└── styles/
```

## 🎮 주요 페이지

- **홈 (`/`)** : 파일 업로드, 메타데이터 탐지 결과 확인, 정제된 파일 다운로드

## 🔧 설치 및 실행

### 필수 요구사항

- Node.js: 22.x
- pnpm: 10.14.x
  - package.json의 packageManager에 따름

### 설치

```bash
# pnpm 설정 및 의존성 설치
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

탐지되는 메타데이터를 카테고리별로 뱃지로 표시합니다.

- **📍 위치 (빨강)** : GPS 위도·경도, 고도
- **🕐 촬영 일시 (주황)** : DateTimeOriginal, DateTime
- **📱 기기 (파랑)** : 제조사(Make), 모델(Model)
- **📷 카메라 설정 (보라)** : 렌즈, 초점거리, 조리개, ISO, 노출 시간
- **💻 소프트웨어 (회색)** : 편집 소프트웨어 정보

### 메타데이터 제거 방식

`exifr`로 메타데이터를 읽은 뒤, HTML Canvas에 이미지를 다시 그려 EXIF가 없는 새 파일을 생성합니다. 파일은 브라우저 메모리에서만 처리되며 외부로 전송되지 않습니다.

### 컨벤션/워크플로우

- 커밋 규칙: Conventional Commits (Commitlint), 커밋 템플릿 사용 권장
- PR 템플릿: `.github/pull_request_template.md`
- 브랜치 전략: 예) trunk-based 또는 Git Flow (팀 결정)
- 코드 스타일: ESLint/Prettier 규칙 준수

## 🚀 배포

이 프로젝트는 Vite를 사용하여 정적 사이트로 빌드됩니다:

### 배포/CI

- 대상: Vercel / Cloudflare Pages / Netlify (정적 호스팅 어디서나 가능)
- 시크릿/환경: 없음

### 라이선스

MIT

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
