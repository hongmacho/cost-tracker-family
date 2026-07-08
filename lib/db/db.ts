import 'server-only'

import Database from 'better-sqlite3'
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

let dbInstance: BetterSQLite3Database<typeof schema> | null = null

function getDb(): BetterSQLite3Database<typeof schema> {
  if (!dbInstance) {
    const dbPath = process.env.DATABASE_URL || './data.db'
    const sqliteDb = new Database(dbPath)
    sqliteDb.pragma('journal_mode = WAL')

    dbInstance = drizzle(sqliteDb, {
      schema,
    }) as BetterSQLite3Database<typeof schema>
  }

  return dbInstance
}

export const db = getDb()
