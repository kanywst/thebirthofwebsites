#!/usr/bin/env node
/**
 * Generate colorful SVG logos under ./public for the 2022-2026 entries.
 *
 * Resolution order per brand:
 *   1. @lobehub/icons-static-svg `<brand>-color.svg` — already brand-colored.
 *   2. @lobehub/icons-static-svg `<brand>.svg` (monochrome currentColor).
 *   3. simple-icons `<slug>.svg` with brand hex from
 *      simple-icons/data/simple-icons.json (or an override).
 *   4. Initial-letter fallback that uses currentColor.
 *
 * Coloring rule: every SVG ends up with a fill attribute on the root
 * <svg> element. If we have a meaningful brand hex (anything other than
 * "#000000") we inject that. Otherwise we inject currentColor so the
 * logo follows the page text color and stays visible in both light and
 * dark mode.
 *
 * Re-runnable: every entry in MAP is overwritten.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const PUBLIC_DIR = resolve(process.cwd(), "public")
const SI_ICONS = resolve(process.cwd(), "node_modules", "simple-icons", "icons")
const SI_DATA = resolve(process.cwd(), "node_modules", "simple-icons", "data", "simple-icons.json")
const LH_ICONS = resolve(process.cwd(), "node_modules", "@lobehub", "icons-static-svg", "icons")

mkdirSync(PUBLIC_DIR, { recursive: true })

const siBySlug = Object.fromEntries(
  JSON.parse(readFileSync(SI_DATA, "utf8")).map((i) => [i.slug, i]),
)

function injectFill(svg, value) {
  if (/<svg[^>]*\sfill="/i.test(svg)) {
    return svg.replace(/(<svg[^>]*?)\sfill="[^"]*"/i, `$1 fill="${value}"`)
  }
  return svg.replace(/<svg/i, `<svg fill="${value}"`)
}

function fallbackSvg(text) {
  const fontSize = text.length === 1 ? 16 : text.length === 2 ? 11 : 9
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><text x="12" y="17" text-anchor="middle" font-family="-apple-system,system-ui,sans-serif" font-size="${fontSize}" font-weight="700">${text}</text></svg>\n`
}

/**
 * spec: { lh?: string, si?: string, hex?: string, fallback?: string }
 *   lh   – lobehub icon slug
 *   si   – simple-icons slug
 *   hex  – override hex (no #). If absent and si is set, falls back to
 *          simple-icons data. "000000" is treated as "no real brand color"
 *          and produces a currentColor logo (theme-following).
 */
const MAP = {
  // OpenAI products: lobehub openai mark + brand purple
  "chatgpt.svg": { lh: "openai", hex: "412991" },
  "gpt4.svg": { lh: "openai", hex: "412991" },
  "openaio1.svg": { lh: "openai", hex: "412991" },
  "openaio3.svg": { lh: "openai", hex: "412991" },
  "sora.svg": { lh: "sora-color" },
  "dalle2.svg": { lh: "dalle-color" },

  // Anthropic Claude family
  "claude.svg": { lh: "claude-color" },
  "claude3.svg": { lh: "claude-color" },
  "claude4.svg": { lh: "claude-color" },

  // Google AI
  "bard.svg": { lh: "gemini-color" },
  "gemini.svg": { lh: "gemini-color" },

  // Meta Llama family
  "llama.svg": { lh: "meta-color" },
  "llama2.svg": { lh: "meta-color" },
  "llama3.svg": { lh: "meta-color" },
  "llama4.svg": { lh: "meta-color" },

  // AI labs — color variants from lobehub
  "mistralai.svg": { lh: "mistral-color" },
  "stabilityai.svg": { lh: "stability-color" },
  "stablediffusion.svg": { lh: "stability-color" },
  "perplexity.svg": { lh: "perplexity-color" },
  "deepseek.svg": { lh: "deepseek-color" },
  "githubcopilot.svg": { lh: "copilot-color" },

  // Black-glyph brands — keep currentColor so they follow theme
  "xai.svg": { lh: "xai" },
  "grok.svg": { lh: "grok" },
  "midjourney.svg": { lh: "midjourney" },
  "elevenlabs.svg": { lh: "elevenlabs" },
  "cursor.svg": { lh: "cursor" },
  "suno.svg": { lh: "suno" },

  // Dev tools / runtimes — simple-icons; override the few with a real
  // public brand color, leave the others on currentColor.
  "bun.svg": { si: "bun", hex: "F472B6" },
  "deno.svg": { si: "deno", hex: "70FFAF" },
  "vercel.svg": { si: "vercel" },
  "nextjs.svg": { si: "nextdotjs" },
  "threads.svg": { si: "threads" },

  // Discontinued
  "stadia.svg": { si: "stadia" },

  // Not in either source
  "heroku.svg": { fallback: "H" },
  "googlewave.svg": { fallback: "GW" },
  "googlereader.svg": { fallback: "GR" },
}

const FALLBACK_TEXT = {
  "chatgpt.svg": "C",
  "gpt4.svg": "G",
  "openaio1.svg": "o1",
  "openaio3.svg": "o3",
  "sora.svg": "S",
  "dalle2.svg": "D",
  "bard.svg": "B",
  "stabilityai.svg": "SA",
  "stablediffusion.svg": "SD",
  "midjourney.svg": "MJ",
}

function pickHex(spec) {
  const candidate = spec.hex ?? (spec.si ? siBySlug[spec.si]?.hex : null)
  if (!candidate) return null
  return candidate.toUpperCase() === "000000" ? null : candidate
}

const counters = { lh: 0, si: 0, fallback: 0 }
const missing = []

for (const [filename, spec] of Object.entries(MAP)) {
  const dest = resolve(PUBLIC_DIR, filename)
  let content = null
  let source = ""

  if (spec.lh) {
    const src = resolve(LH_ICONS, `${spec.lh}.svg`)
    if (existsSync(src)) {
      const raw = readFileSync(src, "utf8")
      const hex = pickHex(spec)
      content = injectFill(raw, hex ? `#${hex}` : "currentColor")
      source = `lobehub:${spec.lh}${hex ? `#${hex}` : ""}`
      counters.lh++
    } else {
      missing.push(`${filename} ← lobehub:${spec.lh} (not found)`)
    }
  } else if (spec.si) {
    const src = resolve(SI_ICONS, `${spec.si}.svg`)
    if (existsSync(src)) {
      const raw = readFileSync(src, "utf8")
      const hex = pickHex(spec)
      content = injectFill(raw, hex ? `#${hex}` : "currentColor")
      source = `simple-icons:${spec.si}${hex ? `#${hex}` : ""}`
      counters.si++
    } else {
      missing.push(`${filename} ← simple-icons:${spec.si} (not found)`)
    }
  }

  if (content === null) {
    const text =
      spec.fallback ??
      FALLBACK_TEXT[filename] ??
      filename.replace(".svg", "").slice(0, 2).toUpperCase()
    content = fallbackSvg(text)
    source = `fallback:"${text}"`
    counters.fallback++
  }

  writeFileSync(dest, content)
  console.log(`  ${filename.padEnd(22)} ← ${source}`)
}

console.log("")
console.log(`✓ lobehub-icons: ${counters.lh}`)
console.log(`✓ simple-icons:  ${counters.si}`)
console.log(`✓ fallback:      ${counters.fallback}`)
if (missing.length) {
  console.log("\nFell back due to missing source:")
  for (const m of missing) console.log(`  - ${m}`)
}
