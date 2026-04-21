export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages requeridos" });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY no está configurada");
    return res.status(500).json({ error: "Configuración del servidor incompleta" });
  }

  const systemPrompt = `Eres GameBot, el asistente virtual de GameVault — una tienda de videojuegos en línea. 
Tu personalidad es entusiasta, amigable y experto en videojuegos.
Ayudas a los usuarios con:
- Recomendaciones de juegos según sus gustos
- Información sobre los juegos disponibles: Cyberpunk 2077 ($599), Elden Ring ($799), Baldur's Gate 3 ($849), Hades II ($449), Starfield ($699), Hogwarts Legacy ($649)
- Preguntas sobre pagos con tarjeta (usamos Stripe, ambiente seguro)
- Soporte general de la tienda

Responde siempre en español, de forma concisa y útil. Máximo 3 párrafos por respuesta.
Si te preguntan algo fuera de videojuegos o la tienda, redirige amablemente al tema.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://gamevault.vercel.app",
        "X-Title": "GameVault",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter error:", response.status, err);
      return res.status(500).json({ error: "Error del servicio de chat" });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Lo siento, no pude procesar tu mensaje.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error interno del chat:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
