import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

for (const app of ["app", "admin"]) {
  test(`${app} resolves the shared source and styles`, () => {
    const require = createRequire(
      new URL(`../../../apps/${app}/package.json`, import.meta.url),
    );
    for (const entry of [
      "components/typography",
      "components/finance-summary",
      "globals.css",
    ]) {
      assert.ok(
        require.resolve(`@perpix/ui/${entry}`).includes("/packages/ui/src/"),
      );
    }
  });
}
