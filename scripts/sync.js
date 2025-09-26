// scripts/sync.js
import fetch from "node-fetch";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { XMLParser } from "fast-xml-parser";

const TALLY_URL = process.env.TALLY_URL || "http://localhost:9000";
const EXPORT_LEDGER_XML = `<?xml version="1.0"?>
<ENVELOPE>
  <HEADER><TALLYREQUEST>Export</TALLYREQUEST></HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <REPORT>List of Ledgers</REPORT>
        <STATICVARIABLES><SVEXPORTFORMAT>XML</SVEXPORTFORMAT></STATICVARIABLES>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>`;

async function main() {
  const r = await fetch(TALLY_URL, { method: "POST", body: EXPORT_LEDGER_XML, headers: { "Content-Type": "application/xml" }});
  const xml = await r.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const json = parser.parse(xml);
  // parse json and upsert ledgers/vouchers into SQLite
  const db = await open({ filename: "./demo.db", driver: sqlite3.Database });
  // (example depends on the exact Tally XML shape — implement mapping here)
  console.log("Fetched XML length:", xml.length);
  // For demo: just log and leave upsert hooks for you to implement quickly.
  await db.close();
  console.log("Sync finished — implement parsing/upsert mapping for your Tally XML.");
}

main().catch(console.error);
