import { expect, test } from "@playwright/test";

import {
  getHistoryTaskType,
  getUniqueHistoryItems,
} from "../model/sidebar-history";

import { APP_ROUTES_KEY } from "@/app/router/routes";

test("history follows the studio on the current route", () => {
  expect(getHistoryTaskType(`${APP_ROUTES_KEY.generation.image.path}/x`)).toBe(
    "IMAGE",
  );
  expect(getHistoryTaskType(`${APP_ROUTES_KEY.generation.video.path}/x`)).toBe(
    "VIDEO",
  );
  expect(getHistoryTaskType("/gallery")).toBeUndefined();
});

test("history items are flattened and de-duplicated in order", () => {
  const pages = [
    { items: [{ uuid: "a" }, { uuid: "b" }] },
    { items: [{ uuid: "b" }, { uuid: "c" }] },
  ];

  expect(getUniqueHistoryItems(pages).map((item) => item.uuid)).toEqual([
    "a",
    "b",
    "c",
  ]);
  expect(getUniqueHistoryItems(undefined)).toEqual([]);
});
