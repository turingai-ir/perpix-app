import { useEffect, useState } from "react";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

/* A clipped copy of each word creates a brief electric streak without moving the text. */
const WORD_CLASS =
  "relative inline-block after:pointer-events-none after:absolute after:inset-0 after:text-white after:opacity-0 after:content-[attr(data-text)] after:[clip-path:inset(32%_0_48%_0)] after:[text-shadow:0_0_8px_#fff,0_0_16px_#49ccff] after:animate-electric-flash after:[animation-play-state:paused] group-data-[motion=running]/slogan:after:[animation-play-state:running] motion-reduce:after:animate-none";

const PIXEL_CLASS =
  "size-[3px] flex-none min-[481px]:size-1 bg-[#cf58ff] shadow-[0_0_7px_#d946ef,5px_5px_0_rgb(49_184_247/60%)] last:bg-[#47c8ff] last:shadow-[0_0_7px_#38bdf8,-5px_-5px_0_rgb(201_66_238/60%)]";

const HeaderSlogan = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [isPageVisible, setIsPageVisible] = useState(
    () => document.visibilityState === "visible",
  );
  const brand = t("pages.app.layout.slogan.brand");
  const promise = t("pages.app.layout.slogan.promise");

  useEffect(() => {
    // Pause decorative flashes in background tabs so they resume only when visible.
    const updateVisibility = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <div
      aria-label={`${brand} ${promise}`}
      className="group/slogan pointer-events-none absolute left-1/2 flex w-max max-w-[calc(100%-8rem)] -translate-x-1/2 items-center justify-center gap-1 text-base leading-normal font-black whitespace-nowrap select-none min-[481px]:gap-[0.45rem] min-[481px]:text-[clamp(1.05rem,1.7vw,1.55rem)]"
      data-header-slogan
      data-motion={isPageVisible ? "running" : "paused"}
      dir="rtl"
    >
      <span aria-hidden="true" className={PIXEL_CLASS} />
      <span
        className={cn(
          WORD_CLASS,
          "text-(--image-accent) [text-shadow:0_0_6px_rgb(206_73_251/75%),0_0_19px_rgb(172_38_231/48%)]",
        )}
        data-text={brand}
      >
        {brand}
      </span>
      <span
        className={cn(
          WORD_CLASS,
          "text-(--video-accent) [text-shadow:0_0_6px_rgb(64_194_255/85%),0_0_19px_rgb(28_156_233/52%)] after:[animation-delay:0.2s]",
        )}
        data-text={promise}
      >
        {promise}
      </span>
      <span aria-hidden="true" className={PIXEL_CLASS} />
    </div>
  );
};

export default HeaderSlogan;
