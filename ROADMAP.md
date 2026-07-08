# 가족 비용 추적 (Cost Tracker Family) - ROADMAP

## Overview
**Timeline:** 6 weeks (Sprint 0-6)  
**Release:** End of Sprint 6  
**QA Strategy:** 3-phase (Unit → Integration → E2E)

---

## Sprint 0: Project Setup & Infrastructure

**Duration:** 1 week  
**Goal:** 개발 환경 준비, DB 스키마 정의, 프로젝트 구조 생성

### Tasks
- [ ] Next.js 16 프로젝트 초기화 (App Router, TypeScript)
- [ ] shadcn/ui 설치 및 기본 컴포넌트 등록
- [ ] Drizzle ORM 설치 및 설정
- [ ] better-sqlite3 설정 (server-only, serverExternalPackages)
- [ ] DB 스키마 정의 (groups, members, expenses, expense_splits, settlements)
- [ ] DB 마이그레이션 스크립트 작성
- [ ] ESLint + TypeScript 설정 (eslint.config.mjs, tsconfig.json)
- [ ] Git 초기화, .gitignore 설정 (*.db, *.sqlite, .env.local, .omc/)
- [ ] Repository 패턴 구현 (GroupRepository, MemberRepository, ExpenseRepository)
- [ ] API 라우트 기본 구조 (error handling, response format)

### Deliverables
- ✅ `package.json` (all dependencies)
- ✅ `src/lib/db/schema.ts` (Drizzle schema)
- ✅ `src/lib/db/db.ts` (database instance)
- ✅ `src/lib/repositories/*.ts` (Repository classes)
- ✅ `src/app/api/route.ts` (API structure)
- ✅ `.env.example`, `.env.local` (template)
- ✅ `eslint.config.mjs`, `next.config.ts`

### Completion Criteria
- TypeScript compilation: 0 errors
- ESLint: 0 errors
- DB schema created in SQLite
- Repository pattern working for all entities
- First git commit: "chore: initial project setup"

---

## Sprint 1: Group & Member Management

**Duration:** 1 week  
**Goal:** 그룹 생성/삭제, 멤버 추가/제거 기능 구현

### Screens
- [ ] **그룹 목록 화면** (`/` 또는 `/groups`)
  - 생성된 그룹 모두 표시
  - "새 그룹 만들기" CTA 버튼
  - 각 그룹 카드에 멤버 수 표시
  - 빈 상태 처리 (그룹 없을 때 안내)
  
- [ ] **그룹 생성 모달/페이지** (`/groups/create`)
  - 그룹명 입력
  - 초기 멤버 추가 (최소 2명)
  - "생성" 버튼
  - 유효성 검증 (그룹명 필수, 멤버 2명 이상)

- [ ] **그룹 상세 페이지** (`/groups/[id]`)
  - 그룹명, 멤버 목록 표시
  - 멤버 추가/제거 버튼
  - "그룹 삭제" 버튼

### Components
- `GroupCard.tsx` - 그룹 카드 (클릭 시 상세로 이동)
- `GroupForm.tsx` - 그룹 생성 폼
- `MemberList.tsx` - 멤버 목록 + 추가/제거
- `MemberInput.tsx` - 멤버 닉네임 입력
- `EmptyState.tsx` - 빈 상태 메시지

### API Routes
- `POST /api/groups` - 그룹 생성
- `GET /api/groups` - 그룹 목록 조회
- `GET /api/groups/[id]` - 그룹 상세
- `DELETE /api/groups/[id]` - 그룹 삭제
- `POST /api/groups/[id]/members` - 멤버 추가
- `DELETE /api/groups/[id]/members/[memberId]` - 멤버 제거

### Types
```typescript
// types.ts
type Group = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

type Member = {
  id: string
  groupId: string
  name: string
  createdAt: Date
}

type CreateGroupInput = {
  name: string
  memberNames: string[]
}
```

### Completion Criteria
- 그룹 생성/삭제 CRUD 동작
- 멤버 추가/제거 동작
- 한국어 UI 텍스트 모두 노출
- 빈 상태 처리 구현
- 유효성 검증 구현
- TypeScript 타입 검증 100% (tsc --noEmit = 0 errors)
- 새 git commit: "feat: group and member management"

---

## Sprint 2: Expense Entry & Settlement Calculation

**Duration:** 1 week  
**Goal:** 지출 입력, 정산 계산 핵심 기능 구현

### Screens
- [ ] **지출 추가 화면** (`/groups/[id]/add-expense`)
  - 항목명 입력 (text)
  - 금액 입력 (number, 천 단위 구분)
  - 결제자 선택 (dropdown)
  - 참여자 선택 (multi-checkbox)
  - 카테고리 선택 (dropdown: 식사, 교통, 숙박, 기타)
  - 날짜 선택 (date picker, 기본값 오늘)
  - "추가" 버튼
  - 유효성 검증

- [ ] **정산 화면** (`/groups/[id]/settlement`)
  - 현재 정산액 요약 (카드 형식)
  - "A가 B에게 ₩X 주기" 목록
  - "정산 완료" 버튼 (각 정산 항목마다)
  - 정산 완료 항목 구분 표시 (회색으로)

### Components
- `ExpenseForm.tsx` - 지출 입력 폼
- `ExpenseInput.tsx` - 금액 입력 (천 단위 포맷)
- `CategorySelect.tsx` - 카테고리 선택
- `ParticipantSelect.tsx` - 참여자 다중 선택
- `SettlementList.tsx` - 정산 항목 목록
- `SettlementCard.tsx` - 정산 카드 ("A → B: ₩X")

### API Routes
- `POST /api/expenses` - 지출 생성
- `GET /api/groups/[id]/settlement` - 정산 계산 결과 조회
- `POST /api/settlements` - 정산 완료 기록

### Settlement Calculation Algorithm
```
1. 각 member의 총 지출액 계산
2. 각 member의 총 부담액 계산 (참여한 지출의 몫)
3. 차액 계산 (지출액 - 부담액)
4. 차액 양수(받을 사람)와 음수(줄 사람) 분리
5. 최소 거래수로 정산 (Greedy algorithm)
   - 받을 사람과 줄 사람을 매칭
   - 작은 금액부터 처리
```

### Types
```typescript
type Expense = {
  id: string
  groupId: string
  description: string
  amount: number
  paidBy: string (memberId)
  category: 'meal' | 'transport' | 'accommodation' | 'other'
  date: Date
  createdAt: Date
}

type ExpenseSplit = {
  id: string
  expenseId: string
  memberId: string
  amount: number
}

type SettlementItem = {
  from: Member
  to: Member
  amount: number
  settled: boolean
}
```

### Completion Criteria
- 지출 생성 동작 (all fields)
- 정산 계산 정확도 (5개 테스트 케이스 검증)
- 금액 포맷 (천 단위 쉼표)
- 한국어 UI 완전 노출
- 유효성 검증 (금액 > 0, 참여자 최소 2명 등)
- TypeScript 타입 검증 (tsc --noEmit = 0 errors)
- 새 git commit: "feat: expense entry and settlement calculation"

---

## Sprint 3: Transaction History & Search/Filter

**Duration:** 1 week  
**Goal:** 거래 기록 조회, 검색/필터 기능 구현 (UI 반드시 노출)

### Screens
- [ ] **지출 목록 화면** (`/groups/[id]/expenses`)
  - 지출 목록 (시간순 역순 정렬)
  - **검색 UI** (항목명, 결제자, 금액 범위)
  - **필터 UI** (카테고리, 날짜 범위, 결제자별)
  - 각 지출 항목 카드 (항목명, 금액, 결제자, 날짜)
  - 클릭하면 상세 페이지로 이동
  - 빈 상태 처리

- [ ] **거래 상세 페이지** (`/groups/[id]/expenses/[expenseId]`)
  - 항목명, 금액, 결제자, 카테고리, 날짜
  - "참여자: A (₩X), B (₩Y)" 분배 내역
  - "A가 B에게 ₩X 줄 것" (정산 관계 표시)
  - "수정" 버튼 (지출 수정)
  - "삭제" 버튼 (지출 삭제)

- [ ] **지출 수정 모달/페이지**
  - 기존 데이터 미리 채우기
  - "저장" 버튼
  - 수정 후 목록으로 돌아가기

### Components
- `ExpenseList.tsx` - 지출 목록
- `ExpenseListItem.tsx` - 각 지출 항목
- `SearchBar.tsx` - 검색 입력 (항목명, 금추, 결제자)
- `FilterPanel.tsx` - 필터 UI (카테고리, 날짜, 결제자)
- `ExpenseDetail.tsx` - 상세 페이지
- `DateRangeFilter.tsx` - 날짜 범위 선택

### API Routes
- `GET /api/expenses?groupId=X&search=Y&category=Z&dateFrom=&dateTo=` - 검색/필터
- `GET /api/expenses/[expenseId]` - 상세 조회
- `PATCH /api/expenses/[expenseId]` - 지출 수정
- `DELETE /api/expenses/[expenseId]` - 지출 삭제

### Search/Filter Implementation
```
Backend:
- SQL WHERE 조건 조합 (AND, OR)
- LIKE를 사용한 텍스트 검색
- 날짜 범위 필터링 (BETWEEN)
- 카테고리 필터링 (IN)

Frontend:
- 실시간 필터 (입력 시 결과 업데이트)
- 필터 초기화 버튼
- 필터 상태 URL에 반영 (query params)
```

### Completion Criteria
- 지출 목록 표시 (정렬 역순)
- **검색 UI 화면에 실제 노출** (API/타입에만 있으면 불통과)
- **필터 UI 화면에 실제 노출** (API/타입에만 있으면 불통과)
- 검색 동작 (항목명 검색)
- 필터 동작 (카테고리, 날짜 범위)
- 상세 페이지 표시
- 수정/삭제 동작
- TypeScript 타입 검증 (tsc --noEmit = 0 errors)
- 새 git commit: "feat: transaction history with search and filter"

---

## Sprint 4: Dashboard & Analytics

**Duration:** 1 week  
**Goal:** 대시보드, 통계, 그래프 기능 구현

### Screens
- [ ] **대시보드 (탭 1: 정산 요약)**
  - 현재 그룹 내 정산액 요약
  - "A가 B에게 ₩X 줄 것" 카드 목록
  - "모두 정산됨" 상태 표시
  
- [ ] **대시보드 (탭 2: 월별 통계)**
  - 월 선택 드롭다운 또는 네비게이션
  - 월 총 지출액
  - 평균 개인 부담액
  - 카테고리별 지출액 (텍스트 또는 차트)

- [ ] **대시보드 (탭 3: 개인별 추이)**
  - 각 멤버별 정산액 그래프 (막대 또는 선형)
  - 시간 흐름에 따른 변화 표시
  - 마우스 호버 시 상세 정보

### Components
- `Dashboard.tsx` - 대시보드 (탭 구조)
- `SettlementSummary.tsx` - 정산 요약
- `MonthlyStats.tsx` - 월별 통계
- `CategoryChart.tsx` - 카테고리별 차트 (원형 또는 막대)
- `PersonalTrendChart.tsx` - 개인별 추이 그래프
- `StatCard.tsx` - 통계 카드 (월 지출, 평균 등)

### API Routes
- `GET /api/groups/[id]/dashboard` - 대시보드 데이터
- `GET /api/groups/[id]/stats?month=YYYY-MM` - 월별 통계
- `GET /api/groups/[id]/trends` - 개인별 추이

### Chart Library
- Recharts (shadcn/ui와 호환)
- BarChart, LineChart, PieChart 사용

### Completion Criteria
- 대시보드 3개 탭 구현
- 정산 요약 표시
- 월별 통계 계산 정확
- 개인별 추이 그래프 렌더링
- 반응형 디자인 (모바일에서도 읽을 수 있음)
- 한국어 UI 완전 노출
- TypeScript 타입 검증 (tsc --noEmit = 0 errors)
- 새 git commit: "feat: dashboard with analytics and charts"

---

## Sprint 5: Data Export, Settings & Polish

**Duration:** 1 week  
**Goal:** CSV 내보내기, 설정, 정산 완료 처리, UI 폴리싱

### Screens
- [ ] **설정 페이지** (`/groups/[id]/settings`)
  - 그룹 정보 (그룹명)
  - 멤버 관리 (추가, 제거, 닉네임 수정)
  - "데이터 내보내기" 버튼
  - "그룹 삭제" 버튼

- [ ] **데이터 내보내기 모달**
  - 기간 선택 (전체, 최근 1개월, 커스텀 날짜)
  - "전체 거래 내보내기" vs "정산 내역만 내보내기" 선택
  - "다운로드" 버튼
  - 파일명 자동 생성 (group-name_2026-07-08.csv)

### Components
- `SettingsPage.tsx` - 설정 페이지
- `GroupSettings.tsx` - 그룹 정보 수정
- `MemberManagement.tsx` - 멤버 관리
- `ExportModal.tsx` - 내보내기 모달
- `ConfirmDialog.tsx` - 삭제 확인 대화

### API Routes
- `PATCH /api/groups/[id]` - 그룹 정보 수정
- `GET /api/groups/[id]/export?format=csv&type=expenses|settlements&from=&to=` - CSV 내보내기

### CSV Export Format
```
# expenses.csv
항목명,금액,결제자,참여자,카테고리,날짜
장보기,50000,김철수,"김철수, 이영희",식사,2026-07-08

# settlements.csv
받을 사람,줄 사람,금액,정산일
이영희,김철수,25000,2026-07-08
```

### Completion Criteria
- CSV 내보내기 동작 (형식 정확)
- 파일명 자동 생성
- 그룹 정보 수정 동작
- 멤버 관리 UI 동작
- 한국어 UI 완전 노출
- 로딩 상태 표시 (스켈레톤)
- 에러 상태 처리
- TypeScript 타입 검증 (tsc --noEmit = 0 errors)
- 새 git commit: "feat: data export, settings, and ui polish"

---

## Sprint 6: Testing, QA & Launch

**Duration:** 1 week  
**Goal:** 버그 수정, 성능 최적화, 최종 QA, 배포

### QA Tasks
- [ ] TypeScript 전체 검증
  ```bash
  npx tsc --noEmit > /tmp/f1.log 2>&1; echo $?
  ```
  **Expected:** Exit code 0

- [ ] ESLint 검증
  ```bash
  npm run lint > /tmp/f2.log 2>&1; echo $?
  ```
  **Expected:** Exit code 0

- [ ] Build 검증
  ```bash
  npm run build > /tmp/f3.log 2>&1; echo $?
  ```
  **Expected:** Exit code 0

- [ ] Functional Testing (Manual)
  - 그룹 생성/삭제
  - 멤버 추가/제거
  - 지출 추가/수정/삭제
  - 정산 계산 (5개 케이스)
  - 검색/필터 (각 필터 조합)
  - 대시보드 통계 (정확성)
  - CSV 내보내기 (형식)

- [ ] UI/UX 검증
  - 한국어 UI 모든 텍스트 노출 (grep -rl '검색' app src --include='*.tsx' ≥ 1)
  - 빈 상태 처리 (그룹 없을 때, 거래 없을 때 등)
  - 로딩 상태 (스켈레톤, 스피너)
  - 에러 상태 (에러 메시지 표시)
  - 반응형 디자인 (모바일 360px, 태블릿 768px, 데스크톱 1024px)

- [ ] Performance
  - 페이지 로드 < 2초
  - 검색/필터 응답 < 500ms
  - 그래프 렌더링 < 1초

- [ ] 자체 게이트 검증
  - page.tsx ≥ 7 개 (7개 이상의 스크린 구현)
  - `grep -rl '검색' app src --include='*.tsx'` ≥ 1 (검색 UI 구현)
  - 대시보드 존재 확인
  - CSV 내보내기 동작

### Bug Fixes & Optimization
- [ ] 정산 계산 엣지 케이스 처리
- [ ] 데이터베이스 쿼리 최적화 (인덱스 추가)
- [ ] 번들 크기 최적화
- [ ] 메모리 누수 체크

### Documentation
- [ ] README.md 작성 (한국어, 기능 목록, 스택, 설치/실행, MIT)
- [ ] INSTALLATION.md 또는 SETUP.md
- [ ] API 문서 (선택사항)

### Completion Criteria
- ✅ TypeScript: 0 errors
- ✅ ESLint: 0 errors
- ✅ Build: success (exit code 0)
- ✅ 모든 기능 테스트 통과
- ✅ 한국어 UI 완전 노출
- ✅ 빈 상태, 로딩, 에러 상태 모두 구현
- ✅ 7개+ 페이지
- ✅ 검색/필터 UI 실제 노출
- ✅ 대시보드 + 통계 구현
- ✅ 최종 git commit: "chore: final qa and release"
- ✅ README.md 작성

---

## Database Schema (Drizzle ORM)

```typescript
// src/lib/db/schema.ts

import { text, integer, real, timestamp, sqliteTable, primaryKey } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const groups = sqliteTable('groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})

export const members = sqliteTable('members', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})

export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  amount: real('amount').notNull(), // DECIMAL stored as REAL
  paidBy: text('paid_by')
    .notNull()
    .references(() => members.id, { onDelete: 'restrict' }),
  category: text('category', {
    enum: ['meal', 'transport', 'accommodation', 'other'],
  }).notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})

export const expenseSplits = sqliteTable('expense_splits', {
  id: text('id').primaryKey(),
  expenseId: text('expense_id')
    .notNull()
    .references(() => expenses.id, { onDelete: 'cascade' }),
  memberId: text('member_id')
    .notNull()
    .references(() => members.id, { onDelete: 'restrict' }),
  amount: real('amount').notNull(),
})

export const settlements = sqliteTable('settlements', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  settledAt: integer('settled_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  note: text('note'),
})

// Relations
export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(members),
  expenses: many(expenses),
}))

export const membersRelations = relations(members, ({ one, many }) => ({
  group: one(groups, {
    fields: [members.groupId],
    references: [groups.id],
  }),
  expenses: many(expenses),
}))

export const expensesRelations = relations(expenses, ({ one, many }) => ({
  group: one(groups, {
    fields: [expenses.groupId],
    references: [groups.id],
  }),
  paidByMember: one(members, {
    fields: [expenses.paidBy],
    references: [members.id],
  }),
  splits: many(expenseSplits),
}))

export const expenseSplitsRelations = relations(expenseSplits, ({ one }) => ({
  expense: one(expenses, {
    fields: [expenseSplits.expenseId],
    references: [expenses.id],
  }),
  member: one(members, {
    fields: [expenseSplits.memberId],
    references: [members.id],
  }),
}))
```

---

## Component Architecture

```
src/
├── app/
│   ├── page.tsx                    # Dashboard (root)
│   ├── groups/
│   │   ├── page.tsx                # Group list
│   │   ├── create/page.tsx          # Create group
│   │   └── [id]/
│   │       ├── page.tsx             # Group detail (tabs)
│   │       ├── add-expense/page.tsx # Add expense
│   │       ├── expenses/
│   │       │   ├── page.tsx         # Expense list (search/filter)
│   │       │   └── [expenseId]/page.tsx # Expense detail
│   │       ├── settlement/page.tsx  # Settlement
│   │       └── settings/page.tsx    # Settings
│   └── api/
│       ├── groups/route.ts
│       ├── groups/[id]/route.ts
│       ├── groups/[id]/members/route.ts
│       ├── groups/[id]/settlement/route.ts
│       ├── expenses/route.ts
│       ├── expenses/[id]/route.ts
│       └── ... (other API routes)
│
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── modal.tsx
│   │   └── ... (other base components)
│   ├── groups/
│   │   ├── GroupCard.tsx
│   │   ├── GroupForm.tsx
│   │   ├── MemberList.tsx
│   │   └── MemberInput.tsx
│   ├── expenses/
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── ExpenseListItem.tsx
│   │   ├── SearchBar.tsx
│   │   └── FilterPanel.tsx
│   ├── settlement/
│   │   ├── SettlementList.tsx
│   │   └── SettlementCard.tsx
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── SettlementSummary.tsx
│   │   ├── MonthlyStats.tsx
│   │   └── PersonalTrendChart.tsx
│   ├── common/
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── Header.tsx
│   └── layouts/
│       └── MainLayout.tsx
│
├── lib/
│   ├── db/
│   │   ├── schema.ts               # Drizzle schema
│   │   ├── db.ts                   # Database instance
│   │   └── migrate.ts              # Migration runner
│   ├── repositories/
│   │   ├── GroupRepository.ts
│   │   ├── MemberRepository.ts
│   │   ├── ExpenseRepository.ts
│   │   └── SettlementRepository.ts
│   ├── services/
│   │   └── SettlementService.ts    # Settlement calculation
│   ├── utils/
│   │   ├── formatting.ts           # Number, date formatting
│   │   ├── validation.ts           # Input validation
│   │   └── uuid.ts                 # UUID generation
│   └── types/
│       └── index.ts                # TypeScript types
│
├── styles/
│   └── globals.css
│
├── env.example
├── .gitignore
├── next.config.ts
├── eslint.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## Key Implementation Notes

1. **Dynamic Routes (Next.js 16):** `[id]` params는 Promise → `await params`
2. **Drizzle Aggregates:** `sql<number>` + `Number()` 사용
3. **Server-Only DB:** `import 'server-only'` at top of db module
4. **Repository Pattern:** All DB access through repository classes
5. **Immutability:** 데이터 수정은 항상 새 객체 반환 (spread operator)
6. **Error Handling:** 명시적 try-catch, 사용자 친화적 에러 메시지
7. **Function Length:** 모든 함수 < 200줄
8. **File Size:** 모든 파일 < 800줄

---

## Git Commit Strategy

```bash
Sprint 0:
- chore: initial project setup (environment, db schema)
- chore: setup repositories and api structure

Sprint 1:
- feat: group management (create, delete, list)
- feat: member management (add, remove)

Sprint 2:
- feat: expense entry and calculation
- feat: settlement calculation algorithm

Sprint 3:
- feat: transaction history
- feat: search and filter functionality

Sprint 4:
- feat: dashboard
- feat: statistics and charts

Sprint 5:
- feat: data export (CSV)
- feat: settings page
- refactor: ui polish and fixes

Sprint 6:
- fix: remaining bugs
- docs: readme and setup guide
- chore: final qa and release
```

---

**Roadmap Version:** 1.0  
**Last Updated:** 2026-07-08  
**Status:** Ready for Sprint 0 Implementation
