// lib/db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDb() {
  const db = await open({
    filename: process.env.DB_PATH || "./demo.db",
    driver: sqlite3.Database
  });
  return db;
}
