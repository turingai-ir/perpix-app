import type { FC } from "react";
import { CircleHelp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppTranslate } from "@/hooks";

export const GenerationRulesDialog: FC = () => {
  const { t } = useAppTranslate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label={t("pages.generation.rules.trigger")}
          size="icon"
          type="button"
          variant="ghost"
        >
          <CircleHelp />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("pages.generation.rules.title")}</DialogTitle>
          <DialogDescription>
            {t("pages.generation.rules.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 leading-6">
          <section>
            <h3 className="font-medium">
              {t("pages.generation.rules.prohibitedContent.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("pages.generation.rules.prohibitedContent.description")}
            </p>
          </section>
          <section>
            <h3 className="font-medium">
              {t("pages.generation.rules.tokenProcessing.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("pages.generation.rules.tokenProcessing.description")}
            </p>
          </section>
          <a
            className="text-primary font-medium underline underline-offset-4"
            href="https://perpixai.ir/terms/"
            rel="noreferrer"
            target="_blank"
          >
            {t("pages.generation.rules.fullTerms")}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};
