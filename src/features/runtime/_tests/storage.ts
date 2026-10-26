import { get, keys, set } from "idb-keyval";
import { dehydrate, onlineManager } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

export async function seedLegacyOfflineData() {
  queryClient.setQueryData(["offline-sentinel"], { cached: true });
  await set("REACT_QUERY_OFFLINE_CACHE", {
    timestamp: Date.now(),
    buster: "",
    clientState: dehydrate(queryClient),
  });
  await set("file-manager:completion:test:old-file", {
    upload_id: "old-token",
  });
  await set("editor-snapshot:offline-removal-test", { layers: ["draft"] });
}
export async function storedData() {
  return {
    keys: await keys(),
    draft: await get("editor-snapshot:offline-removal-test"),
  };
}

export async function exerciseDisconnectedRequests() {
  const previous = onlineManager.isOnline();
  onlineManager.setOnline(false);
  let queries = 0;
  let mutations = 0;
  try {
    const query = queryClient
      .query({
        queryKey: ["disconnected-request"],
        retry: false,
        queryFn: () => {
          queries++;
          throw new Error("Connection unavailable");
        },
      })
      .then(
        () => "success",
        () => "error",
      );
    const mutation = queryClient
      .getMutationCache()
      .build(queryClient, {
        mutationFn: async () => {
          mutations++;
          throw new Error("Connection unavailable");
        },
      })
      .execute(undefined)
      .then(
        () => "success",
        () => "error",
      );
    const results = await Promise.race([
      Promise.all([query, mutation]),
      new Promise<string[]>((resolve) =>
        setTimeout(() => resolve(["paused"]), 1_000),
      ),
    ]);
    return { results, queries, mutations };
  } finally {
    onlineManager.setOnline(previous);
  }
}
