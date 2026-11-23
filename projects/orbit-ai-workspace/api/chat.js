const MODEL_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 8;
const recentRequests = new Map();

module.exports = async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Use POST to send a prompt." });
  }

  const requestOrigin = request.headers.origin;
  const requestHost = request.headers["x-forwarded-host"] || request.headers.host;
  let originHost;
  try {
    originHost = requestOrigin ? new URL(requestOrigin).host : "";
  } catch {
    return response.status(403).json({ error: "Requests must come from this workspace." });
  }
  if (!originHost || originHost !== requestHost) {
    return response.status(403).json({ error: "Requests must come from this workspace." });
  }

  const clientIp = (request.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  const now = Date.now();
  const recent = (recentRequests.get(clientIp) || []).filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    return response.status(429).json({ error: "Too many prompts. Wait a minute and try again." });
  }
  recent.push(now);
  recentRequests.set(clientIp, recent);

  const message = request.body && typeof request.body.message === "string" ? request.body.message.trim() : "";
  if (!message || message.length > 500) {
    return response.status(400).json({ error: "Enter a prompt between 1 and 500 characters." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return response.status(503).json({ error: "Gemini is not configured on the server yet." });
  }

  try {
    const upstream = await fetch(MODEL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "You are Orbit, a concise and supportive productivity assistant. Help with planning, notes, and breaking work into small steps. Do not provide medical, legal, or financial advice. Keep replies under 120 words." }],
        },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 256, temperature: 0.6 },
      }),
    });

    if (!upstream.ok) {
      console.error(`Gemini returned status ${upstream.status}.`);
      return response.status(502).json({ error: "Gemini is temporarily unavailable." });
    }

    const result = await upstream.json();
    const reply = result.candidates && result.candidates[0] && result.candidates[0].content &&
      result.candidates[0].content.parts && result.candidates[0].content.parts
        .map((part) => typeof part.text === "string" ? part.text : "")
        .join("")
        .trim();

    if (!reply) {
      console.error("Gemini returned no text for the prompt.");
      return response.status(502).json({ error: "Gemini did not return a response." });
    }

    return response.status(200).json({ reply });
  } catch (error) {
    console.error("Could not reach the Gemini API.", error);
    return response.status(502).json({ error: "Gemini is temporarily unavailable." });
  }
};
