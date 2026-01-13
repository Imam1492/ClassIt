// server.js (only the relevant parts shown — keep your static serving lines as-is)
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname)); // keep your existing project serving

// === Chat endpoint that forwards to OpenAI ===
app.post("/api/chat", async (req, res) => {
  try {
    // Validate
    const userMessage = String(req.body?.message || "");
    if (!userMessage) return res.status(400).json({ error: "No message provided" });

    // Build messages: system + user. Adjust system prompt to control assistant style.
    const systemPrompt = `You are "ClassIt Assistant", a professional, friendly shopping assistant for an ecommerce site named ClassIt.
- Keep answers concise but helpful (2-4 short paragraphs or bullets when needed).
- When relevant, mention product categories (Livogue, wellfit, tech) and offer buying tips.
- If the user asks about availability/prices, say you don't have live inventory and suggest using site search or contact.
- Use friendly tone, and avoid disclaimers like 'As an AI' unless user asks about limits.`;

    const payload = {
      model: "gpt-4o-mini", // change to the model you prefer (or "gpt-4o" / "gpt-4o-mini" if available)
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 512,
      temperature: 0.7,
      top_p: 1
    };

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      // no-cache to avoid stale results during development
      cache: "no-store"
    });

    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      console.error("OpenAI error:", openaiRes.status, text);
      return res.status(502).json({ error: "AI provider error", details: text });
    }

    const data = await openaiRes.json();
    // Pull the assistant message
    const reply = data?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a reply.";

    return res.json({ reply });

  } catch (err) {
    console.error("Error in /api/chat:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// keep your existing fallback/static logic and app.listen(...) unchanged
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
