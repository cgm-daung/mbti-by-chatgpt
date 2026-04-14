/**
 * MBTI အမျိုးအစားတစ်ခုစီ၏ စံ ကိုဂ်နီတီဗ် စတက် (ဒိုမီနန့် → အင်ဖီးရီယာ)
 * ဒိုမီနန့်+အက်စ် တွဲချက်သည် အမျိုးအစား ၁၆ ခုလုံးတွင် ထူးခြားသည်။
 */
export const FUNCTION_KEYS = ['Ne', 'Ni', 'Se', 'Si', 'Te', 'Ti', 'Fe', 'Fi']

/** @type {Record<string, string[]>} */
export const TYPE_STACKS = {
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti'],
  INFP: ['Fi', 'Ne', 'Si', 'Te'],
  ENFP: ['Ne', 'Fi', 'Te', 'Si'],
  INTJ: ['Ni', 'Te', 'Fi', 'Se'],
  ENTJ: ['Te', 'Ni', 'Se', 'Fi'],
  INTP: ['Ti', 'Ne', 'Si', 'Fe'],
  ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi'],
  ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
  ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'],
  ESTP: ['Se', 'Ti', 'Fe', 'Ni'],
  ISFP: ['Fi', 'Se', 'Ni', 'Te'],
  ESFP: ['Se', 'Fi', 'Te', 'Ni'],
}

export const ALL_TYPES = Object.keys(TYPE_STACKS)

/** ဒိုမီနန့်-အက်စ် တွဲ → MBTI (ဥပမာ Ni-Fe → INFJ) */
export const DOM_AUX_TO_TYPE = Object.fromEntries(
  ALL_TYPES.map((t) => {
    const [d, a] = TYPE_STACKS[t]
    return [`${d}-${a}`, t]
  }),
)

/**
 * ကိုဆိုင်း နှိုင်းယှဉ်ရန် စတက်အပေါ် အခြေခံသော_ideal_ ဗက်တာ (FUNCTION_KEYS အစီအစဉ်)
 */
export function idealVectorForType(type) {
  const stack = TYPE_STACKS[type]
  const base = 2.2
  const w = Object.fromEntries(FUNCTION_KEYS.map((k) => [k, base]))
  const peaks = [10, 8, 5, 3]
  stack.forEach((fn, i) => {
    w[fn] = peaks[i]
  })
  return FUNCTION_KEYS.map((k) => w[k])
}

/**
 * @deprecated — ရှေးက ကိုဆိုင်း သုံးရန် ထားခဲ့သော လက်ရွေးစင် ဗက်တာ
 */
export const TYPE_VECTORS = Object.fromEntries(
  ALL_TYPES.map((t) => [t, idealVectorForType(t)]),
)

/**
 * ချစ်ကြည်ရင်းနှီးမှုအတွက် အကြမ်းဖျင်း ကိုက်ညီမှု ရာခိုင်နှုန်း (ပြသရန် သာ)
 */
export const COMPATIBILITY_HINTS = {
  INTJ: [
    { type: 'ENFP', pct: 88 },
    { type: 'ENTP', pct: 82 },
    { type: 'INFJ', pct: 76 },
  ],
  INTP: [
    { type: 'ENTJ', pct: 86 },
    { type: 'ENFJ', pct: 74 },
    { type: 'INFJ', pct: 72 },
  ],
  ENTJ: [
    { type: 'INTP', pct: 86 },
    { type: 'INFP', pct: 78 },
    { type: 'ISTP', pct: 70 },
  ],
  ENTP: [
    { type: 'INFJ', pct: 90 },
    { type: 'INTJ', pct: 82 },
    { type: 'INTP', pct: 78 },
  ],
  INFJ: [
    { type: 'ENTP', pct: 90 },
    { type: 'ENFP', pct: 84 },
    { type: 'INFP', pct: 80 },
  ],
  INFP: [
    { type: 'ENTJ', pct: 78 },
    { type: 'ENFJ', pct: 82 },
    { type: 'INFJ', pct: 80 },
  ],
  ENFJ: [
    { type: 'INFP', pct: 82 },
    { type: 'ISFP', pct: 76 },
    { type: 'INTP', pct: 74 },
  ],
  ENFP: [
    { type: 'INTJ', pct: 88 },
    { type: 'INFJ', pct: 84 },
    { type: 'INTP', pct: 72 },
  ],
  ISTJ: [
    { type: 'ESFP', pct: 78 },
    { type: 'ESTP', pct: 72 },
    { type: 'ISFJ', pct: 85 },
  ],
  ISFJ: [
    { type: 'ESFP', pct: 80 },
    { type: 'ESTP', pct: 70 },
    { type: 'ISTJ', pct: 85 },
  ],
  ESTJ: [
    { type: 'ISFP', pct: 74 },
    { type: 'ISTP', pct: 72 },
    { type: 'ISTJ', pct: 84 },
  ],
  ESFJ: [
    { type: 'ISFP', pct: 82 },
    { type: 'ISTP', pct: 68 },
    { type: 'ISFJ', pct: 80 },
  ],
  ISTP: [
    { type: 'ESTJ', pct: 72 },
    { type: 'ESFJ', pct: 68 },
    { type: 'ENTJ', pct: 70 },
  ],
  ISFP: [
    { type: 'ESFJ', pct: 82 },
    { type: 'ESTJ', pct: 74 },
    { type: 'ENFJ', pct: 76 },
  ],
  ESTP: [
    { type: 'ISFJ', pct: 70 },
    { type: 'ISTJ', pct: 72 },
    { type: 'ESFP', pct: 86 },
  ],
  ESFP: [
    { type: 'ISTJ', pct: 78 },
    { type: 'ISFJ', pct: 80 },
    { type: 'ESTP', pct: 86 },
  ],
}
