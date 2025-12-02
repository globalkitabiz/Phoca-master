# Phoca 배포 가이드

> Cloudflare + Railway + Supabase + Replicate 구성으로 배포하기

---

## 목차

1. [사전 준비](#1-사전-준비)
2. [Supabase 설정 (Database)](#2-supabase-설정-database)
3. [Cloudflare R2 설정 (이미지 저장소)](#3-cloudflare-r2-설정-이미지-저장소)
4. [Replicate 설정 (AI)](#4-replicate-설정-ai)
5. [Google Cloud 설정 (번역)](#5-google-cloud-설정-번역)
6. [Railway 설정 (Backend)](#6-railway-설정-backend)
7. [Cloudflare Pages 설정 (Frontend)](#7-cloudflare-pages-설정-frontend)
8. [최종 확인](#8-최종-확인)

---

## 1. 사전 준비

### 필요한 계정 (모두 무료)

| 서비스 | 가입 URL | 용도 |
|--------|----------|------|
| GitHub | https://github.com | 소스 코드 저장 |
| Supabase | https://supabase.com | PostgreSQL 데이터베이스 |
| Cloudflare | https://dash.cloudflare.com | R2 스토리지 + Pages |
| Railway | https://railway.app | Backend 서버 호스팅 |
| Replicate | https://replicate.com | AI 객체 인식 API |
| Google Cloud | https://console.cloud.google.com | 번역 API |

### GitHub에 코드 업로드

```bash
# 1. GitHub에서 새 저장소 생성

# 2. 로컬에서 Git 초기화 및 푸시
cd Phoca-master
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/phoca.git
git push -u origin main
```

---

## 2. Supabase 설정 (Database)

### 2.1 프로젝트 생성

1. https://supabase.com 로그인
2. **New Project** 클릭
3. 프로젝트 정보 입력:
   - Name: `phoca`
   - Database Password: 강력한 비밀번호 입력 (저장해두기!)
   - Region: `Northeast Asia (Seoul)` 선택
4. **Create new project** 클릭

### 2.2 연결 정보 확인

1. 프로젝트 대시보드 > **Settings** > **Database**
2. **Connection string** 섹션에서 정보 복사:

```
Host: db.xxxxxxxxxxxx.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: (생성 시 입력한 비밀번호)
```

### 2.3 테이블 생성 (자동)

NestJS의 TypeORM이 첫 실행 시 자동으로 테이블을 생성합니다.
(synchronize: true 설정 시)

---

## 3. Cloudflare R2 설정 (이미지 저장소)

### 3.1 R2 활성화

1. https://dash.cloudflare.com 로그인
2. 왼쪽 메뉴 **R2** 클릭
3. 처음이면 결제 정보 입력 (무료 티어 10GB/월)

### 3.2 버킷 생성

1. **Create bucket** 클릭
2. Bucket name: `phoca-images`
3. Location: `Asia Pacific` 선택
4. **Create bucket** 클릭

### 3.3 퍼블릭 액세스 설정

1. 생성된 버킷 클릭
2. **Settings** 탭
3. **Public access** 섹션 > **Allow Access** 클릭
4. 생성된 Public URL 복사 (예: `https://pub-xxxxx.r2.dev`)

### 3.4 API 토큰 생성

1. R2 메인 페이지 > **Manage R2 API Tokens**
2. **Create API Token** 클릭
3. 설정:
   - Token name: `phoca-backend`
   - Permissions: **Object Read & Write**
   - Specify bucket: `phoca-images` 선택
4. **Create API Token** 클릭
5. 생성된 정보 저장:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL (예: `https://xxxxxxx.r2.cloudflarestorage.com`)

---

## 4. Replicate 설정 (AI)

### 4.1 API 토큰 생성

1. https://replicate.com 로그인 (GitHub 계정으로 가능)
2. 우측 상단 프로필 > **API tokens**
3. **Create token** 클릭
4. 토큰 복사 (예: `r8_xxxxxxxxxxxxxxxx`)

### 4.2 사용할 모델

- **객체 인식**: YOLO 또는 DETR 모델 (자동 선택)
- **그림 인식**: CLIP 기반 모델

무료 크레딧으로 시작 가능 (월 ~1000회 호출)

---

## 5. Google Cloud 설정 (번역)

### 5.1 프로젝트 생성

1. https://console.cloud.google.com 로그인
2. 상단 프로젝트 선택 > **새 프로젝트**
3. 프로젝트 이름: `phoca-translate`
4. **만들기** 클릭

### 5.2 Translation API 활성화

1. 왼쪽 메뉴 > **API 및 서비스** > **라이브러리**
2. "Cloud Translation API" 검색
3. **사용** 클릭

### 5.3 서비스 계정 생성

1. **API 및 서비스** > **사용자 인증 정보**
2. **사용자 인증 정보 만들기** > **서비스 계정**
3. 서비스 계정 이름: `phoca-translate`
4. **완료** 클릭

### 5.4 키 생성

1. 생성된 서비스 계정 클릭
2. **키** 탭 > **키 추가** > **새 키 만들기**
3. JSON 선택 > **만들기**
4. 다운로드된 JSON 파일에서 다음 값 추출:
   - `client_email`
   - `private_key`
   - `project_id`

---

## 6. Railway 설정 (Backend)

### 6.1 프로젝트 생성

1. https://railway.app 로그인 (GitHub 계정)
2. **New Project** > **Deploy from GitHub repo**
3. `phoca` 저장소 선택
4. **Add variables** 클릭하여 다음으로 진행

### 6.2 환경 변수 설정

Railway 대시보드에서 **Variables** 탭 클릭 후 아래 값들 추가:

```env
# Database (Supabase)
DB_HOST=db.xxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password
DB_NAME=postgres

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRESIN=7d

# Cloudflare R2
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret
R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
R2_BUCKET_NAME=phoca-images
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev

# Replicate AI
REPLICATE_API_TOKEN=r8_xxxxxxxx

# Google Translate
client_email=xxx@xxx.iam.gserviceaccount.com
private_key="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
projectId=your-project-id

# Email (선택)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 6.3 빌드 설정

1. **Settings** 탭
2. **Root Directory**: `back`
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm run start:prod`

### 6.4 배포

1. **Deploy** 클릭
2. 빌드 로그 확인
3. 성공 시 URL 생성됨 (예: `https://phoca-back.railway.app`)

---

## 7. Cloudflare Pages 설정 (Frontend)

### 7.1 프로젝트 생성

1. Cloudflare 대시보드 > **Pages**
2. **Create a project** > **Connect to Git**
3. GitHub 연결 > `phoca` 저장소 선택

### 7.2 빌드 설정

```
Framework preset: Next.js
Root directory: front
Build command: yarn build
Build output directory: .next
```

### 7.3 환경 변수 설정

**Environment variables** 섹션에서 추가:

```env
NEXT_PUBLIC_SERVER_URL=https://phoca-back.railway.app
NEXT_PUBLIC_IMAGE_URL=https://pub-xxxxx.r2.dev/
```

### 7.4 배포

1. **Save and Deploy** 클릭
2. 빌드 완료 대기 (약 2-3분)
3. 생성된 URL 확인 (예: `https://phoca.pages.dev`)

---

## 8. 최종 확인

### 체크리스트

- [ ] Frontend 접속 가능 (`https://phoca.pages.dev`)
- [ ] 회원가입 동작
- [ ] 로그인 동작
- [ ] 이미지 업로드 동작 (R2 저장)
- [ ] AI 객체 인식 동작
- [ ] 단어장 생성/조회 동작
- [ ] 카드 매칭 게임 동작
- [ ] 그림 퀴즈 동작

### 문제 해결

#### Backend 500 에러
- Railway 로그 확인
- 환경 변수 누락 확인
- DB 연결 확인

#### 이미지 업로드 실패
- R2 API 토큰 권한 확인
- CORS 설정 확인
- R2 Public URL 확인

#### AI 인식 실패
- Replicate API 토큰 확인
- 크레딧 잔액 확인

---

## 비용 요약

| 서비스 | 무료 한도 | 예상 비용 |
|--------|----------|----------|
| Supabase | 500MB DB, 1GB Storage | 무료 |
| Cloudflare R2 | 10GB Storage | 무료 |
| Cloudflare Pages | 무제한 | 무료 |
| Railway | 500시간/월 | 무료~$5 |
| Replicate | $5 크레딧 | 무료~종량제 |
| Google Translate | 50만 글자/월 | 무료 |

**총 예상 비용: 무료 ~ 월 $5**

---

## 커스텀 도메인 설정 (선택)

### Cloudflare Pages
1. Pages 프로젝트 > **Custom domains**
2. 도메인 추가 (예: `phoca.yourdomain.com`)
3. DNS 설정 자동 적용

### Railway
1. Settings > **Domains**
2. **Generate Domain** 또는 커스텀 도메인 추가

---

## 문의

문제가 발생하면 GitHub Issues에 등록해주세요.

---

*최종 업데이트: 2025-12-02*
