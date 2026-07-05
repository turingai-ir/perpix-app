import type { RegisterSWOptions } from "virtual:pwa-register/react";

export type PwaUpdateStatus = "idle" | "available" | "updating";

export type PwaAutoUpdateDelay = number | false;

export type PwaUpdateOptions = Pick<
  RegisterSWOptions,
  | "immediate"
  | "onNeedReload"
  | "onNeedRefresh"
  | "onOfflineReady"
  | "onRegisteredSW"
  | "onRegisterError"
> & {
  updateCheckIntervalMs?: PwaAutoUpdateDelay;
};

export type PwaUpdateState = {
  needRefresh: boolean;
  status: PwaUpdateStatus;
  update: () => Promise<void>;
  close: () => void;
};
