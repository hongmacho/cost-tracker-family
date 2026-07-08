#!/usr/bin/env node
import Database from "better-sqlite3";

const dbPath = process.env.DATABASE_PATH || "./data.db";
const db = new Database(dbPath);

console.log("🌱 Initializing database schema...");

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      paid_by TEXT NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
      category TEXT NOT NULL CHECK(category IN ('meal', 'transport', 'accommodation', 'other')),
      date INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS expense_splits (
      id TEXT PRIMARY KEY,
      expense_id TEXT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
      member_id TEXT NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
      amount REAL NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS settlements (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
      settled_at INTEGER NOT NULL,
      note TEXT
    );
  `);

  console.log(`✅ Database schema created`);
  
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
} finally {
  db.close();
}
