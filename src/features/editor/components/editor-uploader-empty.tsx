import { useState } from "react";
import {
  ArrowRight,
  Check,
  MoveUpRight,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { useAppTranslate } from "@/shared/hooks/i18/use-app-translate";
import { useRouteBack } from "@/shared/hooks/use-route-back";
import { EditorOnboardingArt } from "./editor-onboarding-art";
import { cn } from "@/shared/lib/utils";
import { EDITOR_SCOPE_CLASS } from "./editor-styles";

interface Props {
  onFileSelect: (file: File) => void;
}

export function EditorUploaderEmpty({ onFileSelect }: Props) {
  const { t } = useAppTranslate();
  const routeBack = useRouteBack();
  const [isDragging, setIsDragging] = useState(false);
  const steps = [
    t("pages.editor.studio.stepOne"),
    t("pages.editor.studio.stepTwo"),
    t("pages.editor.studio.stepThree"),
  ];
  return (
    <main
      className={`${EDITOR_SCOPE_CLASS} bg-background relative isolate min-h-dvh w-full overflow-auto bg-[radial-gradient(ellipse_at_74%_35%,color-mix(in_srgb,var(--primary)_22%,transparent),transparent_45%),radial-gradient(ellipse_at_12%_86%,var(--ambient-media),transparent_45%)] before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(rgb(255_255_255/2.5%)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/2.5%)_1px,transparent_1px)] before:mask-[linear-gradient(to_bottom,transparent,black_36%,transparent)] before:bg-size-[38px_38px] before:content-['']`}
      dir="rtl"
    >
      <header className="m-auto flex w-[calc(100%-2rem)] items-center justify-between py-4.5 min-[701px]:w-[min(1240px,calc(100%-64px))] min-[701px]:py-7">
        <button
          type="button"
          onClick={routeBack}
          className="border-foreground/13 bg-foreground/4 text-foreground inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[13px] border px-3.5 py-2.5"
        >
          <ArrowRight size={18} />
          {t("pages.editor.back")}
        </button>
        <span className="inline-flex items-center gap-2 text-[19px] font-extrabold tracking-tight [direction:ltr]">
          <span className="from-primary to-primary/60 text-primary-foreground grid size-8 place-items-center rounded-[11px] bg-linear-145 font-black shadow-[0_8px_28px_color-mix(in_srgb,var(--primary)_29%,transparent)]">
            P
          </span>{" "}
          PerPix{" "}
          <small className="text-muted-foreground ml-1 text-[9px] font-semibold tracking-[0.18em]">
            STUDIO
          </small>
        </span>
      </header>
      <div className="m-auto flex w-[calc(100%-2.25rem)] flex-col gap-0 pt-8.5 pb-10 min-[701px]:grid min-[701px]:min-h-[calc(100dvh-100px)] min-[701px]:w-[min(1120px,calc(100%-64px))] min-[701px]:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] min-[701px]:items-center min-[701px]:gap-[6vw] min-[701px]:pt-5 min-[701px]:pb-22">
        <section className="z-1 w-full max-w-130">
          <div className="border-primary/35 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold">
            <Sparkles size={15} />
            {t("pages.editor.studio.eyebrow")}
          </div>
          <h1 className="mt-5.75 mb-3.5 text-[34px] leading-snug font-extrabold tracking-tighter text-balance min-[401px]:text-4xl min-[701px]:text-[clamp(38px,5vw,70px)]">
            {t("pages.editor.smartTitle")}
          </h1>
          <p className="text-foreground/80 mb-6.75 text-[clamp(15px,1.5vw,18px)] leading-loose">
            {t("pages.editor.studio.intro")}
          </p>
          <div className="mb-4.5 grid gap-2 min-[701px]:mb-6">
            {steps.map((step, index) => (
              <div
                className="border-foreground/8 [&>svg]:text-accent-emerald flex items-center gap-3 border-b px-2.5 py-2"
                key={step}
              >
                <span className="text-primary font-mono text-[11px] font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-foreground/90 m-0 flex-1 text-sm">{step}</p>
                <Check size={16} />
              </div>
            ))}
          </div>
          <label
            className={cn(
              "border-primary/53 from-primary/9 to-foreground/4 focus-within:outline-primary hover-capable:hover:-translate-y-0.5 hover-capable:hover:border-primary hover-capable:hover:bg-primary/17 relative flex cursor-pointer flex-col items-center gap-2 rounded-[22px] border-[1.5px] border-dashed bg-linear-140 px-5 pt-6.5 pb-5.5 text-center shadow-[inset_0_1px_rgb(255_255_255/17%),0_24px_55px_rgb(9_7_20/27%)] transition-[background-color,border-color,transform] duration-200 focus-within:outline-3 focus-within:outline-offset-3 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              isDragging && "border-primary bg-primary/17 -translate-y-0.5",
            )}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              const file = event.dataTransfer.files[0];
              if (file) onFileSelect(file);
            }}
          >
            <input
              className="absolute inset-0 size-full cursor-pointer opacity-0"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              aria-label={t("pages.editor.uploaderBtn")}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onFileSelect(file);
              }}
            />
            <span className="bg-primary/12 text-primary grid size-12 place-items-center rounded-2xl">
              <UploadCloud size={24} />
            </span>
            <strong className="flex items-center gap-2 text-[15px]">
              {t("pages.editor.uploaderBtn")}
              <MoveUpRight size={17} />
            </strong>
            <span className="text-foreground/75 text-xs">
              {t("pages.editor.studio.dropHint")}
            </span>
            <small className="text-muted-foreground text-[11px]">
              {t("pages.editor.studio.formats")}
            </small>
          </label>
        </section>
        <EditorOnboardingArt />
      </div>
    </main>
  );
}
