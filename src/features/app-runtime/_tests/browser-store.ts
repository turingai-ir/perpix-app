import { get, keys, set } from "idb-keyval";
import { onlineManager } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

export async function readOldCache() {
  try {
    return JSON.stringify(await get("REACT_QUERY_OFFLINE_CACHE")) ?? "";
  } catch {
    return "";
  }
}
export async function seedOldCache() {
  await set("REACT_QUERY_OFFLINE_CACHE", { private: "old-account" });
  await set("file-manager:completion:old", { upload_id: "old-token" });
  await set("editor-snapshot:keep-draft", { layers: [1] });
}
export async function inspectStorage() {
  return { keys: await keys(), draft: await get("editor-snapshot:keep-draft") };
}
export async function exerciseDisconnectedRequests() {
  const previous = onlineManager.isOnline();
  onlineManager.setOnline(false);
  let queries = 0,
    mutations = 0;
  try {
    const query = queryClient
      .fetchQuery({
        queryKey: ["disconnected-test"],
        retry: false,
        queryFn: () => {
          queries++;
          throw new Error("No connection");
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
          throw new Error("No connection");
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
        setTimeout(() => resolve(["queued"]), 1_000),
      ),
    ]);
    return { results, queries, mutations };
  } finally {
    onlineManager.setOnline(previous);
  }
}
