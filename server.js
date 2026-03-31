import 'dotenv/config';
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.AI_API_KEY;

app.post("/ai", async (req, res) => {
  try {
    const { message, system } = req.body;

    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: message }]
    };

    if (system) body.system = system;

    const response = await fetch("3e1b0243-10e2-4885-99a4-11126a180225", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": AI_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    const text = (data.content || [])
      .map(b => b.text || "")
      .join("");

    res.json({ reply: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(3000, () => console.log("AI server running on port 3000"));