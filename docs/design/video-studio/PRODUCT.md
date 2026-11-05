# Video studio — bounded product context

This document records the existing video-generation workflow for the scoped UI extension. It does not establish a new product identity or change generation services.

## Audience and purpose

Persian-speaking creators turn a written scene, optionally supported by images, into a video. The page helps them describe a shot, select an available model and configuration, understand the actual request state, then watch or download the result.

## Existing workflow

1. Compose a prompt and choose the supported settings.
2. Submit the request; display its actual queued or processing state.
3. Show the completed clip inline, with an optional larger screening dialog and download action.
4. Recover from generation or media-loading failures through the existing retry paths.

## Constraints

- Preserve the existing dark/violet visual system, RTL layout and Persian i18n keys.
- Use conversational, confident Persian and restrained creative humor. Errors and recovery remain direct.
- Do not invent completion percentages, queue positions or time estimates.
- Keep processing animation optional, respect reduced motion and pause it when not visible.
- Keep completed media uncropped, with accessible native playback controls and explicit actions.
- Preserve service integration, download behavior and media URL recovery; do not introduce dependencies or an architectural rewrite.
- Support the existing desktop and 375px mobile layouts.

## Scope and evidence

Scope: video-page copy, the idle/processing composition, its compact status panel, and completed-video cards/dialogs. Reference: `../video-studio-motion-brief.md`. The implementation was checked with targeted generation and media-control tests and desktop/mobile captures. The synthetic test clip is not a shipping asset. Live paid generation was not exercised.
