#!/usr/bin/env node
/**
 * Copy SVG logos for the 2022-2026 entries from simple-icons into ./public.
 * For brands not present in simple-icons (OpenAI products, Bard, Midjourney,
 * Heroku, Stability AI, etc.) generate a monochrome initial-letter fallback
 * SVG so the card layout still renders.
 *
 * Re-runnable: skips already-existing destination files.
 */
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const PUBLIC_DIR = resolve(process.cwd(), "public")
const ICONS_DIR = resolve(process.cwd(), "node_modules", "simple-icons", "icons")

mkdirSync(PUBLIC_DIR, { recursive: true })

/** info.json `img` filename → simple-icons slug (without .svg), or null for fallback */
const MAP = {
  // OpenAI — no brandmark in simple-icons; fallback initial
  "chatgpt.svg": { fallback: "C" },
  "gpt4.svg": { fallback: "G" },
  "openaio1.svg": { fallback: "o1" },
  "openaio3.svg": { fallback: "o3" },
  "sora.svg": { fallback: "S" },
  "dalle2.svg": { fallback: "D" },

  // Anthropic Claude family — share claude brandmark
  "claude.svg": { slug: "claude" },
  "claude3.svg": { slug: "claude" },
  "claude4.svg": { slug: "claude" },

  // Google AI
  "bard.svg": { fallback: "B" },
  "gemini.svg": { slug: "googlegemini" },

  // Meta Llama family — share Meta brandmark
  "llama.svg": { slug: "meta" },
  "llama2.svg": { slug: "meta" },
  "llama3.svg": { slug: "meta" },
  "llama4.svg": { slug: "meta" },

  // AI labs
  "mistralai.svg": { slug: "mistralai" },
  "xai.svg": { slug: "x" },
  "grok.svg": { slug: "x" },
  "stabilityai.svg": { fallback: "SA" },
  "stablediffusion.svg": { fallback: "SD" },
  "midjourney.svg": { fallback: "MJ" },
  "elevenlabs.svg": { slug: "elevenlabs" },
  "perplexity.svg": { slug: "perplexity" },
  "deepseek.svg": { slug: "deepseek" },
  "cursor.svg": { slug: "cursor" },
  "suno.svg": { slug: "suno" },

  // Dev tools / runtimes
  "bun.svg": { slug: "bun" },
  "deno.svg": { slug: "deno" },
  "vercel.svg": { slug: "vercel" },
  "nextjs.svg": { slug: "nextdotjs" },
  "threads.svg": { slug: "threads" },
  "githubcopilot.svg": { slug: "githubcopilot" },
  "heroku.svg": { fallback: "H" },

  // Discontinued
  "stadia.svg": { slug: "stadia" },
  "googlewave.svg": { fallback: "GW" },
  "googlereader.svg": { fallback: "GR" },
}

function fallbackSvg(text) {
  const fontSize = text.length === 1 ? 16 : text.length === 2 ? 11 : 9
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><text x="12" y="17" text-anchor="middle" font-family="-apple-system,system-ui,sans-serif" font-size="${fontSize}" font-weight="700">${text}</text></svg>\n`
}

let copied = 0
let generated = 0
let skipped = 0
let missing = 0

for (const [filename, spec] of Object.entries(MAP)) {
  const dest = resolve(PUBLIC_DIR, filename)
  if (existsSync(dest)) {
    skipped++
    continue
  }

  if (spec.slug) {
    const src = resolve(ICONS_DIR, `${spec.slug}.svg`)
    if (existsSync(src)) {
      copyFileSync(src, dest)
      copied++
      continue
    }
    console.warn(`⚠ slug missing for ${filename}: ${spec.slug} — using fallback`)
    missing++
  }

  const text = spec.fallback ?? filename.replace(".svg", "").slice(0, 2).toUpperCase()
  writeFileSync(dest, fallbackSvg(text))
  generated++
}

console.log(`✓ Copied from simple-icons: ${copied}`)
console.log(`✓ Generated fallback initial: ${generated}`)
console.log(`✓ Skipped (exists): ${skipped}`)
if (missing) console.log(`⚠ slug-missing fallbacks used: ${missing}`)
