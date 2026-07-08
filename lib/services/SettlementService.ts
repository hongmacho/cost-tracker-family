import type { Member, Expense, ExpenseSplit, SettlementItem } from '@/lib/types'

export class SettlementService {
  /**
   * Calculate settlement items for a group
   * Returns a list of who owes whom and how much
   */
  calculateSettlement(
    members: Member[],
    expenses: (Expense & { splits: ExpenseSplit[] })[]
  ): SettlementItem[] {
    // Calculate balance for each member (amount owed - amount paid)
    const balances = new Map<string, number>()

    // Initialize balances
    members.forEach((member) => {
      balances.set(member.id, 0)
    })

    // Add expenses to balances
    expenses.forEach((expense) => {
      // Add to payer's balance (positive = they paid more)
      balances.set(expense.paidBy, (balances.get(expense.paidBy) || 0) + expense.amount)

      // Subtract from participants' balances (negative = they owe)
      expense.splits.forEach((split) => {
        balances.set(split.memberId, (balances.get(split.memberId) || 0) - split.amount)
      })
    })

    // Separate creditors (positive balance) and debtors (negative balance)
    const creditors: Array<{ id: string; amount: number; member: Member }> = []
    const debtors: Array<{ id: string; amount: number; member: Member }> = []

    balances.forEach((amount, memberId) => {
      const member = members.find((m) => m.id === memberId)
      if (!member) return

      if (amount > 0.01) {
        creditors.push({ id: memberId, amount, member })
      } else if (amount < -0.01) {
        debtors.push({ id: memberId, amount: Math.abs(amount), member })
      }
    })

    // Sort for greedy matching
    creditors.sort((a, b) => b.amount - a.amount)
    debtors.sort((a, b) => b.amount - a.amount)

    // Greedy matching algorithm
    const settlements: SettlementItem[] = []
    let creditorIdx = 0
    let debtorIdx = 0

    while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
      const creditor = creditors[creditorIdx]
      const debtor = debtors[debtorIdx]

      const amount = Math.min(creditor.amount, debtor.amount)

      settlements.push({
        from: debtor.member,
        to: creditor.member,
        amount,
        settled: false,
      })

      creditor.amount -= amount
      debtor.amount -= amount

      if (creditor.amount < 0.01) creditorIdx++
      if (debtor.amount < 0.01) debtorIdx++
    }

    return settlements
  }

  /**
   * Get total amount owed by a specific member
   */
  getTotalOwed(member: Member, settlements: SettlementItem[]): number {
    return settlements
      .filter((s) => s.from.id === member.id && !s.settled)
      .reduce((sum, s) => sum + s.amount, 0)
  }

  /**
   * Get total amount owed to a specific member
   */
  getTotalReceivable(member: Member, settlements: SettlementItem[]): number {
    return settlements
      .filter((s) => s.to.id === member.id && !s.settled)
      .reduce((sum, s) => sum + s.amount, 0)
  }

  /**
   * Get net balance for a member (positive = owed money, negative = owes money)
   */
  getNetBalance(member: Member, settlements: SettlementItem[]): number {
    const owed = this.getTotalReceivable(member, settlements)
    const owes = this.getTotalOwed(member, settlements)
    return owed - owes
  }
}

export const settlementService = new SettlementService()
