import { NextResponse } from 'next/server'
import { groupRepository } from '@/lib/repositories/GroupRepository'
import { memberRepository } from '@/lib/repositories/MemberRepository'
import { validateGroupName, validateMemberName } from '@/lib/utils/validation'
import type { ApiResponse } from '@/lib/types'

export async function GET() {
  try {
    const groups = await groupRepository.findAll()
    return NextResponse.json({
      success: true,
      data: groups,
    } as ApiResponse)
  } catch (error) {
    console.error('Failed to fetch groups:', error)
    return NextResponse.json(
      {
        success: false,
        error: '그룹을 가져올 수 없습니다',
      } as ApiResponse,
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, memberNames } = body

    // Validate input
    const nameErrors = validateGroupName(name)
    if (nameErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: nameErrors[0].message,
        } as ApiResponse,
        { status: 400 }
      )
    }

    if (!Array.isArray(memberNames) || memberNames.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: '멤버는 최소 2명 이상이어야 합니다',
        } as ApiResponse,
        { status: 400 }
      )
    }

    for (const memberName of memberNames) {
      const errors = validateMemberName(memberName)
      if (errors.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: errors[0].message,
          } as ApiResponse,
          { status: 400 }
        )
      }
    }

    // Create group
    const group = await groupRepository.create({ name, memberNames: [] })

    // Create members
    for (const memberName of memberNames) {
      await memberRepository.create(group.id, memberName)
    }

    const groupWithMembers = await groupRepository.getGroupWithMembers(group.id)

    return NextResponse.json(
      {
        success: true,
        data: groupWithMembers,
      } as ApiResponse,
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create group:', error)
    return NextResponse.json(
      {
        success: false,
        error: '그룹을 생성할 수 없습니다',
      } as ApiResponse,
      { status: 500 }
    )
  }
}
