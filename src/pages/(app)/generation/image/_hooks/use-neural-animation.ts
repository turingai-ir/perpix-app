import { useEffect, useRef, type RefObject } from "react";
import Konva from "konva";

import { neuralNodes, pulseEdges } from "../_components/neural-network-model";

export function useNeuralAnimation(
  layerRef: RefObject<Konva.Layer | null>,
  width: number,
  height: number,
  active: boolean,
  reducedMotion: boolean | null,
) {
  const animationRef = useRef<Konva.Animation | null>(null);
  // Konva resets frame.time on restart; retain the phase across visibility pauses.
  const elapsedRef = useRef(0);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !width || !height || reducedMotion) return;
    const links = layer.find<Konva.Line>(".neural-link");
    const nodes = layer.find(".neural-node");
    const pulses = layer.find(".neural-pulse");
    const animation = new Konva.Animation((frame) => {
      elapsedRef.current += frame?.timeDiff ?? 0;
      const time = elapsedRef.current;
      links.forEach((line, index) => {
        line.dashOffset(time * (0.012 + (index % 4) * 0.002));
      });
      nodes.forEach((node, index) => {
        const pulse = 0.72 + Math.sin(time * 0.0015 + index * 1.7) * 0.28;
        node.opacity(pulse);
        node.scale({ x: pulse, y: pulse });
      });
      pulses.forEach((pulse, index) => {
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
    animationRef.current = animation;
    return () => {
      animation.stop();
      animationRef.current = null;
    };
  }, [height, layerRef, reducedMotion, width]);

  useEffect(() => {
    if (active) animationRef.current?.start();
    else animationRef.current?.stop();
  }, [active, height, reducedMotion, width]);
}
