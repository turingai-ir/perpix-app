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
      className={`${EDITOR_SCOPE_CLASS} relative isolate min-h-dvh w-full overflow-auto bg-background bg-[radial-gradient(ellipse_at_74%_35%,color-mix(in_srgb,var(--primary)_22%,transparent),transparent_45%),radial-gradient(ellipse_at_12%_86%,var(--ambient-media),transparent_45%)] before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(color-mix(in_oklch,var(--night-foreground)_2.5%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklch,var(--night-foreground)_2.5%,transparent)_1px,transparent_1px)] before:mask-[linear-gradient(to_bottom,transparent,black_36%,transparent)] before:bg-size-[38px_38px] before:content-['']`}
      dir="rtl"
    >
      <header className="m-auto flex w-[calc(100%-2rem)] items-center justify-between py-4.5 min-[701px]:w-[min(1240px,calc(100%-64px))] min-[701px]:py-7">
        <button
          type="button"
          onClick={routeBack}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-foreground/13 bg-foreground/4 px-3.5 py-2.5 text-foreground"
        >
          <ArrowRight size={18} />
          {t("pages.editor.back")}
        </button>
        <span className="inline-flex items-center gap-2 text-title-3 font-extrabold tracking-tight [direction:ltr]">
          <span className="grid size-8 place-items-center rounded-md bg-linear-145 from-primary to-primary/60 font-black text-primary-foreground shadow-[0_8px_28px_color-mix(in_srgb,var(--primary)_29%,transparent)]">
            P
          </span>{" "}
          PerPix{" "}
          <small className="ml-1 text-caption font-semibold tracking-[0.18em] text-muted-foreground">
            STUDIO
          </small>
        </span>
      </header>
      <div className="m-auto flex w-[calc(100%-2.25rem)] flex-col gap-0 pt-8.5 pb-10 min-[701px]:grid min-[701px]:min-h-[calc(100dvh-100px)] min-[701px]:w-[min(1120px,calc(100%-64px))] min-[701px]:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] min-[701px]:items-center min-[701px]:gap-[6vw] min-[701px]:pt-5 min-[701px]:pb-22">
        <section className="z-1 w-full max-w-130">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
            <Sparkles size={15} />
            {t("pages.editor.studio.eyebrow")}
          </div>
          <h1 className="mt-5.75 mb-3.5 text-large-title leading-snug font-extrabold tracking-tighter text-balance min-[401px]:text-4xl min-[701px]:text-[clamp(38px,5vw,70px)]">
            {t("pages.editor.smartTitle")}
          </h1>
          <p className="mb-6.75 text-[clamp(15px,1.5vw,18px)] leading-loose text-foreground/80">
            {t("pages.editor.studio.intro")}
          </p>
          <div className="mb-4.5 grid gap-2 min-[701px]:mb-6">
            {steps.map((step, index) => (
              <div
                className="flex items-center gap-3 border-b border-foreground/8 px-2.5 py-2 [&>svg]:text-accent-emerald"
                key={step}
              >
                <span className="font-mono text-caption font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="m-0 flex-1 text-sm text-foreground/90">{step}</p>
                <Check size={16} />
              </div>
            ))}
          </div>
          <label
            className={cn(
              "hover-capable:hover:-translate-y-0.5 hover-capable:hover:border-primary hover-capable:hover:bg-primary/17 relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-[1.5px] border-dashed border-primary/53 bg-linear-140 from-primary/9 to-foreground/4 px-5 pt-6.5 pb-5.5 text-center shadow-modal inset-shadow-highlight-lg transition-[background-color,border-color,transform] duration-200 focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              isDragging && "-translate-y-0.5 border-primary bg-primary/17",
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
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary">
              <UploadCloud size={24} />
            </span>
            <strong className="flex items-center gap-2 text-headline">
              {t("pages.editor.uploaderBtn")}
              <MoveUpRight size={17} />
            </strong>
            <span className="text-xs text-foreground/75">
              {t("pages.editor.studio.dropHint")}
            </span>
            <small className="text-caption text-muted-foreground">
              {t("pages.editor.studio.formats")}
            </small>
          </label>
        </section>
        <EditorOnboardingArt />
      </div>
    </main>
  );
}
