import { useState } from "react";
import { useParams } from "react-router";
import { Edit } from "lucide-react";
import { DetailPageLayout } from "@/components/custom/detail-page-layout";
import { CopyableUuid } from "@/components/custom/copyable-uuid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslate } from "@/hooks";
import { UsdmicroAmount } from "@/components/custom/usdmicro-amount";
import { APP_ROUTES_KEY } from "@/router/routes";
import type { AiRegistryModelProviderLinkDetail } from "../../model/types";
import { useAiModelDetail } from "../../hooks/use-ai-model-detail";
import { useAiProvidersList } from "../../hooks/use-ai-providers-list";
import { AiModelFormDialog } from "./ai-model-form-dialog";
import { AiModelProvidersPanel } from "./ai-model-providers-panel";

export function AiModelDetailPage() {
  const { t } = useAppTranslate();
  const { modelUuid = "" } = useParams<{ modelUuid: string }>();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { model, isLoading, error, refetch } = useAiModelDetail(modelUuid);
  const { providers } = useAiProvidersList({ limit: 50 });

  const title = model?.display_name || model?.name || "";

  return (
    <DetailPageLayout
      breadcrumbs={[
        { label: t("overview.admin", { defaultValue: "پنل مدیریت" }) },
        {
          label: t("features.ai.models.pageTitle", {
            defaultValue: "مدل‌های هوش مصنوعی",
          }),
          href: APP_ROUTES_KEY.ai.models.path,
        },
        { label: title || modelUuid.slice(0, 8) },
      ]}
      backHref={APP_ROUTES_KEY.ai.models.path}
      backLabel="بازگشت به مدل‌ها"
      title={title}
      subtitle={
        model && (
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <code className="font-mono text-xs" dir="ltr">
              {model.name}
            </code>
            <CopyableUuid value={model.uuid} full className="text-xs" />
          </span>
        )
      }
      badges={
        model && (
          <>
            <Badge variant={model.is_active ? "success" : "muted"}>
              {model.is_active ? "فعال" : "غیرفعال"}
            </Badge>
            <Badge variant="outline">{model.model_owner}</Badge>
          </>
        )
      }
      actions={
        model && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="size-3.5" />
            ویرایش مدل
          </Button>
        )
      }
      isLoading={isLoading}
      isError={Boolean(error)}
      errorMessage={error instanceof Error ? error.message : undefined}
      onRetry={() => void refetch()}
    >
      {model && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">مشخصات مدل</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <Field label="ورودی‌ها">
                <BadgeList items={Array.from(model.supported_inputs)} />
              </Field>
              <Field label="خروجی‌ها">
                <BadgeList items={Array.from(model.supported_outputs)} />
              </Field>
              <Field label="دامنه هزینه">
                <span className="flex flex-col gap-1 text-xs">
                  <span>
                    از <UsdmicroAmount value={model.min_cost} hint="inline" />
                  </span>
                  <span>
                    تا <UsdmicroAmount value={model.max_cost} hint="inline" />
                  </span>
                </span>
              </Field>
              <Field label="برچسب‌ها">
                <BadgeList items={Array.from(model.tags)} />
              </Field>
              {model.description && (
                <div className="sm:col-span-2 lg:col-span-4">
                  <Field label="توضیحات">
                    <p className="text-muted-foreground text-xs leading-6">
                      {model.description}
                    </p>
                  </Field>
                </div>
              )}
            </CardContent>
          </Card>

          <AiModelProvidersPanel
            modelUuid={model.uuid}
            modelName={model.name}
            // The query type mangles nested readonly arrays; the shape is the schema's.
            links={
              Array.from(
                model.provider_links ?? [],
              ) as unknown as AiRegistryModelProviderLinkDetail[]
            }
            providers={providers}
            onChanged={() => void refetch()}
          />

          <AiModelFormDialog
            key={model.updated_at}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            initialModel={model}
            onSuccess={() => void refetch()}
          />
        </div>
      )}
    </DetailPageLayout>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-muted-foreground block text-[11px] font-semibold">
        {label}
      </span>
      {children}
    </div>
  );
}

function BadgeList({ items }: { items: readonly string[] }) {
  if (items.length === 0)
    return <span className="text-muted-foreground">-</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => (
        <Badge
          key={item}
          variant="secondary"
          className="px-1.5 py-0 text-[10px]"
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}
