import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'
import { generateId } from '@/lib/utils/uuid'
import type { Group, CreateGroupInput, UpdateGroupInput } from '@/lib/types'
import { eq } from 'drizzle-orm'

export class GroupRepository {
  async create(input: CreateGroupInput): Promise<Group> {
    const id = generateId()
    const now = new Date()

    const group = {
      id,
      name: input.name,
      createdAt: now,
      updatedAt: now,
    }

    db.insert(schema.groups).values(group).run()

    return group
  }

  async findAll(): Promise<Group[]> {
    return db.query.groups.findMany()
  }

  async findById(id: string): Promise<Group | null> {
    const result = await db.query.groups.findFirst({
      where: eq(schema.groups.id, id),
    })
    return result || null
  }

  async update(id: string, input: UpdateGroupInput): Promise<Group> {
    const now = new Date()
    const updateData = {
      ...input,
      updatedAt: now,
    }

    const result = await db
      .update(schema.groups)
      .set(updateData)
      .where(eq(schema.groups.id, id))
      .returning()

    if (!result.length) {
      throw new Error(`Group not found: ${id}`)
    }

    return result[0] as Group
  }

  async delete(id: string): Promise<void> {
    await db.delete(schema.groups).where(eq(schema.groups.id, id)).run()
  }

  async getGroupWithMembers(id: string) {
    return db.query.groups.findFirst({
      where: eq(schema.groups.id, id),
      with: {
        members: true,
      },
    })
  }
}

export const groupRepository = new GroupRepository()
