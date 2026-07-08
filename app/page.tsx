'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          💰 가족 비용 추적
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          간편한 공유 지출 정산 앱
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/dashboard"
            className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-2">📊 대시보드</h2>
            <p className="text-gray-600">
              모든 그룹의 지출 통계와 정산 현황을 확인해보세요
            </p>
          </Link>

          <Link
            href="/groups"
            className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-2">👥 그룹 관리</h2>
            <p className="text-gray-600">
              가족, 친구 그룹을 만들고 지출을 함께 관리해보세요
            </p>
          </Link>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">✨ 주요 기능</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ 그룹 생성 및 멤버 관리</li>
            <li>✓ 공유 지출 기록 및 자동 정산 계산</li>
            <li>✓ 월별 통계와 카테고리별 분석</li>
            <li>✓ 검색 및 필터 기능</li>
            <li>✓ 데이터 CSV 내보내기</li>
            <li>✓ 완전 한국어 UI</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
