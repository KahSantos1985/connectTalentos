import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors } from "../theme";

export const PersistentBackground: React.FC<{ warm?: boolean }> = ({ warm }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 80) * 30;
  const c = warm ? colors.bgWarm : colors.bg;
  return (
    <AbsoluteFill
      style={{
        background: warm
          ? `radial-gradient(circle at ${50 + drift}% 30%, #2a1a12 0%, ${c} 60%)`
          : `radial-gradient(circle at ${50 + drift}% 40%, #16213e 0%, ${c} 65%)`,
      }}
    >
      {/* subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
      {/* floating orbs */}
      {[0, 1, 2].map((i) => {
        const x = interpolate(frame, [0, 600], [i * 600, i * 600 + 150]);
        const y = 200 + i * 250 + Math.sin(frame / 60 + i) * 40;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 380,
              height: 380,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${i === 1 ? colors.accent : colors.primary}22 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
