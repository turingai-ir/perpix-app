import { useState, type FC } from "react";
import { shouldShowSplash } from "../hooks/use-app-ready";
import { useBootSplash, type ReadySource } from "../hooks/use-boot-splash";
import { BootOffice } from "./boot-office";
import { BootSplashHud } from "./boot-splash-hud";
import styles from "./boot-office.module.css";

export function BootSplash({ router }: { router: ReadySource }) {
  const [show, setShow] = useState(shouldShowSplash);
  return show ? (
    <BootSplashOverlay router={router} onVisibilityChange={setShow} />
  ) : null;
}

interface BootSplashOverlayProps {
  router: ReadySource;
  onVisibilityChange: (visible: boolean) => void;
}

const BootSplashOverlay: FC<BootSplashOverlayProps> = ({
  router,
  onVisibilityChange,
}) => {
  const { t, dialog, leaving, bypass, handleSkip, handleCancel } =
    useBootSplash({ router, onVisibilityChange });

  return (
    <dialog
      ref={dialog}
      data-boot-splash
      data-leaving={leaving}
      data-skip={bypass}
      className={styles.overlay}
      aria-label={t("features.bootSplash.loading")}
      onCancel={handleCancel}
    >
      <BootOffice />
      <BootSplashHud onSkip={handleSkip} skipped={bypass} />
    </dialog>
  );
};
