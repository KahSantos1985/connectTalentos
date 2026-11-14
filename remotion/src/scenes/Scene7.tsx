import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { display, body, colors } from "../theme";

export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const tag = spring({ frame: frame - 30, fps, config: { damping: 22 } });
  const url = spring({ frame: frame - 60, fps, config: { damping: 20 } });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
      <div
        style={{
          fontFamily: display,
          color: colors.text,
          fontSize: 140,
          fontWeight: 800,
          lineHeight: 1,
          opacity: logo,
          transform: `scale(${interpolate(logo, [0, 1], [0.7, 1])})`,
          letterSpacing: -3,
        }}
      >
        <span style={{ color: colors.primaryGlow }}>projeto</span>
        <span style={{ color: colors.text }}>api</span>
      </div>
      <div
        style={{
          fontFamily: body,
          color: colors.muted,
          fontSize: 38,
          marginTop: 40,
          opacity: tag,
          maxWidth: 1100,
          lineHeight: 1.4,
        }}
      >
        Rastreamento funcional e seguro. Pouco código. Problemas reais resolvidos.
      </div>
      <div
        style={{
          marginTop: 60,
          opacity: url,
          fontFamily: body,
          color: colors.accent,
          fontSize: 32,
          letterSpacing: 6,
          padding: "16px 40px",
          border: `1px solid ${colors.accent}66`,
          borderRadius: 999,
        }}
      >
        projetoapi.com.br
      </div>
    </div>
  );
};
