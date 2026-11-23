# perpix-web

One repository for PerPix's web frontends and the code they share.

| Path                        | What                                                                                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/app`                  | The user app (generation, gallery, wallet, and the studio).                                                                                                |
| `apps/admin`                | The admin panel.                                                                                                                                           |
| `packages/caption-renderer` | How a caption looks at a moment in time. The app exports video with it and the admin panel previews the caption presets with it, so the two cannot differ. |

## Working here

```bash
pnpm install              # once, at the root
pnpm dev:app              # the app, http://localhost:5173
pnpm dev:admin            # the admin panel
pnpm build                # build everything (Turborepo caches unchanged work)
pnpm lint                 # Oxlint across the workspace
pnpm lint:fix
pnpm format               # Oxfmt, including Tailwind class sorting
pnpm format:check
pnpm test:tooling
pnpm typecheck
pnpm --filter perpix-app <script>   # any script of one app, e.g. scripts:generate-api
```

[Turborepo](https://turborepo.dev/) runs the tasks in `turbo.json`; `pnpm-workspace.yaml` lists the workspaces and holds the pnpm settings both apps share.

## Adding shared code

Put it in `packages/<name>` with a `package.json` named `@perpix/<name>`, depend on it with `"@perpix/<name>": "workspace:*"` and import it by name. A package that is plain TypeScript needs no build step: its `exports` point at `src/index.ts` and each app's Vite compiles it.

## Docker and deployment

Each app keeps its `Dockerfile` and `compose.yaml` in `apps/<name>/`. The **build context is the repository root** (`context: ../..` in the compose file, `docker build -f apps/<name>/Dockerfile .`), so an image can use the packages. Environment files (`.env`, `.env.prod`) stay next to each app's `compose.yaml`: `apps/app/.env`, `apps/admin/.env`.

Anything that deploys these apps (Komodo stacks, CI) must point at `apps/<name>/compose.yaml` and keep the repository root as the build context.

## Linting and formatting

`packages/tooling` (`@perpix/tooling`) owns the Oxlint and Oxfmt rules, ignores,
Tailwind sorting, and the custom design-token rule. Workspace config files only
import these presets, so editors and package commands use the same rules. Tool
versions are pinned once in the pnpm catalog. ESLint and Prettier are no longer
invoked or installed directly by the workspace.

Every app and shared package has `lint`, `lint:fix`, `format`, and `format:check`
scripts. For example: `pnpm --filter perpix-admin-panel lint`.
Generated API clients, build output, reports, agent tooling, and lockfiles are
excluded. The admin API generator explicitly uses the shared `formatSource` API
when creating a client; it never silently skips formatting errors.

The former Mantine preset is replaced by the explicit shared Oxlint policy.
Supported React, hooks, TypeScript, accessibility, and refresh checks run natively;
the project design-token rule uses Oxlint's JavaScript plugin API. Existing
warnings remain warnings; formatting is checked separately with `format:check`.
Use the **Oxc** editor extension (`oxc.oxc-vscode`) for lint diagnostics and formatting.

## Vite and Oxc toolchain

`@perpix/tooling/vite` provides `createViteConfig()`: the React Oxc transform,
Tailwind plugin, modern Vite browser target, and Oxc minifier. Both applications
merge their release, proxy, aliases, and chunk settings into this preset.
Storybook uses the same preset with `{ react: false }` because its Vite framework
already supplies React. Vite 8 handles bundling and dependency optimization with
Rolldown. There is no legacy/SystemJS build, Babel transform, or Terser minifier.

All workspace `typecheck` commands and app builds use the Rust `tsrs` compiler.
Its version is pinned in the pnpm catalog; it currently targets TypeScript 7.1
beta, so compiler upgrades require the workspace typechecks and tooling tests.
The TypeScript package remains only in the two apps for the AST API required by
`openapi-typescript` and the API generators, not for checking or transpiling apps.

The `perpix-ts` executable from `@perpix/tooling` runs TypeScript scripts through
Oxc's Node register hook, replacing `tsx`. It supports `--tsconfig <path>` and
forwards Node flags (including `--test`) and script arguments. For example:

```sh
pnpm --filter perpix-app exec perpix-ts --tsconfig scripts/tsconfig.json --test scripts/generate-api/public-schema.test.ts
```

Caption-renderer unit tests use Vitest 5 with Vite 8. Browser end-to-end tests
continue to use Playwright; native JavaScript tooling tests use Node's test
runner. These runners exercise the same Vite/Oxc-built code.
