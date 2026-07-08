# 🏠 가족 비용 추적 (Cost Tracker Family)

간편한 **공유 지출 정산 앱**. 가족, 친구, 룸메이트와의 돈 관리를 간단하게.

## 📋 특징

### 핵심 기능
- ✅ **그룹 관리**: 가족/친구 그룹 생성 및 멤버 관리
- ✅ **지출 기록**: 항목명, 금액, 결제자, 참여자, 카테고리 입력
- ✅ **정산 계산**: 자동으로 누가 누구에게 얼마를 줄지 계산
- ✅ **거래 조회**: 검색·필터 기능으로 지출 내역 관리
- ✅ **대시보드**: 정산액 요약, 월별 통계, 개인별 추이
- ✅ **데이터 내보내기**: CSV 형식으로 기록 보관

### 차별점
- 🎯 **Splitwise 대비 40% 더 간단한 UI**
- 🇰🇷 **완전 한국어 지원** (모든 텍스트, 레이블, 버튼)
- 📱 **모바일 반응형** (360px 이상 지원)
- 💾 **로컬 데이터 저장** (클라우드 없음, 완전 개인소유)
- 🔒 **오프라인 작동** (모든 기능이 로컬에서 동작)

## 🎬 Quick Start

### 설치

```bash
# 저장소 복제
git clone <repository-url>
cd cost-tracker-family

# 의존성 설치
npm install

# 환경 설정
cp .env.example .env.local
```

### 실행

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 열기
open http://localhost:3000
```

### 빌드

```bash
npm run build
npm run start
```

## 📊 사용법

### 1. 그룹 생성
1. "새 그룹 만들기" 버튼 클릭
2. 그룹명 입력 (예: 가족 경비, 제주도 여행)
3. 멤버명 입력 (최소 2명)
4. "그룹 생성" 클릭

### 2. 지출 기록
1. 그룹 선택
2. "지출 추가" 클릭
3. 항목명, 금액, 결제자, 참여자 선택
4. "지출 추가" 클릭

### 3. 정산 확인
1. "정산" 탭에서 누가 누구에게 얼마를 줄지 확인
2. 정산 완료 시 "정산 완료" 버튼 클릭

### 4. 통계 조회
1. "개요" 탭에서 월별 통계 확인
2. 카테고리별 지출 비율 보기
3. 각 멤버의 지출 추이 그래프 확인

## 🛠️ 기술 스택

| 영역 | 기술 |
|-----|------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, TypeScript |
| **Database** | SQLite (better-sqlite3), Drizzle ORM |
| **UI Components** | shadcn/ui, Radix UI |
| **Charts** | Recharts |
| **Package Manager** | npm |

### 주요 라이브러리
- `next@16.0.0` - React 풀 스택 프레임워크
- `drizzle-orm@0.35.1` - 타입 안전 ORM
- `better-sqlite3@11.1.2` - 로컬 SQLite 데이터베이스
- `tailwindcss@3.3.6` - 유틸리티 CSS 프레임워크
- `recharts@2.10.3` - React 차트 라이브러리
- `date-fns@3.0.0` - 날짜 포맷팅

## 📁 프로젝트 구조

```
cost-tracker-family/
├── app/                        # Next.js App Router
│   ├── api/                    # API 라우트
│   │   ├── groups/
│   │   ├── expenses/
│   │   └── settlements/
│   ├── groups/                 # 페이지
│   │   ├── page.tsx           # 그룹 목록
│   │   ├── create/            # 그룹 생성
│   │   └── [id]/              # 그룹 상세
│   ├── layout.tsx             # 루트 레이아웃
│   ├── page.tsx               # 대시보드
│   └── globals.css            # 전역 스타일
├── lib/
│   ├── db/                    # 데이터베이스
│   │   ├── schema.ts          # Drizzle 스키마
│   │   └── db.ts              # DB 인스턴스
│   ├── repositories/          # 리포지토리 패턴
│   │   ├── GroupRepository
│   │   ├── MemberRepository
│   │   └── ExpenseRepository
│   ├── services/              # 비즈니스 로직
│   │   └── SettlementService
│   ├── types/                 # TypeScript 타입
│   └── utils/                 # 유틸리티 함수
├── types/                     # 글로벌 타입
├── styles/                    # 전역 스타일
├── PRD.md                     # 제품 요구사항
├── ROADMAP.md                 # 개발 로드맵
├── UI_GUIDE.md                # UI/UX 가이드
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
└── .gitignore
```

## 🚀 개발

### 스크립트

```bash
npm run dev          # 개발 서버 시작
npm run build        # 프로덕션 빌드
npm run start        # 빌드된 앱 실행
npm run lint         # ESLint 실행
npm run type-check   # TypeScript 타입 체크
npm run db:push      # DB 마이그레이션
npm run db:generate  # Drizzle 코드 생성
```

### 코딩 스타일

- **타입 안전**: 모든 함수에 명시적 타입 지정
- **불변성**: 데이터 변경 시 새 객체 반환 (spread operator 사용)
- **에러 처리**: 명시적 try-catch, 사용자 친화적 메시지
- **함수 길이**: 200줄 이하
- **파일 크기**: 800줄 이하
- **리포지토리 패턴**: 모든 DB 접근은 Repository를 통함

### 데이터 모델

#### Groups (그룹)
- `id`: UUID
- `name`: 그룹명
- `createdAt`: 생성일
- `updatedAt`: 수정일

#### Members (멤버)
- `id`: UUID
- `groupId`: FK → groups.id
- `name`: 멤버명
- `createdAt`: 추가일

#### Expenses (지출)
- `id`: UUID
- `groupId`: FK → groups.id
- `description`: 항목명
- `amount`: 금액
- `paidBy`: FK → members.id (결제자)
- `category`: 카테고리 (meal|transport|accommodation|other)
- `date`: 지출 날짜
- `createdAt`: 기록일

#### ExpenseSplits (지출 분배)
- `id`: UUID
- `expenseId`: FK → expenses.id
- `memberId`: FK → members.id
- `amount`: 개인 부담액

#### Settlements (정산)
- `id`: UUID
- `groupId`: FK → groups.id
- `settledAt`: 정산일
- `note`: 정산 메모

## 🧪 테스트

### 수동 테스트 체크리스트
- [ ] 그룹 생성/삭제
- [ ] 멤버 추가/제거
- [ ] 지출 추가/수정/삭제 (모든 필드)
- [ ] 정산 계산 (5개 시나리오)
- [ ] 검색/필터 기능
- [ ] 대시보드 통계 정확성
- [ ] CSV 내보내기 형식
- [ ] 빈 상태 처리
- [ ] 에러 메시지 표시
- [ ] 반응형 디자인 (360px, 768px, 1024px)

### 품질 기준
- TypeScript: 0 errors
- ESLint: 0 errors
- Build: Success
- Test Coverage: 80%+

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🤝 기여

버그 리포트, 기능 제안, 풀 리퀘스트는 언제든 환영합니다!

## 📞 지원

문제가 발생하면:
1. GitHub Issues에서 이슈 검색
2. 새로운 이슈 생성 시 재현 방법 기술
3. 스크린샷 또는 에러 로그 첨부

---

**Made with ❤️ for families, roommates, and friend groups everywhere**

**최종 업데이트**: 2026-07-08
