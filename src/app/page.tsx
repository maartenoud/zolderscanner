"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ScanParticles from "@/components/ScanParticles";
import ResultCard from "@/components/ResultCard";

interface ScanResult {
  object_naam: string;
  geschatte_prijs: number;
  conditie_check: string;
  advertentie_tekst: string;
}

const CATEGORIES = [
  { id: "kunst",       label: "Kunst & Antiek",    icon: "🎨" },
  { id: "elektronica", label: "Elektronica",        icon: "📺" },
  { id: "meubels",     label: "Meubels",            icon: "🪑" },
  { id: "speelgoed",   label: "Speelgoed & Games",  icon: "🧸" },
  { id: "kleding",     label: "Kleding",            icon: "👗" },
  { id: "overig",      label: "Overig",             icon: "📦" },
];

function buildTheme(isDark: boolean) {
  return {
    bg:           isDark ? "#0a0f14"                   : "#f8fafc",
    bgCard:       isDark ? "rgba(255,255,255,0.06)"    : "#ffffff",
    bgInput:      isDark ? "rgba(255,255,255,0.06)"    : "#f1f5f9",
    bgHover:      isDark ? "rgba(255,255,255,0.04)"    : "#f8fafc",
    textPrimary:  isDark ? "#f0f0f0"                   : "#0f172a",
    textSecondary:isDark ? "rgba(255,255,255,0.6)"     : "#475569",
    textMuted:    isDark ? "rgba(255,255,255,0.4)"     : "#94a3b8",
    textLabel:    isDark ? "rgba(255,255,255,0.25)"    : "#cbd5e1",
    border:       isDark ? "rgba(255,255,255,0.08)"    : "rgba(0,0,0,0.08)",
    borderStrong: isDark ? "rgba(255,255,255,0.15)"    : "rgba(0,0,0,0.15)",
    green:        isDark ? "#22c55e"                   : "#16a34a",
    greenBg:      isDark ? "rgba(34,197,94,0.08)"      : "rgba(22,163,74,0.07)",
    greenBorder:  isDark ? "rgba(34,197,94,0.25)"      : "rgba(22,163,74,0.2)",
    greenText:    isDark ? "#86efac"                   : "#15803d",
    gradient:     isDark ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#16a34a,#15803d)",
    atmo1:        isDark ? "rgba(34,197,94,0.06)"      : "rgba(22,163,74,0.04)",
    atmo2:        isDark ? "rgba(59,130,246,0.04)"     : "rgba(59,130,246,0.03)",
    shadow:       isDark ? "none"                      : "0 1px 3px rgba(0,0,0,0.08)",
    headerBorder: isDark ? "rgba(255,255,255,0.06)"    : "rgba(0,0,0,0.06)",
  };
}

export default function ZolderScanner() {
  const [isDark, setIsDark] = useState(false);
  const [stage, setStage]   = useState<"hero"|"scanning"|"results">("hero");
  const [results, setResults]   = useState<ScanResult[]>([]);
  const [category, setCategory] = useState<string|null>(null);
  const [files, setFiles]       = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [error, setError]       = useState<string|null>(null);
  const [refinement, setRefinement] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const t = buildTheme(isDark);
  const totalValue = results.reduce((sum, r) => sum + r.geschatte_prijs, 0);

  // Persist theme in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("zolderscanner-theme");
    if (saved === "dark") setIsDark(true);
  }, []);
  const toggleTheme = () => {
    setIsDark((d) => {
      localStorage.setItem("zolderscanner-theme", !d ? "dark" : "light");
      return !d;
    });
  };

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const toAdd = Array.from(newFiles).slice(0, 4 - files.length);
    setFiles((prev) => [...prev, ...toAdd]);
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  }, [files.length]);

  const removeFile = (index: number) => {
    setFiles((prev)    => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleScan = useCallback(async (scanFiles: File[], cat: string, refineText?: string) => {
    setError(null);
    setStage("scanning");
    setScanProgress(0);

    const progressInterval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 90) { clearInterval(progressInterval); return 90; }
        return p + Math.random() * 7;
      });
    }, 300);

    try {
      const formData = new FormData();
      scanFiles.forEach((f) => formData.append("images", f));
      formData.append("category", cat);
      if (refineText) formData.append("refinement", refineText);

      const res  = await fetch("/api/scan", { method: "POST", body: formData });
      const data = await res.json();
      clearInterval(progressInterval);
      if (!res.ok) throw new Error(data.error || "API fout");

      const parsed: ScanResult[] = data.results.map((r: Record<string, unknown>) => ({
        ...r,
        geschatte_prijs: typeof r.geschatte_prijs === "string"
          ? parseInt((r.geschatte_prijs as string).replace(/[^0-9]/g, ""), 10) || 0
          : r.geschatte_prijs,
      }));

      setScanProgress(100);
      setTimeout(() => { setResults(parsed); setStage("results"); }, 600);
    } catch (err) {
      clearInterval(progressInterval);
      setError("Scan mislukt: " + (err instanceof Error ? err.message : "Onbekende fout"));
      setStage("hero");
    }
  }, []);

  const handleVerfijn = async () => {
    if (!refinement.trim() || !category) return;
    setIsRefining(true);
    setResults([]);
    await handleScan(files, category, refinement);
    setIsRefining(false);
  };

  const reset = () => {
    setStage("hero"); setResults([]); setFiles([]); setPreviews([]);
    setCategory(null); setScanProgress(0); setError(null); setRefinement("");
  };

  const canScan = category !== null && files.length > 0;
  const selectedCat = CATEGORIES.find((c) => c.id === category);

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Outfit', sans-serif", color: t.textPrimary, position: "relative", overflow: "hidden", transition: "background 0.3s, color 0.3s" }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes scan-line { 0%{top:0;opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes pulse-dot { 0%{transform:scale(0);opacity:.9} 50%{transform:scale(1.5);opacity:.5} 100%{transform:scale(0);opacity:0} }
        @keyframes float-up  { 0%{transform:translateY(40px);opacity:0} 100%{transform:translateY(0);opacity:1} }
        @keyframes glow      { 0%,100%{box-shadow:0 0 30px rgba(34,197,94,.15)} 50%{box-shadow:0 0 60px rgba(34,197,94,.3)} }
        @keyframes count-up  { 0%{transform:scale(.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes bg-drift  { 0%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(-20px,15px) rotate(1deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes live-pulse{ 0%,100%{opacity:1;transform:scale(1);box-shadow:0 0 0 0 rgba(34,197,94,.5)} 50%{opacity:.8;transform:scale(1.15);box-shadow:0 0 0 6px rgba(34,197,94,0)} }
      `}</style>

      {/* Ambient background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "60%", height: "60%", background: `radial-gradient(circle,${t.atmo1} 0%,transparent 70%)`, animation: "bg-drift 20s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "50%", height: "50%", background: `radial-gradient(circle,${t.atmo2} 0%,transparent 70%)`, animation: "bg-drift 25s ease-in-out infinite reverse" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>

        {/* ── Header ── */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: t.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 20px rgba(34,197,94,0.25)" }}>📦</div>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>Zolder<span style={{ color: t.green }}>Scanner</span></span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {stage !== "hero" && (
              <button onClick={reset} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 16px", color: t.textPrimary, cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'Outfit', sans-serif", boxShadow: t.shadow }}>
                ← Nieuwe scan
              </button>
            )}
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Licht thema" : "Donker thema"}
              style={{ width: 38, height: 38, borderRadius: 10, background: t.bgCard, border: `1px solid ${t.border}`, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.shadow, transition: "all 0.2s" }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* ═══ HERO ═══ */}
        {stage === "hero" && (
          <div style={{ animation: "float-up 0.8s ease-out" }}>

            {/* Hero tekst */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: t.green, textTransform: "uppercase", marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>
                AI-Powered Taxatie
              </div>
              <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 16px", letterSpacing: -1.5, color: t.textPrimary }}>
                Ontdek de verborgen<br />
                <span style={{ background: "linear-gradient(135deg,#22c55e,#4ade80,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  waarde op je zolder
                </span>
              </h1>
              <p style={{ fontSize: 16, color: t.textSecondary, maxWidth: 480, margin: "0 auto", lineHeight: 1.6, fontWeight: 300 }}>
                Kies een categorie, upload tot 4 foto&apos;s en laat de AI taxeren en advertenties schrijven.
              </p>
            </div>

            {/* Scan teller banner */}
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: t.shadow, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {[1,2,3].map((i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i <= 2 ? t.green : t.border }} />
                  ))}
                </div>
                <span style={{ fontSize: 13, color: t.textSecondary, fontFamily: "'DM Mono', monospace" }}>
                  <strong style={{ color: t.textPrimary }}>2 van 3</strong> gratis scans gebruikt
                </span>
              </div>
              <button style={{ background: t.gradient, border: "none", borderRadius: 8, padding: "6px 14px", color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: "0 2px 8px rgba(34,197,94,0.2)" }}>
                ⚡ Upgrade naar Pro — €0,79/mnd
              </button>
            </div>

            {/* AI Vision badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: t.greenBg, border: `1px solid ${t.greenBorder}`, borderRadius: 100, padding: "8px 20px" }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: t.green, display: "inline-block", animation: "live-pulse 1.8s ease-in-out infinite" }} />
                <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, color: t.greenText, textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
                  AI Vision Actief
                </span>
              </div>
            </div>

            {/* Stap 1: Categorie */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, color: t.textMuted, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 14 }}>
                Stap 1 — Kies een categorie
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {CATEGORIES.map((cat) => {
                  const selected = category === cat.id;
                  return (
                    <button key={cat.id} onClick={() => setCategory(cat.id)} style={{
                      padding: "16px 12px", borderRadius: 14,
                      background: selected ? t.greenBg : t.bgCard,
                      border: `1px solid ${selected ? t.greenBorder : t.border}`,
                      color: selected ? t.greenText : t.textSecondary,
                      cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                      fontWeight: 600, fontSize: 13, transition: "all 0.2s",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                      boxShadow: selected ? `0 0 0 2px ${t.greenBorder}` : t.shadow,
                    }}>
                      <span style={{ fontSize: 26 }}>{cat.icon}</span>
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stap 2: Foto's */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, color: t.textMuted, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 14 }}>
                Stap 2 — Upload foto&apos;s (max 4)
              </div>

              {previews.length > 0 && (
                <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                  {previews.map((src, i) => (
                    <div key={i} style={{ position: "relative", width: 80, height: 80 }}>
                      <img src={src} alt={`foto ${i+1}`} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: `1px solid ${t.border}` }} />
                      <button onClick={() => removeFile(i)} style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#ef4444", border: "none", color: "#fff", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✕</button>
                    </div>
                  ))}
                  {files.length < 4 && (
                    <button onClick={() => fileRef.current?.click()} style={{ width: 80, height: 80, borderRadius: 10, border: `2px dashed ${t.greenBorder}`, background: t.greenBg, color: t.green, fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  )}
                </div>
              )}

              {files.length === 0 && (
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = t.green; }}
                  onDragLeave={(e) => { e.currentTarget.style.borderColor = t.greenBorder; }}
                  onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = t.greenBorder; addFiles(e.dataTransfer.files); }}
                  style={{ border: `2px dashed ${t.greenBorder}`, borderRadius: 16, padding: "40px 32px", cursor: "pointer", background: t.greenBg, textAlign: "center", transition: "all 0.3s" }}
                >
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📸</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: t.textPrimary }}>Sleep foto&apos;s hierheen of klik</div>
                  <div style={{ fontSize: 13, color: t.textMuted }}>Meerdere foto&apos;s geven betere resultaten — max 4</div>
                </div>
              )}

              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => addFiles(e.target.files)} />
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 18px", marginBottom: 20, fontSize: 13, color: "#dc2626", fontFamily: "'DM Mono', monospace" }}>
                ⚠️ {error}
              </div>
            )}

            {/* Scan knop */}
            <button
              onClick={() => canScan && handleScan(files, category!)}
              disabled={!canScan}
              style={{ width: "100%", padding: "16px 0", borderRadius: 16, background: canScan ? t.gradient : t.bgCard, border: `1px solid ${canScan ? "transparent" : t.border}`, color: canScan ? "#fff" : t.textMuted, fontWeight: 700, fontSize: 16, cursor: canScan ? "pointer" : "not-allowed", fontFamily: "'Outfit', sans-serif", boxShadow: canScan ? "0 4px 24px rgba(34,197,94,0.25)" : "none", transition: "all 0.3s" }}
            >
              {!category && files.length === 0 ? "Kies een categorie en upload foto's" :
               !category        ? "Kies nog een categorie" :
               files.length === 0 ? "Upload minimaal 1 foto" :
               `🔍 Scan starten — ${files.length} foto${files.length > 1 ? "'s" : ""} · ${selectedCat?.label}`}
            </button>
          </div>
        )}

        {/* ═══ SCANNING ═══ */}
        {stage === "scanning" && (
          <div style={{ textAlign: "center", animation: "float-up 0.5s ease-out" }}>
            <div style={{ maxWidth: 480, margin: "0 auto 32px", borderRadius: 20, overflow: "hidden", position: "relative", border: `1px solid ${t.greenBorder}`, animation: "glow 2s ease-in-out infinite" }}>
              {previews[0] && (
                <img src={previews[0]} alt="Upload" style={{ width: "100%", maxHeight: 340, objectFit: "cover", display: "block", filter: isDark ? "brightness(0.7)" : "brightness(0.85)" }} />
              )}
              <ScanParticles active={true} />
              {previews.length > 1 && (
                <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.55)", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#86efac" }}>
                  +{previews.length - 1} foto{previews.length > 2 ? "'s" : ""}
                </div>
              )}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: t.green, textTransform: "uppercase", marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>
              {isRefining ? "Verfijning verwerken..." : "AI Vision bezig..."}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: t.textPrimary }}>Objecten worden herkend & getaxeerd</div>
            <div style={{ fontSize: 14, color: t.textMuted, marginBottom: 24 }}>
              Categorie: {selectedCat?.icon} {selectedCat?.label}
            </div>
            <div style={{ maxWidth: 400, margin: "0 auto", height: 6, borderRadius: 3, background: t.border, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#22c55e,#4ade80)", width: `${Math.min(scanProgress, 100)}%`, transition: "width 0.3s ease-out", boxShadow: "0 0 12px rgba(34,197,94,0.4)" }} />
            </div>
            <div style={{ marginTop: 10, fontSize: 14, color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>
              {Math.round(Math.min(scanProgress, 100))}%
            </div>
          </div>
        )}

        {/* ═══ RESULTS ═══ */}
        {stage === "results" && (
          <div style={{ animation: "float-up 0.5s ease-out" }}>

            {/* Totaalwaarde banner */}
            <div style={{ background: t.greenBg, border: `1px solid ${t.greenBorder}`, borderRadius: 20, padding: "28px 24px", marginBottom: 28, textAlign: "center", animation: "count-up 0.8s ease-out" }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: t.greenText, textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>
                Geschatte totaalwaarde
              </div>
              <div style={{ fontSize: "clamp(36px,7vw,58px)", fontWeight: 800, letterSpacing: -2, background: "linear-gradient(135deg,#22c55e,#4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                €{totalValue}
              </div>
              <div style={{ fontSize: 13, color: t.textMuted, marginTop: 6 }}>
                {results.length} object{results.length !== 1 ? "en" : ""} · {selectedCat?.icon} {selectedCat?.label}
              </div>
            </div>

            {/* Thumbnails */}
            {previews.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginBottom: 24, justifyContent: "center" }}>
                {previews.map((src, i) => (
                  <img key={i} src={src} alt={`scan ${i+1}`} style={{ height: 64, width: 64, objectFit: "cover", borderRadius: 10, border: `1px solid ${t.border}` }} />
                ))}
              </div>
            )}

            {/* Result cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,380px),1fr))", gap: 16, marginBottom: 32 }}>
              {results.map((item, i) => (
                <ResultCard key={i} item={item} index={i} theme={buildTheme(isDark)} category={category ?? "overig"} />
              ))}
            </div>

            {/* Verfijn scan */}
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: t.shadow }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, color: t.textMuted, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>
                💬 Verfijn de scan
              </div>
              <p style={{ fontSize: 14, color: t.textSecondary, marginBottom: 14 }}>
                Heeft de AI iets gemist? Voeg extra informatie toe en scan opnieuw.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  value={refinement}
                  onChange={(e) => setRefinement(e.target.value)}
                  placeholder="Bijv: olieverf op doek, gesigneerd rechtsonder..."
                  onKeyDown={(e) => e.key === "Enter" && handleVerfijn()}
                  style={{ flex: 1, background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 16px", color: t.textPrimary, fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none" }}
                />
                <button
                  onClick={handleVerfijn}
                  disabled={!refinement.trim() || isRefining}
                  style={{ padding: "12px 20px", borderRadius: 12, background: refinement.trim() ? t.gradient : t.bgInput, border: `1px solid ${t.border}`, color: refinement.trim() ? "#fff" : t.textMuted, fontWeight: 600, fontSize: 14, cursor: refinement.trim() ? "pointer" : "not-allowed", fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap" }}
                >
                  {isRefining ? "⏳ Bezig..." : "🔍 Opnieuw scannen"}
                </button>
              </div>
            </div>

            {/* CTA knoppen */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => navigator.clipboard?.writeText(results.map((r) => `${r.object_naam} – €${r.geschatte_prijs}\n${r.advertentie_tekst}`).join("\n\n---\n\n"))}
                style={{ padding: "14px 28px", borderRadius: 14, background: t.gradient, border: "none", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: "0 4px 24px rgba(34,197,94,0.25)" }}
              >
                📋 Kopieer alle advertenties
              </button>
              <button onClick={reset} style={{ padding: "14px 28px", borderRadius: 14, background: t.bgCard, border: `1px solid ${t.border}`, color: t.textPrimary, fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: t.shadow }}>
                📸 Scan nog een foto
              </button>
            </div>
          </div>
        )}

        {/* ═══ PRIJZEN ═══ */}
        <div style={{ marginTop: 80, marginBottom: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: t.green, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>
              Abonnement
            </div>
            <h2 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: t.textPrimary, margin: 0, letterSpacing: -0.5 }}>
              Kies je plan
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>

            {/* Gratis */}
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 20, padding: 28, boxShadow: t.shadow }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>Gratis</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: t.textPrimary, marginBottom: 4 }}>€0</div>
              <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 24 }}>Voor altijd gratis</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {[
                  { ok: true,  tekst: "3 scans per maand" },
                  { ok: true,  tekst: "1 foto per scan" },
                  { ok: true,  tekst: "Alle 6 categorieën" },
                  { ok: false, tekst: "Meerdere foto's" },
                  { ok: false, tekst: "Verfijn-functie" },
                  { ok: false, tekst: "Onbeperkt scans" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: r.ok ? t.textSecondary : t.textMuted }}>
                    <span style={{ fontSize: 16 }}>{r.ok ? "✅" : "❌"}</span>
                    {r.tekst}
                  </div>
                ))}
              </div>
              <button disabled style={{ width: "100%", padding: "12px 0", borderRadius: 12, background: t.bgInput, border: `1px solid ${t.border}`, color: t.textMuted, fontWeight: 600, fontSize: 14, cursor: "default", fontFamily: "'Outfit', sans-serif" }}>
                Huidig plan
              </button>
            </div>

            {/* Pro */}
            <div style={{ background: t.bgCard, border: `2px solid ${t.green}`, borderRadius: 20, padding: 28, position: "relative", boxShadow: `0 4px 24px rgba(34,197,94,0.12)` }}>
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: t.gradient, borderRadius: 100, padding: "4px 16px", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 1, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>
                ⚡ Aanbevolen
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.green, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>Pro</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: t.textPrimary }}>€0,79</span>
                <span style={{ fontSize: 14, color: t.textMuted }}>/maand</span>
              </div>
              <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 24 }}>Opzegbaar per maand</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {[
                  "Onbeperkt scans",
                  "Tot 4 foto's per scan",
                  "Alle 6 categorieën",
                  "Verfijn-functie",
                  "Alle verkoopplatforms",
                  "Nieuwe functies als eerste",
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: t.textSecondary }}>
                    <span style={{ fontSize: 16 }}>✅</span>
                    {r}
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", padding: "12px 0", borderRadius: 12, background: t.gradient, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: "0 4px 16px rgba(34,197,94,0.25)" }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.9")}
                onMouseOut={(e)  => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                Start Pro voor €0,79/maand
              </button>
              <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: t.textMuted }}>
                Geen verplichtingen · Direct opzegbaar
              </div>
            </div>

          </div>
        </div>

        <footer style={{ textAlign: "center", paddingBottom: 32, fontSize: 12, color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>
          ZolderScanner · Gemaakt met AI
        </footer>
      </div>
    </div>
  );
}
