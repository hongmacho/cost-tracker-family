import Database from 'better-sqlite3'

const GROUP_ID = process.argv[2]
const db = new Database('./data.db')

// 멤버 조회
const members = db.prepare('SELECT id, name FROM members WHERE group_id = ? ORDER BY name').all(GROUP_ID)

// 비용과 분할 조회
const expenses = db.prepare(`
  SELECT 
    e.id, e.description, e.amount, e.paid_by,
    json_group_array(json_object('id', es.id, 'memberId', es.member_id, 'amount', es.amount)) as splits_json
  FROM expenses e
  LEFT JOIN expense_splits es ON e.id = es.expense_id
  WHERE e.group_id = ?
  GROUP BY e.id
`).all(GROUP_ID)

const expensesWithSplits = expenses.map(e => ({
  ...e,
  splits: JSON.parse(e.splits_json).filter(s => s.id)
}))

// SettlementService 로직 (정산 계산)
const balances = new Map()
members.forEach(m => balances.set(m.id, 0))

expensesWithSplits.forEach(expense => {
  balances.set(expense.paid_by, (balances.get(expense.paid_by) || 0) + expense.amount)
  expense.splits.forEach(split => {
    balances.set(split.memberId, (balances.get(split.memberId) || 0) - split.amount)
  })
})

// 결과 추출
const balanceArray = Array.from(balances.entries()).map(([id, amount]) => {
  const member = members.find(m => m.id === id)
  return { id, name: member?.name, amount }
}).sort((a, b) => b.amount - a.amount)

// Creditors & Debtors 분리
const creditors = balanceArray.filter(b => b.amount > 0.01).map(b => ({ ...b, remaining: b.amount }))
const debtors = balanceArray.filter(b => b.amount < -0.01).map(b => ({ ...b, remaining: Math.abs(b.amount) }))

// Greedy matching
const transfers = []
let ci = 0, di = 0

while (ci < creditors.length && di < debtors.length) {
  const c = creditors[ci]
  const d = debtors[di]
  const amount = Math.min(c.remaining, d.remaining)
  
  transfers.push({
    from: d.name,
    to: c.name,
    amount: Math.round(amount * 100) / 100
  })
  
  c.remaining -= amount
  d.remaining -= amount
  
  if (c.remaining < 0.01) ci++
  if (d.remaining < 0.01) di++
}

// 검증
const totalTransfered = transfers.reduce((sum, t) => sum + t.amount, 0)
const totalDebt = debtors.reduce((sum, d) => sum + Math.abs(d.amount), 0)

console.log(JSON.stringify({
  members: members.length,
  net_balances: balanceArray.map(b => ({ name: b.name, amount: b.amount })),
  transfers: transfers,
  transfer_sum: totalTransfered,
  debt_sum: totalDebt,
  sums_match: Math.abs(totalTransfered - totalDebt) < 0.01,
  transfer_count: transfers.length
}))

db.close()
