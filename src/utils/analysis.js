/**
 * ဝင်ရိုးစွန်းလေးချက်၊ ယုံကြည်စိတ်ချရမှု၊ အဖြေပုံစံ စစ်ဆေးမှု
 */

/**
 * ဖန်ရှင်အမှတ်များမှ E/I, N/S, T/F, J/P ဝင်ရိုးစွန်းများ
 * E vs I: (Ne+Se) vs (Ni+Si) | T vs F: (Te+Ti) vs (Fe+Fi)
 * N vs S: (Ne+Ni) vs (Se+Si) | J vs P: (Te+Fe) vs (Ti+Fi)
 */
export function calculateAxes(scores) {
  const { Ne, Ni, Se, Si, Te, Ti, Fe, Fi } = scores

  const ext = Ne + Se
  const intro = Ni + Si
  const sumEI = ext + intro || 1
  const ei = ext >= intro ? 'E' : 'I'
  const eiMargin = Math.abs(ext - intro) / sumEI

  const tfT = Te + Ti
  const tfF = Fe + Fi
  const sumTF = tfT + tfF || 1
  const tf = tfT >= tfF ? 'T' : 'F'
  const tfMargin = Math.abs(tfT - tfF) / sumTF

  const nSum = Ne + Ni
  const sSum = Se + Si
  const sumNS = nSum + sSum || 1
  const ns = nSum >= sSum ? 'N' : 'S'
  const nsMargin = Math.abs(nSum - sSum) / sumNS

  const jSum = Te + Fe
  const pSum = Ti + Fi
  const sumJP = jSum + pSum || 1
  const jp = jSum >= pSum ? 'J' : 'P'
  const jpMargin = Math.abs(jSum - pSum) / sumJP

  return {
    ei,
    tf,
    ns,
    jp,
    fourLetter: `${ei}${ns}${tf}${jp}`,
    margins: { ei: eiMargin, tf: tfMargin, ns: nsMargin, jp: jpMargin },
    raw: {
      ext,
      intro,
      tfT,
      tfF,
      nSum,
      sSum,
      jSum,
      pSum,
    },
  }
}

/**
 * အဖြေများတွင် မသေချာ (၃) များလွန်းခြင်း၊ ပုံစံမတည်ငြိမ်ခြင်း စစ်သည်။
 */
export function detectInconsistency(questions, answers) {
  const vals = []
  for (const q of questions) {
    const v = answers[String(q.id)] ?? answers[q.id]
    if (v != null && v >= 1 && v <= 5) vals.push(v)
  }
  const n = vals.length
  if (n < 10) {
    return {
      shouldWarn: false,
      neutralRatio: 0,
      stdev: 0,
      reasons: [],
      messageMy: null,
    }
  }

  const neutrals = vals.filter((v) => v === 3).length
  const neutralRatio = neutrals / n
  const mean = vals.reduce((a, b) => a + b, 0) / n
  const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / n
  const stdev = Math.sqrt(variance)

  const reasons = []
  if (neutralRatio >= 0.36) {
    reasons.push('neutral-heavy')
  }
  if (stdev < 0.92) {
    reasons.push('low-variance')
  }

  /** အဖြေတန်ဖိုး တစ်ခုနဲ့ တစ်ခု ကွာခြားချက်ကြီးခြင်း (ဥပမာ ၁→၅ အကြိမ်များစွာ) */
  let bigJumps = 0
  const sortedIds = [...questions]
    .map((q) => ({ id: q.id, v: answers[String(q.id)] ?? answers[q.id] }))
    .filter((x) => x.v >= 1 && x.v <= 5)
    .sort((a, b) => a.id - b.id)
  for (let i = 1; i < sortedIds.length; i++) {
    if (Math.abs(sortedIds[i].v - sortedIds[i - 1].v) >= 4) bigJumps++
  }
  if (bigJumps >= 25) {
    reasons.push('erratic-jumps')
  }

  const shouldWarn = reasons.length > 0

  return {
    shouldWarn,
    neutralRatio: Math.round(neutralRatio * 1000) / 1000,
    stdev: Math.round(stdev * 1000) / 1000,
    reasons,
    messageMy: shouldWarn
      ? 'သင့်အဖြေများမှာ မတည်ငြိမ်နိုင်ပါ။ ထပ်မံစမ်းကြည့်ပါ။'
      : null,
  }
}

/**
 * အမှတ်ကွာခြားချက်၊ ဝင်ရိုးညီမှု၊ အဖြေပုံစံတို့အပေါ် အခြေခံ၍ ယုံကြည်စိတ်ချရမှု ၃၀–၉၆
 */
export function calculateConfidence({
  ranked,
  axes,
  finalType,
  inconsistency,
}) {
  const top1 = ranked[0]?.score ?? 0
  const top2 = ranked[1]?.score ?? 0
  const top3 = ranked[2]?.score ?? 0
  const spread12 = top1 > 0 ? Math.min(1, (top1 - top2) / top1) : 0
  const spread23 = top2 > 0 ? Math.min(1, (top2 - top3) / top2) : 0
  const spread = (spread12 * 0.65 + spread23 * 0.35) * 100

  const m =
    (axes.margins.ei +
      axes.margins.tf +
      axes.margins.ns +
      axes.margins.jp) /
    4
  const axisClarity = Math.min(100, m * 120)

  const lettersMatch =
    finalType && finalType.length === 4
      ? ['EI', 'NS', 'TF', 'JP'].filter((_, i) => {
          const ch = finalType[i]
          const ax = i === 0 ? axes.ei : i === 1 ? axes.ns : i === 2 ? axes.tf : axes.jp
          return ch === ax
        }).length
      : 0
  const axisAgreement = lettersMatch * 18

  let score = 32 + spread * 0.28 + axisClarity * 0.22 + axisAgreement
  if (inconsistency?.shouldWarn) score -= 22
  if (lettersMatch <= 2) score -= 10

  return Math.round(Math.max(30, Math.min(96, score)))
}
