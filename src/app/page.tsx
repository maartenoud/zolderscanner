"use client";

import { useState, useRef, useCallback } from "react";
import ScanParticles from "@/components/ScanParticles";
import ResultCard from "@/components/ResultCard";

interface ScanResult {
  object_naam: string;
  geschatte_prijs: number;
  conditie_check: string;
  advertentie_tekst: string;
}

const MOCK_RESULTS: ScanResult[] = [
  {
    object_naam: "Vintage Philips Radio",
    geschatte_prijs: 85,
    conditie_check: "Goed – lichte gebruikssporen",
    advertentie_tekst:
      "Prachtige vintage Philips radio uit de jaren '70. Werkt nog perfect, ideaal als decoratiestuk of voor de echte liefhebber. Lichte gebruikssporen passend bij de leeftijd.",
  },
  {
    object_naam: "LEGO Technic Set 8880",
    geschatte_prijs: 220,
    conditie_check: "Zeer goed – compleet met doos",
    advertentie_tekst:
      "Zeldzame LEGO Technic Super Car 8880, compleet met originele doos en instructies. Een gewild collectors item in uitstekende staat.",
  },
  {
    object_naam: "Zilverkleurige Kandelaar (set)",
    geschatte_prijs: 45,
    conditie_check: "Redelijk – wat aanslag",
    advertentie_tekst:
      "Elegante set van 2 zilverkleurige kandelaars. Met een poetsbeurt weer als nieuw. Perfect voor op de schouw of eettafel.",
  },
  {
    object_naam: "Retro Samsonite Koffer",
    geschatte_prijs: 35,
    conditie_check: "Goed – vintage look",
    advertentie_tekst:
      "Stoere retro Samsonite koffer, perfect als decoratie of opbergoplossing. Geeft elke kamer direct een vintage sfeer.",
  },
];

export default function ZolderScanner() {
  const [stage, setStage] = useState<"hero" | "scanning" | "results">("hero");
  const [results, setResults] = useState<ScanResult[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [useAI] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const totalValue = results.reduce((sum, r) => sum + r.geschatte_prijs, 0);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setError(null);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        setStage("scanning");
        setScanProgress(0);

        const progressInterval = setInterval(() => {
          setScanProgress((p) => {
            if (p >= 95) {
              clearInterval(progressInterval);
              return 95;
            }
            return p + Math.random() * 8;
          });
        }, 300);

        if (useAI) {
          try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("/api/scan", {
              method: "POST",
              body: formData,
            });
            const data = await response.json();

            clearInterval(progressInterval);

            if (!response.ok) {
              throw new Error(data.error || "API fout");
            }

            // Normalize prices to numbers
            const parsed: ScanResult[] = data.results.map(
              (r: Record<string, unknown>) => ({
                ...r,
                geschatte_prijs:
                  typeof r.geschatte_prijs === "string"
                    ? parseInt((r.geschatte_prijs as string).replace(/[^0-9]/g, ""), 10) || 0
                    : r.geschatte_prijs,
              })
            );

            setScanProgress(100);
            setTimeout(() => {
              setResults(parsed);
              setStage("results");
            }, 600);
          } catch (err) {
            clearInterval(progressInterval);
            const msg =
              err instanceof Error ? err.message : "Onbekende fout";
            setError("AI-scan mislukt: " + msg + ". Demo-resultaten worden getoond.");
            setScanProgress(100);
            setTimeout(() => {
              setResults(MOCK_RESULTS);
              setStage("results");
            }, 600);
          }
        } else {
          setTimeout(() => {
            clearInterval(progressInterval);
            setScanProgress(100);
            setTimeout(() => {
              setResults(MOCK_RESULTS);
              setStage("results");
            }, 600);
          }, 3000);
        }
      };
      reader.readAsDataURL(file);
    },
    [useAI]
  );

  const reset = () => {
    setStage("hero");
    setResults([]);
    setPreview(null);
    setScanProgress(0);
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f14",
        fontFamily: "'Outfit', sans-serif",
        color: "#f0f0f0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes scan-line {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes pulse-dot {
          0% { transform: scale(0); opacity: 0.9; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(0); opacity: 0; }
        }
        @keyframes float-up {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(34,197,94,0.15); }
          50% { box-shadow: 0 0 60px rgba(34,197,94,0.3); }
        }
        @keyframes count-up {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bg-drift {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 15px) rotate(1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50% { opacity: 0.8; transform: scale(1.15); box-shadow: 0 0 0 6px rgba(34,197,94,0); }
        }
      `}</style>

      {/* Background atmosphere */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "60%",
            height: "60%",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
            animation: "bg-drift 20s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "50%",
            height: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)",
            animation: "bg-drift 25s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          padding: "24px 20px",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 48,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
              }}
            >
              📦
            </div>
            <span
              style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}
            >
              Zolder<span style={{ color: "#22c55e" }}>Scanner</span>
            </span>
          </div>
          {stage !== "hero" && (
            <button
              onClick={reset}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "8px 18px",
                color: "#fff",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              ← Nieuwe scan
            </button>
          )}
        </header>

        {/* ═══ HERO STAGE ═══ */}
        {stage === "hero" && (
          <div style={{ textAlign: "center", animation: "float-up 0.8s ease-out" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 2,
                color: "#22c55e",
                textTransform: "uppercase",
                marginBottom: 16,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              AI-Powered Taxatie
            </div>
            <h1
              style={{
                fontSize: "clamp(32px, 6vw, 56px)",
                fontWeight: 800,
                lineHeight: 1.1,
                margin: "0 0 20px",
                letterSpacing: -1.5,
              }}
            >
              Ontdek de verborgen
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #22c55e, #4ade80, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                waarde op je zolder
              </span>
            </h1>
            <p
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.5)",
                maxWidth: 500,
                margin: "0 auto 40px",
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              Upload een foto van je zolderspullen. Onze AI herkent elk object,
              schat de waarde en schrijft direct een Marktplaats-advertentie.
            </p>

            {/* AI Vision indicator */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: 100,
                  padding: "8px 20px",
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                    animation: "live-pulse 1.8s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: 1.5,
                    color: "#86efac",
                    textTransform: "uppercase",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  AI Vision Actief
                </span>
              </div>
            </div>

            {/* Upload area */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "#22c55e";
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)";
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)";
                handleFile(e.dataTransfer.files[0]);
              }}
              style={{
                maxWidth: 480,
                margin: "0 auto",
                border: "2px dashed rgba(34,197,94,0.3)",
                borderRadius: 20,
                padding: "56px 32px",
                cursor: "pointer",
                background: "rgba(34,197,94,0.03)",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#22c55e";
                e.currentTarget.style.background = "rgba(34,197,94,0.06)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)";
                e.currentTarget.style.background = "rgba(34,197,94,0.03)";
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                Upload een foto van je zolder
              </div>
              <div
                style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}
              >
                Sleep een foto hierheen of klik om te uploaden
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>

            {/* Features */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
                maxWidth: 600,
                margin: "56px auto 0",
              }}
            >
              {[
                {
                  icon: "🔍",
                  title: "Object herkenning",
                  desc: "AI identificeert elk item",
                },
                {
                  icon: "💰",
                  title: "Waardebepaling",
                  desc: "Realistische marktprijzen",
                },
                {
                  icon: "📝",
                  title: "Advertentietekst",
                  desc: "Direct klaar voor Marktplaats",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  style={{
                    padding: 20,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 10 }}>
                    {f.icon}
                  </div>
                  <div
                    style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}
                  >
                    {f.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.4)",
                      lineHeight: 1.5,
                    }}
                  >
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SCANNING STAGE ═══ */}
        {stage === "scanning" && (
          <div
            style={{
              textAlign: "center",
              animation: "float-up 0.5s ease-out",
            }}
          >
            <div
              style={{
                maxWidth: 480,
                margin: "0 auto 32px",
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(34,197,94,0.2)",
                animation: "glow 2s ease-in-out infinite",
              }}
            >
              {preview && (
                <img
                  src={preview}
                  alt="Upload"
                  style={{
                    width: "100%",
                    maxHeight: 360,
                    objectFit: "cover",
                    display: "block",
                    filter: "brightness(0.7)",
                  }}
                />
              )}
              <ScanParticles active={true} />
            </div>

            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 2,
                color: "#22c55e",
                textTransform: "uppercase",
                marginBottom: 12,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {useAI ? "AI Vision Analyse" : "Demo Scan"} bezig...
            </div>
            <div
              style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}
            >
              Objecten worden herkend & getaxeerd
            </div>

            {/* Progress bar */}
            <div
              style={{
                maxWidth: 400,
                margin: "0 auto",
                height: 6,
                borderRadius: 3,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 3,
                  background:
                    "linear-gradient(90deg, #22c55e, #4ade80)",
                  width: `${Math.min(scanProgress, 100)}%`,
                  transition: "width 0.3s ease-out",
                  boxShadow: "0 0 12px rgba(34,197,94,0.5)",
                }}
              />
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {Math.round(Math.min(scanProgress, 100))}%
            </div>
          </div>
        )}

        {/* ═══ RESULTS STAGE ═══ */}
        {stage === "results" && (
          <div style={{ animation: "float-up 0.5s ease-out" }}>
            {error && (
              <div
                style={{
                  background: "rgba(234,179,8,0.1)",
                  border: "1px solid rgba(234,179,8,0.3)",
                  borderRadius: 12,
                  padding: "12px 18px",
                  marginBottom: 24,
                  fontSize: 13,
                  color: "#fbbf24",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Total value banner */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 20,
                padding: "32px 28px",
                marginBottom: 32,
                textAlign: "center",
                animation: "count-up 0.8s ease-out",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 2,
                  color: "#86efac",
                  textTransform: "uppercase",
                  marginBottom: 8,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Geschatte totaalwaarde van je zolder
              </div>
              <div
                style={{
                  fontSize: "clamp(40px, 8vw, 64px)",
                  fontWeight: 800,
                  letterSpacing: -2,
                  background:
                    "linear-gradient(135deg, #22c55e, #4ade80)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                €{totalValue}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 8,
                }}
              >
                {results.length} object
                {results.length !== 1 ? "en" : ""} herkend
              </div>
            </div>

            {/* Preview image (small) */}
            {preview && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 28,
                }}
              >
                <img
                  src={preview}
                  alt="Scan"
                  style={{
                    height: 80,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.1)",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {/* Results grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 380px), 1fr))",
                gap: 16,
                marginBottom: 32,
              }}
            >
              {results.map((item, i) => (
                <ResultCard key={i} item={item} index={i} />
              ))}
            </div>

            {/* CTA buttons */}
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: 20,
              }}
            >
              <button
                onClick={() => {
                  const text = results
                    .map(
                      (r) =>
                        `${r.object_naam} – €${r.geschatte_prijs}\n${r.advertentie_tekst}`
                    )
                    .join("\n\n---\n\n");
                  navigator.clipboard?.writeText(text);
                }}
                style={{
                  padding: "14px 28px",
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, #22c55e, #16a34a)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  boxShadow: "0 4px 24px rgba(34,197,94,0.3)",
                  transition: "transform 0.2s",
                }}
                onMouseOver={(e) =>
                  ((e.target as HTMLElement).style.transform = "scale(1.04)")
                }
                onMouseOut={(e) =>
                  ((e.target as HTMLElement).style.transform = "scale(1)")
                }
              >
                📋 Kopieer alle advertenties
              </button>
              <button
                onClick={reset}
                style={{
                  padding: "14px 28px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                📸 Scan nog een foto
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            marginTop: 80,
            paddingBottom: 32,
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          ZolderScanner MVP · Gemaakt met AI
        </footer>
      </div>
    </div>
  );
}
