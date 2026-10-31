export interface NeuralNode {
  x: number;
  y: number;
  depth: number;
}

export interface NeuralEdge {
  from: number;
  to: number;
}

export const neuralNodes: NeuralNode[] = Array.from(
  { length: 46 },
  (_, index) => ({
    x: ((index * 37 + Math.floor(index / 6) * 13) % 101) / 100,
    y: ((index * 61 + Math.floor(index / 5) * 17) % 103) / 102,
    depth: ((index * 29) % 97) / 96,
  }),
);

export const neuralEdges: NeuralEdge[] = neuralNodes
  .flatMap((node, from) =>
    neuralNodes.slice(from + 1).map((target, offset) => ({
      from,
      to: from + offset + 1,
      distance: Math.hypot(node.x - target.x, node.y - target.y),
      depthDistance: Math.abs(node.depth - target.depth),
    })),
  )
  .filter(
    ({ distance, depthDistance }) => distance < 0.29 && depthDistance < 0.48,
  )
  .sort((first, second) => first.distance - second.distance)
  .slice(0, 82)
  .map(({ from, to }) => ({ from, to }));

export const pulseEdges = [5, 18, 34, 57].map(
  (edgeIndex) => neuralEdges[edgeIndex % neuralEdges.length],
);
