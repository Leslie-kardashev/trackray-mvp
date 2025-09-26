// scripts/seed.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import fs from "fs";
import { mkdir } from "node:fs/promises";

async function main() {
  // Ensure the directory exists.
  try {
    await mkdir('db');
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
  const db = await open({ filename: "./demo.db", driver: sqlite3.Database });
  const sql = fs.readFileSync("./db/schema.sql", "utf8");
  await db.exec(sql);

  const hashed1 = await bcrypt.hash("secret1", 10);
  const hashed2 = await bcrypt.hash("secret2", 10);

  await db.run("INSERT OR IGNORE INTO users (id, api_key, role) VALUES (?,?,?)", ["admin001", hashed1, "admin"]);
  await db.run("INSERT OR IGNORE INTO users (id, api_key, role) VALUES (?,?,?)", ["analyst001", hashed2, "analyst"]);

  // seed some ledgers & vouchers
  await db.run("INSERT OR IGNORE INTO ledgers (name, type, open_balance) VALUES (?,?,?)", ["Cash", "Asset", 10000]);
  await db.run("INSERT OR IGNORE INTO ledgers (name, type, open_balance) VALUES (?,?,?)", ["Sales", "Income", 0]);

  // insert sample voucher
  const r = await db.run("INSERT INTO vouchers (date, voucher_type, narration, total_amount) VALUES (?,?,?,?)", ["20250901", "Sales", "Demo sale", 2000]);
  const vid = r.lastID;
  const cash = await db.get("SELECT id FROM ledgers WHERE name = ?", "Cash");
  const sales = await db.get("SELECT id FROM ledgers WHERE name = ?", "Sales");
  await db.run("INSERT INTO voucher_lines (voucher_id, ledger_id, amount, is_debit) VALUES (?,?,?,?)", [vid, cash.id, 2000, 1]);
  await db.run("INSERT INTO voucher_lines (voucher_id, ledger_id, amount, is_debit) VALUES (?,?,?,?)", [vid, sales.id, -2000, 0]);

  console.log("Seed complete");
  await db.close();
}

main().catch(err => { console.error(err); process.exit(1); });
