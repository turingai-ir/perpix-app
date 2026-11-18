import type { ComponentType } from "react";

type DefaultRouteModule = { default: ComponentType };

const reloadStorageKey = "perpix:dynamic-import-reload";
const dynamicImportFailurePattern =
  /Failed to fetch|Importing a module script failed/i;

function shouldReloadForDynamicImportFailure(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return dynamicImportFailurePattern.test(error.message);
}

function reloadOnce(): boolean {
  try {
    if (window.sessionStorage.getItem(reloadStorageKey)) {
      return false;
    }

    window.sessionStorage.setItem(reloadStorageKey, "true");
    window.location.reload();
    return true;
  } catch {
    return false;
  }
}

export async function loadRouteModule(
  importRouteModule: () => Promise<DefaultRouteModule>,
): Promise<DefaultRouteModule> {
  try {
    const routeModule = await importRouteModule();
    window.sessionStorage.removeItem(reloadStorageKey);
    return routeModule;
  } catch (error) {
    if (shouldReloadForDynamicImportFailure(error) && reloadOnce()) {
      return new Promise<never>(() => undefined);
    }

    throw error;
  }
}
