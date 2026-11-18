import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Layers,
  Pencil,
  Plug,
  PlusCircle,
  Power,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslate } from "@/hooks";
import { useAiModelActions } from "../../hooks/use-ai-model-actions";
import type {
  AiRegistryModelProviderLinkDetail,
  ProvidersRow,
} from "../../model/types";
import { switchedOffModes } from "../../model/link-modes";
import { AiModelProviderLinkDialog } from "./ai-model-provider-link-dialog";

interface AiModelProvidersPanelProps {
  modelUuid: string;
  modelName: string;
  links: readonly AiRegistryModelProviderLinkDetail[];
  providers: readonly ProvidersRow[];
  onChanged: () => void;
}

type LinkWithProvider = AiRegistryModelProviderLinkDetail & {
  provider_uuid: string;
};

const hasProvider = (
  link: AiRegistryModelProviderLinkDetail,
): link is LinkWithProvider => Boolean(link.provider_uuid);

/** Providers of a model, highest priority first, with add / edit / reorder. */
export function AiModelProvidersPanel({
  modelUuid,
  modelName,
  links,
  providers,
  onChanged,
}: AiModelProvidersPanelProps) {
  const { t } = useAppTranslate();
  const { updateProviderLink, reorderProviders, isReorderingProviders } =
    useAiModelActions();

  // Order shown while a reorder request is in flight (optimistic).
  const [pendingOrder, setPendingOrder] = useState<string[] | null>(null);
  const [dialog, setDialog] = useState<{
    key: string;
    link: AiRegistryModelProviderLinkDetail | null;
  } | null>(null);
  const [togglingUuid, setTogglingUuid] = useState<string | null>(null);

  const providerByUuid = useMemo(
    () => new Map(providers.map((p) => [p.uuid, p])),
    [providers],
  );

  const sortedLinks = useMemo(
    () => links.filter(hasProvider).sort((a, b) => b.priority - a.priority),
    [links],
  );

  const orderedLinks = useMemo(() => {
    if (!pendingOrder) return sortedLinks;
    const byUuid = new Map(sortedLinks.map((l) => [l.provider_uuid, l]));
    return pendingOrder.flatMap((uuid) => byUuid.get(uuid) ?? []);
  }, [pendingOrder, sortedLinks]);

  const orderedUuids = orderedLinks.map((l) => l.provider_uuid);
  const linkedUuids = new Set(orderedUuids);
  const availableProviders = providers.filter((p) => !linkedUuids.has(p.uuid));

  const move = async (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= orderedUuids.length) return;

    const next = [...orderedUuids];
    [next[index], next[target]] = [next[target], next[index]];
    setPendingOrder(next);
    try {
      await reorderProviders(modelUuid, next);
      onChanged();
    } catch {
      // toast handled in hook
    } finally {
      setPendingOrder(null);
    }
  };

  const toggleActive = async (link: LinkWithProvider) => {
    setTogglingUuid(link.provider_uuid);
    try {
      await updateProviderLink(modelUuid, link.provider_uuid, {
        is_active: !link.is_active,
      });
      onChanged();
    } catch {
      // toast handled in hook
    } finally {
      setTogglingUuid(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="text-primary size-4" />
            {t("features.ai.models.providersTitle", {
              defaultValue: "ارائه‌دهندگان مدل",
            })}
            <Badge variant="muted">{orderedLinks.length}</Badge>
          </CardTitle>
          <p className="text-muted-foreground mt-1 text-xs">
            برای هر حالت، درخواست به بالاترین ردیفی می‌رود که هم فعال باشد و هم
            آن حالت در «حالت‌های Workflow»ش روشن باشد. اتصالی که حالتش خاموش است
            در اولویت‌بندی نادیده گرفته می‌شود و اگر هیچ اتصالی روشن نباشد،
            درخواست رد می‌شود.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => setDialog({ key: "add", link: null })}
        >
          <PlusCircle className="size-3.5" />
          افزودن ارائه‌دهنده
        </Button>
      </CardHeader>

      <CardContent>
        {orderedLinks.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-sm">
            <Plug className="size-6" />
            این مدل هنوز به هیچ ارائه‌دهنده‌ای متصل نیست.
          </div>
        ) : (
          <ol className="space-y-2">
            {orderedLinks.map((link, index) => {
              const provider = providerByUuid.get(link.provider_uuid);
              const isToggling = togglingUuid === link.provider_uuid;
              return (
                <li
                  key={link.provider_uuid}
                  className="bg-card flex flex-wrap items-center gap-3 rounded-lg border p-3"
                >
                  <span className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-foreground text-sm font-semibold">
                        {provider?.display_name ||
                          provider?.name ||
                          link.provider_uuid.slice(0, 8)}
                      </span>
                      {provider?.display_name && (
                        <code className="text-muted-foreground font-mono text-[11px]">
                          {provider.name}
                        </code>
                      )}
                      <Badge variant={link.is_active ? "success" : "muted"}>
                        {link.is_active ? "فعال" : "غیرفعال"}
                      </Badge>
                      {index === 0 &&
                        link.is_active &&
                        (link.workflow_modes ?? []).length > 0 && (
                          <Badge variant="default">اولویت اول</Badge>
                        )}
                    </div>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span dir="ltr">priority: {link.priority}</span>
                      {Array.from(link.workflow_modes ?? []).map((mode) => (
                        <Badge
                          key={mode}
                          variant="outline"
                          className="px-1.5 py-0 text-[10px]"
                        >
                          {mode}
                        </Badge>
                      ))}
                      {link.is_active &&
                        switchedOffModes(link).map((mode) => (
                          <Badge
                            key={`off-${mode}`}
                            variant="warning"
                            className="px-1.5 py-0 text-[10px]"
                            title="این حالت روشن نیست؛ درخواست برای آن به این اتصال نمی‌رسد."
                          >
                            خاموش: {mode}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="انتقال به بالا"
                      disabled={index === 0 || isReorderingProviders}
                      onClick={() => void move(index, -1)}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="انتقال به پایین"
                      disabled={
                        index === orderedLinks.length - 1 ||
                        isReorderingProviders
                      }
                      onClick={() => void move(index, 1)}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() =>
                        setDialog({ key: link.provider_uuid, link })
                      }
                    >
                      <Pencil className="size-3.5" />
                      ویرایش
                    </Button>
                    <Button
                      variant={link.is_active ? "ghost" : "outline"}
                      size="sm"
                      className="gap-1"
                      disabled={isToggling}
                      onClick={() => void toggleActive(link)}
                    >
                      <Power className="size-3.5" />
                      {link.is_active ? "غیرفعال‌سازی" : "فعال‌سازی"}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>

      {dialog && (
        <AiModelProviderLinkDialog
          key={dialog.key}
          open
          onOpenChange={(open) => !open && setDialog(null)}
          modelUuid={modelUuid}
          modelName={modelName}
          link={dialog.link}
          availableProviders={availableProviders}
          orderedProviderUuids={orderedUuids}
          onSuccess={onChanged}
        />
      )}
    </Card>
  );
}
