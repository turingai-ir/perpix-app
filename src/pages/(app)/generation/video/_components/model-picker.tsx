import { useState } from "react";
import { Check, ChevronDown, Film, LockKeyhole, Search, X } from "lucide-react";

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

function ModelIcon({ url }: { url?: string | null }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={styles.modelIcon}>
      {url && !failed ? (
        <img
          src={url}
          alt=""
          width={32}
          height={32}
          onError={() => setFailed(true)}
        />
      ) : (
        <Film size={22} aria-hidden="true" />
      )}
    </span>
  );
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
    `${item.display_name ?? ""} ${item.name} ${item.model_owner}`
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
          <ModelIcon key={current?.icon_url} url={current?.icon_url} />
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
          {matches.map((item) => (
            <button
              type="button"
              key={item.uuid}
              className={styles.modelOption}
              aria-pressed={item.uuid === model.currentModel}
              onClick={() => {
                model.setCurrentModel(item.uuid);
                setOpen(false);
                setQuery("");
              }}
            >
              <ModelIcon key={item.icon_url} url={item.icon_url} />
              <span className={styles.modelName}>
                <strong dir="auto">{item.display_name || item.name}</strong>
                <small dir="auto">{item.description || item.model_owner}</small>
                {!isModelAllowed(item, model.allowedModelNames) && (
                  <small className={styles.locked}>
                    <LockKeyhole size={12} />
                    {t("common.upgradeRequired")}
                  </small>
                )}
              </span>
              {item.uuid === model.currentModel && (
                <Check size={18} aria-hidden="true" />
              )}
            </button>
          ))}
          {!matches.length && (
            <p role="status" className={styles.empty}>
              {t("pages.generation.video.studio.noSearchResults")}
            </p>
          )}
        </div>
        <p className={styles.modelHint}>
          {t("pages.generation.video.studio.modelSwitchHint")}
        </p>
      </DialogContent>
    </Dialog>
  );
}
