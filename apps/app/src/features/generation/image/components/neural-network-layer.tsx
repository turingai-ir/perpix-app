import type { RefObject } from "react";
import type Konva from "konva";
import { Circle, Layer, Line } from "react-konva";
import { neuralEdges, neuralNodes, pulseEdges } from "./neural-network-model";

function getNodeColor(index: number) {
  if (index % 6 === 0) return "#ff9d5c";
  if (index % 3 === 0) return "#61dcff";
  return "#a96cff";
}

export function NeuralNetworkLayer({
  height,
  layerRef,
  width,
}: {
  height: number;
  layerRef: RefObject<Konva.Layer | null>;
  width: number;
}) {
  return (
    <Layer ref={layerRef} listening={false}>
      {neuralEdges.map((edge, index) => {
        const from = neuralNodes[edge.from];
        const to = neuralNodes[edge.to];
        const opacity = 0.08 + Math.min(from.depth, to.depth) * 0.22;
        return (
          <Line
            key={`${edge.from}-${edge.to}`}
            name="neural-link"
            points={[
              from.x * width,
              from.y * height,
              to.x * width,
              to.y * height,
            ]}
            stroke={index % 5 === 0 ? "#38c9ff" : "#8c4de8"}
            opacity={opacity}
            strokeWidth={0.45 + from.depth}
            dash={[2, 9]}
            perfectDrawEnabled={false}
          />
        );
      })}
      {neuralNodes.map((node, index) => (
        <Circle
          key={index}
          name="neural-node"
          x={node.x * width}
          y={node.y * height}
          radius={1.5 + node.depth * 2.8}
          fill={getNodeColor(index)}
          shadowColor={index % 6 === 0 ? "#ff7a32" : "#6d78ff"}
          shadowBlur={7 + node.depth * 10}
          perfectDrawEnabled={false}
        />
      ))}
      {pulseEdges.map((_, index) => (
        <Circle
          key={index}
          name="neural-pulse"
          radius={3.2}
          fill="#dff9ff"
          shadowColor="#54d8ff"
          shadowBlur={16}
          perfectDrawEnabled={false}
        />
      ))}
    </Layer>
  );
}
