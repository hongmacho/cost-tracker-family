import { format, parse } from 'date-fns'
import { ko } from 'date-fns/locale'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value)
}

export function parseNumber(value: string): number {
  return parseFloat(value.replace(/,/g, ''))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date
  return format(d, 'yyyy년 M월 d일', { locale: ko })
}

export function formatDateInput(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date
  return format(d, 'M월 d일', { locale: ko })
}

export function formatMonth(date: Date): string {
  return format(date, 'yyyy년 M월', { locale: ko })
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    meal: '🍽️ 식사',
    transport: '🚗 교통',
    accommodation: '🏨 숙박',
    other: '⚙️ 기타',
  }
  return labels[category] || category
}

export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    meal: '🍽️',
    transport: '🚗',
    accommodation: '🏨',
    other: '⚙️',
  }
  return emojis[category] || '📌'
}
