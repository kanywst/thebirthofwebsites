#!/usr/bin/env node
/**
 * Mark discontinued services with their shutdown date.
 * Adds an optional `ended` field (ISO date) to existing info.json entries.
 * Re-runnable: each listed entry is overwritten; others are left untouched.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const path = resolve(process.cwd(), "info.json")
const items = JSON.parse(readFileSync(path, "utf8"))

// name -> shutdown date (ISO). Only services that are fully discontinued.
const ENDED = {
  "Google Reader": "2013-07-01",
  "Google+": "2019-04-02",
  Vine: "2017-01-17",
  GeoCities: "2009-10-26",
  Friendster: "2015-06-30",
  Skype: "2025-05-05",
  Stadia: "2023-01-18",
  "Google Wave": "2012-04-30",
}

let updated = 0
for (const item of items) {
  const ended = ENDED[item.name]
  if (ended) {
    item.ended = ended
    updated++
  }
}

writeFileSync(path, `${JSON.stringify(items, null, 2)}\n`)
console.log(`✓ Ended markers applied: ${updated}/${Object.keys(ENDED).length}`)
