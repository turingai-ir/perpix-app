import { type ComponentProps, useEffect, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useAppTranslate } from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";

export function ExpandedPromptEditor({
  className,
  disabled,
  onChange,
  placeholder,
  ref,
  textareaLabel,
  value,
  ...textareaProps
}: Omit<ComponentProps<"textarea">, "onChange" | "value"> & {
  onChange: (value: string) => void;
  placeholder: string;
  textareaLabel: string;
  value: string;
}) {
  const { t } = useAppTranslate();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
  }, [value]);

  return (
    <>
      <div className="relative min-w-0 flex-1 pe-11">
        <textarea
          {...textareaProps}
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === "function") return ref(node);
            if (ref) ref.current = node;
          }}
          value={value}
          rows={textareaProps.rows ?? 2}
          wrap={textareaProps.wrap ?? "soft"}
          disabled={disabled}
          aria-label={textareaProps["aria-label"] ?? textareaLabel}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "placeholder:text-muted-foreground block min-h-14 w-full resize-none overflow-hidden border-none bg-transparent px-1 py-2 text-base leading-7 wrap-anywhere outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          placeholder={placeholder}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          disabled={disabled}
          className="absolute end-0 top-1"
          aria-label={t("pages.generation.image.studio.expandPrompt")}
          onClick={() => {
            setDraft(value);
            setOpen(true);
          }}
        >
          <Maximize2 aria-hidden="true" />
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="flex h-[min(42rem,calc(100svh-2rem))] max-w-4xl flex-col p-5 sm:max-w-4xl"
          showCloseButton={false}
        >
          <DialogHeader className="relative pe-12">
            <DialogTitle>
              {t("pages.generation.image.studio.promptEditorTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("pages.generation.image.studio.promptEditorDescription")}
            </DialogDescription>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  className="hover:bg-muted absolute end-0 top-0 rounded-full"
                  aria-label={t(
                    "pages.generation.image.studio.closePromptEditor",
                  )}
                />
              }
            >
              <X aria-hidden="true" />
            </DialogClose>
          </DialogHeader>
          <textarea
            value={draft}
            aria-label={textareaLabel}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={placeholder}
            className="border-border bg-muted/20 focus-visible:border-primary min-h-0 flex-1 resize-none rounded-xl border p-4 text-base leading-8 outline-none focus-visible:ring-2"
          />
          <DialogFooter className="bg-transparent p-0 pt-4">
            <Button
              type="button"
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
            >
              {t("pages.generation.image.studio.applyPrompt")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
