import { FUNCTION_KEYS } from '../data/mbtiProfiles'

/**
 * လိုက်ကာ ၁–၅ ကို reverse coding သို့ ပြောင်းသည်။
 * reverse=true: အလွန်သဘောတူ (၅) သည် ဖန်ရှင်အမှတ် နည်းရန် (၆−answer) သုံးသည်။
 */
export function applyReverseScoring(answer, reverse) {
  const v = Number(answer)
  if (v < 1 || v > 5) return 0
  return reverse ? 6 - v : v
}

/**
 * အခြေခံ အမှတ်ကို အလေးချိန်ဖြင့် မြှောက်သည်။
 */
export function applyWeights(effectiveScore, weight) {
  const w = Number(weight)
  const safe = Number.isFinite(w) && w > 0 ? w : 1
  return effectiveScore * safe
}

/**
 * မေးခွန်းတစ်ခုချင်းစီကို ဖန်ရှင်အမှတ်သို့ ပေါင်းသည်။
 * weight မပါလျှင် id အလိုက် default (တတိယမြောက်မေးခွန်းများကို ၁.၅) သို့မဟုတ် ၁.၀
 */
export function calculateFunctionScores(questions, answers) {
  const scores = Object.fromEntries(FUNCTION_KEYS.map((k) => [k, 0]))

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const raw = answers[String(q.id)] ?? answers[q.id]
    if (raw == null) continue
    const fn = q.function
    if (!fn || !FUNCTION_KEYS.includes(fn)) continue

    const eff = applyReverseScoring(raw, !!q.reverse)
    if (eff <= 0) continue

    const w =
      q.weight != null && Number(q.weight) > 0 ? Number(q.weight) : 1.0
    scores[fn] += applyWeights(eff, w)
  }
  return scores
}

export const computeFunctionScores = calculateFunctionScores

export function rankFunctionsByScore(scores) {
  const rows = FUNCTION_KEYS.map((key) => ({
    key,
    score: Math.max(0, scores[key] ?? 0),
  }))
  const orderIdx = Object.fromEntries(FUNCTION_KEYS.map((k, i) => [k, i]))
  rows.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return orderIdx[a.key] - orderIdx[b.key]
  })
  return rows
}

export function functionPercentages(scores) {
  const vec = FUNCTION_KEYS.map((k) => Math.max(0, scores[k] ?? 0))
  const sum = vec.reduce((s, x) => s + x, 0) || 1
  const max = Math.max(...vec, 1e-9)
  return FUNCTION_KEYS.map((key, i) => ({
    key,
    score: vec[i],
    pct: Math.round((vec[i] / sum) * 1000) / 10,
    barPct: Math.round((vec[i] / max) * 1000) / 10,
  })).sort((a, b) => b.score - a.score)
}

export function toScoreVector(scores) {
  return FUNCTION_KEYS.map((k) => Math.max(0, scores[k] ?? 0))
}
