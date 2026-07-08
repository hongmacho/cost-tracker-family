import { NextResponse } from 'next/server'
import { expenseRepository } from '@/lib/repositories/ExpenseRepository'
import {
  validateExpenseDescription,
  validateExpenseAmount,
  validateExpenseSplits,
} from '@/lib/utils/validation'
import type { ApiResponse, CreateExpenseInput } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateExpenseInput

    const descErrors = validateExpenseDescription(body.description)
    if (descErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: descErrors[0].message } as ApiResponse,
        { status: 400 }
      )
    }

    const amountErrors = validateExpenseAmount(body.amount)
    if (amountErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: amountErrors[0].message } as ApiResponse,
        { status: 400 }
      )
    }

    const splitErrors = validateExpenseSplits(
      body.splits.map((s) => s.memberId),
      body.amount
    )
    if (splitErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: splitErrors[0].message } as ApiResponse,
        { status: 400 }
      )
    }

    const expense = await expenseRepository.create(body)

    return NextResponse.json(
      {
        success: true,
        data: expense,
      } as ApiResponse,
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create expense:', error)
    return NextResponse.json(
      { success: false, error: '지출을 추가할 수 없습니다' } as ApiResponse,
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')
    const search = searchParams.get('search') || undefined
    const category = searchParams.get('category') || undefined
    const dateFrom = searchParams.get('dateFrom')
      ? new Date(searchParams.get('dateFrom')!)
      : undefined
    const dateTo = searchParams.get('dateTo')
      ? new Date(searchParams.get('dateTo')!)
      : undefined
    const paidBy = searchParams.get('paidBy') || undefined

    if (!groupId) {
      return NextResponse.json(
        { success: false, error: '그룹 ID가 필요합니다' } as ApiResponse,
        { status: 400 }
      )
    }

    const expenses = await expenseRepository.search(
      groupId,
      search,
      category,
      dateFrom,
      dateTo,
      paidBy
    )

    return NextResponse.json({
      success: true,
      data: { expenses, total: expenses.length },
    } as ApiResponse)
  } catch (error) {
    console.error('Failed to fetch expenses:', error)
    return NextResponse.json(
      { success: false, error: '지출을 가져올 수 없습니다' } as ApiResponse,
      { status: 500 }
    )
  }
}
