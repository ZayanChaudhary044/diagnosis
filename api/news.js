export default async function handler(req, res) {
  const url = `https://gnews.io/api/v4/top-headlines?category=health&lang=en&max=10&apikey=${process.env.GNEWS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // CORS header (optional, but safe)
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
