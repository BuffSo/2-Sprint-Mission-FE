# 🐼 Panda Market - Frontend

Next.js 기반 중고거래 마켓플레이스 프론트엔드

## 📖 개요

Panda Market의 사용자 인터페이스입니다. 상품 검색/등록, 게시글 작성, 소셜 로그인 등의 기능을 제공하는 반응형 웹 애플리케이션입니다.

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (Pages Router)
- **Language**: JavaScript
- **State Management**: TanStack React Query v5
- **Styling**: CSS Modules
- **HTTP Client**: Axios
- **Image Optimization**: Next.js Image

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- 실행 중인 백엔드 서버 (`http://localhost:3000`)

### 설치

```bash
# 의존성 설치
npm install

# 환경 변수 설정
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env
```

### 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start
```

프론트엔드가 `http://localhost:3001`에서 실행됩니다.

## 📁 프로젝트 구조

```
frontend/
├── pages/                    # 페이지 라우팅
│   ├── _app.js              # 전역 App 설정
│   ├── _document.js         # HTML Document 커스터마이징
│   ├── index.js             # 홈페이지
│   ├── signin/              # 로그인 페이지
│   ├── signup/              # 회원가입 페이지
│   ├── items/               # 상품 목록/상세
│   │   ├── index.js         # 상품 목록
│   │   ├── [id].js          # 상품 상세
│   │   └── add.js           # 상품 등록
│   ├── articles/            # 게시글 목록/상세
│   └── auth/
│       └── callback.js      # OAuth 콜백 처리
├── components/              # 재사용 컴포넌트
│   ├── Auth/               # 인증 관련 (SocialLogin 등)
│   ├── Common/             # 공통 컴포넌트 (Navbar, Footer 등)
│   ├── Product/            # 상품 관련 컴포넌트
│   └── Article/            # 게시글 관련 컴포넌트
├── contexts/               # React Context
│   ├── AuthProvider.js     # 인증 상태 관리
│   └── DeviceContext.js    # 반응형 디바이스 감지
├── hooks/                  # Custom Hooks
│   ├── useAuth.js          # 인증 훅
│   ├── useProducts.js      # 상품 데이터 훅
│   └── useArticles.js      # 게시글 데이터 훅
├── lib/                    # 유틸리티 및 API
│   ├── api/
│   │   ├── AuthService.js  # 인증 API
│   │   ├── ProductService.js # 상품 API
│   │   └── ArticleService.js # 게시글 API
│   └── axiosInstance.js    # Axios 인터셉터 설정
├── styles/                 # CSS 모듈
│   ├── globals.css         # 전역 스타일
│   ├── HomePage.css        # 홈 페이지 스타일
│   └── ...
├── public/                 # 정적 자산
│   ├── images/            # 이미지 파일
│   └── icons/             # 아이콘 파일
└── next.config.mjs        # Next.js 설정
```

## 🔑 환경 변수

`.env` 파일 설정:

```env
# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**프로덕션**:
```env
NEXT_PUBLIC_API_URL="https://buffso-pandamarket-api.onrender.com"
```

## 🎨 주요 페이지

### 홈페이지 (`/`)
- 중고마켓 소개
- 베스트 상품 미리보기

### 로그인/회원가입 (`/signin`, `/signup`)
- 이메일/비밀번호 로그인
- Google, Kakao 소셜 로그인

### 상품 목록 (`/items`)
- 상품 검색 및 필터링
- 정렬 (최신순, 좋아요순)
- 페이지네이션

### 상품 상세 (`/items/[id]`)
- 상품 정보 표시
- 댓글 작성/수정/삭제
- 찜하기 기능

### 상품 등록 (`/items/add`)
- 상품 정보 입력
- 이미지 업로드
- 카테고리 선택

### 게시판 (`/articles`)
- 게시글 목록
- 게시글 작성/수정/삭제
- 댓글 및 좋아요

## 🔐 인증 시스템

### 토큰 관리
- **Access Token**: localStorage에 저장, API 요청 시 자동 포함
- **Refresh Token**: localStorage에 저장, Access Token 만료 시 자동 갱신
- **자동 로그아웃**: 토큰 만료 시 또는 사용자 삭제 시 자동 처리

### 소셜 로그인 플로우
1. 소셜 로그인 버튼 클릭
2. 백엔드 OAuth 엔드포인트로 리다이렉트
3. 소셜 제공자 인증 완료
4. `/auth/callback?accessToken=xxx&refreshToken=yyy`로 리다이렉트
5. 토큰 저장 및 사용자 정보 로드
6. `/items` 페이지로 이동

## 📦 주요 라이브러리

### 상태 관리
- **TanStack React Query**: 서버 상태 관리 및 캐싱
- **React Context**: 전역 클라이언트 상태 (인증 등)

### UI/UX
- **CSS Modules**: 컴포넌트별 스타일 격리
- **Next.js Image**: 자동 이미지 최적화
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원

### 네트워킹
- **Axios**: HTTP 클라이언트
- **인터셉터**: 자동 토큰 포함, 에러 처리, 토큰 갱신

## 🔧 개발 도구

```bash
# ESLint 검사
npm run lint

# Next.js 빌드 분석
npm run build
```

## 📱 반응형 브레이크포인트

```css
/* 모바일 */
@media (max-width: 767px) { }

/* 태블릿 */
@media (min-width: 768px) and (max-width: 1199px) { }

/* 데스크톱 */
@media (min-width: 1200px) { }
```

## 🖼️ 이미지 도메인 설정

`next.config.mjs`에서 외부 이미지 도메인 허용:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'lh3.googleusercontent.com',  // Google 프로필
    },
    {
      protocol: 'https',
      hostname: 'k.kakaocdn.net',  // Kakao 프로필
    },
    // ... 기타 도메인
  ],
}
```

## 🚢 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

### 환경 변수 설정
Vercel 대시보드에서 환경 변수 설정:
- `NEXT_PUBLIC_API_URL`: 프로덕션 백엔드 URL

## 📚 API 통신

### 인증 헤더 자동 포함
```javascript
// lib/axiosInstance.js
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
```

### 자동 토큰 갱신
```javascript
// 401 에러 시 자동으로 Refresh Token으로 갱신 시도
instance.interceptors.response.use(
  response => response,
  async error => {
    // 토큰 갱신 로직
  }
);
```

## 🤝 기여

이 프로젝트는 학습 목적으로 만들어졌습니다.

---

**Built with Next.js & React Query**
