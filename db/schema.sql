PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  api_key TEXT NOT NULL,
  role TEXT DEFAULT 'analyst',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ledgers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  type TEXT,
  open_balance REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stock_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  sku TEXT,
  qty REAL DEFAULT 0,
  avg_rate REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS vouchers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,   -- optional Tally identifier
  date TEXT,        -- YYYYMMDD or ISO
  voucher_type TEXT,
  narration TEXT,
  total_amount REAL
);

CREATE TABLE IF NOT EXISTS voucher_lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  voucher_id INTEGER,
  ledger_id INTEGER,
  amount REAL,
  is_debit INTEGER,
  FOREIGN KEY(voucher_id) REFERENCES vouchers(id),
  FOREIGN KEY(ledger_id) REFERENCES ledgers(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  action TEXT,
  payload TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
