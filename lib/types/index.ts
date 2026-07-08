export type Group = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type Member = {
  id: string
  groupId: string
  name: string
  createdAt: Date
}

export type ExpenseCategory = 'meal' | 'transport' | 'accommodation' | 'other'

export type Expense = {
  id: string
  groupId: string
  description: string
  amount: number
  paidBy: string
  category: ExpenseCategory
  date: Date
  createdAt: Date
}

export type ExpenseSplit = {
  id: string
  expenseId: string
  memberId: string
  amount: number
}

export type Settlement = {
  id: string
  groupId: string
  settledAt: Date
  note: string | null
}

export type SettlementItem = {
  from: Member
  to: Member
  amount: number
  settled: boolean
}

// DTO Types
export type CreateGroupInput = {
  name: string
  memberNames: string[]
}

export type UpdateGroupInput = {
  name?: string
}

export type CreateExpenseInput = {
  groupId: string
  description: string
  amount: number
  paidBy: string
  category: ExpenseCategory
  date: Date
  splits: {
    memberId: string
    amount: number
  }[]
}

export type UpdateExpenseInput = {
  description?: string
  amount?: number
  paidBy?: string
  category?: ExpenseCategory
  date?: Date
  splits?: {
    memberId: string
    amount: number
  }[]
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

// Filter Types
export type ExpenseFilter = {
  groupId: string
  search?: string
  category?: ExpenseCategory
  dateFrom?: Date
  dateTo?: Date
  paidBy?: string
}

export type ExpenseListResponse = {
  expenses: (Expense & { paidByMember: Member; splits: ExpenseSplit[] })[]
  total: number
}
