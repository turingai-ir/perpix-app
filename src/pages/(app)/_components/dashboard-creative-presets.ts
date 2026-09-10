import { Clapperboard, Package, Sparkles, WandSparkles } from "lucide-react";

export const creativePresets = [
  {
    Icon: Sparkles,
    id: "portrait",
    mode: "image",
  },
  {
    Icon: Package,
    id: "product",
    mode: "image",
  },
  {
    Icon: Clapperboard,
    id: "commercial",
    mode: "video",
  },
  {
    Icon: WandSparkles,
    id: "animate",
    mode: "video",
  },
] as const;

export type CreativeMode = (typeof creativePresets)[number]["mode"];
export type CreativePreset = (typeof creativePresets)[number];
