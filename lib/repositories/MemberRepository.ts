import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'
import { generateId } from '@/lib/utils/uuid'
import type { Member } from '@/lib/types'
import { eq, and } from 'drizzle-orm'

export class MemberRepository {
  async create(groupId: string, name: string): Promise<Member> {
    const id = generateId()

    const member = {
      id,
      groupId,
      name,
      createdAt: new Date(),
    }

    db.insert(schema.members).values(member).run()

    return member
  }

  async findById(id: string): Promise<Member | null> {
    const result = await db.query.members.findFirst({
      where: eq(schema.members.id, id),
    })
    return result || null
  }

  async findByGroupId(groupId: string): Promise<Member[]> {
    return db.query.members.findMany({
      where: eq(schema.members.groupId, groupId),
    })
  }

  async update(id: string, name: string): Promise<Member> {
    const result = await db
      .update(schema.members)
      .set({ name })
      .where(eq(schema.members.id, id))
      .returning()

    if (!result.length) {
      throw new Error(`Member not found: ${id}`)
    }

    return result[0] as Member
  }

  async delete(id: string): Promise<void> {
    await db.delete(schema.members).where(eq(schema.members.id, id)).run()
  }

  async deleteByGroupId(groupId: string): Promise<void> {
    await db
      .delete(schema.members)
      .where(eq(schema.members.groupId, groupId))
      .run()
  }
}

export const memberRepository = new MemberRepository()
