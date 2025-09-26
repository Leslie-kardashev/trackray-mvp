// pages/api/tally/test.js
import { XMLParser } from "fast-xml-parser";
import { config } from 'dotenv';
config();

const TALLY_URL = process.env.TALLY_URL || "http://localhost:9000";

// A simple, read-only request to fetch the list of companies.
// This is a lightweight way to check if Tally is responsive.
const TEST_CONNECTION_XML = `
<ENVELOPE>
    <HEADER>
        <TALLYREQUEST>Export</TALLYREQUEST>
    </HEADER>
    <BODY>
        <EXPORTDATA>
            <REQUESTDESC>
                <REPORTNAME>List of Companies</REPORTNAME>
                <STATICVARIABLES>
                    <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                </STATICVARIABLES>
            </REQUESTDESC>
        </EXPORTDATA>
    </BODY>
</ENVELOPE>`;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const response = await fetch(TALLY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: TEST_CONNECTION_XML,
    });

    if (!response.ok) {
        throw new Error(`Tally server responded with status: ${response.status}`);
    }

    const xmlResponse = await response.text();

    // Check if the response is valid Tally XML, which usually contains <ENVELOPE>
    if (!xmlResponse.includes('<ENVELOPE>')) {
        throw new Error("Received an invalid response from the Tally port. Is Tally running?");
    }
    
    // A successful response will contain company information.
    // We can simply check for success here.
    res.status(200).json({ status: 'success', message: 'Tally connection successful!' });

  } catch (err) {
    let errorMessage = "Connection failed. Please ensure Tally is running and the port is accessible.";
    if (err.code === 'ECONNREFUSED') {
        errorMessage = "Connection refused. Is Tally running on the specified port? Check your firewall settings.";
    }
    console.error("Tally connection test error:", err.message);
    res.status(500).json({ status: 'error', message: errorMessage });
  }
}
