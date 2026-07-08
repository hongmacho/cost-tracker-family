import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '가족 비용 추적',
  description: '간편한 공유 지출 정산 앱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
