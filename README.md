# The Birth of Websites

A visual timeline of IT history — birthdays of major tech companies, web
services, programming languages, operating systems, and the AI wave of
2022-2026.

**[Live Demo](https://kanywst.github.io/thebirthofwebsites/)**

## Features

- **Historical timeline** from the 1960s through the 2026 generative-AI era.
- **Three-axis filtering**: category (SNS / EC / AI / OS / language / …),
  nationality, and Japanese era 元号 (令和 / 平成 / 昭和 / 大正 / 明治).
- **Multilingual** — English and Japanese, with per-entry localized
  descriptions.
- **OS-aware light / dark theme** via the CSS `light-dark()` function.
- **Monochrome flat design**, responsive layout.

## Tech Stack

- Vue 3.5 (`<script setup>` + Composition API)
- Vite 8 + TypeScript 5.9
- vue-i18n 11
- Biome 2 (lint + format)
- Vitest 4 (unit tests with happy-dom)
- pnpm 10

## Getting Started

Requires **Node.js 20.19+ / 22.12+** and **pnpm 10+**.

```bash
pnpm install
pnpm dev          # Vite dev server
pnpm build        # production build to ./dist
pnpm preview      # serve the built ./dist locally
```

## Quality gates

```bash
pnpm lint         # Biome lint + format check
pnpm lint:fix     # auto-fix
pnpm typecheck    # vue-tsc strict typecheck
pnpm test         # Vitest unit tests
```

CI runs lint / typecheck / test in parallel before `build`, then deploys
`./dist` to GitHub Pages on push to `master`.

## Data maintenance

The dataset lives in [`info.json`](./info.json) at the repo root. Each entry
follows the `Item` type defined in [`src/lib/items.ts`](./src/lib/items.ts).
Filtering uses exact tag matching against `item.type` (an array), so new
category / nationality / era values must also be added to the
`*_FILTERS` arrays in [`Birth.vue`](./src/components/Birth.vue) and the
`filters.*` keys in [`i18n.ts`](./src/i18n.ts) — both `en` and `ja`.

Helper scripts under [`scripts/`](./scripts) (re-runnable):

| Script | Purpose |
| --- | --- |
| `node scripts/sync-icons.mjs` | Copy required logos from `simple-icons` into `public/`; generate initial-letter SVG fallbacks for brands not in the set. |
| `node scripts/update-info.mjs` | One-shot data hygiene (Reiwa retag, type-array typos, name whitespace). |
| `node scripts/apply-rebrands.mjs` | Re-apply post-launch corporate events (acquisitions, rebrands, mergers) to known entries. |
| `node scripts/add-modern-entries.mjs` | Append the 2005-2026 entries (idempotent — skips entries already present by name). |
