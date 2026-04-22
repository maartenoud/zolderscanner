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

interface Platform {
  naam: string;
  icon: string;
  url: string;
  kleur: string;
}

const PLATFORMS: Record<string, Platform[]> = {
  kunst: [
    { naam: "Marktplaats", icon: "🏠", url: "https://www.marktplaats.nl/advertentie/plaatsen.html", kleur: "#d97706" },
    { naam: "eBay",        icon: "🛒", url: "https://www.ebay.nl/sell",                             kleur: "#2563eb" },
    { naam: "2dehands",    icon: "♻️", url: "https://www.2dehands.be/advertentie/plaatsen/",        kleur: "#7c3aed" },
  ],
  elektronica: [
    { naam: "Marktplaats", icon: "🏠", url: "https://www.marktplaats.nl/advertentie/plaatsen.html", kleur: "#d97706" },
    { naam: "eBay",        icon: "🛒", url: "https://www.ebay.nl/sell",                             kleur: "#2563eb" },
    { naam: "2dehands",    icon: "♻️", url: "https://www.2dehands.be/advertentie/plaatsen/",        kleur: "#7c3aed" },
  ],
  meubels: [
    { naam: "Marktplaats",       icon: "🏠", url: "https://www.marktplaats.nl/advertentie/plaatsen.html", kleur: "#d97706" },
    { naam: "2dehands",          icon: "♻️", url: "https://www.2dehands.be/advertentie/plaatsen/",        kleur: "#7c3aed" },
    { naam: "Facebook",          icon: "📘", url: "https://www.facebook.com/marketplace/create",          kleur: "#1d4ed8" },
  ],
  speelgoed: [
    { naam: "Marktplaats", icon: "🏠", url: "https://www.marktplaats.nl/advertentie/plaatsen.html", kleur: "#d97706" },
    { naam: "eBay",        icon: "🛒", url: "https://www.ebay.nl/sell",                             kleur: "#2563eb" },
    { naam: "2dehands",    icon: "♻️", url: "https://www.2dehands.be/advertentie/plaatsen/",        kleur: "#7c3aed" },
  ],
  kleding: [
    { naam: "Marktplaats", icon: "🏠", url: "https://www.marktplaats.nl/advertentie/plaatsen.html", kleur: "#d97706" },
    { naam: "Vinted",      icon: "👗", url: "https://www.vinted.nl/sell",                           kleur: "#09b1ba" },
    { naam: "2dehands",    icon: "♻️", url: "https://www.2dehands.be/advertentie/plaatsen/",        kleur: "#7c3aed" },
  ],
  overig: [
    { naam: "Marktplaats", icon: "🏠", url: "https://www.marktplaats.nl/advertentie/plaatsen.html", kleur: "#d97706" },
    { naam: "2dehands",    icon: "♻️", url: "https://www.2dehands.be/advertentie/plaatsen/",        kleur: "#7c3aed" },
    { naam: "Facebook",    icon: "📘", url: "https://www.facebook.com/marketplace/create",          kleur: "#1d4ed8" },
  ],
};

export default function ResultCard({
  item,
  index,
  theme,
  category,
}: {
  item: ScanResult;
  index: number;
  theme: Theme;
  category: string;
}) {
  const [visible, setVisible]   = useState(false);
  const [copied, setCopied]     = useState(false);
  const [active, setActive]     = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 200);
    return () => clearTimeout(t);
  }, [index]);

  const advertentietekst = `${item.object_naam}\n\n${item.advertentie_tekst}\n\nPrijs: €${item.geschatte_prijs}`;

  const handleKopieer = async () => {
    await navigator.clipboard?.writeText(advertentietekst);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlatform = async (platform: Platform) => {
    await navigator.clipboard?.writeText(advertentietekst);
    setActive(platform.naam);
    setTimeout(() => setActive(null), 2500);
    window.open(platform.url, "_blank");
  };

  const platforms = PLATFORMS[category] ?? PLATFORMS.overig;

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

      {/* Naam + prijs */}
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

      {/* Conditie */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: theme.greenBg, border: `1px solid ${theme.greenBorder}`, borderRadius: 8, padding: "5px 12px", width: "fit-content", fontSize: 13, color: theme.greenText, fontFamily: "'DM Mono', monospace" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: theme.green, display: "inline-block" }} />
        {item.conditie_check}
      </div>

      {/* Advertentietekst */}
      <div style={{ background: theme.bgInput, borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: theme.textMuted, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>
          Advertentietekst
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.65, color: theme.textSecondary, fontFamily: "'Outfit', sans-serif" }}>
          {item.advertentie_tekst}
        </div>
      </div>

      {/* Kopieer knop */}
      <button
        onClick={handleKopieer}
        style={{ width: "100%", padding: "10px 0", borderRadius: 10, background: theme.gradient, border: "none", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "opacity 0.2s" }}
        onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
        onMouseOut={(e)  => ((e.currentTarget as HTMLElement).style.opacity = "1")}
      >
        {copied ? "✓ Gekopieerd!" : "📋 Kopieer advertentietekst"}
      </button>

      {/* Platform knoppen */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: theme.textMuted, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>
          Plaats op
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {platforms.map((platform) => {
            const isActive = active === platform.naam;
            return (
              <button
                key={platform.naam}
                onClick={() => handlePlatform(platform)}
                style={{
                  flex: 1,
                  minWidth: "calc(33% - 6px)",
                  padding: "9px 8px",
                  borderRadius: 10,
                  background: isActive ? platform.kleur : theme.bgInput,
                  border: `1px solid ${isActive ? platform.kleur : theme.border}`,
                  color: isActive ? "#fff" : theme.textPrimary,
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = platform.kleur + "18";
                    (e.currentTarget as HTMLElement).style.borderColor = platform.kleur;
                    (e.currentTarget as HTMLElement).style.color = platform.kleur;
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = theme.bgInput;
                    (e.currentTarget as HTMLElement).style.borderColor = theme.border;
                    (e.currentTarget as HTMLElement).style.color = theme.textPrimary;
                  }
                }}
              >
                <span style={{ fontSize: 16 }}>{platform.icon}</span>
                <span>{isActive ? "✓ Gekopieerd!" : platform.naam}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
