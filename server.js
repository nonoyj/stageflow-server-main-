import 'dotenv/config';
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.STAGEFLOW_API_KEY;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/ai", async (req, res) => {
  try {
    const { message, system } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        { role: "user", content: message }
      ]
    };

    const response = await fetch(
      "https://stageflow-server-main.onrender.com/ais",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`stageflow AI error ${response.status}: ${errText}`);
    }

    const data = await response.json();

    const text = (data.content || [])
      .map(block => block.text || "")
      .join("");

    res.json({ reply: text });

  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI failed" });
  }
});

// Listen on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI server running on port ${PORT}`);
});
