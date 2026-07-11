const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
const GROK_MODEL = "grok-2-latest"; // adjust to whichever Grok model your account has access to
 
const buildPrompt = ({ faceShape, hairType, occasion, notes }) => `
You are a professional hairstylist and grooming consultant for EZYCUT, an Indian salon booking platform.
 
Recommend exactly 3 hairstyles for a client with:
- Face shape: ${faceShape}
- Hair type: ${hairType}
- Occasion / need: ${occasion}
${notes ? `- Additional notes from client: ${notes}` : ""}
 
Respond with ONLY a raw JSON array (no markdown, no code fences, no commentary) of exactly 3 objects, each shaped like:
{
  "name": "string, short style name (max 4 words)",
  "match": number between 82 and 99 (how well this style suits the given inputs),
  "tags": ["string", "string", "string"]  (3 short descriptive tags, e.g. "Low maintenance", "Adds volume", "Formal-ready"),
  "desc": "string, 1-2 sentences explaining why this style suits the client's face shape and hair type"
}
 
Order the array from best match to third-best match.
`.trim();
 
const extractJson = (rawText) => {
  // Strip accidental markdown code fences if the model adds them anyway
  const cleaned = rawText.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};
 
exports.getRecommendation = async (req, res) => {
  try {
    const { faceShape, hairType, occasion, notes } = req.body;
 
    if (!faceShape || !hairType || !occasion) {
      return res.status(400).json({
        message: "faceShape, hairType, and occasion are required.",
      });
    }
 
    if (!process.env.XAI_API_KEY) {
      console.error("XAI_API_KEY is not set in backend .env");
      return res.status(500).json({ message: "AI service is not configured." });
    }
 
    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [
          { role: "system", content: "You are a helpful, precise assistant that always responds with valid raw JSON only." },
          { role: "user", content: buildPrompt({ faceShape, hairType, occasion, notes }) },
        ],
        temperature: 0.7,
      }),
    });
 
    if (!response.ok) {
      const errText = await response.text();
      console.error("Grok API error:", response.status, errText);
      return res.status(502).json({ message: "AI recommendation service failed. Please try again." });
    }
 
    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "";
 
    let recommendations;
    try {
      recommendations = extractJson(rawText);
    } catch (parseErr) {
      console.error("Failed to parse Grok response as JSON:", rawText);
      return res.status(502).json({ message: "AI returned an unexpected format. Please try again." });
    }
 
    // Attach a deterministic placeholder image per recommendation.
    // Swap this for real style photography / an image-generation step later.
    const withImages = recommendations.map((rec, i) => ({
      ...rec,
      image: `https://picsum.photos/seed/ezycut-${encodeURIComponent(rec.name)}-${i}/480/560`,
    }));
 
    return res.status(200).json({ recommendations: withImages });
  } catch (err) {
    console.error("AI Mentor recommendation error:", err);
    return res.status(500).json({ message: "Something went wrong generating your recommendations." });
  }
};