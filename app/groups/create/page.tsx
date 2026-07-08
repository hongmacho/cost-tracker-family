'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateGroupPage() {
  const router = useRouter()
  const [groupName, setGroupName] = useState('')
  const [memberNames, setMemberNames] = useState(['', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddMember = () => {
    setMemberNames([...memberNames, ''])
  }

  const handleRemoveMember = (index: number) => {
    if (memberNames.length > 2) {
      setMemberNames(memberNames.filter((_, i) => i !== index))
    }
  }

  const handleMemberChange = (index: number, value: string) => {
    const newNames = [...memberNames]
    newNames[index] = value
    setMemberNames(newNames)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName,
          memberNames: memberNames.filter((name) => name.trim()),
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || '그룹을 생성할 수 없습니다')
        return
      }

      router.push('/groups')
    } catch (err) {
      setError('그룹을 생성할 수 없습니다')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-8">새 그룹 만들기</h1>

        {error && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">그룹명 *</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="예: 가족 경비, 제주도 여행"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">멤버 *</label>
            <div className="space-y-2">
              {memberNames.map((name, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    placeholder={`멤버 ${index + 1}의 이름`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {memberNames.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      제거
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddMember}
              className="mt-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              + 멤버 추가
            </button>
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
              {loading ? '생성 중...' : '그룹 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
