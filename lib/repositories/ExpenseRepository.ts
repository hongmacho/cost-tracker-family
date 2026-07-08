import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'
import { generateId } from '@/lib/utils/uuid'
import type { Expense, ExpenseSplit, CreateExpenseInput, UpdateExpenseInput } from '@/lib/types'
import { eq, and, gte, lte, like, sql } from 'drizzle-orm'

export class ExpenseRepository {
  async create(input: CreateExpenseInput): Promise<Expense & { splits: ExpenseSplit[] }> {
    const expenseId = generateId()

    const expense = {
      id: expenseId,
      groupId: input.groupId,
      description: input.description,
      amount: input.amount,
      paidBy: input.paidBy,
      category: input.category,
      date: input.date,
      createdAt: new Date(),
    }

    db.insert(schema.expenses).values(expense).run()

    const splits = input.splits.map((split) => ({
      id: generateId(),
      expenseId,
      memberId: split.memberId,
      amount: split.amount,
    }))

    db.insert(schema.expenseSplits).values(splits).run()

    return {
      ...expense,
      splits,
    } as Expense & { splits: ExpenseSplit[] }
  }

  async findById(id: string) {
    return db.query.expenses.findFirst({
      where: eq(schema.expenses.id, id),
      with: {
        splits: true,
        paidByMember: true,
      },
    })
  }

  async findByGroupId(groupId: string) {
    return db.query.expenses.findMany({
      where: eq(schema.expenses.groupId, groupId),
      with: {
        splits: true,
        paidByMember: true,
      },
      orderBy: (expenses) => sql`${expenses.date} DESC, ${expenses.createdAt} DESC`,
    })
  }

  async search(
    groupId: string,
    search?: string,
    category?: string,
    dateFrom?: Date,
    dateTo?: Date,
    paidBy?: string
  ) {
    const conditions: (ReturnType<typeof eq> | ReturnType<typeof like> | ReturnType<typeof gte> | ReturnType<typeof lte> | undefined)[] = [
      eq(schema.expenses.groupId, groupId),
      search ? like(schema.expenses.description, `%${search}%`) : undefined,
      category && ['meal', 'transport', 'accommodation', 'other'].includes(category)
        ? eq(schema.expenses.category, category as any)
        : undefined,
      dateFrom ? gte(schema.expenses.date, dateFrom) : undefined,
      dateTo ? lte(schema.expenses.date, dateTo) : undefined,
      paidBy ? eq(schema.expenses.paidBy, paidBy) : undefined,
    ]

    return db.query.expenses.findMany({
      where: and(...conditions),
      with: {
        splits: true,
        paidByMember: true,
      },
      orderBy: (expenses) => sql`${expenses.date} DESC, ${expenses.createdAt} DESC`,
    })
  }

  async update(id: string, input: UpdateExpenseInput): Promise<Expense> {
    const updateData: Record<string, unknown> = {}

    if (input.description !== undefined) updateData.description = input.description
    if (input.amount !== undefined) updateData.amount = input.amount
    if (input.paidBy !== undefined) updateData.paidBy = input.paidBy
    if (input.category !== undefined) updateData.category = input.category
    if (input.date !== undefined) updateData.date = input.date

    const result = await db
      .update(schema.expenses)
      .set(updateData)
      .where(eq(schema.expenses.id, id))
      .returning()

    if (!result.length) {
      throw new Error(`Expense not found: ${id}`)
    }

    // Update splits if provided
    if (input.splits) {
      await db.delete(schema.expenseSplits).where(eq(schema.expenseSplits.expenseId, id)).run()

      const newSplits = input.splits.map((split) => ({
        id: generateId(),
        expenseId: id,
        memberId: split.memberId,
        amount: split.amount,
      }))

      db.insert(schema.expenseSplits).values(newSplits).run()
    }

    return result[0] as Expense
  }

  async delete(id: string): Promise<void> {
    await db.delete(schema.expenses).where(eq(schema.expenses.id, id)).run()
  }

  async deleteByGroupId(groupId: string): Promise<void> {
    await db
      .delete(schema.expenses)
      .where(eq(schema.expenses.groupId, groupId))
      .run()
  }
}

export const expenseRepository = new ExpenseRepository()
