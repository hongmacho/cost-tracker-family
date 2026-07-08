import { NextResponse } from 'next/server'
import { memberRepository } from '@/lib/repositories/MemberRepository'
import { validateMemberName } from '@/lib/utils/validation'
import type { ApiResponse } from '@/lib/types'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params
    const body = await request.json()
    const { name } = body

    const errors = validateMemberName(name)
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: errors[0].message,
        } as ApiResponse,
        { status: 400 }
      )
    }

    const member = await memberRepository.create(groupId, name)

    return NextResponse.json(
      {
        success: true,
        data: member,
      } as ApiResponse,
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create member:', error)
    return NextResponse.json(
      {
        success: false,
        error: '멤버를 추가할 수 없습니다',
      } as ApiResponse,
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json(
        {
          success: false,
          error: '멤버 ID가 필요합니다',
        } as ApiResponse,
        { status: 400 }
      )
    }

    await memberRepository.delete(memberId)

    return NextResponse.json({
      success: true,
      data: { id: memberId },
    } as ApiResponse)
  } catch (error) {
    console.error('Failed to delete member:', error)
    return NextResponse.json(
      {
        success: false,
        error: '멤버를 제거할 수 없습니다',
      } as ApiResponse,
      { status: 500 }
    )
  }
}
