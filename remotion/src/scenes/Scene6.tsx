import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { display, body, mono, colors } from "../theme";

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22 } });

  // battery fill stable around 85%
  const battery = 88 + Math.sin(frame / 30) * 1.5;
  const ticks = Math.min(8, Math.floor(frame / 30));

  return (
    <div style={{ width: "100%", height: "100%", padding: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ opacity: enter, marginBottom: 50 }}>
        <div style={{ fontFamily: body, color: colors.accent, fontSize: 22, letterSpacing: 4, marginBottom: 16, textTransform: "uppercase" }}>
          Equilíbrio
        </div>
        <div style={{ fontFamily: display, color: colors.text, fontSize: 68, fontWeight: 800, lineHeight: 1 }}>
          10 segundos. Bateria salva.
        </div>
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        {/* Battery card */}
        <div style={{ flex: 1, background: `linear-gradient(160deg, ${colors.surface}, #0a1326)`, border: `1px solid ${colors.green}55`, borderRadius: 20, padding: 32, opacity: enter }}>
          <div style={{ fontFamily: body, color: colors.muted, fontSize: 20, marginBottom: 16 }}>Bateria do prestador</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", width: 220, height: 80, border: `4px solid ${colors.green}`, borderRadius: 12 }}>
              <div style={{ position: "absolute", inset: 6, background: colors.green, width: `${battery - 4}%`, borderRadius: 6, boxShadow: `0 0 30px ${colors.green}88` }} />
            </div>
            <div style={{ width: 12, height: 36, background: colors.green, borderRadius: 4 }} />
            <div style={{ fontFamily: display, color: colors.green, fontSize: 56, fontWeight: 800 }}>{battery.toFixed(0)}%</div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 32 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 12, background: i < ticks ? colors.primary : colors.surface, borderRadius: 4, transition: "none" }} />
            ))}
          </div>
          <div style={{ fontFamily: body, color: colors.muted, fontSize: 18, marginTop: 12 }}>
            Envio a cada 10s — consumo tolerável de GPS
          </div>
        </div>

        {/* Haversine */}
        <div style={{ flex: 1.2, background: "#070b16", border: `1px solid ${colors.primary}55`, borderRadius: 20, padding: 32, opacity: enter }}>
          <div style={{ fontFamily: body, color: colors.muted, fontSize: 20, marginBottom: 12 }}>Cálculo local — sem chamadas de API</div>
          <div style={{ fontFamily: display, color: colors.primaryGlow, fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
            Fórmula de Haversine
          </div>
          <div style={{ fontFamily: mono, color: colors.accent, fontSize: 20, lineHeight: 1.7, background: "#000", padding: 20, borderRadius: 12 }}>
            <div>a = sin²(Δφ/2) + cos φ₁ · cos φ₂ · sin²(Δλ/2)</div>
            <div>c = 2 · atan2(√a, √(1−a))</div>
            <div style={{ color: colors.green }}>d = R · c</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <div>
              <div style={{ fontFamily: body, color: colors.muted, fontSize: 16 }}>Distância calculada</div>
              <div style={{ fontFamily: display, color: colors.text, fontSize: 40, fontWeight: 700 }}>
                {(1.2 - (frame / 360) * 0.8).toFixed(2)} km
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: body, color: colors.muted, fontSize: 16 }}>Custo de API</div>
              <div style={{ fontFamily: display, color: colors.green, fontSize: 40, fontWeight: 700 }}>R$ 0,00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
