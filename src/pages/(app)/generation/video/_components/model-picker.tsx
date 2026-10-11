import { useState } from "react";
import { Check, ChevronDown, LockKeyhole, Search, X } from "lucide-react";

import styles from "../composer.module.css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppTranslate } from "@/hooks";
import type { useGenerationPromptBox } from "@/pages/(app)/generation/_hooks";
import { isModelAllowed } from "@/pages/(app)/generation/_utils/model-access";

function getModelMark(name: string) {
  const normalizedName = name.toLocaleLowerCase();
  if (normalizedName.includes("wan")) return "W";
  if (normalizedName.includes("grok")) return "x";
  if (normalizedName.includes("seedance")) return "S";
  if (normalizedName.includes("aleph")) return "A";
  if (normalizedName.includes("kling")) return "K";
  return name.trim().charAt(0).toLocaleUpperCase() || "P";
}

type LocalModelLogo = {
  id: string;
  src: string;
};

const modelLogos = [
  ["grok", { id: "xai", src: "/images/model-logos/xai.svg" }],
  ["wan", { id: "alibaba", src: "/images/model-logos/alibaba-cloud.svg" }],
  ["seedance", { id: "bytedance", src: "/images/model-logos/bytedance.svg" }],
  ["kling", { id: "kuaishou", src: "/images/model-logos/kuaishou.svg" }],
  ["aleph", { id: "runway", src: "/images/model-logos/runway.svg" }],
] as const satisfies ReadonlyArray<readonly [string, LocalModelLogo]>;

function getLocalModelLogo(name: string) {
  const normalizedName = name.toLocaleLowerCase();
  return modelLogos.find(([modelName]) =>
    normalizedName.includes(modelName),
  )?.[1];
}

function ModelIcon({ url, name }: { url?: string | null; name: string }) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const localLogo = getLocalModelLogo(name);
  const source = [localLogo?.src, url].find(
    (candidate): candidate is string =>
      candidate != null && !failedSources.includes(candidate),
  );

  return (
    <span
      className={styles.modelIcon}
      data-model-logo={localLogo?.id}
      data-model-mark={getModelMark(name)}
    >
      {source ? (
        <img
          src={source}
          alt=""
          width={32}
          height={32}
          onError={() =>
            setFailedSources((previous) =>
              previous.includes(source) ? previous : [...previous, source],
            )
          }
        />
      ) : (
        <span className={styles.modelMonogram} aria-hidden="true">
          {getModelMark(name)}
        </span>
      )}
    </span>
  );
}

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
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={styles.modelTrigger}
          aria-label={`${t("common.chooseModel")} ${name}`}
        >
          <ModelIcon
            key={`${name}-${current?.icon_url ?? ""}`}
            url={current?.icon_url}
            name={name}
          />
          <span className={styles.modelName}>
            <small>{t("pages.generation.video.studio.model")}</small>
            <strong dir="auto">{name}</strong>
          </span>
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent className={styles.modelDialog} showCloseButton={false}>
        <div className={styles.dialogHeading}>
          <div>
            <DialogTitle>{t("common.chooseModel")}</DialogTitle>
            <DialogDescription>
              {t("pages.generation.video.studio.modelHint")}
            </DialogDescription>
          </div>
          <DialogClose
            className={styles.closeButton}
            aria-label={t("common.close")}
          >
            <X size={20} />
          </DialogClose>
        </div>
        <label className={styles.search}>
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={t("pages.generation.video.studio.modelSearch")}
            placeholder={t("pages.generation.video.studio.modelSearch")}
          />
        </label>
        <div className={styles.modelList}>
          {matches.map((item) => {
            const modelName = item.display_name || item.name;
            return (
              <button
                type="button"
                key={item.uuid}
                className={styles.modelOption}
                aria-label={modelName}
                aria-pressed={item.uuid === model.currentModel}
                onClick={() => {
                  model.setCurrentModel(item.uuid);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <ModelIcon
                  key={`${modelName}-${item.icon_url ?? ""}`}
                  url={item.icon_url}
                  name={modelName}
                />
                <span className={styles.modelName}>
                  <span className={styles.modelCardHeading}>
                    <strong dir="auto">{modelName}</strong>
                  </span>
                  <span className={styles.modelDescription}>
                    {getModelDescription(modelName, t)}
                  </span>
                  {!isModelAllowed(item, model.allowedModelNames) && (
                    <small className={styles.locked}>
                      <LockKeyhole size={12} />
                      {t("common.upgradeRequired")}
                    </small>
                  )}
                </span>
                {item.uuid === model.currentModel && (
                  <span className={styles.selectedMark}>
                    <Check size={15} strokeWidth={2.4} aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
          {!matches.length && (
            <p role="status" className={styles.empty}>
              {t("pages.generation.video.studio.noSearchResults")}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
