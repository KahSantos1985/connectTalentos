import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { display, body, mono, colors } from "../theme";

// Cena 5 — upsert + RLS
export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22 } });

  // Single row updating: lat/lng change
  const upsertTick = Math.floor(frame / 30);
  const lat = (-12.9714 + Math.sin(upsertTick) * 0.001).toFixed(5);
  const lng = (-38.5014 + Math.cos(upsertTick) * 0.001).toFixed(5);
  const flash = interpolate(frame % 30, [0, 8, 30], [0.4, 1, 0.4]);

  const lockOp = spring({ frame: frame - 120, fps, config: { damping: 20 } });

  return (
    <div style={{ width: "100%", height: "100%", padding: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ opacity: enter, marginBottom: 40 }}>
        <div style={{ fontFamily: body, color: colors.accent, fontSize: 22, letterSpacing: 4, marginBottom: 16, textTransform: "uppercase" }}>
          Eficiência + Segurança
        </div>
        <div style={{ fontFamily: display, color: colors.text, fontSize: 68, fontWeight: 800, lineHeight: 1 }}>
          Uma linha. Atualizada. Protegida.
        </div>
      </div>

      <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
        {/* Table */}
        <div style={{ flex: 1.3, background: "#070b16", border: `1px solid ${colors.primary}55`, borderRadius: 20, padding: 28, fontFamily: mono, opacity: enter, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ color: colors.muted, fontSize: 18, marginBottom: 16, fontFamily: body }}>
            <span style={{ color: colors.primaryGlow }}>localizacoes_prestador</span> — UPSERT por solicitacao_id
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 0, fontSize: 18, color: colors.muted, paddingBottom: 12, borderBottom: `1px solid ${colors.primary}33` }}>
            <div>solicitacao_id</div><div>latitude</div><div>longitude</div><div>updated_at</div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: 0,
              fontSize: 22,
              color: colors.text,
              padding: "20px 0",
              background: `linear-gradient(90deg, ${colors.primary}${Math.round(flash * 40).toString(16).padStart(2,"0")} 0%, transparent 100%)`,
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            <div style={{ color: colors.accent }}>req_4287</div>
            <div>{lat}</div>
            <div>{lng}</div>
            <div style={{ color: colors.green }}>now()</div>
          </div>
          <div style={{ marginTop: 16, color: colors.muted, fontSize: 16, fontFamily: body }}>
            Sem histórico pesado · cliente só precisa do último ponto
          </div>
        </div>

        {/* RLS Lock */}
        <div style={{ flex: 1, background: `linear-gradient(160deg, ${colors.surface}, #0a1326)`, border: `1px solid ${colors.green}66`, borderRadius: 20, padding: 32, opacity: lockOp, transform: `scale(${interpolate(lockOp, [0, 1], [0.9, 1])})` }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🔒</div>
          <div style={{ fontFamily: display, color: colors.green, fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
            Row-Level Security
          </div>
          <div style={{ fontFamily: mono, color: colors.text, fontSize: 18, lineHeight: 1.6, background: "#070b16", padding: 16, borderRadius: 8 }}>
            <div><span style={{ color: colors.primaryGlow }}>CREATE POLICY</span> "prestador_writes_own"</div>
            <div>  ON localizacoes_prestador</div>
            <div>  FOR INSERT TO authenticated</div>
            <div>  USING (auth.uid() = prestador_id);</div>
          </div>
          <div style={{ fontFamily: body, color: colors.muted, fontSize: 18, marginTop: 16, lineHeight: 1.4 }}>
            Postgres recusa qualquer acesso indevido — direto no banco.
          </div>
        </div>
      </div>
    </div>
  );
};
