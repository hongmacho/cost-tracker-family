import { NextResponse } from 'next/server'
import { groupRepository } from '@/lib/repositories/GroupRepository'
import type { ApiResponse } from '@/lib/types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const group = await groupRepository.getGroupWithMembers(id)

    if (!group) {
      return NextResponse.json(
        {
          success: false,
          error: '그룹을 찾을 수 없습니다',
        } as ApiResponse,
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: group,
    } as ApiResponse)
  } catch (error) {
    console.error('Failed to fetch group:', error)
    return NextResponse.json(
      {
        success: false,
        error: '그룹을 가져올 수 없습니다',
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
    await groupRepository.delete(id)

    return NextResponse.json({
      success: true,
      data: { id },
    } as ApiResponse)
  } catch (error) {
    console.error('Failed to delete group:', error)
    return NextResponse.json(
      {
        success: false,
        error: '그룹을 삭제할 수 없습니다',
      } as ApiResponse,
      { status: 500 }
    )
  }
}
