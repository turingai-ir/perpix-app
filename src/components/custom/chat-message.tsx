import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "../ui/button";
import { useAppTranslate } from "@/hooks";

export function ChatMessage({
  message,
  showCopy,
}: {
  message: string;
  showCopy: boolean;
}) {
  const { t } = useAppTranslate();
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimerRef.current), []);

  const copyMessage = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="bg-accent w-full rounded-xl px-3 py-2.5 leading-7 wrap-anywhere">
        {message}
      </div>
      {showCopy ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label={t(
            copied
              ? "pages.generation.image.chat.promptCopied"
              : "pages.generation.image.chat.copyPrompt",
          )}
          onClick={() => void copyMessage()}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </Button>
      ) : null}
    </div>
  );
}
