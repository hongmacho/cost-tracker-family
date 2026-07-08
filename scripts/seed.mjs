#!/usr/bin/env node
import Database from "better-sqlite3";
import { randomUUID } from "crypto";

const dbPath = process.env.DATABASE_PATH || "./data.db";
const db = new Database(dbPath);
const now = Math.floor(Date.now() / 1000);

console.log("🌱 Seeding cost-tracker-family with 2 groups...");

try {
  // GROUP 1: 여름휴가
  const g1 = randomUUID();
  db.exec(`INSERT INTO groups VALUES ('${g1}', '여름휴가 비용', ${now}, ${now})`);
  
  const members1 = [];
  const names1 = ['김철수', '이영희', '박민준', '정수진', '최동욱', '한나영'];
  for (const name of names1) {
    const id = randomUUID();
    members1.push(id);
    db.exec(`INSERT INTO members VALUES ('${id}', '${g1}', '${name}', ${now})`);
  }
  
  const categories = ['meal', 'transport', 'accommodation', 'other'];
  for (let i = 0; i < 22; i++) {
    const id = randomUUID();
    const paidBy = members1[i % 6];
    const amount = 10000 + i * 5000;
    const category = categories[i % 4];
    const date = now - (i * 86400);
    db.exec(`INSERT INTO expenses VALUES ('${id}', '${g1}', '비용${i+1}', ${amount}, '${paidBy}', '${category}', ${date}, ${now})`);
    
    const splitCount = 2 + (i % 3);
    const splitAmount = amount / splitCount;
    for (let j = 0; j < splitCount; j++) {
      const sid = randomUUID();
      const memberId = members1[(i + j) % 6];
      db.exec(`INSERT INTO expense_splits VALUES ('${sid}', '${id}', '${memberId}', ${splitAmount})`);
    }
  }

  // GROUP 2: 팀 회식
  const g2 = randomUUID();
  db.exec(`INSERT INTO groups VALUES ('${g2}', '팀 회식비', ${now}, ${now})`);
  
  const members2 = [];
  const names2 = ['박진영', '최수미', '이준호', '김나영'];
  for (const name of names2) {
    const id = randomUUID();
    members2.push(id);
    db.exec(`INSERT INTO members VALUES ('${id}', '${g2}', '${name}', ${now})`);
  }
  
  // Group 2의 지출 12개
  for (let i = 0; i < 12; i++) {
    const id = randomUUID();
    const paidBy = members2[i % 4];
    const amount = 50000 + i * 10000;
    const category = categories[i % 4];
    const date = now - (i * 86400);
    db.exec(`INSERT INTO expenses VALUES ('${id}', '${g2}', '회식${i+1}', ${amount}, '${paidBy}', '${category}', ${date}, ${now})`);
    
    const splitCount = 2 + (i % 2);
    const splitAmount = amount / splitCount;
    for (let j = 0; j < splitCount; j++) {
      const sid = randomUUID();
      const memberId = members2[(i + j) % 4];
      db.exec(`INSERT INTO expense_splits VALUES ('${sid}', '${id}', '${memberId}', ${splitAmount})`);
    }
  }
  
  const g1Count = db.prepare("SELECT COUNT(*) as c FROM groups WHERE id = ?").get(g1).c;
  const g2Count = db.prepare("SELECT COUNT(*) as c FROM groups WHERE id = ?").get(g2).c;
  const totalGroups = db.prepare("SELECT COUNT(*) as c FROM groups").get().c;
  const totalMembers = db.prepare("SELECT COUNT(*) as c FROM members").get().c;
  const totalExpenses = db.prepare("SELECT COUNT(*) as c FROM expenses").get().c;
  const totalSplits = db.prepare("SELECT COUNT(*) as c FROM expense_splits").get().c;
  
  console.log(`✅ Seeded: groups=${totalGroups}, members=${totalMembers}, expenses=${totalExpenses}, splits=${totalSplits}`);
  
} catch (error) {
  console.error("❌ Error:", error);
  process.exit(1);
} finally {
  db.close();
}
