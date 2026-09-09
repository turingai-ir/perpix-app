import type { FC } from "react";

import PreviewHeader from "./_components/preview-header";
import PreviewHero from "./_components/preview-hero";
import PreviewStudio from "./_components/preview-studio";
import styles from "./design-preview.module.css";

const DesignPreviewPage: FC = () => {
  return (
    <main className={`${styles.preview} min-h-dvh overflow-hidden text-white`}>
      <PreviewHeader />
      <PreviewHero />
      <PreviewStudio />
    </main>
  );
};

export default DesignPreviewPage;
