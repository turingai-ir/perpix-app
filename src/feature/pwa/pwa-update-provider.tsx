import { PwaUpdateDialog } from "./pwa-update-dialog";
import { usePwaUpdate } from "./use-pwa-update";
import type { PwaUpdateOptions } from "./types";

type PwaUpdateProviderProps = {
  options?: PwaUpdateOptions;
};

export function PwaUpdateProvider({ options }: PwaUpdateProviderProps) {
  const updateState = usePwaUpdate(options);

  return <PwaUpdateDialog {...updateState} />;
}
