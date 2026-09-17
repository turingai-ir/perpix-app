import { useEffect, useRef } from "react";
import Konva from "konva";
import { Stage } from "react-konva";
import { motion, useReducedMotion } from "motion/react";
import { useNeuralCanvasSize } from "../_hooks/use-neural-canvas-size";
import { neuralNodes, pulseEdges } from "./neural-network-model";
import { NeuralNetworkLayer } from "./neural-network-layer";
import styles from "../studio.module.css";

export function NeuralNetworkBackground() {
  const { containerRef, width, height } = useNeuralCanvasSize();
  const layerRef = useRef<Konva.Layer>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !width || !height || reducedMotion) return;
    const animation = new Konva.Animation((frame) => {
      const time = frame?.time ?? 0;
      layer.find<Konva.Line>(".neural-link").forEach((line, index) => {
        line.dashOffset(time * (0.012 + (index % 4) * 0.002));
      });
      layer.find(".neural-node").forEach((node, index) => {
        const pulse = 0.72 + Math.sin(time * 0.0015 + index * 1.7) * 0.28;
        node.opacity(pulse);
        node.scale({ x: pulse, y: pulse });
      });
      layer.find(".neural-pulse").forEach((pulse, index) => {
        const edge = pulseEdges[index];
        const from = neuralNodes[edge.from];
        const to = neuralNodes[edge.to];
        const progress = (time * 0.00012 + index * 0.23) % 1;
        pulse.position({
          x: (from.x + (to.x - from.x) * progress) * width,
          y: (from.y + (to.y - from.y) * progress) * height,
        });
      });
    }, layer);
    animation.start();
    return () => {
      animation.stop();
    };
  }, [height, reducedMotion, width]);

  return (
    <div
      ref={containerRef}
      className={styles.networkBackground}
      aria-hidden="true"
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
