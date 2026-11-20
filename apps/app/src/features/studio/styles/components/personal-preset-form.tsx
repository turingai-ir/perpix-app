import { useState, type FormEvent } from "react";
import type { CaptionTemplate } from "@perpix/caption-renderer";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useAppTranslate } from "@/shared/hooks";
import { useSavePersonalPreset } from "../hooks/use-save-personal-preset";

const MAX_NAME_LENGTH = 64;

export function PersonalPresetForm({
  template,
  count,
  limit,
}: {
  template: CaptionTemplate;
  count: number;
  limit: number;
}) {
  const { t } = useAppTranslate();
  const { save, pending, error } = useSavePersonalPreset();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const atLimit = count >= limit;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (atLimit || pending || !name.trim()) return;
    if (await save(name.trim(), template)) {
      setName("");
      setSaved(true);
    }
  };

  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="gap-group flex flex-col"
    >
      <p className="text-muted-foreground text-footnote">
        {t("features.studio.styles.quota", {
          count: count.toLocaleString("fa-IR"),
          limit: limit.toLocaleString("fa-IR"),
        })}
      </p>
      <Input
        aria-label={t("features.studio.styles.presetName")}
        placeholder={t("features.studio.styles.presetName")}
        maxLength={MAX_NAME_LENGTH}
        value={name}
        readOnly={pending}
        onChange={(event) => {
          setName(event.currentTarget.value);
          setSaved(false);
        }}
      />
      <Button
        type="submit"
        variant="outline"
        disabled={!name.trim() || atLimit || pending}
      >
        {t(
          pending
            ? "features.studio.styles.saving"
            : "features.studio.styles.savePersonal",
        )}
      </Button>
      {error ? (
        <p role="alert" className="text-destructive text-footnote">
          {t(
            error === "limit"
              ? "features.studio.styles.limitReached"
              : "features.studio.styles.saveError",
          )}
        </p>
      ) : (
        atLimit && (
          <p role="status" className="text-muted-foreground text-footnote">
            {t("features.studio.styles.limitReached")}
          </p>
        )
      )}
      {saved && (
        <p role="status" className="text-footnote">
          {t("features.studio.styles.saved")}
        </p>
      )}
    </form>
  );
}
