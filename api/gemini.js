export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
  }

  const { userMessage } = req.body;

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const medicalPrompt = `You are a helpful AI health assistant. Keep your response under 250 words. The user is asking about: "${userMessage}". 
You are not a doctor. Provide general info only. Recommend consulting a healthcare professional for real medical issues.`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: medicalPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
      topP: 0.9,
      topK: 40
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received. Please try again.";

    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from Gemini API" });
  }
}
