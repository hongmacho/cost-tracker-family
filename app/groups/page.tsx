'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Group } from '@/lib/types'

export default function GroupsPage() {
  const [groups, setGroups] = useState<(Group & { memberCount: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch('/api/groups')
        const data = await res.json()
        if (data.success) {
          // Fetch member count for each group
          const groupsWithMembers = await Promise.all(
            (data.data || []).map(async (group: Group) => {
              const detailRes = await fetch(`/api/groups/${group.id}`)
              const detailData = await detailRes.json()
              return {
                ...group,
                memberCount: detailData.data?.members?.length || 0,
              }
            })
          )
          setGroups(groupsWithMembers)
        }
      } catch (err) {
        setError('그룹을 불러올 수 없습니다')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">그룹</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">그룹</h1>
          <Link
            href="/groups/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + 새 그룹 만들기
          </Link>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {groups.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">아직 그룹이 없어요</p>
            <Link
              href="/groups/create"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              첫 번째 그룹을 만들어보세요
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="block bg-white rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{group.name}</h2>
                    <p className="text-gray-600 text-sm">
                      멤버 {group.memberCount}명
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {group.createdAt instanceof Date
                      ? group.createdAt.toLocaleDateString('ko-KR')
                      : new Date(group.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
