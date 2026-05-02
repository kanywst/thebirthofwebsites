# The Birth of Websites

> A visual timeline of IT history — from FORTRAN to Claude 4.

[![CI](https://github.com/kanywst/thebirthofwebsites/actions/workflows/deploy.yml/badge.svg)](https://github.com/kanywst/thebirthofwebsites/actions/workflows/deploy.yml)
[![Vue](https://img.shields.io/badge/vue-3.5-42b883)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/vite-8-646cff)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/typescript-5.9-3178c6)](https://www.typescriptlang.org)
[![pnpm](https://img.shields.io/badge/pnpm-10-f69220)](https://pnpm.io)

**[→ Live](https://kanywst.github.io/thebirthofwebsites/)**

## Quickstart

```sh
pnpm install
pnpm dev
```

Requires Node 20.19+ / 22.12+ and pnpm 10+.

## Stack

Vue 3.5 · Vite 8 · TypeScript · vue-i18n · Biome · Vitest · pnpm.
Light / dark via `light-dark()`. Deployed to GitHub Pages by parallel CI
(lint · typecheck · test → build).

## Develop

|                  |                                   |
| ---------------- | --------------------------------- |
| `pnpm dev`       | dev server                        |
| `pnpm build`     | production build into `./dist`    |
| `pnpm preview`   | serve `./dist`                    |
| `pnpm lint`      | Biome check (`lint:fix` to write) |
| `pnpm typecheck` | `vue-tsc --noEmit`                |
| `pnpm test`      | Vitest                            |

## Data

266 entries in [`info.json`](./info.json), filterable by category ×
nationality × era 元号 (令和 / 平成 / 昭和 / 大正 / 明治). The `Item` shape
and pure search / filter helpers live in
[`src/lib/items.ts`](./src/lib/items.ts).

Idempotent maintenance scripts under [`scripts/`](./scripts):

| Script                   | What it does                                   |
| ------------------------ | ---------------------------------------------- |
| `update-info.mjs`        | hygiene (Reiwa retag, type typos, name trim)   |
| `apply-rebrands.mjs`     | corporate events on existing entries           |
| `add-modern-entries.mjs` | append new entries by name                     |
| `sync-icons.mjs`         | logos via `simple-icons` + monochrome fallback |
