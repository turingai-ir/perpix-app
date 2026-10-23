import type { SVGProps } from "react";

type MenuIconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.7,
  viewBox: "0 0 24 24",
  "aria-hidden": true as const,
};

export function HomeIcon(props: MenuIconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m3.5 10 8.5-7 8.5 7v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
      <path d="M9 21v-7h6v7" />
      <path className="icon-accent" d="m9 9 3-2.5L15 9" />
    </svg>
  );
}

export function ImageIcon(props: MenuIconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="8.3" cy="9" r="1.4" />
      <path d="m5 17 4.4-4.3 3.2 2.7 2.6-2.4 3.8 4" />
      <path
        className="icon-accent"
        d="m15.5 5.9.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
      />
    </svg>
  );
}

export function VideoIcon(props: MenuIconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m10 9 5 3-5 3z" />
      <path className="icon-accent" d="M7 3v2m10-2v2M7 19v2m10-2v2" />
    </svg>
  );
}

export function GalleryIcon(props: MenuIconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="3" width="14" height="14" rx="2.5" />
      <path d="M17 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2" />
      <path className="icon-accent" d="m9.5 14 3.2-3.1 2.1 1.8 2.8-3.1L20 12" />
      <circle cx="11" cy="7" r="1" />
    </svg>
  );
}

export function EditorIcon(props: MenuIconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4 20 9.5-9.5 3 3L7 23H4z" />
      <path d="m12.5 5.5 1-2.5 1 2.5L17 6.5l-2.5 1-1 2.5-1-2.5-2.5-1z" />
      <path
        className="icon-accent"
        d="m19 13 .6 1.4L21 15l-1.4.6L19 17l-.6-1.4L17 15l1.4-.6z"
      />
    </svg>
  );
}

export function CreditIcon(props: MenuIconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 2 8 4.5v11L12 22l-8-4.5v-11z" />
      <path d="m4 6.5 8 5 8-5M12 11.5V22" />
      <path className="icon-accent" d="m8.5 4.1 7 4.2" />
    </svg>
  );
}

export function AccountIcon(props: MenuIconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.2 20v-1.5a6.8 6.8 0 0 1 6.8-6.8 6.8 6.8 0 0 1 6.8 6.8V20" />
      <path
        className="icon-accent"
        d="m17.8 3.4.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z"
      />
    </svg>
  );
}
