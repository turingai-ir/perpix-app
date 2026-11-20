import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useAppTranslate } from "@/shared/hooks";
import { BottomSheet } from "../../ui/bottom-sheet";
import type { EditableCaptionWord } from "../model/caption-corrections";
import type { CaptionMatch } from "../model/caption-matches";
import { CaptionBulkCorrection } from "./caption-bulk-correction";

const WORDS_PER_PAGE = 30;
const LABEL = "features.studio.editor.corrections";

interface CaptionWordSheetProps {
  words: readonly EditableCaptionWord[];
  sourceMs: number;
  onClose: () => void;
  onCommit: (word: EditableCaptionWord, text: string | null) => void;
  onFind: (query: string) => CaptionMatch[];
  onApplyMatches: (
    matches: readonly CaptionMatch[],
    replacement: string,
  ) => void;
}

export function CaptionWordSheet({
  words,
  sourceMs,
  onClose,
  onCommit,
  onFind,
  onApplyMatches,
}: CaptionWordSheetProps) {
  const { t } = useAppTranslate();
  const [page, setPage] = useState(() => {
    const index = words.findIndex((word) => word.endMs > sourceMs);
    return Math.floor(
      (index === -1 ? words.length - 1 : index) / WORDS_PER_PAGE,
    );
  });
  const [selected, setSelected] = useState<EditableCaptionWord>();
  const [bulk, setBulk] = useState(false);
  const first = page * WORDS_PER_PAGE;

  const changePage = (step: number) => {
    setPage(page + step);
    setSelected(undefined);
  };

  return (
    <BottomSheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={t(`${LABEL}.title`)}
      description={t(
        bulk ? `${LABEL}.bulkDescription` : `${LABEL}.description`,
      )}
    >
      <Button className="mb-3" variant="outline" onClick={() => setBulk(!bulk)}>
        {t(bulk ? `${LABEL}.single` : `${LABEL}.bulk`)}
      </Button>
      {bulk ? (
        <CaptionBulkCorrection onFind={onFind} onApply={onApplyMatches} />
      ) : (
        <div className="gap-block flex flex-col">
          <div className="gap-group flex flex-wrap">
            {words.slice(first, first + WORDS_PER_PAGE).map((word) => (
              <Button
                key={word.key}
                type="button"
                variant={selected?.key === word.key ? "secondary" : "outline"}
                aria-pressed={selected?.key === word.key}
                className="h-auto whitespace-normal"
                onClick={() => setSelected(word)}
              >
                <bdi className="min-w-0 break-all">{word.text}</bdi>
              </Button>
            ))}
          </div>
          {words.length > WORDS_PER_PAGE && (
            <div className="gap-group flex justify-between">
              <Button
                variant="ghost"
                disabled={page === 0}
                onClick={() => changePage(-1)}
              >
                {t(`${LABEL}.previous`)}
              </Button>
              <Button
                variant="ghost"
                disabled={first + WORDS_PER_PAGE >= words.length}
                onClick={() => changePage(1)}
              >
                {t(`${LABEL}.next`)}
              </Button>
            </div>
          )}
          {selected && (
            <WordForm key={selected.key} word={selected} onCommit={onCommit} />
          )}
        </div>
      )}
    </BottomSheet>
  );
}

function WordForm({
  word,
  onCommit,
}: {
  word: EditableCaptionWord;
  onCommit: CaptionWordSheetProps["onCommit"];
}) {
  const { t } = useAppTranslate();
  const [text, setText] = useState(word.text);
  const [invalid, setInvalid] = useState(false);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    field.current?.focus();
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) {
      setInvalid(true);
      field.current?.focus();
      return;
    }
    onCommit(word, value === word.original ? null : value);
  };

  return (
    <form className="gap-group flex flex-col" onSubmit={submit}>
      <Input
        aria-label={t(`${LABEL}.word`)}
        aria-invalid={invalid}
        dir="auto"
        ref={field}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setInvalid(false);
        }}
        enterKeyHint="done"
      />
      {invalid && (
        <p role="alert" className="text-destructive text-footnote">
          {t(`${LABEL}.empty`)}
        </p>
      )}
      <Button type="submit">{t(`${LABEL}.apply`)}</Button>
      {word.text !== word.original && (
        <Button
          variant="ghost"
          type="button"
          onClick={() => onCommit(word, null)}
        >
          {t(`${LABEL}.restore`)}
        </Button>
      )}
    </form>
  );
}
