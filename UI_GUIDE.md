# 가족 비용 추적 (Cost Tracker Family) - UI/UX GUIDE

## Design Philosophy

- **Simplicity:** Splitwise 대비 40% 더 간단한 인터페이스
- **Korean-First:** 모든 텍스트 한국어 최적화
- **Accessibility:** 색상 이외의 정보 전달, 명확한 대비
- **Responsiveness:** 모바일 우선 (360px부터 지원)
- **Trust:** 정산 계산 투명성 (단계별 표시)

---

## Design System

### Color Palette

#### Light Mode
- **Primary:** `#3B82F6` (Blue 600) - 주요 액션, 하이라이트
- **Secondary:** `#8B5CF6` (Purple 600) - 보조 액션
- **Success:** `#10B981` (Green 600) - 완료, 정산된 상태
- **Warning:** `#F59E0B` (Amber 600) - 주의 필요
- **Danger:** `#EF4444` (Red 600) - 삭제, 에러
- **Neutral:** `#6B7280` (Gray 600) - 텍스트, 아이콘
- **Background:** `#F9FAFB` (Gray 50)
- **Surface:** `#FFFFFF` (White)
- **Border:** `#E5E7EB` (Gray 200)

#### Dark Mode
- **Primary:** `#60A5FA` (Blue 400)
- **Secondary:** `#A78BFA` (Purple 400)
- **Success:** `#34D399` (Green 400)
- **Warning:** `#FBBF24` (Amber 400)
- **Danger:** `#F87171` (Red 400)
- **Neutral:** `#D1D5DB` (Gray 400)
- **Background:** `#111827` (Gray 900)
- **Surface:** `#1F2937` (Gray 800)
- **Border:** `#374151` (Gray 700)

### Typography

```css
/* Headings */
h1: 28px, weight 700, line-height 1.3
h2: 24px, weight 700, line-height 1.3
h3: 20px, weight 600, line-height 1.4
h4: 16px, weight 600, line-height 1.4

/* Body */
Body Large: 16px, weight 400, line-height 1.6
Body: 14px, weight 400, line-height 1.6
Body Small: 12px, weight 400, line-height 1.5

/* Labels */
Label: 14px, weight 500, line-height 1.4
Label Small: 12px, weight 500, line-height 1.4
```

### Spacing

```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
2xl: 32px
3xl: 48px
```

### Shadows

```
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.1)
lg: 0 10px 15px rgba(0,0,0,0.1)
xl: 0 20px 25px rgba(0,0,0,0.1)
```

### Border Radius

```
sm: 4px
md: 8px
lg: 12px
xl: 16px
full: 9999px
```

---

## Components

### Button Variants

#### Primary Button
- Background: Primary color
- Text: White
- Hover: Darker shade
- Disabled: 50% opacity
- Size: 40px height (mobile), 36px (desktop)
- Padding: 10px 16px

```tsx
<Button variant="default" size="md">
  저장
</Button>
```

#### Secondary Button
- Background: Gray 100
- Text: Gray 700
- Border: Gray 200
- Hover: Gray 200 background
- Size: Same as Primary

```tsx
<Button variant="outline" size="md">
  취소
</Button>
```

#### Danger Button
- Background: Red 600
- Text: White
- Hover: Red 700
- Used for: Delete, Remove

```tsx
<Button variant="destructive" size="md">
  삭제
</Button>
```

#### Ghost Button
- Background: Transparent
- Text: Primary color
- Hover: Primary color with 10% opacity
- Used for: Links, secondary actions

```tsx
<Button variant="ghost" size="sm">
  더보기
</Button>
```

### Cards

#### Standard Card
- Background: White (Surface color)
- Border: 1px Gray 200
- Shadow: md
- Border Radius: md (8px)
- Padding: 16px
- Used for: Content containers, summaries

```tsx
<Card>
  <CardHeader>
    <CardTitle>그룹명</CardTitle>
  </CardHeader>
  <CardContent>
    <p>내용</p>
  </CardContent>
</Card>
```

#### Highlighted Card (Settlement)
- Background: Primary 50 (Light blue)
- Border: 1px Primary 200
- Text color: Primary 700 or Primary 900 (dark mode: lighter)
- Used for: Important items (정산 항목)

```tsx
<Card className="bg-blue-50 border-blue-200">
  <p className="text-blue-900">김철수가 이영희에게 ₩25,000 주기</p>
</Card>
```

### Input Fields

#### Text Input
```tsx
<Input
  type="text"
  placeholder="항목명을 입력해주세요"
  value={value}
  onChange={onChange}
/>
```

#### Number Input (Money)
```tsx
<Input
  type="number"
  placeholder="금액 입력"
  value={value}
  onChange={onChange}
  min="0"
  step="100"
/>
```

- Display format: `1,000,000` (thousand separators)
- Input format: `1000000` (numbers only)
- Use library: `numeral.js` or custom `formatCurrency()`

#### Date Picker
```tsx
<Input
  type="date"
  value={value}
  onChange={onChange}
/>
```

### Selects & Checkboxes

#### Category Select
```tsx
<Select value={category} onValueChange={setCategory}>
  <SelectTrigger>
    <SelectValue placeholder="카테고리 선택" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="meal">🍽️ 식사</SelectItem>
    <SelectItem value="transport">🚗 교통</SelectItem>
    <SelectItem value="accommodation">🏨 숙박</SelectItem>
    <SelectItem value="other">⚙️ 기타</SelectItem>
  </SelectContent>
</Select>
```

#### Multi-select Participants
```tsx
<div className="space-y-2">
  {members.map((member) => (
    <label key={member.id} className="flex items-center gap-2">
      <Checkbox
        checked={selectedMembers.includes(member.id)}
        onCheckedChange={() => toggleMember(member.id)}
      />
      <span>{member.name}</span>
    </label>
  ))}
</div>
```

### Empty States

#### Empty Groups
```
╔══════════════════════════════════════╗
║                                      ║
║           📋 아직 그룹이               ║
║              없어요                   ║
║                                      ║
║  첫 번째 그룹을 만들어보세요          ║
║                                      ║
║     [새 그룹 만들기 버튼]            ║
║                                      ║
╚══════════════════════════════════════╝
```

#### Empty Expenses
```
╔══════════════════════════════════════╗
║                                      ║
║         💰 등록된 지출이               ║
║              없어요                   ║
║                                      ║
║  첫 번째 지출을 기록해보세요          ║
║                                      ║
║     [지출 추가 버튼]                 ║
║                                      ║
╚══════════════════════════════════════╝
```

### Loading States

#### Skeleton (카드)
```tsx
<Card className="animate-pulse">
  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
  <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
</Card>
```

#### Spinner
```tsx
<div className="flex items-center justify-center">
  <div className="animate-spin">
    <Loader2 className="w-6 h-6 text-primary" />
  </div>
  <p className="ml-2">로딩 중...</p>
</div>
```

### Error Messages

#### Inline Error
```tsx
<div className="mt-2 text-sm text-red-600">
  ⚠️ 금액은 0보다 커야 합니다
</div>
```

#### Toast Alert
```tsx
toast.error("지출 추가에 실패했습니다. 다시 시도해주세요.")
```

---

## Screen Layouts

### 1. Dashboard (대시보드)

```
┌──────────────────────────────────┐
│  ☰ 메뉴       Cost Tracker       │
├──────────────────────────────────┤
│                                  │
│  📈 정산 요약 | 📊 월별 통계      │
│          | 👥 개인별 추이        │
│                                  │
│ ┌──────────────────────────────┐ │
│ │  현재 정산액                 │ │
│ │  ───────────────────────────  │ │
│ │  김철수가 이영희에게 25,000원 │ │
│ │                               │ │
│ │  ✓ 정산 완료 표시              │ │
│ └──────────────────────────────┘ │
│                                  │
│  [그룹 선택 드롭다운 또는 탭]    │
│                                  │
└──────────────────────────────────┘
```

### 2. Group List (그룹 목록)

```
┌──────────────────────────────────┐
│  ☰ 메뉴       그룹                │
├──────────────────────────────────┤
│                                  │
│  [검색 입력 필드]                │
│                                  │
│  ┌──────────────────────────────┐ │
│  │  🏠 가족 경비                │ │
│  │  멤버 4명 · 지출 12개        │ │
│  │                               │ │
│  │  정산액: 25,000원             │ │
│  └──────────────────────────────┘ │
│                                  │
│  ┌──────────────────────────────┐ │
│  │  ✈️ 제주도 여행              │ │
│  │  멤버 3명 · 지출 8개         │ │
│  │                               │ │
│  │  정산액: 0원 (완료)           │ │
│  └──────────────────────────────┘ │
│                                  │
│  ┌──────────────────────────────┐ │
│  │  + 새 그룹 만들기             │ │
│  └──────────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
```

### 3. Add Expense (지출 추가)

```
┌──────────────────────────────────┐
│  ← 뒤로   지출 추가                │
├──────────────────────────────────┤
│                                  │
│  항목명 *                         │
│  ┌──────────────────────────────┐ │
│  │ 예: 장보기, 식사비 ...        │ │
│  └──────────────────────────────┘ │
│                                  │
│  금액 *                           │
│  ┌──────────────────────────────┐ │
│  │ 0 원                          │ │
│  └──────────────────────────────┘ │
│                                  │
│  결제자 *                         │
│  ┌──────────────────────────────┐ │
│  │ 선택해주세요 ▾                │ │
│  └──────────────────────────────┘ │
│                                  │
│  참여자 *                         │
│  ☑ 김철수                         │
│  ☑ 이영희                         │
│  ☐ 박수철                         │
│                                  │
│  카테고리                         │
│  ☉ 식사  ○ 교통  ○ 숙박  ○ 기타 │
│                                  │
│  날짜                             │
│  ┌──────────────────────────────┐ │
│  │ 2026-07-08                   │ │
│  └──────────────────────────────┘ │
│                                  │
│  ┌───────────────┬───────────────┐ │
│  │ 취소           │ 추가           │ │
│  └───────────────┴───────────────┘ │
│                                  │
└──────────────────────────────────┘
```

### 4. Expense List with Search/Filter (지출 목록 - 검색/필터 노출)

```
┌──────────────────────────────────┐
│  ← 뒤로   지출 목록                │
├──────────────────────────────────┤
│                                  │
│  🔍 [검색 입력] | 🎛️ 필터       │
│                                  │
│  필터 패널 (접혀있음)            │
│  카테고리: [ ] [ ] [ ] [ ]      │
│  날짜: [____] ~ [____]           │
│  결제자: [선택] ▾                │
│                                  │
│  ┌──────────────────────────────┐ │
│  │  🍽️ 장보기                   │ │
│  │  50,000원 | 김철수           │ │
│  │  2026-07-08 | 식사           │ │
│  └──────────────────────────────┘ │
│                                  │
│  ┌──────────────────────────────┐ │
│  │  🚗 택시비                    │ │
│  │  15,000원 | 이영희           │ │
│  │  2026-07-07 | 교통           │ │
│  └──────────────────────────────┘ │
│                                  │
│  [+ 지출 추가]                    │
│                                  │
└──────────────────────────────────┘
```

### 5. Settlement (정산 화면)

```
┌──────────────────────────────────┐
│  ← 뒤로   정산                    │
├──────────────────────────────────┤
│                                  │
│  현재 정산액                     │
│  ───────────────────────────────  │
│                                  │
│  ┌──────────────────────────────┐ │
│  │ 🔵 김철수가 이영희에게       │ │
│  │    ₩25,000 주기               │ │
│  │  ─────────────────────────    │ │
│  │  [정산 완료]                 │ │
│  └──────────────────────────────┘ │
│                                  │
│  ┌──────────────────────────────┐ │
│  │ 🟢 박수철이 이영희에게       │ │
│  │    ₩10,000 주기               │ │
│  │  ─────────────────────────    │ │
│  │  [정산 완료]                 │ │
│  └──────────────────────────────┘ │
│                                  │
│  ┌──────────────────────────────┐ │
│  │ ✓ 모든 정산이 완료됐어요!    │ │
│  └──────────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
```

### 6. Dashboard - Monthly Stats Tab

```
┌──────────────────────────────────┐
│  📊 월별 통계                     │
├──────────────────────────────────┤
│                                  │
│  월: [2026년 7월 ▾]              │
│                                  │
│  ┌──────────────────────────────┐ │
│  │  월 총 지출액                 │ │
│  │  ₩125,000                     │ │
│  └──────────────────────────────┘ │
│                                  │
│  ┌──────────────────────────────┐ │
│  │  평균 개인 부담액             │ │
│  │  ₩31,250                      │ │
│  └──────────────────────────────┘ │
│                                  │
│  카테고리별 지출                 │
│                                  │
│  🍽️ 식사    ████████ ₩50,000      │
│  🚗 교통    ███░░░░░ ₩30,000      │
│  🏨 숙박    █░░░░░░░ ₩20,000      │
│  ⚙️ 기타    ██░░░░░░ ₩25,000      │
│                                  │
└──────────────────────────────────┘
```

### 7. Settings (설정)

```
┌──────────────────────────────────┐
│  ← 뒤로   설정                    │
├──────────────────────────────────┤
│                                  │
│  🏠 그룹: 가족 경비               │
│                                  │
│  그룹 정보                        │
│  그룹명: [________________]      │
│                                  │
│  멤버 관리                        │
│  ┌──────────────────────────────┐ │
│  │ 김철수          [×]           │ │
│  │ 이영희          [×]           │ │
│  │ 박수철          [×]           │ │
│  └──────────────────────────────┘ │
│                                  │
│  [+ 멤버 추가]                    │
│                                  │
│  ┌──────────────────────────────┐ │
│  │ 📥 데이터 내보내기 (CSV)     │ │
│  └──────────────────────────────┘ │
│                                  │
│  ┌──────────────────────────────┐ │
│  │ ⚠️ 그룹 삭제                 │ │
│  └──────────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
```

---

## Responsive Design Breakpoints

### Mobile (360px - 640px)
- Full width, 16px padding
- Single column layouts
- Touch targets: minimum 44px height
- Stacked buttons, vertical forms

### Tablet (641px - 1024px)
- 2-column layouts where applicable
- Wider cards, better spacing
- Horizontal form layouts

### Desktop (1025px+)
- 3-column layouts
- Side navigation optional
- Maximum content width: 1200px

---

## Accessibility (WCAG 2.1 AA)

### Color Contrast
- Text: Minimum 4.5:1 ratio
- UI Components: Minimum 3:1 ratio
- Do not use color alone to convey information

### Typography
- Minimum font size: 12px (body)
- Line height: ≥ 1.5
- Letter spacing adequate

### Interactive Elements
- Keyboard navigation: Tab order logical
- Focus indicators: Visible (minimum 2px)
- Touch targets: Minimum 44px (mobile)

### Forms
- Labels associated with inputs (for attribute)
- Error messages linked to inputs (aria-describedby)
- Required fields marked with asterisk and aria-required

### Images & Icons
- All images have alt text
- Icons accompanied by text labels or aria-label

---

## Motion & Animation

### Transitions
- Default: 200ms ease-in-out
- Quick actions: 100ms
- Slow transitions: 400ms
- Used for: hover states, modal opens, page transitions

### Animations
- Entrance: Fade in (200ms)
- Loading: Smooth spin (1s infinite)
- Success: Checkmark animation (300ms)

---

**UI Guide Version:** 1.0  
**Last Updated:** 2026-07-08  
**Status:** Ready for Implementation
