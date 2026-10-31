import { del, keys } from "idb-keyval";

export async function clearOldOfflineCache() {
  const cached = await keys();
  await Promise.all(
    cached
      .filter(
        (key) =>
          typeof key === "string" &&
          (key === "REACT_QUERY_OFFLINE_CACHE" ||
            key.startsWith("file-manager:completion:")),
      )
      .map((key) => del(key)),
  );
}
