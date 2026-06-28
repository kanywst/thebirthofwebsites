#!/usr/bin/env node
/**
 * Mark discontinued services with their shutdown date.
 * The ENDED map below is the single source of truth: listed entries get the
 * `ended` ISO date set, and the field is removed from any entry not listed
 * (e.g. a service that was resurrected or marked by mistake). Fully idempotent.
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
  Mangamura: "2018-04-17",
  Sora: "2026-04-26",
  "Alexa Internet": "2022-05-01",
  "Pandora TV": "2023-01-31",
  Theranos: "2018-09-04",
  Megaupload: "2012-01-19",
  LimeWire: "2010-10-26",
  "Silk Road": "2013-10-02",
  AlphaBay: "2017-07-04",
  "SixDegrees.com": "2001",
  "Mt. Gox": "2014-02-28",
  LiveLeak: "2021-05-05",
  Napster: "2001-07-11",
  "Popcorn Time": "2022-01-05",
}

let updated = 0
let cleared = 0
for (const item of items) {
  const ended = ENDED[item.name]
  if (ended) {
    item.ended = ended
    updated++
  } else if ("ended" in item) {
    delete item.ended
    cleared++
  }
}

writeFileSync(path, `${JSON.stringify(items, null, 2)}\n`)
console.log(`✓ Ended markers applied: ${updated}/${Object.keys(ENDED).length} (cleared ${cleared})`)
