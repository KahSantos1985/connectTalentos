import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { display, body, colors } from "../theme";

// Cena 2 — mapa em tempo real
export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22 } });

  // P moves toward C along a curved path
  const t = interpolate(frame, [30, 330], [0, 1], { extrapolateRight: "clamp" });
  // Path: start (100, 600) → end (820, 200)
  const px = interpolate(t, [0, 1], [120, 760]);
  const py = interpolate(t, [0, 1], [620, 240]) + Math.sin(t * Math.PI * 2) * 20;
  const distM = Math.round(interpolate(t, [0, 1], [2400, 80]));

  const pulse = 0.6 + Math.sin(frame / 8) * 0.4;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", padding: 80, gap: 60 }}>
      {/* Map card */}
      <div
        style={{
          width: 920,
          height: 760,
          borderRadius: 32,
          background: "#0f1729",
          border: `1px solid ${colors.primary}33`,
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${colors.primary}22`,
          padding: 24,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [60, 0])}px)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Map grid (streets) */}
        <svg width="100%" height="100%" viewBox="0 0 880 720" style={{ position: "absolute", inset: 24 }}>
          <defs>
            <pattern id="streets" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M0 40 L80 40 M40 0 L40 80" stroke="#1e2a44" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="880" height="720" fill="url(#streets)" />
          {/* avenues */}
          <path d="M0 200 Q 400 220, 880 180" stroke="#2a3a5c" strokeWidth="6" fill="none" />
          <path d="M0 500 Q 500 540, 880 480" stroke="#2a3a5c" strokeWidth="6" fill="none" />
          <path d="M300 0 Q 320 360, 280 720" stroke="#2a3a5c" strokeWidth="6" fill="none" />
          <path d="M650 0 Q 660 400, 700 720" stroke="#2a3a5c" strokeWidth="6" fill="none" />

          {/* trail */}
          <path d="M120 620 Q 400 500, 760 240" stroke={colors.primary} strokeWidth="4" strokeDasharray="8 8" fill="none" opacity="0.5" />

          {/* C marker */}
          <g transform="translate(760, 240)">
            <circle r={20 + pulse * 6} fill={colors.accent} opacity="0.2" />
            <circle r="18" fill={colors.accent} stroke="white" strokeWidth="3" />
            <text textAnchor="middle" y="6" fill="white" fontWeight="bold" fontSize="16" fontFamily={display}>C</text>
          </g>

          {/* P marker */}
          <g transform={`translate(${px}, ${py})`}>
            <circle r={24 + pulse * 8} fill={colors.primary} opacity="0.25" />
            <circle r="22" fill={colors.primary} stroke="white" strokeWidth="3" />
            <text textAnchor="middle" y="7" fill="white" fontWeight="bold" fontSize="18" fontFamily={display}>P</text>
          </g>
        </svg>

        {/* Online badge */}
        <div style={{ position: "absolute", top: 44, left: 44, background: "rgba(16,185,129,0.15)", border: `1px solid ${colors.green}`, color: colors.green, padding: "8px 16px", borderRadius: 999, fontFamily: body, fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: colors.green, opacity: pulse }} />
          Online
        </div>

        {/* Distance HUD */}
        <div style={{ position: "absolute", bottom: 44, left: 44, right: 44, background: "rgba(15,23,41,0.8)", backdropFilter: "blur(0)", border: `1px solid ${colors.primary}44`, borderRadius: 16, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: colors.muted, fontSize: 16, fontFamily: body }}>Distância</div>
            <div style={{ color: colors.text, fontSize: 36, fontFamily: display, fontWeight: 700 }}>
              {distM > 1000 ? `${(distM / 1000).toFixed(1)} km` : `${distM} m`}
            </div>
          </div>
          <div style={{ color: colors.primaryGlow, fontFamily: body, fontSize: 18 }}>● Atualizado agora</div>
        </div>
      </div>

      {/* Right text */}
      <div style={{ flex: 1, opacity: spring({ frame: frame - 40, fps, config: { damping: 20 } }) }}>
        <div style={{ fontFamily: body, color: colors.accent, fontSize: 22, letterSpacing: 4, marginBottom: 20, textTransform: "uppercase" }}>
          A solução
        </div>
        <div style={{ fontFamily: display, color: colors.text, fontSize: 72, fontWeight: 800, lineHeight: 1.05, marginBottom: 28 }}>
          Rastreamento<br />em tempo real
        </div>
        <div style={{ fontFamily: body, color: colors.muted, fontSize: 26, lineHeight: 1.5 }}>
          Igual a pedir um carro ou acompanhar uma entrega — o cliente vê o prestador chegando.
        </div>
      </div>
    </div>
  );
};
