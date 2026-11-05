import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";

import { CLASH_AT, ROUND_SECONDS } from "../model/choreography";
import { sceneClock } from "./scene-time";

const SLOW_FROM = CLASH_AT - 0.06;
const SLOW_TO = CLASH_AT + 0.22;
const SLOW_SPEED = 0.28;

function speedAt(time: number) {
  const u = time % ROUND_SECONDS;
  return u > SLOW_FROM && u < SLOW_TO ? SLOW_SPEED : 1;
}

/** Advances `sceneClock` before anything else renders the frame. */
export function SceneClock() {
  useEffect(() => {
    sceneClock.time = 0;
  }, []);

  useFrame((_, delta) => {
    const step = Math.min(delta, 1 / 20);
    sceneClock.time += step * speedAt(sceneClock.time);
  }, -1);

  return null;
}
