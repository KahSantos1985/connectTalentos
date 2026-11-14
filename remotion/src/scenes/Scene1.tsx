import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { display, body, colors } from "../theme";

// Cena 1 — 10s — cliente em dúvida
export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const sub = spring({ frame: frame - 30, fps, config: { damping: 18 } });
  const phoneY = interpolate(spring({ frame, fps, config: { damping: 20 } }), [0, 1], [80, 0]);
  const tick = Math.floor(frame / 30) % 4;
  const dots = ".".repeat(tick);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: 80 }}>
      {/* Phone mockup */}
      <div
        style={{
          width: 380,
          height: 760,
          borderRadius: 48,
          background: "linear-gradient(180deg, #1a1f2e, #0d1220)",
          border: "8px solid #2a3142",
          padding: 28,
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
          transform: `translateY(${phoneY}px)`,
          opacity: op,
          marginRight: 80,
        }}
      >
        <div style={{ color: colors.muted, fontSize: 18, fontFamily: body, marginBottom: 24 }}>
          Solicitação #4287
        </div>
        <div style={{ color: colors.text, fontSize: 32, fontWeight: 700, fontFamily: display, marginBottom: 16 }}>
          Eletricista
        </div>
        <div style={{ color: colors.green, fontSize: 20, fontFamily: body, marginBottom: 40 }}>
          ● Aprovado
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ color: colors.muted, fontSize: 16, fontFamily: body }}>Status</div>
          <div style={{ color: colors.warm, fontSize: 28, fontFamily: display, fontWeight: 600, marginTop: 8 }}>
            A caminho{dots}
          </div>
        </div>
        <div style={{ color: colors.muted, fontSize: 18, fontFamily: body, lineHeight: 1.5 }}>
          Sem previsão de chegada
        </div>
      </div>

      {/* Right side text */}
      <div style={{ maxWidth: 700, opacity: sub }}>
        <div style={{ fontFamily: body, color: colors.warm, fontSize: 22, letterSpacing: 4, marginBottom: 20, textTransform: "uppercase" }}>
          O problema
        </div>
        <div style={{ fontFamily: display, color: colors.text, fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginBottom: 32 }}>
          Ele já saiu?<br />
          Está chegando?
        </div>
        <div style={{ fontFamily: body, color: colors.muted, fontSize: 28, lineHeight: 1.4 }}>
          Antes do GPS, a única resposta era ligar e perguntar.
        </div>
      </div>
    </div>
  );
};
