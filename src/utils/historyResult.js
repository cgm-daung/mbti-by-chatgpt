import { COMPATIBILITY_HINTS } from '../data/mbtiProfiles'
import { TYPE_CONTENT } from '../data/typeContent'

/**
 * ရလဒ်ကို မှတ်တမ်းသိမ်းရန် လျှော့ချထားသော အရာထုတ်သည်
 */
export function serializeResultForHistory(result) {
  if (!result?.primary) return null
  return {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `res-${Date.now()}`,
    date: new Date().toISOString(),
    typeKey: result.primary.type,
    type: result.primary.type,
    match: result.primary.match,
    confidence: result.confidence,
    secondary: result.secondary,
    fnBreakdown: result.fnBreakdown,
    mbtiResult: result.mbtiResult,
    whyMy: result.whyMy,
    axes: result.axes,
    inconsistency: result.inconsistency,
    dynamicNarrative: result.dynamicNarrative,
    compat: result.compat,
  }
}

/**
 * မှတ်တမ်းမှ ပြန်ဖွင့်ရန် ပြည့်စုံ result ပုံစံ
 */
export function hydrateHistoryEntry(entry) {
  const typeKey = entry.typeKey || entry.type
  return {
    primary: { type: entry.type, match: entry.match },
    secondary: entry.secondary || [],
    fnBreakdown: entry.fnBreakdown || [],
    copy: TYPE_CONTENT[typeKey] || TYPE_CONTENT.INTJ,
    compat: entry.compat?.length ? entry.compat : COMPATIBILITY_HINTS[typeKey] || [],
    mbtiResult: entry.mbtiResult,
    dynamicNarrative: entry.dynamicNarrative || '',
    confidence: entry.confidence,
    whyMy: entry.whyMy || '',
    axes: entry.axes,
    inconsistency: entry.inconsistency,
    isHistoryView: true,
    savedAt: entry.date,
    historyId: entry.id,
  }
}
