import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GenerationStatusEnum } from "../../model/types";

export const GENERATION_STATUS_LABELS: Record<GenerationStatusEnum, string> = {
  PENDING: "در صف",
  SUBMITTING: "در حال ارسال",
  WAITING_RESULT: "در انتظار نتیجه",
  PROCESSING_OUTPUT: "در حال پردازش خروجی",
  COMPLETED: "تکمیل شده",
  FAILED: "ناموفق",
  NEEDS_REVIEW: "نیازمند بررسی",
};

export function GenerationStatusBadge({
  status,
}: {
  status: GenerationStatusEnum;
}) {
  const label = GENERATION_STATUS_LABELS[status];
  switch (status) {
    case "COMPLETED":
      return (
        <Badge
          variant="default"
          className="gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <CheckCircle2 className="size-3" />
          {label}
        </Badge>
      );
    case "SUBMITTING":
    case "WAITING_RESULT":
    case "PROCESSING_OUTPUT":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-blue-500 text-white hover:bg-blue-600"
        >
          <RefreshCw className="size-3 animate-spin" />
          {label}
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-amber-500 text-white hover:bg-amber-600"
        >
          <Clock className="size-3" />
          {label}
        </Badge>
      );
    case "NEEDS_REVIEW":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-amber-500 text-amber-600"
        >
          <AlertTriangle className="size-3" />
          {label}
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="size-3" />
          {label}
        </Badge>
      );
  }
}
