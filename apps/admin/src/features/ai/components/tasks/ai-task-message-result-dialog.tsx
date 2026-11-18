import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAiTaskMessageResult } from "../../hooks/use-ai-task-message-result";
import { useAppTranslate } from "@/hooks";
import {
  Clock,
  AlertTriangle,
  Cpu,
  Copy,
  Check,
  MessageSquare,
  Bot,
  User,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface AiTaskMessageResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userUuid?: string;
  taskMessageUuid?: string;
}

export function AiTaskMessageResultDialog({
  open,
  onOpenChange,
  userUuid,
  taskMessageUuid,
}: AiTaskMessageResultDialogProps) {
  const { t } = useAppTranslate();
  const [copied, setCopied] = useState(false);
  const { result, isLoading, error } = useAiTaskMessageResult(
    userUuid,
    taskMessageUuid,
  );

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("متن پیام در کلیپ‌بورد کپی شد.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("خطا در کپی کردن متن.");
    }
  };

  const renderRoleBadge = (role?: string) => {
    switch (role) {
      case "ASSISTANT":
        return (
          <Badge className="gap-1 bg-purple-600 text-white">
            <Bot className="size-3" />
            دستیار (Assistant)
          </Badge>
        );
      case "USER":
        return (
          <Badge className="gap-1 bg-blue-600 text-white">
            <User className="size-3" />
            کاربر (User)
          </Badge>
        );
      case "SYSTEM":
        return (
          <Badge variant="secondary" className="gap-1">
            <Settings className="size-3" />
            سیستم (System)
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-mono text-xs">
            {role || "—"}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="size-5 text-indigo-500" />
            {t("features.ai.tasks.messageResultTitle", {
              defaultValue: "نتیجه اجرای پیام وظیفه",
            })}
          </DialogTitle>
          <DialogDescription>
            {t("features.ai.tasks.messageResultDesc", {
              defaultValue:
                "مشاهده خروجی، نقش و متادیتای پردازش شده توسط هوش مصنوعی",
            })}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
            {error instanceof Error
              ? error.message
              : "خطا در دریافت نتیجه پیام"}
          </div>
        ) : !result ? (
          <div className="text-muted-foreground py-6 text-center text-sm">
            {t("features.ai.tasks.noResult", {
              defaultValue: "نتیجه‌ای برای این پیام یافت نشد.",
            })}
          </div>
        ) : (
          <div className="space-y-4 py-2 text-sm">
            {/* Status and Role */}
            <div className="bg-muted/40 grid grid-cols-2 gap-4 rounded-lg border p-3">
              <div>
                <span className="text-muted-foreground block text-xs">
                  {t("features.ai.tasks.taskStatus", {
                    defaultValue: "وضعیت وظیفه",
                  })}
                  :
                </span>
                <div className="mt-1 flex items-center gap-1.5 font-medium">
                  {result.task_status === "IN_PROGRESS" ? (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-amber-500 text-white"
                    >
                      <Clock className="size-3" />
                      در حال پردازش
                    </Badge>
                  ) : result.task_status === "FAILED" ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="size-3" />
                      ناموفق
                    </Badge>
                  ) : result.task_status === "SUCCESS" ? (
                    <Badge className="gap-1 bg-emerald-600 text-white">
                      <CheckCircle2 className="size-3" />
                      موفق
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      {result.task_status || "—"}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-xs">
                  نقش پیام (Role):
                </span>
                <div className="mt-1">{renderRoleBadge(result.role)}</div>
              </div>
            </div>

            {/* Model Info */}
            <div className="bg-card flex items-center justify-between rounded-lg border p-3 text-xs">
              <span className="text-muted-foreground">
                {t("features.ai.tasks.modelUuid", {
                  defaultValue: "شناسه مدل انتخابی",
                })}
                :
              </span>
              <span className="font-mono font-medium" dir="ltr">
                {result.ai_model_uuid || "پیش‌فرض"}
              </span>
            </div>

            {/* Message Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <MessageSquare className="size-3.5 text-blue-500" />
                  محتوای پیام خروجی:
                </span>
                {result.message && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => handleCopy(result.message || "")}
                  >
                    {copied ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    {copied ? "کپی شد" : "کپی متن"}
                  </Button>
                )}
              </div>
              <div
                className="bg-muted/30 max-h-60 overflow-y-auto rounded-lg border p-3 text-xs leading-relaxed whitespace-pre-wrap select-text"
                dir="auto"
              >
                {result.message || (
                  <span className="text-muted-foreground italic">
                    پیامی ثبت نشده است.
                  </span>
                )}
              </div>
            </div>

            {/* Model Config */}
            {result.ai_model_config &&
              Object.keys(result.ai_model_config).length > 0 && (
                <div>
                  <span className="text-muted-foreground mb-1 block text-xs font-semibold">
                    {t("features.ai.tasks.modelConfig", {
                      defaultValue: "پیکربندی مدل (AI Model Config)",
                    })}
                  </span>
                  <pre
                    className="max-h-48 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100 dark:bg-zinc-900"
                    dir="ltr"
                  >
                    {JSON.stringify(result.ai_model_config, null, 2)}
                  </pre>
                </div>
              )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
