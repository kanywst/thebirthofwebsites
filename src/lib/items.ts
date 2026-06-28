import data from "../../info.json"

export type Era = "明治" | "大正" | "昭和" | "平成" | "令和"

export interface Item {
  readonly date: string
  readonly name: string
  readonly type: readonly string[]
  readonly img: string
  readonly nationality: string
  readonly description: string
  readonly description_en: string
  readonly ended?: string
}

export const items: readonly Item[] = data as readonly Item[]

export function searchByKeyword(items: readonly Item[], keyword: string): Item[] {
  if (keyword === "") return [...items]
  const lower = keyword.toLowerCase()
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower) ||
      item.description_en.toLowerCase().includes(lower),
  )
}

export function filterByTag(items: readonly Item[], tag: string): Item[] {
  if (tag === "" || tag === "All") return [...items]
  return items.filter((item) => item.type.includes(tag))
}

export function filterEnded(items: readonly Item[]): Item[] {
  return items.filter((item) => item.ended != null)
}

export function countEnded(items: readonly Item[]): number {
  return items.filter((item) => item.ended != null).length
}

export function sortByDate(items: readonly Item[]): Item[] {
  return [...items].sort((a, b) => a.date.localeCompare(b.date))
}

export function countByTag(items: readonly Item[], tag: string): number {
  if (tag === "All") return items.length
  return items.filter((item) => item.type.includes(tag)).length
}
