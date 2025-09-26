// pages/api/tally/proxy.js
export default async function handler(req, res) {
  // example: POST body should contain raw XML in req.body.xml
  const TALLY_URL = process.env.TALLY_URL || "http://localhost:9000";
  const xml = req.body.xml;
  if (!xml) return res.status(400).json({ error: "Missing XML" });

  try {
    const r = await fetch(TALLY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml
    });
    const text = await r.text();
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
