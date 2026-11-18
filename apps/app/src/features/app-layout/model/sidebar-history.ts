import { APP_ROUTES_KEY } from "@/app/router/routes";
import type { AiRegistryModelSupportedTypesEnumKey } from "@/shared/api";

/** The studio on the current route decides which task history is shown. */
export const getHistoryTaskType = (
  pathname: string,
): AiRegistryModelSupportedTypesEnumKey | undefined => {
  if (pathname.includes(APP_ROUTES_KEY.generation.image.path)) {
    return "IMAGE";
  }
  if (pathname.includes(APP_ROUTES_KEY.generation.video.path)) {
    return "VIDEO";
  }
  return undefined;
};

/** Flattens the pages; each task stays at its first position with its last copy. */
export const getUniqueHistoryItems = <TItem extends { uuid: string }>(
  pages: readonly { items: ArrayLike<TItem> }[] | undefined,
) => {
  const items = pages?.flatMap((page) => Array.from(page.items)) ?? [];
  return Array.from(new Map(items.map((item) => [item.uuid, item])).values());
};
