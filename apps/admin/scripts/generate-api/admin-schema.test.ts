import assert from "node:assert/strict";
import test from "node:test";
import { adminApiSchema } from "./admin-schema";

test("keeps admin and login contracts with their transitive schemas", () => {
  const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
  const result = adminApiSchema({
    paths: {
      "/api/admin/v1/auth/me": { get: { responses: ref("Admin") } },
      "/api/v1/auth/login": { post: { requestBody: ref("Login") } },
      "/api/v1/gallery": { get: { responses: ref("Gallery") } },
    },
    components: {
      schemas: {
        Admin: { properties: { user: ref("User") } },
        User: { type: "object" },
        Login: { type: "object" },
        Gallery: { type: "object" },
      },
    },
  });
  assert.deepEqual(Object.keys(result.paths), [
    "/api/admin/v1/auth/me",
    "/api/v1/auth/login",
  ]);
  assert.deepEqual(Object.keys(result.components.schemas), [
    "Admin",
    "User",
    "Login",
  ]);
});
