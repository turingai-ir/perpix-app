import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ListOrdered } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useAppTranslate } from "@/hooks";
import {
  useAiModelsList,
  type AiModelsRowItem,
} from "../../hooks/use-ai-models-list";
import { useAiModelActions } from "../../hooks/use-ai-model-actions";
import type { AiRegistryModelSupportedTypesEnum } from "../../model/types";

const OUTPUT_TYPES: {
  value: AiRegistryModelSupportedTypesEnum;
  label: string;
}[] = [
  { value: "VIDEO", label: "مدل‌های ویدیو" },
  { value: "IMAGE", label: "مدل‌های تصویر" },
  { value: "AUDIO", label: "مدل‌های صدا" },
  { value: "TEXT", label: "مدل‌های متن" },
];

// The admin list caps a page at 100, far above the models of one type.
const MAX_MODELS = 100;

interface AiModelsOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

/**
 * The order users see models in, one output type at a time. Moving a model
 * only swaps it among models of that type; every other model keeps its place.
 */
export function AiModelsOrderDialog({
  open,
  onOpenChange,
  onSaved,
}: AiModelsOrderDialogProps) {
  const [outputType, setOutputType] =
    useState<AiRegistryModelSupportedTypesEnum>("VIDEO");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListOrdered className="text-primary size-5" />
            ترتیب نمایش مدل‌ها
          </DialogTitle>
          <DialogDescription>
            کاربر مدل‌ها را به همین ترتیب از بالا به پایین می‌بیند. جابه‌جایی در
            یک نوع، جای مدل‌های نوع‌های دیگر را تغییر نمی‌دهد.
          </DialogDescription>
        </DialogHeader>

        <Select
          value={outputType}
          onChange={(e) =>
            setOutputType(e.target.value as AiRegistryModelSupportedTypesEnum)
          }
        >
          {OUTPUT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>

        {open && (
          <OrderList
            key={outputType}
            outputType={outputType}
            onClose={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function OrderList({
  outputType,
  onClose,
  onSaved,
}: {
  outputType: AiRegistryModelSupportedTypesEnum;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const { t } = useAppTranslate();
  const { models, isLoading, error, refetch } = useAiModelsList({
    page: 1,
    limit: MAX_MODELS,
    outputType,
  });
  const { reorderModels, isReorderingModels } = useAiModelActions();

  const ordered = useMemo(
    () =>
      [...models].sort(
        (a, b) =>
          a.display_order - b.display_order ||
          b.created_at.localeCompare(a.created_at),
      ),
    [models],
  );
  // The admin's arrangement; null until the first move, so fresh data shows as is.
  const [moved, setMoved] = useState<AiModelsRowItem[] | null>(null);
  const rows = moved ?? ordered;

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setMoved(next);
  };

  const save = async () => {
    if (!moved) return;
    try {
      await reorderModels(moved.map((model) => model.uuid));
      // Reopening must show the saved order, not the cached one.
      await refetch();
      onSaved?.();
      onClose();
    } catch {
      // toast handled in hook
    }
  };

  if (isLoading || error) {
    return (
      <p className="text-muted-foreground py-6 text-center text-sm">
        {error
          ? "بارگذاری مدل‌ها ناموفق بود."
          : t("common.loading", { defaultValue: "در حال بارگذاری..." })}
      </p>
    );
  }

  return (
    <>
      {rows.length === 0 ? (
        <p className="text-muted-foreground py-6 text-center text-sm">
          مدلی از این نوع وجود ندارد.
        </p>
      ) : (
        <ol className="space-y-2">
          {rows.map((model, index) => (
            <li
              key={model.uuid}
              className="bg-card flex items-center gap-3 rounded-lg border p-2.5"
            >
              <span className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                {(index + 1).toLocaleString("fa-IR")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-foreground truncate text-sm font-semibold">
                  {model.display_name || model.name}
                </div>
                <code className="text-muted-foreground font-mono text-[11px]">
                  {model.name}
                </code>
              </div>
              {!model.is_active && <Badge variant="muted">غیرفعال</Badge>}
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="انتقال به بالا"
                disabled={index === 0 || isReorderingModels}
                onClick={() => move(index, -1)}
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="انتقال به پایین"
                disabled={index === rows.length - 1 || isReorderingModels}
                onClick={() => move(index, 1)}
              >
                <ArrowDown className="size-4" />
              </Button>
            </li>
          ))}
        </ol>
      )}

      <DialogFooter className="gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("common.cancel", { defaultValue: "انصراف" })}
        </Button>
        <Button
          type="button"
          disabled={!moved || isReorderingModels}
          onClick={() => void save()}
        >
          {isReorderingModels
            ? t("common.submitting", { defaultValue: "در حال ذخیره..." })
            : t("common.save", { defaultValue: "ذخیره" })}
        </Button>
      </DialogFooter>
    </>
  );
}
