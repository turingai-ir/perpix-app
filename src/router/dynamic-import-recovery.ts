import type { ComponentType } from "react";

type DefaultRouteModule = { default: ComponentType };

const reloadStorageKey = "perpix:dynamic-import-reload";
const dynamicImportFailurePattern =
  /Failed to fetch|Importing a module script failed/i;
let pendingRouteImports = 0;
let routeImportFailed = false;

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
  if (pendingRouteImports === 0) {
    routeImportFailed = false;
  }
  pendingRouteImports += 1;

  try {
    return await importRouteModule();
  } catch (error) {
    routeImportFailed = true;
    if (shouldReloadForDynamicImportFailure(error) && reloadOnce()) {
      return new Promise<never>(() => undefined);
    }

    throw error;
  } finally {
    pendingRouteImports -= 1;
    // Nested routes load together; a successful layout must not erase a child's failure.
    if (pendingRouteImports === 0 && !routeImportFailed) {
      try {
        window.sessionStorage.removeItem(reloadStorageKey);
      } catch {
        // Storage restrictions must not prevent a successfully loaded route.
      }
    }
  }
}
