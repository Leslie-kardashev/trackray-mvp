// pages/api/login.js
import { openDb } from "../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "demo_secret";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { id, key } = req.body;
  const db = await openDb();
  const user = await db.get("SELECT * FROM users WHERE id = ?", id);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(key, user.api_key);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "2h" });
  res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=7200; SameSite=Strict`);
  res.status(200).json({ message: "ok", id: user.id, role: user.role });
}
