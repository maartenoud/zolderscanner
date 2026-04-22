"use client";

import { useState, useEffect } from "react";

interface ScanResult {
  object_naam: string;
  geschatte_prijs: number;
  conditie_check: string;
  advertentie_tekst: string;
}

export default function ResultCard({
  item,
  index,
}: {
  item: ScanResult;
  index: number;
}) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [geplaatst, setGeplaatst] = useState(false);

  const handleKopieer = async () => {
    const text = `${item.object_naam}\n\n${item.advertentie_tekst}\n\nPrijs: €${item.geschatte_prijs}`;
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlaats = async () => {
    const text = `${item.object_naam}\n\n${item.advertentie_tekst}\n\nPrijs: €${item.geschatte_prijs}`;
    await navigator.clipboard?.writeText(text);
    setGeplaatst(true);
    setTimeout(() => setGeplaatst(false), 3000);
    window.open("https://www.marktplaats.nl/plaatsen", "_blank");
  };

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 200);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: 24,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1.5,
              color: "#22c55e",
              textTransform: "uppercase",
              marginBottom: 6,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Herkend object
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#f0f0f0",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {item.object_naam}
          </div>
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            borderRadius: 12,
            padding: "8px 16px",
            fontFamily: "'DM Mono', monospace",
            fontWeight: 700,
            fontSize: 22,
            color: "#fff",
            boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
          }}
        >
          €{item.geschatte_prijs}
        </div>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 8,
          padding: "5px 12px",
          width: "fit-content",
          fontSize: 13,
          color: "#86efac",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#22c55e",
            display: "inline-block",
          }}
        />
        {item.conditie_check}
      </div>

      <div
        style={{
          fontSize: 14,
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {item.advertentie_tekst}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={handleKopieer}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            border: "none",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLElement).style.transform = "scale(1.03)")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLElement).style.transform = "scale(1)")
          }
        >
          {copied ? "✓ Gekopieerd!" : "📋 Kopieer advertentie"}
        </button>
        <button
          onClick={handlePlaats}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            background: geplaatst ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)",
            border: geplaatst ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLElement).style.transform = "scale(1.03)")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLElement).style.transform = "scale(1)")
          }
        >
          {geplaatst ? "✓ Tekst gekopieerd!" : "🔗 Plaats op Marktplaats"}
        </button>
      </div>
    </div>
  );
}
