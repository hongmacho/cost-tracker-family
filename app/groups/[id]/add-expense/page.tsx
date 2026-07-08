'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import type { Member } from '@/lib/types'
import { formatDateInput } from '@/lib/utils/formatting'

export default function AddExpensePage() {
  const router = useRouter()
  const params = useParams()
  const groupId = params.id as string

  const [members, setMembers] = useState<Member[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [category, setCategory] = useState('meal')
  const [date, setDate] = useState(formatDateInput(new Date()))
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/groups/${groupId}`)
        const data = await res.json()
        if (data.success) {
          setMembers(data.data.members)
          if (data.data.members.length > 0) {
            setPaidBy(data.data.members[0].id)
            setSelectedMembers(data.data.members.map((m: Member) => m.id))
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchMembers()
  }, [groupId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!description.trim() || !amount || !paidBy || selectedMembers.length < 2) {
      setError('모든 필드를 입력해주세요')
      return
    }

    setLoading(true)

    try {
      const numAmount = parseFloat(amount)
      const splitAmount = numAmount / selectedMembers.length

      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId,
          description,
          amount: numAmount,
          paidBy,
          category,
          date: new Date(date),
          splits: selectedMembers.map((memberId) => ({
            memberId,
            amount: splitAmount,
          })),
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || '지출을 추가할 수 없습니다')
        return
      }

      router.push(`/groups/${groupId}?tab=expenses`)
    } catch (err) {
      setError('지출을 추가할 수 없습니다')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div className="min-h-screen p-4 flex items-center justify-center">로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-8">지출 추가</h1>

        {error && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">항목명 *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 장보기, 식사비"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">금액 *</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              step="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">결제자 *</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">참여자 *</label>
            <div className="space-y-2">
              {members.map((member) => (
                <label key={member.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers([...selectedMembers, member.id])
                      } else {
                        setSelectedMembers(selectedMembers.filter((id) => id !== member.id))
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span>{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="meal">🍽️ 식사</option>
              <option value="transport">🚗 교통</option>
              <option value="accommodation">🏨 숙박</option>
              <option value="other">⚙️ 기타</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">날짜</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '추가 중...' : '지출 추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
