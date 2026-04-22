import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const categoryPrompts: Record<string, string> = {
  kunst: `Je bent gespecialiseerd in kunst en antiek. Let extra op:
- Kunstenaar of maker (zoek naar signatuur, stempel, label)
- Techniek: olieverf, aquarel, litho, zeefdruk, foto, ets, etc.
- Stijlperiode of tijdperk
- Conditie van doek, papier, lijst of sokkel
- Of het een origineel, oplage of reproductie lijkt
- Eventuele galerij- of veilingsstickers op de achterkant`,

  elektronica: `Je bent gespecialiseerd in elektronica en apparaten. Let extra op:
- Merk en modelnummer (zo precies mogelijk)
- Geschat bouwjaar
- Staat van kabels, knoppen en scherm
- Of het compleet is (afstandsbediening, adapter, etc.)
- Zichtbare schade of slijtage
- Huidige marktwaarde op Marktplaats voor dit specifieke model`,

  meubels: `Je bent gespecialiseerd in meubels en woonaccessoires. Let extra op:
- Materiaal (hout, metaal, riet, stof, leer)
- Stijl of tijdperk (jaren 50, jaren 70, Scandinavisch, Barok, etc.)
- Bekende ontwerper of merk (IKEA, Artifort, Pastoe, etc.)
- Beschadigingen, krassen of vlekken
- Schat de afmetingen in
- Of het demonteerbaar of moeilijk te transporteren is`,

  speelgoed: `Je bent gespecialiseerd in speelgoed en verzamelobjecten. Let extra op:
- Merk, naam en set- of artikelnummer
- Volledigheid (dozen, instructies, onderdelen)
- Bouwjaar of productieperiode
- Staat van de verpakking
- Zeldzaamheid of verzamelwaarde
- Populaire sets of series die meer waard zijn`,

  kleding: `Je bent gespecialiseerd in kleding en accessoires. Let extra op:
- Merk en eventueel seizoen of collectie
- Zichtbare maat
- Materiaal en kwaliteit
- Staat: vlekken, pillen, scheuren, verkleuringen
- Of het vintage of designer is
- Huidige vraagprijzen voor dit merk op Marktplaats`,

  overig: `Je bent een algemene taxateur voor tweedehands spullen. Identificeer alle verkoopbare objecten zo nauwkeurig mogelijk. Let op merk, model, staat en realistische Marktplaats-waarde.`,
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];
    const category = (formData.get("category") as string) || "overig";
    const refinement = formData.get("refinement") as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Geen afbeelding ontvangen" }, { status: 400 });
    }

    // Build image blocks for all uploaded photos
    const imageBlocks = await Promise.all(
      files.map(async (file) => ({
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
          data: Buffer.from(await file.arrayBuffer()).toString("base64"),
        },
      }))
    );

    const categoryInstruction = categoryPrompts[category] || categoryPrompts.overig;
    const refinementInstruction = refinement
      ? `\n\nExtra informatie van de gebruiker: "${refinement}"\nGebruik deze informatie om je analyse te verfijnen en nauwkeuriger te zijn.`
      : "";

    const prompt = `${categoryInstruction}${refinementInstruction}

Je analyseert ${files.length > 1 ? `${files.length} foto's van hetzelfde object of dezelfde objecten` : "een foto van een zoldervondst"}.

Geef je antwoord als een JSON-array. Elk herkend verkoopbaar object krijgt een eigen entry. Gebruik exact dit formaat:

[
  {
    "object_naam": "specifieke naam inclusief merk/model indien herkenbaar",
    "geschatte_prijs": getal in euro (realistisch Marktplaats-gemiddelde, alleen het getal),
    "conditie_check": "korte conditie omschrijving in 3-6 woorden",
    "advertentie_tekst": "Kant-en-klare Marktplaats-advertentietekst van 3-4 zinnen in het Nederlands. Wervend maar eerlijk. Vermeld staat, kenmerken en waarom dit een goede koop is."
  }
]

Richtlijnen:
- Wees zo specifiek mogelijk met namen, merken en modellen
- Geef realistische Marktplaats-prijzen (wat kopers écht betalen)
- Maximaal 6 objecten per scan
- Antwoord ALLEEN met de JSON-array, geen andere tekst`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            ...imageBlocks,
            { type: "text", text: prompt },
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
