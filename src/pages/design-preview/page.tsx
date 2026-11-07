import type { FC } from "react";

import PreviewHeader from "./_components/preview-header";
import PreviewHero from "./_components/preview-hero";
import PreviewStudio from "./_components/preview-studio";

const DesignPreviewPage: FC = () => {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_76%_26%,color-mix(in_srgb,var(--video-accent)_14%,transparent),transparent_30%),radial-gradient(circle_at_62%_34%,color-mix(in_srgb,var(--image-accent)_12%,transparent),transparent_24%)] bg-background text-foreground before:pointer-events-none before:fixed before:inset-0 before:bg-[linear-gradient(color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px)] before:bg-[size:64px_64px] before:[mask-image:radial-gradient(circle_at_70%_26%,black,transparent_58%)] before:content-['']">
      <PreviewHeader />
      <PreviewHero />
      <PreviewStudio />
    </main>
  );
};

export default DesignPreviewPage;
