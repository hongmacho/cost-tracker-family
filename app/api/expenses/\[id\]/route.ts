import { NextResponse } from 'next/server'
import { expenseRepository } from '@/lib/repositories/ExpenseRepository'
import type { ApiResponse } from '@/lib/types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const expense = await expenseRepository.findById(id)

    if (!expense) {
      return NextResponse.json(
        {
          success: false,
          error: '지출을 찾을 수 없습니다',
        } as ApiResponse,
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: expense,
    } as ApiResponse)
  } catch (error) {
    console.error('Failed to fetch expense:', error)
    return NextResponse.json(
      {
        success: false,
        error: '지출을 가져올 수 없습니다',
      } as ApiResponse,
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await expenseRepository.delete(id)

    return NextResponse.json({
      success: true,
      data: { id },
    } as ApiResponse)
  } catch (error) {
    console.error('Failed to delete expense:', error)
    return NextResponse.json(
      {
        success: false,
        error: '지출을 삭제할 수 없습니다',
      } as ApiResponse,
      { status: 500 }
    )
  }
}
