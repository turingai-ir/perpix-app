import { useState } from "react";
import { toast } from "sonner";
import {
  AiActionError,
  failGeneration,
  setGenerationCost,
  setGenerationExternalTask,
} from "../services/ai-service";

export type GenerationActionKind = "fail" | "cost" | "external-task";

export interface GenerationActionInput {
  kind: GenerationActionKind;
  reason: string;
  /** Actual cost in micro-dollars (kind "cost"). */
  costUsdmicro?: number;
  /** Provider task id (kind "external-task"). */
  externalTaskId?: string;
}

const SUCCESS_MESSAGES: Record<GenerationActionKind, string> = {
  fail: "درخواست به‌صورت دستی ناموفق ثبت شد.",
  cost: "هزینهٔ واقعی ثبت شد.",
  "external-task": "شناسهٔ وظیفهٔ ارائه‌دهنده ثبت شد.",
};

/** Operator actions for a generation stuck in NEEDS_REVIEW. */
export function useAiGenerationActions(generationUuid: string) {
  const [isPending, setIsPending] = useState(false);

  const run = async (input: GenerationActionInput) => {
    setIsPending(true);
    try {
      switch (input.kind) {
        case "fail":
          await failGeneration(generationUuid, input.reason);
          break;
        case "cost":
          await setGenerationCost(generationUuid, {
            reason: input.reason,
            actual_cost_usdmicro: input.costUsdmicro ?? 0,
          });
          break;
        case "external-task":
          await setGenerationExternalTask(generationUuid, {
            reason: input.reason,
            external_task_id: input.externalTaskId ?? "",
          });
          break;
      }
      toast.success(SUCCESS_MESSAGES[input.kind]);
    } catch (err) {
      toast.error(
        err instanceof AiActionError ? err.message : "انجام عملیات ناموفق بود.",
      );
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { run, isPending };
}
