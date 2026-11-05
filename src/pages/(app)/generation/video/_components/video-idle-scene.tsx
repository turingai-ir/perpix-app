import { useId, type CSSProperties } from "react";

import { useAppTranslate } from "@/hooks";
import styles from "./video-idle-scene.module.css";

// Six folded exposures surround the same moment, separate, then become one.
const pieces = [
  {
    face: "M450 88 601 160 518 236 433 205Z",
    fold: "M450 88 518 236 433 205Z",
    x: -6,
    y: -22,
    turn: -4,
  },
  {
    face: "M601 160 644 310 514 326 518 236Z",
    fold: "M601 160 644 310 518 236Z",
    x: 24,
    y: -10,
    turn: 5,
  },
  {
    face: "M644 310 539 430 432 350 514 326Z",
    fold: "M644 310 539 430 514 326Z",
    x: 22,
    y: 18,
    turn: 4,
  },
  {
    face: "M539 430 370 429 379 288 432 350Z",
    fold: "M539 430 370 429 432 350Z",
    x: -2,
    y: 24,
    turn: -3,
  },
  {
    face: "M370 429 267 300 387 231 379 288Z",
    fold: "M370 429 267 300 379 288Z",
    x: -24,
    y: 12,
    turn: 4,
  },
  {
    face: "M267 300 302 162 450 88 433 205 387 231Z",
    fold: "M267 300 302 162 433 205 387 231Z",
    x: -22,
    y: -16,
    turn: -5,
  },
];

export function VideoIdleScene() {
  const { t } = useAppTranslate();
  const id = useId();

  return (
    <div className={styles.scene} data-video-preview-frame>
      <div className={styles.aura} aria-hidden="true" />
      <svg
        className={styles.artwork}
        viewBox="0 0 900 560"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${id}-glass`}
            x1="295"
            y1="100"
            x2="600"
            y2="430"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f2c5ff" />
            <stop offset=".32" stopColor="#a277ec" />
            <stop offset=".68" stopColor="#40316e" />
            <stop offset="1" stopColor="#83dae1" />
          </linearGradient>
          <linearGradient
            id={`${id}-edge`}
            x1="300"
            y1="100"
            x2="570"
            y2="430"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ffdaee" />
            <stop offset=".45" stopColor="#b887ef" stopOpacity=".2" />
            <stop offset="1" stopColor="#b5faff" stopOpacity=".8" />
          </linearGradient>
          <linearGradient id={`${id}-film`} x2="1" y2="1">
            <stop stopColor="#c395ef" stopOpacity=".35" />
            <stop offset=".5" stopColor="#b4a4ec" stopOpacity=".04" />
            <stop offset="1" stopColor="#8de1ef" stopOpacity=".25" />
          </linearGradient>
          <radialGradient id={`${id}-light`}>
            <stop stopColor="#e4d5ff" stopOpacity=".4" />
            <stop offset="1" stopColor="#ad7de7" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          className={styles.halo}
          cx="450"
          cy="277"
          rx="220"
          ry="210"
          fill={`url(#${id}-light)`}
        />
        <g className={styles.orbits} stroke={`url(#${id}-edge)`}>
          <ellipse
            cx="450"
            cy="275"
            rx="344"
            ry="106"
            transform="rotate(-23 450 275)"
          />
          <ellipse
            cx="450"
            cy="275"
            rx="274"
            ry="210"
            transform="rotate(-23 450 275)"
            strokeDasharray="2 12"
            opacity=".25"
          />
        </g>
        <g transform="rotate(-18 450 275)">
          <path d="M56 227H844M56 323H844" stroke={`url(#${id}-film)`} />
          {Array.from({ length: 8 }, (_, frame) => (
            <g
              key={frame}
              className={styles.exposure}
              style={{ "--frame": frame } as CSSProperties}
              data-video-motion
            >
              <rect
                x={62 + frame * 98}
                y="235"
                width="84"
                height="80"
                rx="3"
                fill={`url(#${id}-film)`}
                stroke={`url(#${id}-edge)`}
                strokeOpacity=".35"
              />
              <path
                d={`M${74 + frame * 98} 303L${96 + frame * 98} 275L${113 + frame * 98} 287L${134 + frame * 98} 254`}
                stroke="#c4b0f0"
                strokeOpacity=".2"
              />
            </g>
          ))}
        </g>
        <g className={styles.sculpture}>
          <path
            d="M433 205 518 236 514 326 432 350 379 288 387 231Z"
            fill="#14111e"
            stroke={`url(#${id}-edge)`}
            strokeOpacity=".5"
          />
          {pieces.map((piece, index) => (
            <g
              key={piece.face}
              className={styles.piece}
              style={
                {
                  "--dx": `${piece.x}px`,
                  "--dy": `${piece.y}px`,
                  "--turn": `${piece.turn}deg`,
                } as CSSProperties
              }
              data-video-motion
            >
              <path
                d={piece.face}
                fill={`url(#${id}-glass)`}
                fillOpacity={index % 2 === 0 ? ".8" : ".45"}
                stroke={`url(#${id}-edge)`}
                strokeWidth="1.25"
              />
              <path
                d={piece.fold}
                fill={index < 3 ? "#201332" : "#c3c8fa"}
                fillOpacity={index < 3 ? ".35" : ".12"}
                stroke={`url(#${id}-edge)`}
                strokeOpacity=".35"
              />
            </g>
          ))}
          <g className={styles.moment}>
            <path
              d="M432 246 475 274 432 302Z"
              fill={`url(#${id}-edge)`}
              stroke="#f2e5ff"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
            <path
              d="M418 230 490 274 418 318"
              stroke="#e5c8ff"
              strokeOpacity=".18"
            />
          </g>
          <path
            d="M302 162 450 88 601 160"
            stroke="#f7d4ef"
            strokeOpacity=".65"
          />
        </g>
        <g className={styles.sparks} fill="#e8d6ff">
          <path
            d="M229 163v12m-6-6h12M691 355v10m-5-5h10"
            stroke="currentColor"
          />
          <circle cx="192" cy="349" r="2" />
          <circle cx="714" cy="173" r="2" />
          <circle cx="571" cy="80" r="1.5" />
        </g>
        <ellipse cx="450" cy="481" rx="148" ry="1" fill={`url(#${id}-film)`} />
      </svg>
      <span className={styles.caption}>
        <span className={styles.recordDot} aria-hidden="true" />
        {t("pages.generation.video.studio.framePlaceholder")}
      </span>
    </div>
  );
}
