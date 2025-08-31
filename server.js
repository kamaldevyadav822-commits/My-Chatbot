// add near top, after creating `app`
app.use(express.json());

// POST /chat - simple text fallback
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message || "";
    if (!userMessage) return res.status(400).json({ error: "No message" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // change if you want another model
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 600
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? data?.error?.message ?? "No reply";
    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat request failed" });
  }
});
