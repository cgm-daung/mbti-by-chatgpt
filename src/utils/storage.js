/**
 * ရလဒ်မှတ်တမ်း — localStorage
 */
const HISTORY_KEY = 'mbti-cf-result-history-v1'
const MAX_ENTRIES = 40

export function getHistoryEntries() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!data?.items || !Array.isArray(data.items)) return []
    return data.items
  } catch {
    return []
  }
}

export function saveHistoryEntries(items) {
  try {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify({ version: 1, items: items.slice(0, MAX_ENTRIES) }),
    )
  } catch {
    /* quota */
  }
}

/**
 * @param {object} entry — id, date, typeKey, type, match, confidence, …
 */
export function appendHistoryEntry(entry) {
  const items = getHistoryEntries()
  const id =
    entry.id ||
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `h-${Date.now()}`)
  const next = [{ ...entry, id }, ...items.filter((e) => e.id !== id)].slice(
    0,
    MAX_ENTRIES,
  )
  saveHistoryEntries(next)
  return next
}
