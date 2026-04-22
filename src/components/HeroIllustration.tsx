"use client";

export default function HeroIllustration({ isDark }: { isDark: boolean }) {
  const lineColor  = isDark ? "#334155" : "#e2e8f0";
  const floorColor = isDark ? "#1e293b" : "#f1f5f9";

  return (
    <svg viewBox="0 0 280 360" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 280 }}>

      {/* Attic ceiling beams */}
      <line x1="0"   y1="58" x2="140" y2="22" stroke={lineColor} strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1="280" y1="58" x2="140" y2="22" stroke={lineColor} strokeWidth="1.5" strokeDasharray="5 4"/>

      {/* Floor */}
      <rect x="0" y="333" width="280" height="27" fill={floorColor}/>
      <line x1="0" y1="333" x2="280" y2="333" stroke={lineColor} strokeWidth="1.5"/>

      {/* ── LEFT: Box stack ── */}
      {/* Big bottom box */}
      <rect x="6" y="272" width="90" height="61" rx="4" fill="#D97706"/>
      <rect x="6" y="272" width="90" height="61" rx="4" stroke="#B45309" strokeWidth="1.5"/>
      <line x1="6"  y1="302" x2="96"  y2="302" stroke="#B45309" strokeWidth="1.2"/>
      <line x1="51" y1="272" x2="51"  y2="333" stroke="#B45309" strokeWidth="1.2"/>

      {/* Middle box */}
      <rect x="16" y="237" width="70" height="36" rx="3" fill="#F59E0B"/>
      <rect x="16" y="237" width="70" height="36" rx="3" stroke="#D97706" strokeWidth="1.5"/>
      <line x1="51" y1="237" x2="51" y2="273" stroke="#D97706" strokeWidth="1.2"/>

      {/* Small open-top box */}
      <rect x="24" y="216" width="54" height="22" rx="2" fill="#D97706"/>
      <rect x="24" y="216" width="54" height="22" rx="2" stroke="#B45309" strokeWidth="1.2"/>
      <path d="M24 216 L19 204 L51 204 L51 216" fill="#F59E0B" stroke="#D97706" strokeWidth="1"/>
      <path d="M78 216 L83 204 L51 204 L51 216" fill="#FBBF24" stroke="#D97706" strokeWidth="1"/>

      {/* ── LEFT: Old lamp ── */}
      <rect x="104" y="258" width="6" height="76" rx="3" fill="#94a3b8"/>
      <rect x="98"  y="328" width="18" height="7" rx="3" fill="#64748b"/>
      <path d="M86 258 L104 276 L116 276 L124 258 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5"/>
      <ellipse cx="107" cy="278" rx="13" ry="4" fill="#FDE68A" opacity="0.35"/>

      {/* ── RIGHT: Leaning picture frame ── */}
      <g transform="rotate(-7, 218, 222)">
        <rect x="190" y="178" width="54" height="74" rx="3" fill="#92400E"/>
        <rect x="194" y="182" width="46" height="66" rx="1" fill="#FEF3C7"/>
        <rect x="194" y="216" width="46" height="32" fill="#86EFAC"/>
        <ellipse cx="217" cy="200" rx="10" ry="10" fill="#FCD34D"/>
        <path d="M194 226 Q208 214 217 222 Q226 214 240 226" fill="#4ADE80"/>
      </g>

      {/* Small crate */}
      <rect x="198" y="247" width="50" height="26" rx="3" fill="#D97706"/>
      <rect x="198" y="247" width="50" height="26" rx="3" stroke="#B45309" strokeWidth="1"/>
      <line x1="214" y1="247" x2="214" y2="273" stroke="#B45309" strokeWidth="1"/>
      <line x1="230" y1="247" x2="230" y2="273" stroke="#B45309" strokeWidth="1"/>
      <line x1="198" y1="260" x2="248" y2="260" stroke="#B45309" strokeWidth="1"/>

      {/* Vintage suitcase */}
      <rect x="184" y="271" width="84" height="62" rx="8" fill="#1D4ED8"/>
      <rect x="184" y="271" width="84" height="62" rx="8" stroke="#1E40AF" strokeWidth="1.5"/>
      <path d="M216 271 Q226 258 238 271" stroke="#93C5FD" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <line x1="184" y1="302" x2="268" y2="302" stroke="#1E40AF" strokeWidth="1.5"/>
      <rect x="218" y="296" width="16" height="10" rx="2" fill="#93C5FD"/>
      <rect x="184" y="271" width="9" height="9" rx="4" fill="#3B82F6"/>
      <rect x="259" y="271" width="9" height="9" rx="4" fill="#3B82F6"/>
      <rect x="184" y="324" width="9" height="9" rx="4" fill="#3B82F6"/>
      <rect x="259" y="324" width="9" height="9" rx="4" fill="#3B82F6"/>

      {/* ── PERSON ── */}
      {/* Shoes */}
      <ellipse cx="129" cy="331" rx="14" ry="5" fill="#1e293b"/>
      <ellipse cx="152" cy="331" rx="14" ry="5" fill="#1e293b"/>

      {/* Legs */}
      <rect x="121" y="290" width="15" height="43" rx="5" fill="#475569"/>
      <rect x="143" y="290" width="15" height="43" rx="5" fill="#475569"/>

      {/* Body – green shirt */}
      <rect x="113" y="224" width="54" height="70" rx="13" fill="#16a34a"/>
      <rect x="118" y="232" width="14" height="11" rx="2" fill="#15803d" opacity="0.45"/>

      {/* Right arm – relaxed down */}
      <path d="M167 240 Q182 252 178 272 Q176 282 170 284"
            stroke="#FBBF80" strokeWidth="13" strokeLinecap="round" fill="none"/>

      {/* Left arm – raised to hold phone */}
      <path d="M113 240 Q96 228 89 208 Q83 188 87 170"
            stroke="#FBBF80" strokeWidth="13" strokeLinecap="round" fill="none"/>

      {/* Phone */}
      <rect x="70" y="138" width="32" height="50" rx="5" fill="#0f172a"/>
      <rect x="73" y="141" width="26" height="44" rx="3" fill="#22c55e" opacity="0.88"/>
      {/* Viewfinder grid */}
      <line x1="73" y1="155" x2="99" y2="155" stroke="#15803d" strokeWidth="0.8" opacity="0.6"/>
      <line x1="73" y1="169" x2="99" y2="169" stroke="#15803d" strokeWidth="0.8" opacity="0.6"/>
      <line x1="82" y1="141" x2="82" y2="185" stroke="#15803d" strokeWidth="0.8" opacity="0.6"/>
      <line x1="90" y1="141" x2="90" y2="185" stroke="#15803d" strokeWidth="0.8" opacity="0.6"/>
      {/* Shutter button */}
      <circle cx="86" cy="184" r="4" fill="#0f172a" opacity="0.45"/>

      {/* Flash burst */}
      <circle cx="70" cy="141" r="6" fill="#FDE68A" opacity="0.9"/>
      <line x1="70" y1="130" x2="70" y2="125" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="78" y1="133" x2="82" y2="129" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="62" y1="133" x2="58" y2="129" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="63" y1="141" x2="58" y2="141" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round"/>

      {/* Neck */}
      <rect x="131" y="212" width="18" height="14" rx="5" fill="#FBBF80"/>

      {/* Head */}
      <circle cx="140" cy="190" r="28" fill="#FBBF80"/>

      {/* Hair */}
      <path d="M113 186 Q115 160 140 158 Q165 156 167 178 Q160 163 140 163 Q120 163 113 186 Z" fill="#1e293b"/>
      <path d="M114 176 Q110 188 115 198" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none"/>

      {/* Eyes */}
      <circle cx="132" cy="189" r="4.5" fill="#1e293b"/>
      <circle cx="148" cy="189" r="4.5" fill="#1e293b"/>
      <circle cx="134" cy="187" r="1.8" fill="white"/>
      <circle cx="150" cy="187" r="1.8" fill="white"/>

      {/* Eyebrows – raised (excited) */}
      <path d="M127 182 Q132 179 137 181" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M143 181 Q148 178 153 181" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" fill="none"/>

      {/* Smile */}
      <path d="M131 199 Q140 208 149 199" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" fill="none"/>

      {/* Blush */}
      <ellipse cx="125" cy="198" rx="8" ry="4.5" fill="#FCA5A5" opacity="0.45"/>
      <ellipse cx="155" cy="198" rx="8" ry="4.5" fill="#FCA5A5" opacity="0.45"/>

      {/* ── Dust motes ── */}
      <circle cx="158" cy="148" r="2.2" fill="#D97706" opacity="0.55"/>
      <circle cx="172" cy="165" r="1.5" fill="#94a3b8" opacity="0.45"/>
      <circle cx="58"  cy="198" r="2"   fill="#94a3b8" opacity="0.4"/>
      <circle cx="44"  cy="252" r="1.5" fill="#D97706" opacity="0.45"/>
      <circle cx="252" cy="182" r="2"   fill="#94a3b8" opacity="0.38"/>
      <circle cx="272" cy="238" r="1.5" fill="#94a3b8" opacity="0.3"/>

      {/* Sparkle stars */}
      <path d="M164 128 L165.5 124 L167 128 L171 129.5 L167 131 L165.5 135 L164 131 L160 129.5 Z"
            fill="#FDE68A" opacity="0.85"/>
      <path d="M50 172 L51 170 L52 172 L54 173 L52 174 L51 176 L50 174 L48 173 Z"
            fill="#86EFAC" opacity="0.7"/>
      <path d="M240 148 L241 146 L242 148 L244 149 L242 150 L241 152 L240 150 L238 149 Z"
            fill="#FDE68A" opacity="0.6"/>
    </svg>
  );
}
