import { useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import { Bot, User, Calendar, MessageSquare, Search } from "lucide-react";
import {
  useAiTaskDetail,
  useAiTaskMessages,
  type AiTaskMessageRowItem,
} from "../../hooks/use-ai-task-detail";
import { AiTaskMessageResultDialog } from "./ai-task-message-result-dialog";
import { DetailPageLayout } from "@/components/custom/detail-page-layout";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslate } from "@/hooks";

export function AiTaskDetailPage() {
  const { t } = useAppTranslate();
  const { taskUuid = "" } = useParams<{ taskUuid: string }>();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedMessage, setSelectedMessage] =
    useState<AiTaskMessageRowItem | null>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  const {
    task,
    isLoading: isTaskLoading,
    error: taskError,
    refetch: refetchTask,
  } = useAiTaskDetail(taskUuid);

  const {
    messages,
    totalCount,
    isLoading: isMessagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useAiTaskMessages(taskUuid, { page, limit });

  const handleOpenResultDialog = (msg: AiTaskMessageRowItem) => {
    setSelectedMessage(msg);
    setIsResultDialogOpen(true);
  };

  const columns: DataTableColumn<AiTaskMessageRowItem>[] = useMemo(
    () => [
      {
        id: "uuid",
        header: t("features.ai.tasks.messages.uuid", {
          defaultValue: "شناسه پیام",
        }),
        cell: (item) => (
          <code className="text-muted-foreground font-mono text-xs">
            {item.uuid.slice(0, 8)}...
          </code>
        ),
      },
      {
        id: "role",
        header: t("features.ai.tasks.messages.role", {
          defaultValue: "نقش (Role)",
        }),
        cell: (item) => (
          <Badge
            variant={item.role === "assistant" ? "default" : "secondary"}
            className="text-[11px]"
          >
            {item.role}
          </Badge>
        ),
      },
      {
        id: "message",
        header: t("features.ai.tasks.messages.content", {
          defaultValue: "متن پیام",
        }),
        cell: (item) => (
          <p
            className="max-w-md truncate font-mono text-xs"
            title={item.message || ""}
          >
            {item.message || "-"}
          </p>
        ),
      },
      {
        id: "status",
        header: t("features.ai.tasks.messages.status", {
          defaultValue: "وضعیت",
        }),
        cell: (item) => (
          <span className="text-xs font-medium">{item.task_status || "-"}</span>
        ),
      },
      {
        id: "created_at",
        header: t("features.ai.tasks.messages.createdAt", {
          defaultValue: "زمان ارسال",
        }),
        cell: (item) => (
          <span className="text-muted-foreground text-xs" dir="ltr">
            {new Date(item.created_at).toLocaleString("fa-IR")}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: (item) => (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => handleOpenResultDialog(item)}
            >
              <Search className="size-3" />
              {t("features.ai.tasks.messages.checkResult", {
                defaultValue: "بررسی نتیجه",
              })}
            </Button>
          </div>
        ),
      },
    ],
    [t],
  );

  return (
    <>
      <DetailPageLayout
        breadcrumbs={[
          {
            label: t("features.ai.tasks.menuTitle", {
              defaultValue: "وظایف هوش مصنوعی",
            }),
            href: "/ai/tasks",
          },
          {
            label: task?.uuid || taskUuid.slice(0, 8),
          },
        ]}
        title={t("features.ai.tasks.detailTitle", {
          defaultValue: "جزئیات وظیفه هوش مصنوعی",
        })}
        subtitle={task?.uuid}
        isLoading={isTaskLoading}
        isError={Boolean(taskError)}
        errorMessage={
          taskError instanceof Error ? taskError.message : undefined
        }
        onRetry={() => {
          void refetchTask();
          void refetchMessages();
        }}
      >
        <div className="space-y-6">
          {/* Overview Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Bot className="text-primary size-4" />
                {t("features.ai.tasks.overview", {
                  defaultValue: "مشخصات وظیفه",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <User className="size-3.5" />
                    {t("features.ai.tasks.user", { defaultValue: "کاربر" })}
                  </span>
                  <div>
                    {task?.user_uuid ? (
                      <Link
                        to={`/users/${task.user_uuid}`}
                        className="text-primary font-mono text-xs font-medium hover:underline"
                      >
                        {task.user_uuid}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Bot className="size-3.5" />
                    {t("features.ai.tasks.type", {
                      defaultValue: "نوع پردازش",
                    })}
                  </span>
                  <div className="text-xs font-semibold">
                    {task?.task_type || "-"}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Calendar className="size-3.5" />
                    {t("features.ai.tasks.createdAt", {
                      defaultValue: "تاریخ ثبت",
                    })}
                  </span>
                  <div className="text-xs" dir="ltr">
                    {task?.created_at
                      ? new Date(task.created_at).toLocaleString("fa-IR")
                      : "-"}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Calendar className="size-3.5" />
                    {t("features.ai.tasks.updatedAt", {
                      defaultValue: "آخرین بروزرسانی",
                    })}
                  </span>
                  <div className="text-xs" dir="ltr">
                    {task?.updated_at
                      ? new Date(task.updated_at).toLocaleString("fa-IR")
                      : "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages List Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <MessageSquare className="text-primary size-4" />
                {t("features.ai.tasks.messagesList", {
                  defaultValue: "پیام‌های این وظیفه",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable<AiTaskMessageRowItem>
                keyExtractor={(item) => item.uuid}
                data={messages ? Array.from(messages) : []}
                columns={columns}
                isLoading={isMessagesLoading}
                isError={Boolean(messagesError)}
                errorMessage={
                  messagesError instanceof Error
                    ? messagesError.message
                    : undefined
                }
                onRetry={() => void refetchMessages()}
                pagination={{
                  page,
                  limit,
                  totalCount,
                  onPageChange: setPage,
                  onLimitChange: setLimit,
                }}
                emptyMessage={t("features.ai.tasks.noMessages", {
                  defaultValue: "پیامی برای این وظیفه ثبت نشده است.",
                })}
              />
            </CardContent>
          </Card>
        </div>
      </DetailPageLayout>

      {/* Message Result Modal */}
      <AiTaskMessageResultDialog
        open={isResultDialogOpen}
        onOpenChange={setIsResultDialogOpen}
        userUuid={selectedMessage?.user_uuid || task?.user_uuid}
        taskMessageUuid={selectedMessage?.uuid}
      />
    </>
  );
}
