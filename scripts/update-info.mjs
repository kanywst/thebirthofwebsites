#!/usr/bin/env node
/**
 * One-shot data hygiene script for info.json.
 * Run: pnpm node scripts/update-info.mjs
 *
 * Fixes:
 * - Anthropic-and-later entries: 平成 → 令和 (Reiwa era starts 2019-05-01)
 * - Typos in `type` array: seaarch→search, hardwre→hardware, services→service
 * - Google+ nationality: China → United-States-of-America
 * - Trim leading/trailing whitespace from names
 */
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const path = resolve(process.cwd(), "info.json")
const items = JSON.parse(readFileSync(path, "utf8"))

const TYPO_MAP = {
  "seaarch engine": "search engine",
  hardwre: "hardware",
  services: "service",
}

let reiwaCount = 0
let typoCount = 0
let nameTrimCount = 0
let nationalityFixCount = 0

for (const item of items) {
  // Reiwa era re-tag
  if (item.date >= "2019-05-01") {
    const before = item.type
    item.type = item.type.map((t) => (t === "平成" ? "令和" : t))
    if (JSON.stringify(before) !== JSON.stringify(item.type)) reiwaCount++
  }

  // Typo fixes in type array
  const typoBefore = JSON.stringify(item.type)
  item.type = item.type.map((t) => TYPO_MAP[t] ?? t)
  if (typoBefore !== JSON.stringify(item.type)) typoCount++

  // Name whitespace
  const trimmed = item.name.trim()
  if (trimmed !== item.name) {
    item.name = trimmed
    nameTrimCount++
  }

  // Google+ nationality
  if (item.name === "Google+" && item.nationality !== "United-States-of-America") {
    item.nationality = "United-States-of-America"
    nationalityFixCount++
  }
}

writeFileSync(path, `${JSON.stringify(items, null, 2)}\n`)

console.log(`✓ Reiwa re-tagged: ${reiwaCount}`)
console.log(`✓ Type typos fixed: ${typoCount}`)
console.log(`✓ Names trimmed: ${nameTrimCount}`)
console.log(`✓ Google+ nationality fixed: ${nationalityFixCount}`)
