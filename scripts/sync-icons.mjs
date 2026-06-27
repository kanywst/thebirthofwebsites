#!/usr/bin/env node
/**
 * Generate colorful SVG logos under ./public for the 2022-2026 entries.
 *
 * Resolution order per brand:
 *   1. @lobehub/icons-static-svg `<spec.lh>.svg` — copied as-is for the
 *      `-color` variants, or with brand hex / currentColor injected for
 *      monochrome variants.
 *   2. @lobehub/icons-static-svg `<spec.lh>` not on disk → fall through.
 *   3. simple-icons `<spec.si>.svg` with brand hex from
 *      simple-icons/data/simple-icons.json (or an override).
 *   4. Initial-letter fallback SVG that uses currentColor.
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

/**
 * lobehub icons ship with `width="1em" height="1em" style="flex:none;..."`
 * which makes the browser render them at the inline em size regardless of
 * the wrapper's CSS sizing. Strip those so CSS controls dimensions.
 *
 * Scoped to the opening <svg> tag so internal elements (e.g. <rect>,
 * <image>, <foreignObject>) keep their own width/height/style.
 * Handles both single- and double-quoted attribute values.
 */
function stripInlineSizing(svg) {
  return svg.replace(/<svg[^>]*>/i, (tag) =>
    tag.replace(/\s(width|height|style)=(['"])[^'"]*\2/gi, ""),
  )
}

function overrideTitle(svg, title) {
  if (/<title>[^<]*<\/title>/i.test(svg)) {
    return svg.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
  }
  return svg.replace(/(<svg[^>]*>)/i, `$1<title>${title}</title>`)
}

function fallbackSvg(text) {
  const fontSize = text.length === 1 ? 16 : text.length === 2 ? 11 : 9
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><text x="12" y="17" text-anchor="middle" font-family="-apple-system,system-ui,sans-serif" font-size="${fontSize}" font-weight="700">${text}</text></svg>\n`
}

/**
 * spec: { lh?, si?, hex?, title?, fallback? }
 *   lh    – lobehub icon slug (with or without `-color` variant)
 *   si    – simple-icons slug
 *   hex   – override hex (no #). If absent and si is set, falls back to
 *           simple-icons data. "000000" is treated as "no real brand
 *           color" and produces a currentColor logo.
 *   title – override the SVG <title> element (e.g. upstream xai.svg
 *           ships with <title>Grok</title>).
 *   fallback – text used by the initial-letter fallback SVG, also used
 *           if neither lobehub nor simple-icons resolves on disk.
 */
const MAP = {
  // OpenAI products: lobehub openai mark + brand purple
  "chatgpt.svg": { lh: "openai", hex: "412991", fallback: "C" },
  "gpt4.svg": { lh: "openai", hex: "412991", fallback: "G" },
  "openaio1.svg": { lh: "openai", hex: "412991", fallback: "o1" },
  "openaio3.svg": { lh: "openai", hex: "412991", fallback: "o3" },
  "sora.svg": { lh: "sora-color", fallback: "S" },
  "dalle2.svg": { lh: "dalle-color", fallback: "D" },

  // Anthropic Claude family
  "claude.svg": { lh: "claude-color" },
  "claude3.svg": { lh: "claude-color" },
  "claude4.svg": { lh: "claude-color" },

  // Google AI
  "bard.svg": { lh: "gemini-color", fallback: "B" },
  "gemini.svg": { lh: "gemini-color" },

  // Meta Llama family
  "llama.svg": { lh: "meta-color" },
  "llama2.svg": { lh: "meta-color" },
  "llama3.svg": { lh: "meta-color" },
  "llama4.svg": { lh: "meta-color" },

  // AI labs — color variants from lobehub
  "mistralai.svg": { lh: "mistral-color" },
  "stabilityai.svg": { lh: "stability-color", fallback: "SA" },
  "stablediffusion.svg": { lh: "stability-color", fallback: "SD" },
  "perplexity.svg": { lh: "perplexity-color" },
  "deepseek.svg": { lh: "deepseek-color" },
  "githubcopilot.svg": { lh: "copilot-color" },

  // Black-glyph brands — keep currentColor so they follow theme.
  // xai upstream ships <title>Grok</title>, so override it.
  "xai.svg": { lh: "xai", title: "xAI" },
  "grok.svg": { lh: "grok" },
  "midjourney.svg": { lh: "midjourney", fallback: "MJ" },
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

  // Malware / security incidents — no brand logos exist, use glyph fallbacks
  "stuxnet.svg": { fallback: "SX" },
  "morrisworm.svg": { fallback: "MW" },
  "iloveyou.svg": { fallback: "ILY" },
  "wannacry.svg": { fallback: "WC" },
  "mirai.svg": { fallback: "未来" },
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
      const raw = stripInlineSizing(readFileSync(src, "utf8"))
      const hex = pickHex(spec)
      content = injectFill(raw, hex ? `#${hex}` : "currentColor")
      source = `lobehub:${spec.lh}${hex ? `#${hex}` : ""}`
      counters.lh++
    } else {
      missing.push(`${filename} ← lobehub:${spec.lh} (not found)`)
    }
  }

  if (content === null && spec.si) {
    const src = resolve(SI_ICONS, `${spec.si}.svg`)
    if (existsSync(src)) {
      const raw = stripInlineSizing(readFileSync(src, "utf8"))
      const hex = pickHex(spec)
      content = injectFill(raw, hex ? `#${hex}` : "currentColor")
      source = `simple-icons:${spec.si}${hex ? `#${hex}` : ""}`
      counters.si++
    } else {
      missing.push(`${filename} ← simple-icons:${spec.si} (not found)`)
    }
  }

  if (content === null) {
    const text = spec.fallback ?? filename.replace(".svg", "").slice(0, 2).toUpperCase()
    content = fallbackSvg(text)
    source = `fallback:"${text}"`
    counters.fallback++
  }

  if (spec.title) {
    content = overrideTitle(content, spec.title)
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
