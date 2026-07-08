import 'server-only'

import Database from 'better-sqlite3'
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const dbPath = process.env.DATABASE_URL || './data.db'
const sqliteDb = new Database(dbPath)
sqliteDb.pragma('journal_mode = WAL')

export const db = drizzle(sqliteDb, {
  schema,
}) as BetterSQLite3Database<typeof schema>
