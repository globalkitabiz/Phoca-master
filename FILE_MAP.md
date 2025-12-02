# Phoca 프로젝트 파일 맵

> **Phoca (Photo + Vocabulary)** - AI 기반 영어 어휘 학습 서비스
>
> 기술 스택: Next.js + NestJS + Python Flask + TensorFlow

---

## 프로젝트 구조 개요

```
Phoca-master/
├── ai/                 # Python AI 서비스 (객체인식, 이미지분류)
├── back/               # NestJS 백엔드 API 서버
├── front/              # Next.js 프론트엔드
└── .gitlab/            # GitLab CI/CD 템플릿
```

---

## 1. AI 서비스 (`/ai`)

Python Flask 기반 AI 마이크로서비스

```
ai/
├── flask_serve.py              # Flask API 서버 (메인 엔트리포인트)
├── requirements.txt            # Python 패키지 의존성
├── README.md                   # AI 서비스 문서
├── .gitignore
│
├── object-detection/           # YOLO 객체 인식 모델
│   ├── exporting_model.ipynb   # 모델 내보내기 노트북
│   ├── tfrecord_generator.ipynb # TFRecord 생성 노트북
│   ├── data/
│   │   └── lvis.names          # LVIS 데이터셋 라벨 목록
│   └── saved_model/            # 저장된 YOLO 모델
│
└── image-classification/       # MobileNet 이미지 분류 모델
    ├── model_training.ipynb    # 모델 학습 노트북
    ├── data/
    │   └── labels.names        # 분류 라벨 목록
    └── saved_model/            # 저장된 MobileNet 모델
```

### 주요 파일 설명

| 파일 | 설명 |
|------|------|
| `flask_serve.py` | Flask REST API 서버. `/od/` (객체인식), `/ic/` (이미지분류) 엔드포인트 |
| `requirements.txt` | TensorFlow 2.9, Flask 2.1, boto3 등 의존성 |
| `lvis.names` | 1,203개 객체 클래스 라벨 (LVIS 데이터셋) |
| `labels.names` | 그림 분류용 라벨 목록 |

---

## 2. 백엔드 (`/back`)

NestJS + TypeScript 기반 REST API 서버

```
back/
├── package.json                # 프로젝트 설정 및 의존성
├── package-lock.json
├── tsconfig.json               # TypeScript 설정
├── tsconfig.build.json         # 빌드용 TypeScript 설정
├── nest-cli.json               # NestJS CLI 설정
├── .eslintrc.js                # ESLint 설정
├── .gitignore
├── README.md
│
└── src/
    ├── main.ts                 # 애플리케이션 엔트리포인트
    ├── app.module.ts           # 루트 모듈 (모든 모듈 임포트)
    ├── orm.config.ts           # TypeORM 설정
    │
    ├── api/
    │   └── base.document.ts    # Swagger API 문서 기본 설정
    │
    ├── config/                 # 설정 모듈
    │   ├── typeorm.config.ts   # PostgreSQL TypeORM 설정
    │   └── email.confg.ts      # 이메일 서비스 설정
    │
    ├── auth/                   # 인증 모듈
    │   ├── auth.module.ts      # 인증 모듈 정의
    │   ├── auth.controller.ts  # 인증 컨트롤러 (로그인, 회원가입)
    │   ├── auth.service.ts     # 인증 비즈니스 로직
    │   ├── dto/
    │   │   └── auth.credential.dto.ts  # 인증 DTO
    │   ├── guard/
    │   │   ├── jwt-auth.guard.ts       # JWT 인증 가드
    │   │   └── kakao-auth.guard.ts     # 카카오 OAuth 가드
    │   └── strategy/
    │       ├── jwt.strategy.ts         # JWT 전략
    │       └── kakao-auth.strategy.ts  # 카카오 OAuth 전략
    │
    ├── user/                   # 사용자 모듈
    │   ├── user.module.ts      # 사용자 모듈 정의
    │   ├── user.controller.ts  # 사용자 컨트롤러
    │   ├── user.service.ts     # 사용자 비즈니스 로직
    │   ├── user.entity.ts      # 사용자 엔티티 (DB 테이블)
    │   ├── decorator/
    │   │   └── user.decorator.ts       # 커스텀 사용자 데코레이터
    │   └── dto/
    │       ├── create-user.dto.ts      # 회원가입 DTO
    │       ├── login-user.dto.ts       # 로그인 DTO
    │       ├── user-info.dto.ts        # 사용자 정보 DTO
    │       ├── param-user.dto.ts       # URL 파라미터 DTO
    │       ├── checkt-email.dto.ts     # 이메일 확인 DTO
    │       └── update-password.dto.ts  # 비밀번호 변경 DTO
    │
    ├── word/                   # 단어 모듈
    │   ├── word.module.ts      # 단어 모듈 정의
    │   ├── word.controller.ts  # 단어 컨트롤러 (업로드, CRUD)
    │   ├── word.service.ts     # 단어 비즈니스 로직
    │   ├── word.entity.ts      # 단어 엔티티 (영어, 한국어, 이미지)
    │   ├── dto/
    │   │   ├── create-word.dto.ts      # 단어 생성 DTO
    │   │   ├── update-word.dto.ts      # 단어 수정 DTO
    │   │   ├── body-word.dto.ts        # 요청 바디 DTO
    │   │   ├── param-word.dto.ts       # URL 파라미터 DTO
    │   │   └── create-translate.dto.ts # 번역 생성 DTO
    │   └── listener/
    │       └── word-created.listener.ts # 단어 생성 이벤트 리스너
    │
    ├── wordbook/               # 단어장 모듈
    │   ├── wordbook.module.ts      # 단어장 모듈 정의
    │   ├── wordbook.controller.ts  # 단어장 컨트롤러
    │   ├── wordbook.service.ts     # 단어장 비즈니스 로직
    │   ├── wordbook.entity.ts      # 단어장 엔티티
    │   └── dto/
    │       ├── create-wordbook.dto.ts  # 단어장 생성 DTO
    │       └── update-wordbook.dto.ts  # 단어장 수정 DTO
    │
    ├── bookmark/               # 북마크 모듈
    │   ├── bookmark.module.ts      # 북마크 모듈 정의
    │   ├── bookmark.controller.ts  # 북마크 컨트롤러
    │   ├── bookmark.service.ts     # 북마크 비즈니스 로직
    │   ├── bookmark.entity.ts      # 북마크 엔티티
    │   └── dto/
    │       └── create-bookmark.dto.ts  # 북마크 생성 DTO
    │
    ├── quiz/                   # 퀴즈 모듈
    │   ├── quiz.module.ts      # 퀴즈 모듈 정의
    │   ├── quiz.controller.ts  # 퀴즈 컨트롤러
    │   ├── quiz.service.ts     # 퀴즈 비즈니스 로직
    │   └── quiz.entity.ts      # 퀴즈 엔티티 (그림 게임 결과)
    │
    ├── email/                  # 이메일 서비스
    │   └── email.service.ts    # 이메일 발송 로직
    │
    ├── events/                 # 이벤트 정의
    │   └── word-created.event.ts   # 단어 생성 이벤트
    │
    └── middleware/             # 미들웨어
        ├── image.middleware.ts     # 이미지 업로드 (S3)
        └── translate.middleware.ts # 번역 미들웨어 (Google Translate)
```

### 주요 파일 설명

| 파일 | 설명 |
|------|------|
| `main.ts` | NestJS 앱 부트스트랩, Swagger 설정, 포트 5001 |
| `app.module.ts` | 모든 모듈 통합, 글로벌 설정 |
| `user.entity.ts` | Users 테이블: userId, userName, email, password, userImage |
| `word.entity.ts` | Word 테이블: wordEng[], wordKor[], wordKey (S3 URL) |
| `wordbook.entity.ts` | Wordbook 테이블: wordbookName, secured (공개/비공개) |
| `jwt.strategy.ts` | JWT 토큰 검증 및 사용자 인증 |
| `image.middleware.ts` | AWS S3 이미지 업로드 처리 |

---

## 3. 프론트엔드 (`/front`)

Next.js + React 18 + TypeScript 기반 웹 클라이언트

```
front/
├── package.json                # 프로젝트 설정 및 의존성
├── yarn.lock                   # Yarn 락 파일
├── tsconfig.json               # TypeScript 설정
├── next.config.js              # Next.js 설정
├── next-env.d.ts               # Next.js 타입 정의
├── .eslintrc.json              # ESLint 설정
├── .gitignore
├── README.md
│
├── pages/                      # Next.js 페이지 라우팅
│   ├── _app.tsx                # App 컴포넌트 (전역 설정)
│   ├── _document.tsx           # Document 컴포넌트 (HTML 구조)
│   ├── index.tsx               # 홈페이지 (/)
│   │
│   ├── login/
│   │   ├── index.tsx           # 로그인 페이지 (/login)
│   │   └── kakao.tsx           # 카카오 OAuth 콜백 (/login/kakao)
│   │
│   ├── register/
│   │   └── index.tsx           # 회원가입 페이지 (/register)
│   │
│   ├── guide/
│   │   └── index.tsx           # 사용 가이드 페이지 (/guide)
│   │
│   ├── myPage/
│   │   └── index.tsx           # 마이페이지 (/myPage)
│   │
│   ├── vocabulary/
│   │   ├── index.tsx           # 내 단어장 목록 (/vocabulary)
│   │   └── [id].tsx            # 단어장 상세 (/vocabulary/:id)
│   │
│   ├── word/
│   │   ├── upload.tsx          # 이미지 업로드 (/word/upload)
│   │   └── results/
│   │       └── [id].tsx        # 단어 인식 결과 (/word/results/:id)
│   │
│   ├── wordQuiz/
│   │   ├── index.tsx           # 퀴즈 선택 (/wordQuiz)
│   │   └── game/
│   │       └── [id].tsx        # 카드 매칭 게임 (/wordQuiz/game/:id)
│   │
│   ├── drawing/
│   │   └── index.tsx           # 그림 그리기 게임 (/drawing)
│   │
│   └── network/
│       └── index.tsx           # 공개 단어장 탐색 (/network)
│
├── components/                 # React 컴포넌트
│   ├── intro/                  # 인트로/메인 페이지 컴포넌트
│   │   ├── Main.style.ts       # 메인 스타일
│   │   ├── NavBar.tsx          # 네비게이션 바
│   │   └── NavBar.style.ts     # 네비게이션 스타일
│   │
│   ├── sidebar/                # 사이드바 컴포넌트
│   │   ├── SideBar.tsx         # 사이드바 메뉴
│   │   └── SideBar.style.ts    # 사이드바 스타일
│   │
│   ├── user/                   # 사용자 관련 컴포넌트
│   │   ├── LoginPage.tsx           # 로그인 폼
│   │   ├── RegisterPage.tsx        # 회원가입 폼
│   │   ├── FindPasswordForm.tsx    # 비밀번호 찾기 폼
│   │   ├── UserEditModal.tsx       # 프로필 수정 모달
│   │   ├── UserEditModal.style.ts
│   │   ├── UserPasswordEditModal.tsx  # 비밀번호 변경 모달
│   │   ├── UserPasswordEditModal.style.ts
│   │   ├── UserDelModal.tsx        # 회원 탈퇴 모달
│   │   ├── userDelModal.style.ts
│   │   ├── AccountPage.style.ts    # 계정 페이지 스타일
│   │   └── AuthCard.style.ts       # 인증 카드 스타일
│   │
│   ├── vocabulary/             # 단어장 컴포넌트
│   │   ├── VocabularyItem.tsx      # 단어장 아이템
│   │   ├── VocabularyEditModal.tsx # 단어장 수정 모달
│   │   ├── VocabularyMarkHeader.tsx # 단어장 헤더
│   │   ├── Vocabulary.styles.ts    # 단어장 스타일
│   │   ├── modal/
│   │   │   └── VocabularyModal.style.ts
│   │   └── words/              # 단어 목록 컴포넌트
│   │       ├── Words.tsx           # 단어 목록
│   │       ├── Words.style.ts
│   │       ├── WordEditForm.tsx    # 단어 수정 폼
│   │       └── WordDelForm.tsx     # 단어 삭제 폼
│   │
│   ├── word/                   # 단어 업로드/결과 컴포넌트
│   │   ├── upload/
│   │   │   ├── Dropzone.tsx        # 이미지 드롭존
│   │   │   └── Dropzone.style.ts
│   │   └── results/
│   │       ├── Results.tsx         # 인식 결과 표시
│   │       ├── Results.style.ts
│   │       ├── EditForm/           # 결과 수정 폼
│   │       │   ├── EditForm.tsx
│   │       │   ├── EditForm.style.ts
│   │       │   ├── SelectWord.tsx  # 단어 선택
│   │       │   └── WriteWord.tsx   # 단어 직접 입력
│   │       └── SaveForm/           # 결과 저장 폼
│   │           ├── SaveForm.tsx
│   │           ├── SaveForm.style.ts
│   │           └── AddForm.tsx     # 단어장 추가 폼
│   │
│   ├── wordQuiz/               # 퀴즈 게임 컴포넌트
│   │   ├── WordQuiz.style.ts
│   │   ├── game/               # 카드 매칭 게임
│   │   │   ├── WordQuizCard.tsx    # 개별 카드
│   │   │   ├── WordQuizCardList.tsx # 카드 목록
│   │   │   └── WordQuizGame.style.ts
│   │   └── voca/
│   │       └── Voca.style.ts       # 단어장 선택 스타일
│   │
│   ├── drawing/                # 그림 그리기 게임 컴포넌트
│   │   ├── Drawing.tsx             # 그림 게임 메인
│   │   ├── Drawing.style.ts
│   │   ├── Canvas.tsx              # 캔버스 컴포넌트
│   │   └── Result.tsx              # 게임 결과
│   │
│   ├── guide/                  # 가이드 페이지 컴포넌트
│   │   ├── GuideContent.tsx        # 가이드 콘텐츠
│   │   ├── GuideFooter.tsx         # 가이드 푸터
│   │   ├── MenuList.tsx            # 메뉴 리스트
│   │   ├── MakeVoca.tsx            # 단어장 만들기 가이드
│   │   ├── LookVoca.tsx            # 단어장 보기 가이드
│   │   ├── VocaGame.tsx            # 단어 게임 가이드
│   │   ├── ImageGame.tsx           # 이미지 게임 가이드
│   │   └── Guide.style.ts
│   │
│   ├── network/                # 네트워크 (공개 단어장) 컴포넌트
│   │   ├── NetworkListItem.tsx     # 공개 단어장 아이템
│   │   └── Network.style.ts
│   │
│   └── myPage/                 # 마이페이지 컴포넌트
│       └── MyPage.style.ts
│
├── common/                     # 공통 유틸리티 및 컴포넌트
│   ├── Seo.tsx                 # SEO 메타태그 컴포넌트
│   │
│   ├── booklist/               # 책 목록 공통 컴포넌트
│   │   ├── BookList.tsx            # 책 목록
│   │   └── BookList.style.ts
│   │
│   ├── modal/                  # 모달 공통 컴포넌트
│   │   ├── Modal.tsx               # 모달 베이스
│   │   └── Modal.style.ts
│   │
│   ├── loginRequiredModal/     # 로그인 필요 모달
│   │   ├── LoginRequiredModal.tsx
│   │   └── LoginRequiredModal.style.ts
│   │
│   ├── toast/                  # 토스트 알림 컴포넌트
│   │   ├── Toast.tsx
│   │   └── Toast.style.ts
│   │
│   ├── note/                   # 노트 UI 컴포넌트
│   │   ├── Note.tsx
│   │   └── Note.style.ts
│   │
│   ├── types/                  # TypeScript 타입 정의
│   │   ├── propsType.ts            # Props 타입
│   │   ├── resultsType.ts          # API 응답 타입
│   │   └── wordType.ts             # 단어 관련 타입
│   │
│   ├── queryKeys/              # React Query 키
│   │   └── querykeys.ts            # API 쿼리 키 상수
│   │
│   └── utils/                  # 유틸리티 함수
│       ├── constant.ts             # 상수 정의 (API URL 등)
│       ├── shuffle.ts              # 배열 셔플 함수
│       ├── styletron.js            # Styletron 설정
│       ├── useIsLapTop.ts          # 노트북 화면 감지 훅
│       └── useIsMiddle.ts          # 중간 화면 감지 훅
│
├── zustand/                    # Zustand 상태 관리
│   ├── userStore.ts            # 사용자 상태 (로그인, 토큰)
│   └── useGameStore.ts         # 게임 상태 (점수, 진행)
│
├── styles/                     # 전역 스타일
│   ├── globals.css             # 전역 CSS
│   └── reset.css               # CSS 리셋
│
└── public/                     # 정적 파일
    ├── favicon.ico             # 파비콘
    ├── favicon-32x32.png
    ├── logo.png                # 로고 이미지
    ├── vercel.svg
    │
    ├── fonts/
    │   └── style.css           # 웹 폰트 스타일
    │
    └── images/                 # 이미지 에셋
        ├── branch.png
        ├── celebrate.png
        ├── contemplating.png
        ├── faq.png
        ├── kakaoLogin.png          # 카카오 로그인 버튼
        ├── loginBg.jpg             # 로그인 배경
        ├── Memorizing.png
        ├── monster_artist.png
        ├── note.png
        ├── pencil.png
        ├── playing_cards.png
        ├── playing_cards_yellow.png
        ├── popularity.png
        ├── registerBg.jpg          # 회원가입 배경
        ├── traveling.png
        ├── updated.png
        ├── well_done.png
        └── wordcard.png
```

### 주요 파일 설명

| 파일 | 설명 |
|------|------|
| `_app.tsx` | 전역 App 설정, QueryClient, Styletron Provider |
| `_document.tsx` | HTML Document 구조, 폰트 로드 |
| `index.tsx` | 메인 랜딩 페이지 |
| `userStore.ts` | Zustand 사용자 상태 (userId, token, isLoggedIn) |
| `useGameStore.ts` | Zustand 게임 상태 (score, matched cards) |
| `constant.ts` | API BASE URL, 환경 상수 |
| `querykeys.ts` | React Query 캐시 키 상수 |

---

## 4. GitLab 설정 (`/.gitlab`)

```
.gitlab/
├── .gitkeep
├── issue_templates/
│   ├── issue_dev_template.md       # 개발 이슈 템플릿
│   └── office_hour_template.md     # 오피스아워 템플릿
└── merge_request_templates/
    └── MR_template.md              # MR 템플릿
```

---

## 5. 루트 파일

```
Phoca-master/
├── README.md               # 프로젝트 메인 문서
├── .prettierrc             # Prettier 코드 포맷 설정
├── autoreport.sh           # 자동 보고서 스크립트
└── package-lock.json       # 루트 패키지 락
```

---

## 데이터베이스 스키마

### ERD 관계도

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Users     │       │   Wordbook   │       │    Word     │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ userId (PK) │──1:N──│ userId (FK)  │       │ wordbookId  │
│ userName    │       │ wordbookId   │──1:N──│   (FK)      │
│ email       │       │ wordbookName │       │ wordId (PK) │
│ password    │       │ secured      │       │ wordEng[]   │
│ userImage   │       │ createDate   │       │ wordKor[]   │
│ comment     │       └──────────────┘       │ wordKey     │
│ provider    │                              └─────────────┘
│ activated   │
└─────────────┘
       │
       │ 1:N
       ▼
┌─────────────┐
│  Bookmark   │
├─────────────┤
│ bookmarkId  │
│ userId (FK) │
│ wordbookId  │
└─────────────┘
```

---

## API 엔드포인트 요약

| 모듈 | 메서드 | 엔드포인트 | 설명 |
|------|--------|-----------|------|
| **Auth** | POST | `/auth/login` | 로그인 |
| | POST | `/auth/register` | 회원가입 |
| | GET | `/auth/kakao` | 카카오 OAuth |
| **User** | GET | `/user/:userId` | 사용자 정보 조회 |
| | PATCH | `/user/:userId` | 사용자 정보 수정 |
| | DELETE | `/user/:userId` | 회원 탈퇴 |
| **Word** | POST | `/word/upload` | 이미지 업로드 및 단어 인식 |
| | GET | `/word/all/:wordbookId` | 단어장의 모든 단어 |
| | GET | `/word/game/:wordbookId` | 게임용 랜덤 단어 (8개) |
| | PATCH | `/word/:wordId` | 단어 수정 |
| | DELETE | `/word/:wordId` | 단어 삭제 |
| **Wordbook** | GET | `/wordbook` | 공개 단어장 목록 |
| | POST | `/wordbook/create/:userId` | 단어장 생성 |
| | GET | `/wordbook/:userId` | 사용자 단어장 목록 |
| | GET | `/wordbook/search` | 단어장 검색 |
| | PATCH | `/wordbook/:wordbookId` | 단어장 수정 |
| | DELETE | `/wordbook/:wordbookId` | 단어장 삭제 |
| **Bookmark** | POST | `/bookmark` | 북마크 추가 |
| | GET | `/bookmark/:userId` | 북마크 목록 |
| | DELETE | `/bookmark/:bookmarkId` | 북마크 삭제 |
| **Quiz** | POST | `/quiz` | 퀴즈 결과 저장 |
| | GET | `/quiz/:userId` | 퀴즈 기록 조회 |

---

## 실행 방법

### Backend
```bash
cd back
npm install
npm run start:dev    # 개발 모드 (포트 5001)
```

### Frontend
```bash
cd front
yarn install
yarn dev             # 개발 모드 (포트 3000)
```

### AI Service
```bash
cd ai
pip install -r requirements.txt
python flask_serve.py
```

---

## 환경 변수

### Backend (`.dev.env`)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=phoca

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=phoca-bucket
AWS_REGION=ap-northeast-2

KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CALLBACK_URL=http://localhost:5001/auth/kakao/callback

EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Frontend (`next.config.js`)
```javascript
env: {
  NEXT_PUBLIC_API_URL: 'http://localhost:5001',
}
```

### AI Service (`.env`)
```env
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=phoca-bucket
```

---

## 파일 통계

| 디렉토리 | 파일 수 | 주요 확장자 |
|---------|--------|-----------|
| `/ai` | 6 | .py, .ipynb, .txt |
| `/back/src` | 45+ | .ts |
| `/front` | 100+ | .tsx, .ts, .css |
| **총합** | **150+** | - |

---

*마지막 업데이트: 2025-12-02*
