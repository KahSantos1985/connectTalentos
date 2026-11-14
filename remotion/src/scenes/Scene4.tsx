import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { display, body, mono, colors } from "../theme";

const CODE_LINES = [
  "const channel = supabase",
  "  .channel('tracking')",
  "  .on('postgres_changes', {",
  "    event: '*',",
  "    schema: 'public',",
  "    table: 'localizacoes_prestador',",
  "    filter: `solicitacao_id=eq.${id}`",
  "  }, ({ new: loc }) => setPos(loc))",
  "  .subscribe();",
];

const STACK = ["Capacitor", "React", "Supabase Realtime", "PostgreSQL", "React-Leaflet", "OpenStreetMap"];

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22 } });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", padding: 80, gap: 60, alignItems: "center" }}>
      {/* Code panel */}
      <div
        style={{
          flex: 1.2,
          background: "#070b16",
          border: `1px solid ${colors.primary}44`,
          borderRadius: 20,
          padding: 36,
          fontFamily: mono,
          fontSize: 22,
          lineHeight: 1.6,
          opacity: enter,
          transform: `translateX(${interpolate(enter, [0, 1], [-60, 0])}px)`,
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${colors.primary}22`,
        }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5f57" }} />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#febc2e" }} />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28c840" }} />
          <span style={{ marginLeft: 12, color: colors.muted, fontSize: 16 }}>useProviderLocation.ts</span>
        </div>
        {CODE_LINES.map((line, i) => {
          const op = interpolate(frame, [30 + i * 12, 50 + i * 12], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ opacity: op, color: line.includes("supabase") || line.includes("channel") ? colors.primaryGlow : line.includes("'") ? colors.accent : colors.text }}>
              <span style={{ color: colors.muted, marginRight: 16 }}>{String(i + 1).padStart(2, "0")}</span>
              {line}
            </div>
          );
        })}
      </div>

      {/* Stack labels */}
      <div style={{ flex: 0.8 }}>
        <div style={{ fontFamily: body, color: colors.accent, fontSize: 22, letterSpacing: 4, marginBottom: 16, textTransform: "uppercase" }}>
          A engenharia
        </div>
        <div style={{ fontFamily: display, color: colors.text, fontSize: 60, fontWeight: 800, lineHeight: 1, marginBottom: 36 }}>
          Stack precisa.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {STACK.map((s, i) => {
            const e = spring({ frame: frame - 60 - i * 14, fps, config: { damping: 18 } });
            return (
              <div
                key={s}
                style={{
                  background: `${colors.primary}1a`,
                  border: `1px solid ${colors.primary}66`,
                  color: colors.primaryGlow,
                  padding: "12px 20px",
                  borderRadius: 999,
                  fontFamily: body,
                  fontSize: 22,
                  fontWeight: 500,
                  opacity: e,
                  transform: `scale(${interpolate(e, [0, 1], [0.6, 1])})`,
                }}
              >
                {s}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
