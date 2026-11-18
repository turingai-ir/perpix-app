import assert from "node:assert/strict";
import test from "node:test";
import { publicApiSchema } from "./public-schema";

test("removes admin routes and their exclusive schemas, preserving shared and nested public schemas", () => {
  const reference = (name: string) => ({
    $ref: `#/components/schemas/${name}`,
  });
  const result = publicApiSchema({
    openapi: "3.1.0",
    paths: {
      "/api/v1/payment-intents": { get: { responses: reference("Payment") } },
      "/api/admin/v1/user/list": { get: { responses: reference("AdminUser") } },
    },
    components: {
      schemas: {
        Payment: { properties: { amount: reference("Money") } },
        Money: { type: "string" },
        AdminUser: { properties: { amount: reference("Money") } },
      },
    },
  });
  assert.deepEqual(Object.keys(result.paths), ["/api/v1/payment-intents"]);
  assert.deepEqual(Object.keys(result.components.schemas), [
    "Payment",
    "Money",
  ]);
});
