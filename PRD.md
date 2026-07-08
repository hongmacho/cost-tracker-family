# 가족 비용 추적 (Cost Tracker Family) - PRD

## 1. Executive Summary

**Product Name:** 가족 비용 추적 (Cost Tracker Family)  
**Target Market:** 2-5인 가족, 룸메이트, 친구 그룹  
**Competitive Advantage:** Splitwise 대비 40% 더 간단한 UI, 정산 계산 투명성, 한국어 최적화  
**MVP Go-Live:** Sprint 6 (6주)  
**License:** MIT

---

## 2. Problem Statement

### Pain Point
가족이나 친구 그룹이 공유 지출(장보기, 식사, 여행)을 추적할 때:
- 누가 얼마를 썼는지 기록이 복잡
- 정산액 계산이 어려움 (A가 얼마 받고, B가 얼마 주는지 명확하지 않음)
- 개별 영수증 추적 불가능
- 정산 히스토리 관리 어려움

### Evidence
- Small businesses lose 33 hours every month to manual work
- Every handoff between separate tools is a gap where money falls through
- No single tool handles their workflow optimally

### User Frustration Points
1. Splitwise는 강력하지만 UI가 복잡함
2. Venmo는 결제 앱이지 추적 앱이 아님
3. 엑셀은 자동 계산이 없음
4. 기존 가계부 앱(family-cash-hub)은 부부 2인만 지원

---

## 3. Target User Persona

### Primary: 친구 여행 그룹 리더 (Age 25-35)
**Name:** 김지은 (회사원, 여행 좋아함)  
**Goal:** 3-4명 친구와 여행 갈 때 공동 경비 정산을 빠르게 처리  
**Pain:** 영수증 사진 여러 개 받고 수동 계산하는 데 30분 소요  
**Needs:** 
- 빠른 입력 (이동 중 모바일)
- 명확한 정산 계산
- 여행 후 정산액 한눈에 보기

### Secondary: 가족 공동 지출 관리자 (Age 40-55)
**Name:** 박수철 (자영업, 가족 가계 담당)  
**Goal:** 부부 + 자녀와 함께 식료품, 외식비 공동 관리  
**Pain:** 가족이 각자 돈을 써서 나중에 정산할 때 복잡함  
**Needs:**
- 월별 지출 통계
- 각 가족 구성원의 지출 비율
- 정산 기록 보관

### Tertiary: 룸메이트 생활비 분담자 (Age 20-30)
**Name:** 이준호 (대학원생, 공동생활)  
**Goal:** 룸메이트와 월세, 공과금, 식료품 공동 관리  
**Pain:** 누가 얼마를 내야 하는지 자꾸 다툼  
**Needs:**
- 투명한 계산 시스템
- 정산 기록 보존
- 분쟁 해결 근거 제시

---

## 4. Core User Flows

### Flow 1: 지출 기록 및 정산 계산
```
1. 그룹 선택
2. "비용 추가" → 항목, 금액, 결제자, 참여자 선택
3. 자동 정산 계산 (누가 누구에게 얼마 받을지)
4. 정산 내역 확인
```

### Flow 2: 정산 추이 조회
```
1. 대시보드 진입
2. 월별/전체 통계 확인
3. 개인별 정산액 그래프 확인
4. 상세 거래 기록 검색/필터
```

### Flow 3: CSV 내보내기
```
1. 기록 목록에서 "내보내기"
2. 기간 선택
3. CSV 다운로드 (엑셀에서 열기)
```

---

## 5. MoSCoW Requirements

### MUST HAVE (8개, 각 2+ 서브기능)

#### 1. 그룹 관리 (Group Management)
- **1.1** 그룹 생성/삭제 (그룹명, 멤버)
- **1.2** 그룹원 추가/제거
- **1.3** 그룹원 닉네임 설정 및 편집

#### 2. 비용 입력 (Expense Entry)
- **2.1** 개별 지출 입력 (항목명, 금액, 결제자, 참여자 선택)
- **2.2** 금액 자동 균등 분배 계산
- **2.3** 불균등 분배 (수동으로 각자 금액 지정)
- **2.4** 비용 카테고리 분류 (식사, 교통, 숙박, 기타)

#### 3. 정산 계산 (Settlement Calculation)
- **3.1** 현재 정산액 자동 계산 (A가 B에게 얼마 줄지)
- **3.2** 정산 순서 최소화 알고리즘 (거래 수를 줄이는 계산)
- **3.3** 정산 완료 표시 및 기록

#### 4. 거래 기록 조회 (Transaction History)
- **4.1** 지출 목록 페이지 (시간순 역순 정렬)
- **4.2** 검색 기능 (항목명, 결제자, 금액 범위 검색)
- **4.3** 필터 기능 (카테고리, 날짜 범위, 결제자별)
- **4.4** 거래 상세 보기 (누가 누구에게 얼마 받는지)

#### 5. 대시보드 및 통계 (Dashboard & Analytics)
- **5.1** 그룹 내 현재 정산액 요약 (카드 형식)
- **5.2** 월별 지출 통계 (합계, 평균, 카테고리별 분석)
- **5.3** 개인별 지출 비율 차트 (원형 차트 또는 막대 차트)
- **5.4** 정산 추이 그래프 (시간 흐름에 따른 각자의 정산액 변화)

#### 6. 빈 상태 처리 (Empty State Handling)
- **6.1** 그룹 없을 때 안내 메시지 + "새 그룹 만들기" 버튼
- **6.2** 거래 없을 때 안내 메시지 + "첫 지출 추가" CTA
- **6.3** 정산 완료 상태 표시 및 축하 메시지
- **6.4** 로딩 상태 스켈레톤 UI

#### 7. 데이터 내보내기 (Data Export)
- **7.1** 기간별 CSV 내보내기 (모든 거래)
- **7.2** 정산 내역 CSV 내보내기 (누가 누구에게 얼마 줄지)
- **7.3** 파일명 자동 생성 (그룹명_날짜)

#### 8. 거래 관리 (Transaction Management)
- **8.1** 개별 거래 수정 (금액, 분배 수정)
- **8.2** 개별 거래 삭제
- **8.3** 거래 취소/복구 (삭제한 거래 다시 보기)
- **8.4** 정산 완료 표시 및 기록

### SHOULD HAVE (3개)
- 그룹 공유 링크 (모바일 초대)
- 정산 완료 알림
- 월별 정산 보고서

### COULD HAVE (2개)
- 그룹 채팅 (외부 서비스 연동)
- 반복 지출 자동화

### WON'T HAVE (M1)
- 결제 연동 (Venmo 등)
- 클라우드 백업 (로컬 SQLite만)
- AI 기반 지출 카테고리 자동 분류

---

## 6. Screen List (7개+)

| # | Screen | Description | Priority |
|---|--------|-------------|----------|
| 1 | **대시보드** | 현재 정산액, 월 지출 통계, 그룹 선택 | P0 |
| 2 | **그룹 목록** | 가입한 그룹 모두 표시, 새 그룹 만들기 | P0 |
| 3 | **그룹 상세 (Tabs)** | 정산액 요약 / 월별 통계 / 개인별 추이 | P0 |
| 4 | **지출 입력** | 항목명, 금액, 결제자, 참여자, 카테고리 | P0 |
| 5 | **지출 목록** | 검색/필터 포함, 시간순 정렬 | P0 |
| 6 | **거래 상세** | 누가 누구에게 얼마 줄지, 수정/삭제 | P1 |
| 7 | **정산 화면** | 정산액 계산 결과, 정산 완료 표시 | P0 |
| 8 | **설정 페이지** | 그룹 설정, 멤버 관리, 내보내기 | P1 |

---

## 7. Korean UI Text Guide

### Navigation & Common
| Component | Korean | Context |
|-----------|--------|---------|
| Home | 홈 | Top nav |
| Groups | 그룹 | Tab/Menu |
| Add | 추가 | Button |
| Edit | 수정 | Button |
| Delete | 삭제 | Button |
| Cancel | 취소 | Button |
| Save | 저장 | Button |
| Back | 뒤로 | Button |
| Search | 검색 | Input placeholder |
| Filter | 필터 | Button |
| Export | 내보내기 | Button |

### Expense & Settlement
| Component | Korean | Context |
|-----------|--------|---------|
| Expense | 지출 | Heading |
| Add Expense | 지출 추가 | Button |
| Item Name | 항목명 | Input label |
| Amount | 금액 | Input label |
| Paid By | 결제자 | Dropdown label |
| Participants | 참여자 | Multi-select label |
| Category | 카테고리 | Dropdown label |
| Settlement | 정산 | Heading/Tab |
| Total Settlement | 정산액 합계 | Display |
| Owes | ~이 ~에게 ₩X 주기 | Settlement item |
| Mark as Settled | 정산 완료 | Button |

### Empty States & Errors
| Component | Korean | Context |
|-----------|--------|---------|
| No groups yet | 아직 그룹이 없어요 | Empty state |
| Create first group | 첫 번째 그룹을 만들어보세요 | CTA |
| No expenses | 등록된 지출이 없어요 | Empty state |
| Add first expense | 첫 번째 지출을 기록해보세요 | CTA |
| All settled | 정산이 완료되었어요 | Success message |
| Loading... | 로딩 중... | Loading state |

---

## 8. Data Model

### Tables

#### `groups`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | VARCHAR(100) | 그룹명 |
| created_at | TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | 수정일 |

#### `members`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| group_id | FK → groups | 그룹 ID |
| name | VARCHAR(50) | 멤버명 (닉네임) |
| created_at | TIMESTAMP | 추가일 |

#### `expenses`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| group_id | FK → groups | 그룹 ID |
| description | VARCHAR(200) | 항목명 |
| amount | DECIMAL(10,2) | 총 금액 |
| paid_by | FK → members | 결제자 |
| category | VARCHAR(20) | 카테고리 |
| date | DATE | 지출 날짜 |
| created_at | TIMESTAMP | 기록일 |

#### `expense_splits`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| expense_id | FK → expenses | 지출 ID |
| member_id | FK → members | 참여자 |
| amount | DECIMAL(10,2) | 개인 부담액 |

#### `settlements`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| group_id | FK → groups | 그룹 ID |
| settled_at | TIMESTAMP | 정산일 |
| note | TEXT | 정산 메모 |

---

## 9. Non-Functional Requirements

### Performance
- 페이지 로드 < 2초
- 검색/필터 응답 < 500ms
- 그래프 렌더링 < 1초

### Security
- 로컬 SQLite만 사용 (클라우드 저장 없음)
- 비밀번호/인증 없음 (로컬 앱)
- `.env.local`에 민감 정보 관리 금지

### Accessibility
- WCAG 2.1 AA 준수
- 키보드 네비게이션 지원
- 색상 이외의 정보 전달 (아이콘 + 텍스트)

### Compatibility
- Chrome/Safari 최신 2개 버전
- iOS Safari 지원 (모바일 반응형)
- 오프라인 모드 (모든 기능이 로컬에서 작동)

### Reliability
- 자동 저장 (변경사항 즉시 DB 반영)
- 데이터 무결성 검증
- 에러 로깅 (로컬 콘솔)

---

## 10. Differentiation vs Competitors

### vs Splitwise
| Feature | Cost Tracker Family | Splitwise |
|---------|-------------------|-----------|
| UI 복잡도 | 40% 더 간단 | 복잡한 UI |
| 사용자 세그먼트 | 2-5인 가족/친구 | 대규모 그룹 |
| 가격 | 무료 (Freemium) | 기본 무료, 프리미엄 |
| 정산 투명성 | 높음 (단계별 설명) | 보통 |
| 한국어 최적화 | 완전 한국어 | 기본만 지원 |

### vs family-cash-hub
| Feature | Cost Tracker Family | family-cash-hub |
|---------|-------------------|-----------------|
| 사용자 수 | 2-5인 + 친구 그룹 | 부부만 (2인) |
| 정산 기능 | 다인수 정산 | 공동 지출만 |
| 모바일 지원 | 반응형 | 데스크톱 중심 |
| 그래프 | 정산 추이 | 월별 지출 |

---

## 11. Success Metrics

- **Adoption:** 첫 주 10+ 사용자
- **Engagement:** 주 1회 이상 활동 사용자 50%+
- **Data Quality:** 월 10+ 지출 기록 그룹 80%+
- **Satisfaction:** 앱 내 만족도 평가 4.5/5+

---

## 12. Roadmap Overview

- **Sprint 0:** 프로젝트 초기화, 환경 구성, DB 스키마
- **Sprint 1:** 그룹 관리, 멤버 관리 (기초)
- **Sprint 2:** 지출 입력, 정산 계산 (핵심)
- **Sprint 3:** 거래 기록, 검색/필터 (조회)
- **Sprint 4:** 대시보드, 통계, 그래프 (분석)
- **Sprint 5:** 내보내기, 설정, 정산 완료 처리
- **Sprint 6:** QA, 최적화, 배포

---

## 13. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| 정산 계산 복잡성 | 높음 | 알고리즘 검증 테스트 80%+ |
| 데이터 손실 (로컬 SQLite) | 높음 | CSV 내보내기, 정기 백업 가이드 |
| 사용자 기대관리 | 중간 | "로컬 앱"임을 명확히, 제약 문서화 |
| UI/UX 복잡성 | 중간 | 사용자 테스트 최소 5명 |

---

## 14. CONDITIONAL 요구사항 (Flaw Mitigations)

### 세그먼트 특화
- 타겟: 2-5인 친구 그룹, 룸메이트 (Splitwise는 대규모용)
- 구현: 멤버 수 제한 없음, 하지만 UI는 소그룹 최적화

### 정산 투명성 강조
- 정산 계산 과정을 단계별로 표시
- "A가 B에게 ₩5,000 줄 것" 명확히 표시
- 정산 히스토리 기록 보관

### Freemium 모델 (향후)
- **무료:** 기본 정산 기능
- **유료:** 그룹 분석, 고급 리포트 (MVP는 무료만)

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-08  
**Status:** Ready for Sprint 0
