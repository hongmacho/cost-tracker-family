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

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            프로젝트 초기화 중...
          </h2>
          <p className="text-gray-600 mb-4">
            이 페이지는 개발 중입니다. 잠시만 기다려주세요.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-6">
            <h3 className="font-semibold text-blue-900 mb-2">📋 진행 상황</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ 프로젝트 초기화 완료</li>
              <li>✓ DB 스키마 정의</li>
              <li>✓ Repository 패턴 구현</li>
              <li>→ Sprint 1: 그룹/멤버 관리</li>
              <li>→ Sprint 2-6: 기능 구현</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
