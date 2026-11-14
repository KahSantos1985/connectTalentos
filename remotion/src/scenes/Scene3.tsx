import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { display, body, colors } from "../theme";

const STEPS = [
  { n: "01", t: "Aceitar", d: "Prestador aceita o serviço" },
  { n: "02", t: "Ativar", d: "Liga a chave 'Compartilhar localização'" },
  { n: "03", t: "Permitir", d: "Autoriza o GPS uma vez" },
  { n: "04", t: "Transmitir", d: "Envia posição a cada 10 segundos" },
  { n: "05", t: "Acompanhar", d: "Cliente vê o mapa atualizar sozinho" },
];

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleOp = spring({ frame, fps, config: { damping: 22 } });

  return (
    <div style={{ width: "100%", height: "100%", padding: "80px 100px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ opacity: titleOp, marginBottom: 60 }}>
        <div style={{ fontFamily: body, color: colors.accent, fontSize: 22, letterSpacing: 4, marginBottom: 16, textTransform: "uppercase" }}>
          Como funciona
        </div>
        <div style={{ fontFamily: display, color: colors.text, fontSize: 84, fontWeight: 800, lineHeight: 1 }}>
          Em apenas 5 passos.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24 }}>
        {STEPS.map((s, i) => {
          const enter = spring({ frame: frame - 30 - i * 18, fps, config: { damping: 20 } });
          return (
            <div
              key={s.n}
              style={{
                background: `linear-gradient(160deg, ${colors.surface}, #0a1326)`,
                border: `1px solid ${colors.primary}33`,
                borderRadius: 20,
                padding: 28,
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
                boxShadow: `0 20px 40px rgba(0,0,0,0.4)`,
              }}
            >
              <div style={{ fontFamily: display, color: colors.primary, fontSize: 56, fontWeight: 800, marginBottom: 12 }}>
                {s.n}
              </div>
              <div style={{ fontFamily: display, color: colors.text, fontSize: 28, fontWeight: 700, marginBottom: 10 }}>
                {s.t}
              </div>
              <div style={{ fontFamily: body, color: colors.muted, fontSize: 18, lineHeight: 1.4 }}>
                {s.d}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 60, opacity: spring({ frame: frame - 200, fps, config: { damping: 20 } }), fontFamily: body, color: colors.text, fontSize: 28, textAlign: "center" }}>
        Confiança · Menos ligações · Profissionalismo
      </div>
    </div>
  );
};
