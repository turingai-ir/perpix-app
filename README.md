# perpix-web

One repository for PerPix's web frontends and the code they share.

| Path | What |
|---|---|
| `apps/app` | The user app (generation, gallery, wallet, and the studio). |
| `apps/admin` | The admin panel. |
| `packages/caption-renderer` | How a caption looks at a moment in time. The app exports video with it and the admin panel previews the caption presets with it, so the two cannot differ. |

## Working here

```bash
pnpm install              # once, at the root
pnpm dev:app              # the app, http://localhost:5173
pnpm dev:admin            # the admin panel
pnpm build                # build everything (Turborepo caches unchanged work)
pnpm lint
pnpm typecheck
pnpm --filter perpix-app <script>   # any script of one app, e.g. scripts:generate-api
```

[Turborepo](https://turborepo.dev/) runs the tasks in `turbo.json`; `pnpm-workspace.yaml` lists the workspaces and holds the pnpm settings both apps share.

## Adding shared code

Put it in `packages/<name>` with a `package.json` named `@perpix/<name>`, depend on it with `"@perpix/<name>": "workspace:*"` and import it by name. A package that is plain TypeScript needs no build step: its `exports` point at `src/index.ts` and each app's Vite compiles it.

## Docker and deployment

Each app keeps its `Dockerfile` and `compose.yaml` in `apps/<name>/`. The **build context is the repository root** (`context: ../..` in the compose file, `docker build -f apps/<name>/Dockerfile .`), so an image can use the packages. Environment files (`.env`, `.env.prod`) stay next to each app's `compose.yaml`: `apps/app/.env`, `apps/admin/.env`.

Anything that deploys these apps (Komodo stacks, CI) must point at `apps/<name>/compose.yaml` and keep the repository root as the build context.
