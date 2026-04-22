"use client";

import { useState, useEffect } from "react";

interface ScanResult {
  object_naam: string;
  geschatte_prijs: number;
  conditie_check: string;
  advertentie_tekst: string;
}

interface Theme {
  bgCard: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textLabel: string;
  green: string;
  greenBg: string;
  greenBorder: string;
  greenText: string;
  gradient: string;
  bgInput: string;
}

export default function ResultCard({
  item,
  index,
  theme,
}: {
  item: ScanResult;
  index: number;
  theme: Theme;
}) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [geplaatst, setGeplaatst] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 200);
    return () => clearTimeout(t);
  }, [index]);

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
    window.open("https://www.marktplaats.nl/advertentie/plaatsen.html", "_blank");
  };

  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: 16,
      padding: 24,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: theme.green, textTransform: "uppercase", marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>
            Herkend object
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: theme.textPrimary, fontFamily: "'Outfit', sans-serif", lineHeight: 1.3 }}>
            {item.object_naam}
          </div>
        </div>
        <div style={{ background: theme.gradient, borderRadius: 12, padding: "8px 16px", fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 22, color: "#fff", boxShadow: "0 4px 20px rgba(34,197,94,0.25)", flexShrink: 0 }}>
          €{item.geschatte_prijs}
        </div>
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, borderRadius: 8, padding: "5px 12px", width: "fit-content", fontSize: 13, color: theme.greenText, fontFamily: "'DM Mono', monospace" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: theme.green, display: "inline-block" }} />
        {item.conditie_check}
      </div>

      <div style={{ background: theme.bgInput, borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: theme.textMuted, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>
          Advertentietekst
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.65, color: theme.textSecondary, fontFamily: "'Outfit', sans-serif" }}>
          {item.advertentie_tekst}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={handleKopieer}
          style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: theme.gradient, border: "none", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "opacity 0.2s" }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
        >
          {copied ? "✓ Gekopieerd!" : "📋 Kopieer advertentie"}
        </button>
        <button
          onClick={handlePlaats}
          style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: geplaatst ? theme.greenBg : theme.bgInput, border: `1px solid ${geplaatst ? theme.greenBorder : theme.border}`, color: geplaatst ? theme.greenText : theme.textPrimary, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.2s" }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
        >
          {geplaatst ? "✓ Tekst gekopieerd!" : "🔗 Plaats op Marktplaats"}
        </button>
      </div>
    </div>
  );
}
