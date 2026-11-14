import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { PersistentBackground } from "./components/PersistentBackground";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";
import { Scene7 } from "./scenes/Scene7";

const D = [300, 360, 420, 360, 360, 360, 240]; // frames per scene
const TRANSITION = 18;
// Total: sum(D) - 6*TRANSITION
export const TOTAL_FRAMES = D.reduce((a, b) => a + b, 0) - 6 * TRANSITION;

const scenes = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7];

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0f1c" }}>
      <PersistentBackground />
      <AbsoluteFill>
        <TransitionSeries>
          {scenes.map((Scene, i) => {
            const items = [] as JSX.Element[];
            items.push(
              <TransitionSeries.Sequence key={`s${i}`} durationInFrames={D[i]}>
                <Scene />
              </TransitionSeries.Sequence>
            );
            if (i < scenes.length - 1) {
              items.push(
                <TransitionSeries.Transition
                  key={`t${i}`}
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: TRANSITION })}
                />
              );
            }
            return items;
          })}
        </TransitionSeries>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
