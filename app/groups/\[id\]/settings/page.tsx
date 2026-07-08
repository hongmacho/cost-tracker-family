'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import type { Group, Member } from '@/lib/types'

export default function SettingsPage() {
  const router = useRouter()
  const params = useParams()
  const groupId = params.id as string

  const [group, setGroup] = useState<Group & { members: Member[] } | null>(null)
  const [newMemberName, setNewMemberName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`/api/groups/${groupId}`)
        const data = await res.json()
        if (data.success) {
          setGroup(data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchGroup()
  }, [groupId])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberName.trim()) return

    try {
      const res = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMemberName }),
      })

      const data = await res.json()

      if (data.success && group) {
        setGroup({ ...group, members: [...group.members, data.data] })
        setNewMemberName('')
      } else {
        setError(data.error || '멤버를 추가할 수 없습니다')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteGroup = async () => {
    try {
      await fetch(`/api/groups/${groupId}`, { method: 'DELETE' })
      router.push('/groups')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="min-h-screen p-4">로딩 중...</div>
  }

  if (!group) {
    return <div className="min-h-screen p-4">그룹을 찾을 수 없습니다</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={() => router.back()} className="text-blue-600 mr-4">
            ←
          </button>
          <h1 className="text-3xl font-bold">설정</h1>
        </div>

        {error && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</div>}

        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">그룹 정보</h2>
          <p className="text-lg font-semibold">{group.name}</p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">멤버 관리</h2>
          <div className="space-y-2 mb-4">
            {group.members.map((member) => (
              <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>{member.name}</span>
                <button
                  onClick={async () => {
                    await fetch(`/api/groups/${groupId}/members?memberId=${member.id}`, {
                      method: 'DELETE',
                    })
                    setGroup({
                      ...group,
                      members: group.members.filter((m) => m.id !== member.id),
                    })
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddMember} className="flex gap-2">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="새 멤버 추가"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              추가
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">데이터 내보내기</h2>
          <button className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
            📥 CSV로 내보내기
          </button>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">위험한 작업</h2>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              ⚠️ 그룹 삭제
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-red-600 font-semibold">정말 이 그룹을 삭제하시겠습니까?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteGroup}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
