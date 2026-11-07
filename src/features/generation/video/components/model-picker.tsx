import { useState } from "react";
import { Check, ChevronDown, LockKeyhole, Search, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { ModelIcon } from "./model-icon";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useAppTranslate } from "@/shared/hooks";
import type { useGenerationPromptBox } from "@/features/generation/hooks";
import { isModelAllowed } from "@/features/generation/model/model-access";

function getModelDescription(
  name: string,
  t: ReturnType<typeof useAppTranslate>["t"],
) {
  const normalizedName = name.toLocaleLowerCase();
  if (normalizedName.includes("grok") && normalizedName.includes("1.5"))
    return t("pages.generation.video.studio.modelDescriptions.grokCompact");
  if (normalizedName.includes("wan"))
    return t("pages.generation.video.studio.modelDescriptions.wan");
  if (normalizedName.includes("grok"))
    return t("pages.generation.video.studio.modelDescriptions.grok");
  if (normalizedName.includes("seedance"))
    return t("pages.generation.video.studio.modelDescriptions.seedance");
  if (normalizedName.includes("aleph"))
    return t("pages.generation.video.studio.modelDescriptions.aleph");
  if (normalizedName.includes("kling"))
    return t("pages.generation.video.studio.modelDescriptions.kling");
  return t("pages.generation.video.studio.modelDescriptions.default");
}

export function VideoModelPicker({
  model,
  disabled,
}: {
  model: ReturnType<typeof useGenerationPromptBox>["model"];
  disabled: boolean;
}) {
  const { t } = useAppTranslate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const models = model.modelsListState.data ?? [];
  const current = models.find((item) => item.uuid === model.currentModel);
  const name =
    current?.display_name || current?.name || t("common.chooseModel");
  const matches = models.filter((item) =>
    `${item.display_name ?? ""} ${item.name}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setQuery("");
      }}
    >
      <DialogTrigger
        type="button"
        disabled={disabled}
        className="border-border bg-muted hover-capable:hover:bg-accent flex min-h-18 w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-start transition-[background-color,border-color] duration-150 disabled:cursor-wait disabled:opacity-55 motion-reduce:transition-none [&>svg:last-child]:ms-auto [&>svg:last-child]:flex-none"
        aria-label={`${t("common.chooseModel")} ${name}`}
      >
        <ModelIcon
          key={`${name}-${current?.icon_url ?? ""}`}
          url={current?.icon_url}
          name={name}
          modelId={current?.name}
        />
        <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
          <small className="text-muted-foreground text-xs leading-normal">
            {t("pages.generation.video.studio.model")}
          </small>
          <strong
            dir="auto"
            className="text-[15px] leading-normal font-semibold wrap-anywhere"
          >
            {name}
          </strong>
        </span>
        <ChevronDown size={18} aria-hidden="true" />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className="border-border bg-popover text-popover-foreground [&_:is(button,input):focus-visible]:outline-ring fixed top-1/2 left-1/2 z-50 flex max-h-[min(720px,86dvh)] w-[min(720px,calc(100%-32px))] max-w-180 -translate-x-1/2 -translate-y-1/2 flex-col gap-4.5 overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_85%_-10%,var(--ambient-brand),transparent_42%)] p-6.5 text-sm shadow-[inset_0_1px_rgb(255_255_255/10%),0_32px_100px_rgb(0_0_0/62%)] backdrop-blur-xl backdrop-saturate-135 outline-none max-[600px]:top-auto max-[600px]:bottom-0 max-[600px]:left-0 max-[600px]:max-h-[90dvh] max-[600px]:w-full max-[600px]:max-w-full max-[600px]:translate-x-0 max-[600px]:translate-y-0 max-[600px]:rounded-b-none max-[600px]:px-4.5 max-[600px]:pt-5 max-[600px]:pb-[max(20px,env(safe-area-inset-bottom))] [&_:is(button,input):focus-visible]:outline-2 [&_:is(button,input):focus-visible]:outline-offset-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <DialogTitle>{t("common.chooseModel")}</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1 leading-relaxed">
                {t("pages.generation.video.studio.modelHint")}
              </DialogDescription>
            </div>
            <DialogClose
              className="border-border bg-muted grid size-11 min-w-11 cursor-pointer place-items-center rounded-full border"
              aria-label={t("common.close")}
            >
              <X size={20} />
            </DialogClose>
          </div>
          <label className="border-border bg-background/40 text-muted-foreground [&_input]:text-foreground flex min-h-13 items-center gap-2.5 rounded-2xl border px-4 shadow-[inset_0_1px_rgb(255_255_255/7%)] backdrop-blur-lg [&_input]:h-11.5 [&_input]:w-full [&_input]:min-w-0 [&_input]:bg-transparent [&_input]:text-base">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={t("pages.generation.video.studio.modelSearch")}
              placeholder={t("pages.generation.video.studio.modelSearch")}
            />
          </label>
          <div className="grid max-h-[min(58dvh,500px)] min-h-0 [scrollbar-width:thin] grid-cols-2 gap-2.5 overflow-y-auto overscroll-contain p-px pe-1 max-[720px]:grid-cols-1">
            {matches.map((item) => {
              const modelName = item.display_name || item.name;
              return (
                <button
                  type="button"
                  key={item.uuid}
                  className="border-border bg-card ease-out-quint aria-pressed:border-primary/50 aria-pressed:bg-accent hover-capable:hover:-translate-y-0.5 hover-capable:hover:border-primary/30 hover-capable:hover:bg-accent/60 relative grid min-h-37 w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-start gap-3.5 rounded-2xl border p-4 text-start transition-[translate,scale,border-color,background-color,box-shadow] duration-150 active:scale-[0.96] motion-reduce:transition-none max-[720px]:min-h-30"
                  aria-label={modelName}
                  aria-pressed={item.uuid === model.currentModel}
                  onClick={() => {
                    model.setCurrentModel(item.uuid);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <ModelIcon
                    className="size-13 rounded-[14px]"
                    key={`${modelName}-${item.icon_url ?? ""}`}
                    url={item.icon_url}
                    name={modelName}
                    modelId={item.name}
                  />
                  <span className="flex min-w-0 flex-1 flex-col items-start gap-2.5">
                    <span className="flex min-w-0 flex-col items-start">
                      <strong
                        dir="auto"
                        className="text-[15px] leading-snug font-semibold wrap-anywhere"
                      >
                        {modelName}
                      </strong>
                    </span>
                    <span className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                      {getModelDescription(modelName, t)}
                    </span>
                    {!isModelAllowed(item, model.allowedModelNames) && (
                      <small className="text-accent-gold flex max-w-full items-center gap-1 truncate text-xs">
                        <LockKeyhole size={12} />
                        {t("common.upgradeRequired")}
                      </small>
                    )}
                  </span>
                  {item.uuid === model.currentModel && (
                    <span className="border-primary/30 bg-primary/20 text-primary absolute end-2.5 top-2.5 grid size-6.5 place-items-center rounded-full border">
                      <Check size={15} strokeWidth={2.4} aria-hidden="true" />
                    </span>
                  )}
                </button>
              );
            })}
            {!matches.length && (
              <p
                role="status"
                className="text-muted-foreground col-span-full px-3 py-8 text-center"
              >
                {t("pages.generation.video.studio.noSearchResults")}
              </p>
            )}
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
