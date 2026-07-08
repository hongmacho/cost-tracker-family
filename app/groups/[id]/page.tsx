'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { Group, Member, Expense, ExpenseSplit, SettlementItem } from '@/lib/types'
import { settlementService } from '@/lib/services/SettlementService'
import { formatCurrency, formatDate, getCategoryEmoji, formatMonth } from '@/lib/utils/formatting'

export default function GroupDetailPage() {
  const params = useParams()
  const groupId = params.id as string

  const [group, setGroup] = useState<Group & { members: Member[] } | null>(null)
  const [expenses, setExpenses] = useState<
    (Expense & { splits: ExpenseSplit[]; paidByMember: Member })[]
  >([])
  const [settlements, setSettlements] = useState<SettlementItem[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'settlement'>('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupRes = await fetch(`/api/groups/${groupId}`)
        const groupData = await groupRes.json()

        if (!groupData.success) {
          setError('그룹을 찾을 수 없습니다')
          return
        }

        setGroup(groupData.data)

        const expensesRes = await fetch(`/api/expenses?groupId=${groupId}`)
        const expensesData = await expensesRes.json()

        if (expensesData.success) {
          const expensesList = expensesData.data.expenses || []
          setExpenses(expensesList)

          const settlementItems = settlementService.calculateSettlement(
            groupData.data.members,
            expensesList
          )
          setSettlements(settlementItems)
        }
      } catch (err) {
        setError('데이터를 불러올 수 없습니다')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (groupId) fetchData()
  }, [groupId])

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen p-4 text-center">
        <p className="text-red-600">{error || '그룹을 찾을 수 없습니다'}</p>
      </div>
    )
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.paidByMember.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || expense.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const monthlyStats = (() => {
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthExpenses = expenses.filter((e) => {
      const expenseDate = e.date instanceof Date ? e.date : new Date(e.date)
      return expenseDate.getFullYear() === currentMonth.getFullYear() &&
        expenseDate.getMonth() === currentMonth.getMonth()
    })

    const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
    const byCategory: Record<string, number> = {}

    monthExpenses.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount
    })

    return { total, byCategory }
  })()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/groups" className="text-blue-600 hover:text-blue-700">
            ← 뒤로
          </Link>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <Link
            href={`/groups/${groupId}/settings`}
            className="text-gray-600 hover:text-gray-800"
          >
            ⚙️
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          {(['overview', 'expenses', 'settlement'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-semibold ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'overview' && '개요'}
              {tab === 'expenses' && '지출'}
              {tab === 'settlement' && '정산'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">현재 정산액</h2>
              {settlements.length === 0 ? (
                <p className="text-gray-600">아직 정산할 항목이 없습니다</p>
              ) : (
                <div className="space-y-2">
                  {settlements.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-blue-50 border border-blue-200 rounded"
                    >
                      <p className="text-blue-900">
                        {item.from.name}이 {item.to.name}에게 {formatCurrency(item.amount)}{' '}
                        주기
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                {formatMonth(new Date())} 통계
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">월 총 지출액</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(monthlyStats.total)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">평균 개인 부담액</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(monthlyStats.total / (group.members.length || 1))}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-sm text-gray-600">카테고리별 지출</p>
                {Object.entries(monthlyStats.byCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span>{getCategoryEmoji(category)}</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={categoryFilter || ''}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">모든 카테고리</option>
                <option value="meal">식사</option>
                <option value="transport">교통</option>
                <option value="accommodation">숙박</option>
                <option value="other">기타</option>
              </select>
            </div>

            {filteredExpenses.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">등록된 지출이 없어요</p>
                <Link
                  href={`/groups/${groupId}/add-expense`}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  첫 번째 지출을 기록해보세요
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="bg-white rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                  >
                    <div>
                      <p className="font-semibold">{getCategoryEmoji(expense.category)} {expense.description}</p>
                      <p className="text-sm text-gray-600">
                        {expense.paidByMember.name} · {formatDate(expense.date)}
                      </p>
                    </div>
                    <p className="font-bold text-lg">{formatCurrency(expense.amount)}</p>
                  </div>
                ))}
              </div>
            )}

            <Link
              href={`/groups/${groupId}/add-expense`}
              className="block bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
            >
              + 지출 추가
            </Link>
          </div>
        )}

        {/* Settlement Tab */}
        {activeTab === 'settlement' && (
          <div className="space-y-4">
            {settlements.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-green-600 font-semibold">✓ 모든 정산이 완료되었어요!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {settlements.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {item.from.name} → {item.to.name}
                      </p>
                      <p className="text-sm text-gray-600">{formatCurrency(item.amount)}</p>
                    </div>
                    <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      정산 완료
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
