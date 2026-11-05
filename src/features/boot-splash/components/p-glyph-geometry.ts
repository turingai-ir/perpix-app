import {
  Color,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Path,
  Shape,
} from "three";

import type { FighterColors } from "../model/palette";

/** Hole centre in the centred geometry, used to place the fighter's eye. */
export const P_EYE = { x: 0.18, y: 0.65 } as const;

function createPShape() {
  const outer = new Shape();
  outer.moveTo(0, 0);
  outer.lineTo(0.72, 0);
  outer.lineTo(0.72, 1.3);
  outer.lineTo(1.0, 1.3);
  outer.absarc(1.0, 2.15, 0.85, -Math.PI / 2, Math.PI / 2, false);
  outer.lineTo(0, 3);
  outer.lineTo(0, 0);

  const hole = new Path();
  hole.moveTo(0.72, 1.66);
  hole.lineTo(0.72, 2.64);
  hole.lineTo(1.0, 2.64);
  hole.absarc(1.0, 2.15, 0.49, Math.PI / 2, -Math.PI / 2, true);
  hole.lineTo(0.72, 1.66);
  outer.holes.push(hole);

  return outer;
}

/**
 * Extruded, bevelled logo "P" with a vertical vertex-colour gradient taken
 * from the fighter's slice of the logo spectrum.
 */
export function createPGlyphGeometry(colors: FighterColors) {
  const geometry = new ExtrudeGeometry(createPShape(), {
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 3,
    curveSegments: 28,
  });
  geometry.center();
  geometry.computeBoundingBox();

  const box = geometry.boundingBox;
  const minY = box?.min.y ?? -1.5;
  const height = (box?.max.y ?? 1.5) - minY;
  const base = new Color(colors.base);
  const tip = new Color(colors.tip);
  const mixed = new Color();
  const positions = geometry.getAttribute("position");
  const shades = new Float32Array(positions.count * 3);

  for (let i = 0; i < positions.count; i += 1) {
    const t = (positions.getY(i) - minY) / height;
    mixed.copy(base).lerp(tip, t);
    shades.set([mixed.r, mixed.g, mixed.b], i * 3);
  }
  geometry.setAttribute("color", new Float32BufferAttribute(shades, 3));

  return geometry;
}
