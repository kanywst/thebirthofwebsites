import { describe, expect, test } from "vitest"
import { countByTag, filterByTag, type Item, searchByKeyword, sortByDate } from "./items"

const sample: Item[] = [
  {
    date: "2022-11-30",
    name: "ChatGPT",
    type: ["AI", "アメリカ", "令和"],
    img: "chatgpt.svg",
    nationality: "United-States-of-America",
    description: "AIチャットボット",
    description_en: "AI chatbot",
  },
  {
    date: "1976-04-01",
    name: "Apple",
    type: ["hardware", "アメリカ", "昭和"],
    img: "apple.png",
    nationality: "United-States-of-America",
    description: "ハードウェア製品の老舗",
    description_en: "Hardware company",
  },
  {
    date: "1996-01-31",
    name: "Yahoo Japan",
    type: ["portal site", "日本", "平成"],
    img: "yahoojapan.png",
    nationality: "Japan",
    description: "ポータルサイト",
    description_en: "Portal",
  },
]

describe("searchByKeyword", () => {
  test("returns all items when keyword is empty", () => {
    expect(searchByKeyword(sample, "")).toHaveLength(3)
  })
  test("matches name", () => {
    expect(searchByKeyword(sample, "Apple").map((i) => i.name)).toEqual(["Apple"])
  })
  test("matches English description case-insensitively", () => {
    expect(searchByKeyword(sample, "ai chatbot").map((i) => i.name)).toEqual(["ChatGPT"])
  })
  test("matches Japanese description", () => {
    expect(searchByKeyword(sample, "ハードウェア").map((i) => i.name)).toEqual(["Apple"])
  })
  test("matches Latin words inside Japanese descriptions case-insensitively", () => {
    const items: Item[] = [
      {
        date: "2024-01-01",
        name: "Mixed",
        type: ["service", "アメリカ", "令和"],
        img: "x.svg",
        nationality: "United-States-of-America",
        description: "Googleの検索を使ったAIサービス",
        description_en: "AI service using Google search",
      },
    ]
    expect(searchByKeyword(items, "google")).toHaveLength(1)
  })
  test("returns empty array when no match", () => {
    expect(searchByKeyword(sample, "zzzzz")).toEqual([])
  })
  test("does not mutate input", () => {
    const original = [...sample]
    searchByKeyword(sample, "Apple")
    expect(sample).toEqual(original)
  })
})

describe("filterByTag", () => {
  test("All returns everything", () => {
    expect(filterByTag(sample, "All")).toHaveLength(3)
  })
  test("empty tag returns everything", () => {
    expect(filterByTag(sample, "")).toHaveLength(3)
  })
  test("filters by category exactly", () => {
    expect(filterByTag(sample, "AI").map((i) => i.name)).toEqual(["ChatGPT"])
  })
  test("filters by Japanese nationality", () => {
    expect(filterByTag(sample, "アメリカ").map((i) => i.name)).toEqual(["ChatGPT", "Apple"])
  })
  test("filters by era", () => {
    expect(filterByTag(sample, "令和").map((i) => i.name)).toEqual(["ChatGPT"])
  })
  test("does not match substrings (regression for previous indexOf bug)", () => {
    const items: Item[] = [
      {
        date: "2010-01-01",
        name: "Substring trap",
        type: ["AIRBNB-fake-tag", "アメリカ", "平成"],
        img: "x.svg",
        nationality: "United-States-of-America",
        description: "x",
        description_en: "x",
      },
    ]
    expect(filterByTag(items, "AI")).toEqual([])
  })
})

describe("sortByDate", () => {
  test("ascending order", () => {
    const sorted = sortByDate(sample)
    expect(sorted.map((i) => i.date)).toEqual(["1976-04-01", "1996-01-31", "2022-11-30"])
  })
  test("does not mutate input", () => {
    const original = [...sample]
    sortByDate(sample)
    expect(sample).toEqual(original)
  })
})

describe("countByTag", () => {
  test("All returns total length", () => {
    expect(countByTag(sample, "All")).toBe(3)
  })
  test("counts tag occurrences", () => {
    expect(countByTag(sample, "アメリカ")).toBe(2)
  })
  test("returns 0 for unknown tag", () => {
    expect(countByTag(sample, "nonexistent")).toBe(0)
  })
})
