import {
  ALL_TYPES,
  DOM_AUX_TO_TYPE,
  TYPE_STACKS,
  idealVectorForType,
} from '../data/mbtiProfiles'
import {
  calculateAxes,
  calculateConfidence,
  detectInconsistency,
} from './analysis.js'
import {
  calculateFunctionScores,
  rankFunctionsByScore,
  toScoreVector,
} from './scoring.js'

const FN_LABEL_MY = {
  Ne: 'ပြင်ပ အသိဉာဏ် (Ne)',
  Ni: 'အတွင်း အသိဉာဏ် (Ni)',
  Se: 'ပြင်ပ သိဉာဏ် (Se)',
  Si: 'အတွင်း သိဉာဏ် (Si)',
  Te: 'ပြင်ပ တွေးခေါ်မှု (Te)',
  Ti: 'အတွင်း တွေးခေါ်မှု (Ti)',
  Fe: 'ပြင်ပ ခံစားမှု (Fe)',
  Fi: 'အတွင်း ခံစားမှု (Fi)',
}

function l2norm(v) {
  return Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1e-9
}

function cosineSimilarity(a, b) {
  let dot = 0
  const na = l2norm(a)
  const nb = l2norm(b)
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i]
  return dot / (na * nb)
}

function letterAgreement(typeCode, axisFour) {
  if (!typeCode || typeCode.length !== 4 || !axisFour || axisFour.length !== 4)
    return 0
  let c = 0
  for (let i = 0; i < 4; i++) {
    if (typeCode[i] === axisFour[i]) c++
  }
  return c / 4
}

/** အသုံးပြုသူ ထိပ် ၄ ခု စဉ်နှင့် စတက် ၄ ခု ကိုက်ညီမှု (အစဉ်နှင့် အတွင်းပါဝင်မှု အလေးချိန်ပါ) */
function top4StackSimilarity(ranked, stack) {
  const top4 = ranked.slice(0, 4).map((r) => r.key)
  let pts = 0
  for (let i = 0; i < 4; i++) {
    if (top4[i] === stack[i]) pts += 1
    else if (top4.includes(stack[i])) pts += 0.42
  }
  return pts / 4
}

/**
 * ကိုဆိုင်း + ထိပ်၄ စဉ် + ဝင်ရိုးလေးချက် ညီမှု — ပေါင်းစပ် ကိုက်ညီမှု
 */
export function calculateMatchPercentages(scores, ranked, axes) {
  const userVec = toScoreVector(scores)
  const axisFour = axes.fourLetter

  const rows = ALL_TYPES.map((type) => {
    const ideal = idealVectorForType(type)
    const cos = cosineSimilarity(userVec, ideal)
    const stack = TYPE_STACKS[type]
    const top4sim = top4StackSimilarity(ranked, stack)
    const letterSim = letterAgreement(type, axisFour)
    const combined = 0.4 * cos + 0.38 * top4sim + 0.22 * letterSim
    return {
      type,
      match: Math.round(combined * 100),
      combined,
      cos,
      top4sim,
      letterSim,
    }
  })
  rows.sort((a, b) => b.combined - a.combined)
  return rows.map(({ type, match }) => ({ type, match }))
}

export function rankMbtiTypes(scores, ranked, axes) {
  const userVec = toScoreVector(scores)
  const axisFour = axes.fourLetter
  return ALL_TYPES.map((type) => {
    const ideal = idealVectorForType(type)
    const cos = cosineSimilarity(userVec, ideal)
    const top4sim = top4StackSimilarity(ranked, TYPE_STACKS[type])
    const letterSim = letterAgreement(type, axisFour)
    const combined = 0.4 * cos + 0.38 * top4sim + 0.22 * letterSim
    return {
      type,
      match: Math.round(combined * 100),
      similarity: combined,
    }
  }).sort((a, b) => b.similarity - a.similarity)
}

/**
 * စမ်းသပ်မှု အဖြေအပြည့်အစုံကို ခွဲခြမ်းပြီး MBTI ရလဒ်တစ်ခုတည်းအဖြစ် ထုတ်ပေးသည်
 */
export function resolveTestResult(questions, answers) {
  const scores = calculateFunctionScores(questions, answers)
  const ranked = rankFunctionsByScore(scores)
  const axes = calculateAxes(scores)
  const inconsistency = detectInconsistency(questions, answers)

  const fullMatches = (() => {
    const userVec = toScoreVector(scores)
    const axisFour = axes.fourLetter
    return ALL_TYPES.map((type) => {
      const ideal = idealVectorForType(type)
      const cos = cosineSimilarity(userVec, ideal)
      const stack = TYPE_STACKS[type]
      const top4sim = top4StackSimilarity(ranked, stack)
      const letterSim = letterAgreement(type, axisFour)
      const combined = 0.4 * cos + 0.38 * top4sim + 0.22 * letterSim
      return {
        type,
        match: Math.round(combined * 100),
        combined,
        cos,
        top4sim,
        letterSim,
      }
    }).sort((a, b) => b.combined - a.combined)
  })()

  const best = fullMatches[0]
  const stackKey = `${ranked[0].key}-${ranked[1].key}`
  const stackType = DOM_AUX_TO_TYPE[stackKey]
  const crossCheckStack = stackType === best.type

  const [dominantType, auxiliaryType] = TYPE_STACKS[best.type] || [
    ranked[0].key,
    ranked[1].key,
  ]

  const mbtiResult = {
    type: best.type,
    dominantUser: ranked[0].key,
    auxiliaryUser: ranked[1].key,
    dominantType,
    auxiliaryType,
    inferredByStack: Boolean(stackType && stackType === best.type),
    stackKey,
    stackTypeGuess: stackType ?? null,
    axisType: axes.fourLetter,
    crossCheckStack,
  }

  const confidence = calculateConfidence({
    ranked,
    axes,
    finalType: best.type,
    inconsistency,
  })

  const primary = { type: best.type, match: best.match }
  const secondary = fullMatches.slice(1, 4).map(({ type, match }) => ({
    type,
    match,
  }))

  const whyMy = buildWhyThisTypeExplanation({
    best,
    axes,
    ranked,
    mbtiResult,
    fullMatches,
  })

  const dynamicNarrative = buildDynamicResultNarrative(
    mbtiResult,
    axes,
    confidence,
    crossCheckStack,
  )

  return {
    scores,
    ranked,
    axes,
    inconsistency,
    primary,
    secondary,
    mbtiResult,
    confidence,
    whyMy,
    dynamicNarrative,
    fullMatches,
  }
}

/** ရှေးက API — scores တစ်ခုတည်းပေးလျှင် axes နှင့် ranked ကို အတွင်းတွက်သည် */
export function getMBTIType(scores) {
  const ranked = rankFunctionsByScore(scores)
  const axes = calculateAxes(scores)
  const stackKey = `${ranked[0].key}-${ranked[1].key}`
  const fromStack = DOM_AUX_TO_TYPE[stackKey]
  const list = calculateMatchPercentages(scores, ranked, axes)
  const best = list[0]
  return {
    type: best.type,
    dominant: ranked[0].key,
    auxiliary: ranked[1].key,
    ranked,
    inferredByStack: Boolean(fromStack && fromStack === best.type),
    stackKey,
    fallbackType: best.type,
  }
}

export function buildDynamicResultNarrative(
  mbtiResult,
  axes,
  confidence,
  crossCheckStack,
) {
  const d = FN_LABEL_MY[mbtiResult.dominantUser] || mbtiResult.dominantUser
  const a = FN_LABEL_MY[mbtiResult.auxiliaryUser] || mbtiResult.auxiliaryUser
  const dt = FN_LABEL_MY[mbtiResult.dominantType] || mbtiResult.dominantType
  const at = FN_LABEL_MY[mbtiResult.auxiliaryType] || mbtiResult.auxiliaryType

  const lines = [
    `ဝင်ရိုးစွန်းများ — ပြင်ပ/အတွင်း: ${axes.ei === 'E' ? 'E (ပြင်ပ)' : 'I (အတွင်း)'}၊ အသိဉာဏ်/သိဉာဏ်: ${axes.ns}၊ တွေးခေါ်/ခံစား: ${axes.tf}၊ စီစဉ်/လိုက်လျောညီထွေ: ${axes.jp}။ ဤအရေအတွက်များမှ ${axes.fourLetter} ပုံစံ ထွက်ရှိသည်။`,
    `သင့်အမှတ်အရ ထိပ်ဆုံး ဖန်ရှင်နှစ်ခုမှာ ${d} (${mbtiResult.dominantUser}) နှင့် ${a} (${mbtiResult.auxiliaryUser}) ဖြစ်သည်။ ရွေးချယ်ထားသော ${mbtiResult.type} ၏ စံစတက်အရ ဒိုမီနန့် ${dt}၊ အက်စ် ${at} ဖြစ်သည်။`,
    crossCheckStack
      ? 'ဒိုမီနန့်+အက်စ် တိုက်ရိုက်စတက်နှင့် ပေါင်းစပ် ကိုက်ညီမှု အယ်လ်ဂိုရစ်သမ် ရလဒ် တူညီပါသည်။'
      : 'ဒိုမီနန့်+အက်စ် တိုက်ရိုက်တွဲနှင့် ပေါင်းစပ် ကိုက်ညီမှု မတူညီသောကြောင့် ဝင်ရိုးနှင့် စတက်ပုံစံကို ပေါင်းစပ်၍ အမျိုးအစားရွေးချယ်ထားပါသည်။',
    `ယုံကြည်စိတ်ချရမှု (Confidence) — ပရိုဖိုင်ကွာခြားချက်၊ ဝင်ရိုးရှင်းလင်းမှု၊ အဖြေပုံစံတို့အပေါ် အခြေခံ၍ အနီးစပ် ${confidence}% ခန့်။`,
  ]
  return lines.join('\n')
}

export function buildWhyThisTypeExplanation({
  best,
  axes,
  ranked,
  mbtiResult,
  fullMatches,
}) {
  const second = fullMatches[1]
  const top4labels = ranked
    .slice(0, 4)
    .map((r) => FN_LABEL_MY[r.key] || r.key)
    .join(' → ')

  const parts = [
    `${mbtiResult.type} ကို ရွေးချယ်ရခြင်း အကြောင်းရင်း —`,
    `၁) သင့် ဖန်ရှင်အမှတ် ပုံစံနှင့် ${mbtiResult.type} ၏ စတက် ပရိုဖိုင်ကြား ကိုဆိုင်း ကိုက်ညီမှု (${Math.round(best.cos * 100)}% ခန့်)။`,
    `၂) ထိပ်တန်း လေးဖန်ရှင် စဉ် (${top4labels}) နှင့် စတက်အစဉ် ကိုက်ညီမှု။`,
    `၃) ဝင်ရိုးလေးချက် (${axes.fourLetter}) နှင့် အမျိုးအစားအက္ခရာ လေးလုံး ညီမှု အချ (${Math.round(best.letterSim * 100)}%)။`,
  ]
  if (second) {
    parts.push(
      `နောက်အနီးစပ်ဆုံး အမျိုးအစား ${second.type} နှင့် ကွာခြားချက် အနည်းငယ်သာ ရှိပါသည် (${second.match}% ကိုက်ညီမှု)။`,
    )
  }
  return parts.join('\n')
}

export { FN_LABEL_MY }
