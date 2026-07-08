import {
  text,
  real,
  integer,
  sqliteTable,
  primaryKey,
} from 'drizzle-orm/sqlite-core'
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
  amount: real('amount').notNull(),
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
  settlements: many(settlements),
}))

export const membersRelations = relations(members, ({ one, many }) => ({
  group: one(groups, {
    fields: [members.groupId],
    references: [groups.id],
  }),
  expenses: many(expenses),
  expenseSplits: many(expenseSplits),
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

export const expenseSplitsRelations = relations(
  expenseSplits,
  ({ one }) => ({
    expense: one(expenses, {
      fields: [expenseSplits.expenseId],
      references: [expenses.id],
    }),
    member: one(members, {
      fields: [expenseSplits.memberId],
      references: [members.id],
    }),
  })
)

export const settlementsRelations = relations(settlements, ({ one }) => ({
  group: one(groups, {
    fields: [settlements.groupId],
    references: [groups.id],
  }),
}))
