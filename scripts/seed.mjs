#!/usr/bin/env node
import Database from "better-sqlite3";
import { randomUUID } from "crypto";
const dbPath = process.env.DATABASE_PATH || "./cost-tracker.db";
const db = new Database(dbPath);
const now = Math.floor(Date.now() / 1000);
console.log("🌱 Seeding cost-tracker-family...");
try {
  // Insert 2 groups
  const g1 = randomUUID(), g2 = randomUUID();
  db.exec(`INSERT INTO groups VALUES ('${g1}', '여름휴가 비용', ${now}, ${now})`);
  db.exec(`INSERT INTO groups VALUES ('${g2}', '프로젝트 팀 식사비', ${now}, ${now})`);
  
  // Insert 6+ members
  const members = [];
  const names = ['김철수', '이영희', '박민준', '정수진', '최동욱', '한나영'];
  for (const name of names) {
    const id = randomUUID();
    members.push(id);
    db.exec(`INSERT INTO members VALUES ('${id}', '${g1}', '${name}', ${now})`);
  }
  
  // Insert 20+ expenses
  const categories = ['meal', 'transport', 'accommodation', 'other'];
  const expenses = [];
  for (let i = 0; i < 22; i++) {
    const id = randomUUID();
    const paidBy = members[i % 6];
    const amount = 10000 + i * 5000;
    const category = categories[i % 4];
    const date = now - (i * 86400);
    db.exec(`INSERT INTO expenses VALUES ('${id}', '${g1}', '비용${i+1}', ${amount}, '${paidBy}', '${category}', ${date}, ${now})`);
    expenses.push({id, amount, paidBy});
    
    // Add expense splits (divide by 3-4 people)
    const splitCount = 2 + (i % 3);
    const splitAmount = amount / splitCount;
    for (let j = 0; j < splitCount; j++) {
      const sid = randomUUID();
      const memberId = members[(i + j) % 6];
      db.exec(`INSERT INTO expense_splits VALUES ('${sid}', '${id}', '${memberId}', ${splitAmount})`);
    }
  }
  
  const counts = db.prepare("SELECT COUNT(*) as c FROM groups").get().c;
  console.log(`✅ Seeded: groups=${counts}, members=${members.length}, expenses=${expenses.length}`);
  console.log(JSON.stringify({seed: {ok: true, counts: {groups: counts, members: members.length, expenses: expenses.length}}}));
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
} finally {
  db.close();
}
