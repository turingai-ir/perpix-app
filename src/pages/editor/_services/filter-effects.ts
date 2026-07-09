import type { FilterPreset } from "../_model/types";

export function getPresetFilter(preset: FilterPreset) {
  if (preset === "none") return null;

  return function (imageData: ImageData) {
    const data = imageData.data;
    const len = data.length;

    for (let i = 0; i < len; i += 4) {
      let r = data[i],
        g = data[i + 1],
        b = data[i + 2];

      switch (preset) {
        case "grayscale": {
          const v = 0.299 * r + 0.587 * g + 0.114 * b;
          r = v;
          g = v;
          b = v;
          break;
        }
        case "sepia": {
          const tr = 0.393 * r + 0.769 * g + 0.189 * b;
          const tg = 0.349 * r + 0.686 * g + 0.168 * b;
          const tb = 0.272 * r + 0.534 * g + 0.131 * b;
          r = tr;
          g = tg;
          b = tb;
          break;
        }
        case "vintage":
          r *= 1.1;
          g *= 0.95;
          b *= 0.8;
          break;
        case "warm":
          r *= 1.2;
          g *= 1.05;
          b *= 0.9;
          break;
        case "cool":
          r *= 0.9;
          g *= 1.05;
          b *= 1.2;
          break;
        case "vivid": {
          const avg = (r + g + b) / 3;
          r = avg + (r - avg) * 1.4;
          g = avg + (g - avg) * 1.4;
          b = avg + (b - avg) * 1.4;
          break;
        }
        case "dramatic": {
          const avg = (r + g + b) / 3;
          r = (avg + (r - avg) * 0.6 - 128) * 1.3 + 128;
          g = (avg + (g - avg) * 0.6 - 128) * 1.3 + 128;
          b = (avg + (b - avg) * 0.6 - 128) * 1.3 + 128;
          break;
        }
        case "cinematic": {
          const avg = (r + g + b) / 3;
          if (avg < 128) {
            b *= 1.15;
            g *= 1.05;
            r *= 0.9;
          } else {
            r *= 1.15;
            g *= 1.05;
            b *= 0.9;
          }
          break;
        }
        case "cyberpunk":
          r *= 1.2;
          g *= 0.6;
          b *= 1.3;
          break;
        case "golden":
          r *= 1.15;
          g *= 1.1;
          b *= 0.85;
          break;
        case "noir": {
          const v = (0.299 * r + 0.587 * g + 0.114 * b - 128) * 1.5 + 128;
          r = v;
          g = v;
          b = v;
          break;
        }
        case "matte":
          r = r < 50 ? 50 + r * 0.5 : r;
          g = g < 50 ? 50 + g * 0.5 : g;
          b = b < 50 ? 50 + b * 0.5 : b;
          break;
        case "lomo": {
          r = (r - 128) * 1.2 + 128;
          g = (g - 128) * 1.2 + 128;
          b = (b - 128) * 1.2 + 128;
          const avg = (r + g + b) / 3;
          r = avg + (r - avg) * 1.3;
          g = avg + (g - avg) * 1.3;
          b = avg + (b - avg) * 1.3;
          break;
        }
        case "retro":
          g *= 0.9;
          b *= 0.8;
          break;
        case "rosy":
          r *= 1.15;
          g *= 0.9;
          b *= 1.15;
          break;
        case "forest":
          r *= 0.85;
          g *= 1.2;
          b *= 0.85;
          break;
        case "invert":
          r = 255 - r;
          g = 255 - g;
          b = 255 - b;
          break;
        case "fade":
          r = r * 0.8 + 50;
          g = g * 0.8 + 50;
          b = b * 0.8 + 50;
          break;
        case "solarize":
          r = r > 128 ? 255 - r : r;
          g = g > 128 ? 255 - g : g;
          b = b > 128 ? 255 - b : b;
          break;
        case "noise": {
          const n = (Math.random() - 0.5) * 30;
          r += n;
          g += n;
          b += n;
          break;
        }
        case "winter":
          r *= 0.85;
          g *= 1.0;
          b *= 1.25;
          break;
      }

      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }
  };
}
