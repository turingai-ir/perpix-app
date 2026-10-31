import { useRef } from "react";
import type Konva from "konva";
import { Stage } from "react-konva";
import { motion, useReducedMotion } from "motion/react";
import { useNeuralCanvasSize } from "../_hooks/use-neural-canvas-size";
import { useNeuralAnimation } from "../_hooks/use-neural-animation";
import { useAnimationVisibility } from "@/hooks/use-animation-visibility";
import { NeuralNetworkLayer } from "./neural-network-layer";
import styles from "../studio.module.css";

export function NeuralNetworkBackground() {
  const { containerRef, width, height } = useNeuralCanvasSize();
  const layerRef = useRef<Konva.Layer>(null);
  const reducedMotion = useReducedMotion();
  const active = useAnimationVisibility(containerRef);

  useNeuralAnimation(layerRef, width, height, active, reducedMotion);

  return (
    <div
      ref={containerRef}
      className={styles.networkBackground}
      aria-hidden="true"
      data-neural-network
      data-paused={!active || !!reducedMotion}
    >
      <motion.div
        className={styles.networkCamera}
        animate={
          reducedMotion
            ? undefined
            : {
                x: ["-1.2%", "1.2%", "-1.2%"],
                y: ["0%", "-1%", "0%"],
                scale: [1.03, 1.08, 1.03],
              }
        }
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
      >
        {width > 0 && height > 0 ? (
          <Stage width={width} height={height} listening={false}>
            <NeuralNetworkLayer
              layerRef={layerRef}
              width={width}
              height={height}
            />
          </Stage>
        ) : null}
      </motion.div>
      <span className={styles.networkVignette} />
    </div>
  );
}
