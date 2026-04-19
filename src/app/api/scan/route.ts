import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Geen afbeelding ontvangen" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const mediaType = file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: `Je bent een expert in het taxeren van tweedehands spullen voor Marktplaats.nl. Analyseer deze foto van een zoldervondst.

Geef je antwoord als een JSON-array met objecten. Elk object dat je herkent in de foto krijgt een eigen entry. Gebruik exact dit formaat:

[
  {
    "object_naam": "naam van het object",
    "geschatte_prijs": getal in euro (alleen het getal, geen euroteken),
    "conditie_check": "korte conditie omschrijving",
    "advertentie_tekst": "Een wervende Marktplaats-advertentietekst van 2-3 zinnen in het Nederlands. Wees eerlijk, enthousiast maar niet overdreven."
  }
]

Richtlijnen:
- Geef realistische Marktplaats-prijzen (wat mensen echt betalen, niet nieuwprijzen)
- Wees eerlijk over de conditie op basis van wat je ziet
- De advertentietekst moet direct te kopiëren zijn naar Marktplaats
- Als je meerdere objecten ziet, beschrijf ze allemaal
- Antwoord ALLEEN met de JSON-array, geen andere tekst`,
            },
          ],
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Geen tekstrespons ontvangen" }, { status: 500 });
    }

    const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Kon geen resultaten verwerken" }, { status: 500 });
    }

    const results = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ results });
  } catch (error: unknown) {
    console.error("Scan error:", error);
    const message = error instanceof Error ? error.message : "Interne serverfout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
