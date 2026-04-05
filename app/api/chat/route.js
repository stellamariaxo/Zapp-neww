export async function POST(req) {
  try {
    const { messages, system } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return Response.json({
        content: [{ text: "\u{1F916} ZAPP AI demo mode \u2014 tambahkan ANTHROPIC_API_KEY untuk AI penuh!" }]
      });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system,
        messages,
      }),
    });

    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json(
      { content: [{ text: "\u26A0\uFE0F Koneksi error. Coba lagi!" }] },
      { status: 500 }
    );
  }
}
