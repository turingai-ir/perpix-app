import type { CSSProperties } from "react";
import { Sparkles } from "lucide-react";

import styles from "./image-generation-placeholder.module.css";
import { useAppTranslate } from "@/hooks";

const frames = Array.from({ length: 8 });
const particles = Array.from({ length: 16 });
const ignoredWords = new Set(["این", "برای", "یک", "با", "های", "در", "از"]);

const getPromptWords = (prompt: string) => {
  const words = prompt
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !ignoredWords.has(word));
  return [...new Set(words)].slice(0, 4);
};

const getPromptHue = (prompt: string) =>
  [...prompt].reduce((hash, character) => hash + character.charCodeAt(0), 0) %
  360;

export function ImageGenerationPlaceholder({
  aspectRatio,
  label,
  prompt,
}: {
  aspectRatio: string;
  label: string;
  prompt: string;
}) {
  const { t } = useAppTranslate();
  const [width, height] = aspectRatio.split(":").map(Number);
  const validRatio = width > 0 && height > 0 ? width / height : 1;
  const promptWords = getPromptWords(prompt);
  const hue = getPromptHue(prompt);
  const visualStyle = {
    "--image-ratio": validRatio,
    "--prompt-hue": hue,
  } as CSSProperties;

  return (
    <div
      className={styles.root}
      role="status"
      aria-live="polite"
      aria-label={t("pages.generation.image.generationLoading.museumLabel")}
      data-unborn-museum
      style={visualStyle}
    >
      <div className={styles.statusLine}>
        <Sparkles aria-hidden="true" />
        <div className={styles.statusText}>
          <span>{label}</span>
          <span>{t("pages.generation.image.generationLoading.phaseOne")}</span>
          <span>{t("pages.generation.image.generationLoading.phaseTwo")}</span>
          <span>
            {t("pages.generation.image.generationLoading.phaseThree")}
          </span>
        </div>
      </div>
      <div
        className={styles.portal}
        data-generation-visual
        style={{ aspectRatio: validRatio }}
      >
        <div className={styles.museum} aria-hidden="true">
          <div className={styles.vanishingLight} />
          <div className={styles.architecture} />
          <div className={styles.frames}>
            {frames.map((_, index) => (
              <i
                key={index}
                className={styles.frame}
                data-side={index % 2 === 0 ? "start" : "end"}
                style={{ "--frame": Math.floor(index / 2) } as CSSProperties}
              >
                <b />
              </i>
            ))}
          </div>
          <div className={styles.guardian}>
            <i className={styles.guardianHalo} />
            <i className={styles.guardianHead} />
            <i className={styles.guardianBody} />
            <i className={styles.guardianCore} />
          </div>
          <div className={styles.words}>
            {promptWords.map((word, index) => (
              <span key={word} style={{ "--word": index } as CSSProperties}>
                {word}
              </span>
            ))}
          </div>
          <div className={styles.particles}>
            {particles.map((_, index) => (
              <i
                key={index}
                style={
                  {
                    "--particle": index,
                    "--particle-left": `${(index * 61) % 94}%`,
                    "--particle-top": `${(index * 37) % 90}%`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <div className={styles.floor} />
          <div className={styles.vignette} />
        </div>
      </div>
    </div>
  );
}
