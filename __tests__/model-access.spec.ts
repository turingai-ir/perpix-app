import { expect, test } from "@playwright/test";

import { getDefaultAccessibleModel } from "../src/pages/(app)/generation/_utils/model-access";

const models = [
  { uuid: "model-locked", name: "LOCKED_MODEL" },
  { uuid: "model-allowed", name: "ALLOWED_MODEL" },
  { uuid: "model-other", name: "OTHER_MODEL" },
];

test("selects the first model available to the active subscription", () => {
  expect(getDefaultAccessibleModel(models, ["ALLOWED_MODEL"])?.uuid).toBe(
    "model-allowed",
  );
});

test("falls back to the first model when the subscription allows none", () => {
  expect(getDefaultAccessibleModel(models, ["MISSING_MODEL"])?.uuid).toBe(
    "model-locked",
  );
});

test("keeps the first model as default when there is no allow-list", () => {
  expect(getDefaultAccessibleModel(models, undefined)?.uuid).toBe(
    "model-locked",
  );
});
