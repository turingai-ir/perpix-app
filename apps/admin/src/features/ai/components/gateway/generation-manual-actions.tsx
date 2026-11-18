import { useState } from "react";
import { AlertTriangle, Ban, Coins, Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UsdmicroInputHint } from "@/components/custom/usdmicro-amount";
import { parseUsdmicro } from "@/utils/usdmicro";
import {
  useAiGenerationActions,
  type GenerationActionKind,
} from "../../hooks/use-ai-generation-actions";
import type { GenerationReviewReasonEnum } from "../../model/types";
import { UsdmicroInput } from "@/components/custom/usdmicro-input";

const ACTIONS: Record<
  GenerationActionKind,
  { title: string; description: string; confirm: string; destructive: boolean }
> = {
  cost: {
    title: "ثبت هزینهٔ واقعی",
    description:
      "هزینهٔ واقعی را که از پنل ارائه‌دهنده دیده‌اید وارد کنید. پس از ثبت، درخواست ادامه پیدا می‌کند.",
    confirm: "ثبت هزینه",
    destructive: false,
  },
  "external-task": {
    title: "ثبت شناسهٔ وظیفهٔ ارائه‌دهنده",
    description:
      "اگر شناسهٔ وظیفه در پنل ارائه‌دهنده هست، آن را ثبت کنید تا نتیجه دوباره خوانده شود.",
    confirm: "ثبت شناسه",
    destructive: false,
  },
  fail: {
    title: "ناموفق کردن درخواست",
    description:
      "درخواست ناموفق می‌شود و رزرو کیف پول کاربر آزاد می‌گردد. این کار قابل بازگشت نیست.",
    confirm: "ناموفق کردن",
    destructive: true,
  },
};

interface GenerationManualActionsProps {
  generationUuid: string;
  reviewReason: GenerationReviewReasonEnum | null;
  onDone: () => void;
}

/** Operator actions for a generation that needs manual review. */
export function GenerationManualActions({
  generationUuid,
  reviewReason,
  onDone,
}: GenerationManualActionsProps) {
  const [kind, setKind] = useState<GenerationActionKind | null>(null);
  const { run, isPending } = useAiGenerationActions(generationUuid);

  const hint =
    reviewReason === "COST_UNRESOLVED"
      ? "هزینهٔ واقعی مشخص نیست؛ پیشنهاد: ثبت هزینهٔ واقعی."
      : reviewReason === "RESULT_UNREADABLE"
        ? "نتیجه خوانده نمی‌شود؛ پیشنهاد: ثبت شناسهٔ وظیفه یا ناموفق کردن."
        : null;

  return (
    <Card className="border-amber-500/40">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <AlertTriangle className="size-4 text-amber-600" />
          نیاز به بررسی دستی
        </CardTitle>
        {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          variant={reviewReason === "COST_UNRESOLVED" ? "default" : "outline"}
          size="sm"
          className="justify-start gap-2"
          onClick={() => setKind("cost")}
        >
          <Coins className="size-3.5" />
          ثبت هزینهٔ واقعی
        </Button>
        <Button
          variant={reviewReason === "RESULT_UNREADABLE" ? "default" : "outline"}
          size="sm"
          className="justify-start gap-2"
          onClick={() => setKind("external-task")}
        >
          <Link2 className="size-3.5" />
          ثبت شناسهٔ وظیفهٔ ارائه‌دهنده
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="justify-start gap-2"
          onClick={() => setKind("fail")}
        >
          <Ban className="size-3.5" />
          ناموفق کردن درخواست
        </Button>
      </CardContent>

      {kind && (
        <ActionDialog
          key={kind}
          kind={kind}
          isPending={isPending}
          onClose={() => setKind(null)}
          onSubmit={async (values) => {
            await run({ kind, ...values });
            setKind(null);
            onDone();
          }}
        />
      )}
    </Card>
  );
}

interface ActionDialogProps {
  kind: GenerationActionKind;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (values: {
    reason: string;
    costUsdmicro?: number;
    externalTaskId?: string;
  }) => Promise<void>;
}

function ActionDialog({
  kind,
  isPending,
  onClose,
  onSubmit,
}: ActionDialogProps) {
  const meta = ACTIONS[kind];
  const [reason, setReason] = useState("");
  const [cost, setCost] = useState("");
  const [taskId, setTaskId] = useState("");

  const costValue = parseUsdmicro(cost);
  const isValid =
    reason.trim() !== "" &&
    (kind !== "cost" || costValue !== null) &&
    (kind !== "external-task" || taskId.trim() !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isPending) return;
    try {
      await onSubmit({
        reason: reason.trim(),
        costUsdmicro: kind === "cost" ? (costValue ?? 0) : undefined,
        externalTaskId: kind === "external-task" ? taskId.trim() : undefined,
      });
    } catch {
      // toast handled in hook; keep the dialog open
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{meta.title}</DialogTitle>
          <DialogDescription>{meta.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-sm">
          {kind === "cost" && (
            <div>
              <label
                htmlFor="gen-action-cost"
                className="mb-1 block text-xs font-semibold"
              >
                هزینهٔ واقعی (میکرودلار) *
              </label>
              <UsdmicroInput
                id="gen-action-cost"
                value={cost}
                onValueChange={(v) => setCost(v)}
                placeholder="40000"
              />
              <UsdmicroInputHint value={cost} className="mt-1" />
            </div>
          )}
          {kind === "external-task" && (
            <div>
              <label
                htmlFor="gen-action-task"
                className="mb-1 block text-xs font-semibold"
              >
                شناسهٔ وظیفه (External Task ID) *
              </label>
              <Input
                id="gen-action-task"
                dir="ltr"
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
              />
            </div>
          )}
          <div>
            <label
              htmlFor="gen-action-reason"
              className="mb-1 block text-xs font-semibold"
            >
              علت (برای ثبت در سوابق) *
            </label>
            <Input
              id="gen-action-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="مثلاً: هزینه از پنل ارائه‌دهنده بررسی شد"
            />
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            <Button
              type="submit"
              variant={meta.destructive ? "destructive" : "default"}
              disabled={!isValid || isPending}
            >
              {isPending ? "در حال ثبت..." : meta.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
