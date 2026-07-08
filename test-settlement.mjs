import Database from 'better-sqlite3'

const db = new Database('./data.db')

// 그룹 ID 조회
const group = db.prepare('SELECT id FROM groups LIMIT 1').get()
const groupId = group.id

// 멤버 조회
const members = db.prepare('SELECT id, name FROM members WHERE group_id = ?').all(groupId)

// 비용과 분할 조회
const expenses = db.prepare(`
  SELECT 
    e.id, e.description, e.amount, e.paid_by,
    json_group_array(json_object('id', es.id, 'memberId', es.member_id, 'amount', es.amount)) as splits_json
  FROM expenses e
  LEFT JOIN expense_splits es ON e.id = es.expense_id
  WHERE e.group_id = ?
  GROUP BY e.id
`).all(groupId)

// JSON 파싱
const expensesWithSplits = expenses.map(e => ({
  ...e,
  splits: JSON.parse(e.splits_json).filter(s => s.id)
}))

console.log('========== SETTLEMENT CALCULATION TEST ==========')
console.log(`Group: ${groupId}`)
console.log(`Members: ${members.length}`)
console.log(`Expenses: ${expensesWithSplits.length}`)

// 수동 정산 계산 (SettlementService 로직 복사)
const balances = new Map()

// Initialize
members.forEach(m => {
  balances.set(m.id, 0)
})

// 비용 계산
expensesWithSplits.forEach(expense => {
  balances.set(expense.paid_by, (balances.get(expense.paid_by) || 0) + expense.amount)
  
  expense.splits.forEach(split => {
    balances.set(split.memberId, (balances.get(split.memberId) || 0) - split.amount)
  })
})

// 결과 출력
console.log('\n=== Net Balances (positive = owed money, negative = owes) ===')
const balanceArray = Array.from(balances.entries()).map(([id, amount]) => {
  const member = members.find(m => m.id === id)
  return { name: member?.name, amount, id }
}).sort((a, b) => b.amount - a.amount)

balanceArray.forEach(({ name, amount }) => {
  const status = amount > 0.01 ? 'CREDITOR' : amount < -0.01 ? 'DEBTOR' : 'SETTLED'
  console.log(`${name.padEnd(10)} ${amount.toFixed(2).padStart(12)} (${status})`)
})

// Greedy matching
const creditors = balanceArray.filter(b => b.amount > 0.01).map(b => ({ ...b, amount: b.amount }))
const debtors = balanceArray.filter(b => b.amount < -0.01).map(b => ({ ...b, amount: Math.abs(b.amount) }))

creditors.sort((a, b) => b.amount - a.amount)
debtors.sort((a, b) => b.amount - a.amount)

console.log(`\nCreditors: ${creditors.length}, Debtors: ${debtors.length}`)

const settlements = []
let creditorIdx = 0
let debtorIdx = 0

while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
  const creditor = creditors[creditorIdx]
  const debtor = debtors[debtorIdx]
  
  const amount = Math.min(creditor.amount, debtor.amount)
  
  settlements.push({
    from: debtor.name,
    to: creditor.name,
    amount: amount.toFixed(2)
  })
  
  creditor.amount -= amount
  debtor.amount -= amount
  
  if (creditor.amount < 0.01) creditorIdx++
  if (debtor.amount < 0.01) debtorIdx++
}

console.log(`\n=== Settlement Items (${settlements.length}) ===`)
settlements.forEach((s, i) => {
  console.log(`${i+1}. ${s.from} → ${s.to}: ${s.amount}원`)
})

db.close()
