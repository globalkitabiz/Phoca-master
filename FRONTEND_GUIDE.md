# Phoca (Vocapic) 프론트엔드 기능 설명서

> AI 기반 영어 어휘 학습 웹 애플리케이션

---

## 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 12.1.6 | React 프레임워크 |
| React | 18.1.0 | UI 라이브러리 |
| TypeScript | 4.7.3 | 타입 안전성 |
| React Query | 3.39.1 | 서버 상태 관리 |
| Zustand | 4.0.0 | 전역 상태 관리 |
| Styletron | - | CSS-in-JS |
| Formik + Yup | - | 폼 유효성 검증 |

---

## 페이지 구조

### 🏠 메인 페이지 (`/`)

홈 화면에서 4가지 주요 기능으로 이동할 수 있습니다:
- 학습가이드
- 단어장
- 단어퀴즈
- 그림퀴즈

---

### 👤 사용자 인증

#### 로그인 (`/login`)
- 이메일/비밀번호 로그인
- 카카오 소셜 로그인
- 비밀번호 찾기 기능

#### 회원가입 (`/register`)
- 이메일, 비밀번호, 닉네임 입력
- 유효성 검증 (Formik + Yup)

#### 마이페이지 (`/myPage`) - 로그인 필요
- 사용자 정보 표시
- 단어장 통계
- 북마크한 단어장 수
- 프로필 수정, 비밀번호 변경, 계정 삭제

---

### 📚 단어장 기능

#### 단어장 목록 (`/vocabulary`)
| 탭 | 기능 |
|-----|------|
| 내 단어장 | 내가 만든 단어장 목록 |
| 북마크 | 다른 사람 단어장 중 북마크한 것 |

#### 단어장 상세 (`/vocabulary/[id]`)
- 단어 목록 보기 (영어, 한국어, 이미지)
- 단어 수정/삭제
- 단어장 정보 수정
- 공개/비공개 설정

#### 단어장 만들기 (`/word/upload`)
1. **파일 업로드**: 드래그&드롭으로 이미지 업로드
2. **AI 객체 인식**: Replicate AI가 이미지에서 물체 감지
3. **자동 번역**: Google Translate로 영어→한국어 번역

#### 업로드 결과 (`/word/results/[id]`)
- AI가 인식한 단어 확인
- 단어 수정/삭제
- 새 단어 추가
- 단어장에 저장

---

### 🎮 단어 퀴즈 게임

#### 게임 선택 (`/wordQuiz`) - 로그인 필요
두 가지 게임 모드 선택:
1. 단어 짝 맞추기
2. 단어장 외우기

#### 단어 짝 맞추기 (`/wordQuiz/game/[id]`)
| 항목 | 설명 |
|------|------|
| 게임 방식 | 16장의 카드 중 영어-이미지 쌍 맞추기 |
| 필요 조건 | 단어장에 16개 이상의 단어 필요 |
| 점수 | 맞춘 쌍 개수 표시 |

**게임 흐름:**
```
카드 뒤집기 → 2장 선택 → 쌍 확인 →
일치하면 제거 / 불일치하면 다시 뒤집기 →
모든 쌍 맞추면 완료
```

#### 단어장 외우기 (`/wordQuiz/voca/[id]`)
| 항목 | 설명 |
|------|------|
| 게임 방식 | 플래시카드 형태로 단어 학습 |
| 기능 | 영단어 음성 재생 (Web Speech API) |
| 조작 | 카드 넘기기, 정답 보기 |

---

### 🎨 그림 퀴즈 (`/drawing`)

AI가 제시한 영어 단어를 그림으로 그리면 AI가 맞추는 게임

**게임 흐름:**
```
영어 단어 제시 (예: "apple")
→ 캔버스에 그림 그리기
→ 제출 버튼 클릭
→ Replicate AI가 그림 분석
→ 정답/오답 판정
```

| 기능 | 설명 |
|------|------|
| 캔버스 | 마우스/터치로 그림 그리기 |
| 지우기 | 캔버스 초기화 |
| 제출 | AI 판정 요청 |
| 다시하기 | 새 단어로 시작 |

---

### 🌐 네트워크 (`/network`)

다른 사용자가 공개한 단어장을 탐색하고 북마크

| 기능 | 설명 |
|------|------|
| 검색 | 단어장 이름으로 검색 |
| 북마크 | 마음에 드는 단어장 저장 |
| 미리보기 | 단어장 내용 확인 |

---

### 📖 학습가이드 (`/guide`)

앱 사용법을 설명하는 가이드 페이지

| 가이드 항목 | 내용 |
|-------------|------|
| 단어장 만들기 | 이미지 업로드 방법 |
| 단어장 보기 | 단어장 관리 방법 |
| 단어 퀴즈 | 게임 방법 설명 |
| 그림 퀴즈 | AI 그림 인식 게임 설명 |

---

## 컴포넌트 구조

```
components/
├── common/          # 공통 컴포넌트 (Seo, Note, etc.)
├── drawing/         # 그림퀴즈 컴포넌트
│   ├── Canvas.tsx      # 그림 그리기 캔버스
│   ├── Drawing.tsx     # 메인 로직
│   └── Result.tsx      # 결과 표시
├── guide/           # 학습가이드 컴포넌트
├── intro/           # 네비게이션 바
├── myPage/          # 마이페이지 컴포넌트
├── network/         # 네트워크 페이지 컴포넌트
├── sidebar/         # 사이드바
├── user/            # 사용자 인증 컴포넌트
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── UserEditModal.tsx
├── vocabulary/      # 단어장 컴포넌트
│   ├── VocabularyItem.tsx
│   └── words/          # 단어 관련 컴포넌트
├── word/            # 단어 업로드/결과 컴포넌트
│   ├── upload/
│   │   └── Dropzone.tsx
│   └── results/
│       ├── Results.tsx
│       ├── EditForm/
│       └── SaveForm/
└── wordQuiz/        # 단어퀴즈 컴포넌트
    ├── game/           # 짝맞추기 게임
    │   ├── WordQuizCard.tsx
    │   └── WordQuizCardList.tsx
    └── voca/           # 플래시카드 학습
```

---

## 상태 관리

### Zustand 스토어

```typescript
// userStore - 사용자 정보
{
  userId: number,
  email: string,
  nickname: string,
  isLoggedIn: boolean
}

// useGameStore - 게임 상태
{
  score: number,
  matchedPairs: string[],
  isGameOver: boolean
}
```

### React Query

서버 데이터 캐싱 및 동기화:
- 단어장 목록 조회
- 단어 목록 조회
- 북마크 목록 조회
- 게임 데이터 페칭

---

## 라우팅 구조

| 경로 | 페이지 | 인증 필요 |
|------|--------|----------|
| `/` | 홈 | ❌ |
| `/login` | 로그인 | ❌ |
| `/register` | 회원가입 | ❌ |
| `/myPage` | 마이페이지 | ✅ |
| `/vocabulary` | 단어장 목록 | ❌ |
| `/vocabulary/[id]` | 단어장 상세 | ❌ |
| `/network` | 네트워크 | ❌ |
| `/guide` | 학습가이드 | ❌ |
| `/word/upload` | 단어장 만들기 | ❌ |
| `/word/results/[id]` | 업로드 결과 | ❌ |
| `/wordQuiz` | 퀴즈 선택 | ✅ |
| `/wordQuiz/game/[id]` | 짝맞추기 게임 | ✅ |
| `/wordQuiz/voca/[id]` | 플래시카드 | ✅ |
| `/drawing` | 그림퀴즈 | ❌ |

---

## 주요 기능 흐름도

### 단어장 생성 흐름
```
이미지 업로드 (Dropzone)
    ↓
Backend API로 전송
    ↓
Cloudflare R2에 이미지 저장
    ↓
Replicate AI 객체 인식
    ↓
Google Translate 번역
    ↓
결과 페이지에서 확인/수정
    ↓
Supabase DB에 저장
```

### 그림 퀴즈 흐름
```
랜덤 영단어 제시
    ↓
Canvas에 그림 그리기
    ↓
Base64로 이미지 변환
    ↓
Backend API → Replicate AI
    ↓
AI 판정 결과 표시
```

---

## 반응형 디자인

`react-responsive` 라이브러리로 모바일/데스크톱 대응

| 화면 크기 | 레이아웃 |
|----------|---------|
| 모바일 (< 768px) | 사이드바 숨김, 단일 컬럼 |
| 데스크톱 (≥ 768px) | 사이드바 표시, 다중 컬럼 |

---

## 환경 변수

```env
# Frontend (.env.local)
NEXT_PUBLIC_SERVER_URL=https://phoca-master-production.up.railway.app
NEXT_PUBLIC_IMAGE_URL=https://pub-xxxxx.r2.dev/
```

---

## 로컬 개발

```bash
cd front
npm install
npm run dev
```

개발 서버: http://localhost:3000

---

## 빌드 및 배포

```bash
# 로컬 빌드
npm run build

# Cloudflare Pages 빌드
npm run pages:build
```

---

*마지막 업데이트: 2025-12-09*
