'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Group, Member, Expense, ExpenseSplit, SettlementItem } from '@/lib/types'
import { settlementService } from '@/lib/services/SettlementService'
import { formatCurrency, formatMonth, getCategoryEmoji } from '@/lib/utils/formatting'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

interface GroupData {
  group: Group & { members: Member[] }
  expenses: (Expense & { splits: ExpenseSplit[]; paidByMember: Member })[]
  settlements: SettlementItem[]
}

export default function DashboardPage() {
  const [groupsData, setGroupsData] = useState<GroupData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const groupsRes = await fetch('/api/groups')
        const groupsData = await groupsRes.json()

        if (!groupsData.success) {
          setError('데이터를 불러올 수 없습니다')
          return
        }

        const groups = groupsData.data || []
        const allGroupsData: GroupData[] = []

        for (const group of groups) {
          const groupDetailRes = await fetch(`/api/groups/${group.id}`)
          const groupDetailData = await groupDetailRes.json()

          const expensesRes = await fetch(`/api/expenses?groupId=${group.id}`)
          const expensesData = await expensesRes.json()

          const expenses = expensesData.data?.expenses || []
          const settlements = settlementService.calculateSettlement(
            groupDetailData.data.members,
            expenses
          )

          allGroupsData.push({
            group: groupDetailData.data,
            expenses,
            settlements,
          })
        }

        setGroupsData(allGroupsData)
      } catch (err) {
        setError('데이터를 불러올 수 없습니다')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  const allExpenses = groupsData.flatMap((g) => g.expenses)
  const allSettlements = groupsData.flatMap((g) => g.settlements)

  const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0)

  const currentMonth = new Date()
  const monthExpenses = allExpenses.filter((e) => {
    const expenseDate = e.date instanceof Date ? e.date : new Date(e.date)
    return (
      expenseDate.getFullYear() === currentMonth.getFullYear() &&
      expenseDate.getMonth() === currentMonth.getMonth()
    )
  })
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0)

  const unsettledTotal = allSettlements
    .filter((s) => !s.settled)
    .reduce((sum, s) => sum + s.amount, 0)

  const categoryBreakdown: Record<string, number> = {}
  monthExpenses.forEach((e) => {
    categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount
  })

  const categoryChartData = Object.entries(categoryBreakdown).map(([category, amount]) => ({
    name: getCategoryEmoji(category),
    value: amount,
  }))

  const groupSummary = groupsData.map((gd) => ({
    name: gd.group.name,
    total: gd.expenses.reduce((sum, e) => sum + e.amount, 0),
    unsettled: gd.settlements
      .filter((s) => !s.settled)
      .reduce((sum, s) => sum + s.amount, 0),
  }))

  const monthlyTrend: { month: string; amount: number }[] = []
  const monthMap = new Map<string, number>()

  allExpenses.forEach((e) => {
    const date = e.date instanceof Date ? e.date : new Date(e.date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthMap.set(key, (monthMap.get(key) || 0) + e.amount)
  })

  Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([month, amount]) => {
      monthlyTrend.push({
        month: month.substring(5),
        amount,
      })
    })

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 대시보드</h1>
          <p className="text-gray-600">모든 그룹의 지출 통계</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {allExpenses.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-4">아직 지출 내역이 없습니다</p>
            <Link
              href="/groups"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              그룹을 만들어 지출을 기록해보세요
            </Link>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-600 text-sm mb-2">총 지출</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-600 text-sm mb-2">
                  {formatMonth(currentMonth)} 지출
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(monthTotal)}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-600 text-sm mb-2">미정산액</p>
                <p className="text-3xl font-bold text-red-600">
                  {formatCurrency(unsettledTotal)}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Trend */}
              {monthlyTrend.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-bold mb-4">월별 지출 추이</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#3B82F6"
                        name="지출액"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Category Distribution */}
              {categoryChartData.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-bold mb-4">카테고리별 분포</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) =>
                          `${name} ${formatCurrency(value)}`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryChartData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Group Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-lg font-bold mb-4">그룹별 지출 요약</h2>
              {groupSummary.length === 0 ? (
                <p className="text-gray-600">그룹 데이터가 없습니다</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupSummary.map((group) => (
                    <Link
                      key={group.name}
                      href="/groups"
                      className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {group.name}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          총 지출: {formatCurrency(group.total)}
                        </p>
                        <p
                          className={
                            group.unsettled > 0
                              ? 'text-red-600 font-semibold'
                              : 'text-green-600'
                          }
                        >
                          {group.unsettled > 0
                            ? `미정산: ${formatCurrency(group.unsettled)}`
                            : '정산 완료 ✓'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 justify-center mb-8">
              <Link
                href="/groups"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                그룹 관리
              </Link>
              <Link
                href="/groups/create"
                className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                새 그룹 만들기
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
