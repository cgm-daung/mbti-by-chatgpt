import { useCallback, useRef, useState } from 'react'
import { useTest } from '../context/TestContext'
import { downloadResultPng } from '../utils/pngExport'
import FunctionChart from './FunctionChart'
import ResultExportPanel from './ResultExportPanel'
import ResultHero from './ResultHero'

function toBulletItems(text) {
  if (!text?.trim()) return []
  return text
    .split('၊')
    .map((s) => s.trim())
    .filter(Boolean)
}

const FN_NAMES_MY = {
  Ne: 'ပြင်ပ အသိဉာဏ် (Ne)',
  Ni: 'အတွင်း အသိဉာဏ် (Ni)',
  Se: 'ပြင်ပ သိဉာဏ် (Se)',
  Si: 'အတွင်း သိဉာဏ် (Si)',
  Te: 'ပြင်ပ တွေးခေါ်မှု (Te)',
  Ti: 'အတွင်း တွေးခေါ်မှု (Ti)',
  Fe: 'ပြင်ပ ခံစားမှု (Fe)',
  Fi: 'အတွင်း ခံစားမှု (Fi)',
}

export default function ResultScreen() {
  const {
    activeResult,
    restart,
    isHistoryView,
    backToHistoryList,
    goHistory,
  } = useTest()
  const exportRef = useRef(null)
  const [pngBusy, setPngBusy] = useState(false)

  const shareResult = useCallback(async () => {
    if (!activeResult) return
    const {
      primary,
      copy,
      dynamicNarrative,
      confidence,
      inconsistency,
      whyMy,
      savedAt,
    } = activeResult
    const text = [
      `ကိုဂ်နီတီဗ် ဖန်ရှင်း စမ်းသပ်မှု ရလဒ်`,
      savedAt ? `ရက်စွဲ: ${savedAt}` : '',
      `အဓိက အမျိုးအစား: ${primary.type} (${primary.match}%)`,
      `ယုံကြည်စိတ်ချရမှု: ${confidence}%`,
      inconsistency?.shouldWarn ? `\nသတိပေးချက်: ${inconsistency.messageMy}` : '',
      ``,
      whyMy,
      ``,
      dynamicNarrative,
      ``,
      copy.summary,
    ]
      .filter(Boolean)
      .join('\n')
    try {
      if (navigator.share) {
        await navigator.share({ title: 'MBTI ရလဒ်', text })
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        alert('ရလဒ်ကို ကလစ်ဘုတ်သို့ ကူးယူပြီးပါပြီ။')
      }
    } catch (e) {
      if (e?.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(text)
          alert('ရလဒ်ကို ကလစ်ဘုတ်သို့ ကူးယူပြီးပါပြီ။')
        } catch {
          /* noop */
        }
      }
    }
  }, [activeResult])

  const handleDownloadPng = useCallback(async () => {
    const el = exportRef.current
    if (!el) return
    setPngBusy(true)
    try {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
      await downloadResultPng(
        el,
        `MBTI-${activeResult?.primary?.type}-${Date.now()}.png`,
      )
    } catch {
      alert('PNG မအောင်မြင်ပါ။ နောက်မှ ထပ်စမ်းကြည့်ပါ။')
    } finally {
      setPngBusy(false)
    }
  }, [activeResult?.primary?.type])

  if (!activeResult) return null

  const {
    primary,
    secondary,
    fnBreakdown,
    copy,
    compat,
    confidence,
    whyMy,
    mbtiResult,
    inconsistency,
    dynamicNarrative,
  } = activeResult

  const strengthItems = toBulletItems(copy.strengths)
  const weaknessItems = toBulletItems(copy.weaknesses)
  const careerItems = toBulletItems(copy.careers)
  const highlightKeys = [mbtiResult?.dominantUser, mbtiResult?.auxiliaryUser].filter(
    Boolean,
  )

  const dominantLabel = FN_NAMES_MY[mbtiResult?.dominantType] || mbtiResult?.dominantType
  const auxiliaryLabel = FN_NAMES_MY[mbtiResult?.auxiliaryType] || mbtiResult?.auxiliaryType

  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        {isHistoryView && (
          <div className="fade-in-up glass-card mb-6 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-sm text-ink-700">မှတ်တမ်းမှ ပြန်ကြည့်ခြင်း</p>
            <button
              type="button"
              onClick={backToHistoryList}
              className="glass-btn px-4 py-2 text-sm"
            >
              မှတ်တမ်းသို့
            </button>
          </div>
        )}

        <div className="fade-in-up space-y-8">
          {inconsistency?.shouldWarn && (
            <div
              className="rounded-2xl border border-amber-300/50 bg-amber-100/35 px-4 py-3 text-sm text-amber-950 shadow-lg backdrop-blur-xl"
              role="alert"
            >
              <p className="font-semibold">သတိပေးချက်</p>
              <p className="mt-1">{inconsistency.messageMy}</p>
            </div>
          )}

          <ResultHero
            type={primary.type}
            matchPercent={primary.match}
            confidencePercent={confidence}
            subtitle="သင်၏ ကိုယ်ရည်ကိုယ်သွေး"
          />

          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink-900">
              ကိုဂ်နီတီဗ် ဖန်ရှင်ရှင်း ချားတ်
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              ထိပ် ၂ ဖန်ရှင်ကို အလင်းရောင်ချယှက်ထားသည်
            </p>
            <div className="mt-6">
              <FunctionChart fnBreakdown={fnBreakdown} highlightKeys={highlightKeys} />
            </div>
          </section>

          {dynamicNarrative?.trim() && (
            <section className="glass-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-ink-900">
                ဝင်ရိုးနှင့် စတက် — အကျဉ်း
              </h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-700">
                {dynamicNarrative}
              </p>
            </section>
          )}

          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink-900">
              ဘာကြောင့် ဤအမျိုးအစားလဲ?
            </h2>
            {whyMy && (
              <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-700">
                {whyMy}
              </p>
            )}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/40 bg-white/20 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  ဒိုမီနန့် (စတက်)
                </p>
                <p className="mt-2 text-base font-semibold text-ink-900">
                  {dominantLabel}
                </p>
              </div>
              <div className="rounded-xl border border-white/40 bg-white/20 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  အက်စ် (စတက်)
                </p>
                <p className="mt-2 text-base font-semibold text-ink-900">
                  {auxiliaryLabel}
                </p>
              </div>
            </div>
          </section>

          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink-900">ကိုယ်ရည်ကိုယ်သွေး အကျဉ်း</h2>
            <p className="mt-4 leading-[1.8] text-ink-700">{copy.summary}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card p-6 sm:p-7">
              <h2 className="text-base font-semibold text-ink-900">အားသာချက်များ</h2>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-700">
                {strengthItems.map((item, i) => (
                  <li key={`s-${i}`} className="flex gap-2">
                    <span className="text-indigo-600">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-6 sm:p-7">
              <h2 className="text-base font-semibold text-ink-900">အားနည်းချက်များ</h2>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-700">
                {weaknessItems.map((item, i) => (
                  <li key={`w-${i}`} className="flex gap-2">
                    <span className="text-ink-500">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink-900">
              အလုပ်အကိုင် အကြံပြုချက်များ
            </h2>
            <ul className="mt-4 space-y-2 text-ink-700">
              {careerItems.map((item, i) => (
                <li key={`c-${i}`} className="flex gap-2 text-sm leading-relaxed">
                  <span className="text-indigo-600">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink-900">
              ကိုက်ညီသော အမျိုးအစားများ
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {compat.map((c) => (
                <div
                  key={c.type}
                  className="flex items-center justify-between rounded-xl border border-white/45 bg-white/20 px-4 py-3 backdrop-blur-sm transition hover:border-white/60 hover:bg-white/30"
                >
                  <span className="font-semibold text-ink-800">{c.type}</span>
                  <span className="text-sm tabular-nums text-ink-500">~{c.pct}%</span>
                </div>
              ))}
            </div>
            {secondary?.length > 0 && (
              <>
                <h3 className="mb-3 mt-8 text-sm font-semibold text-ink-500">
                  နောက်ထပ် ဖြစ်နိုင်ချေများ
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {secondary.map((row) => (
                    <div
                      key={row.type}
                      className="rounded-xl border border-white/40 bg-white/25 px-3 py-2 text-center text-sm backdrop-blur-sm"
                    >
                      <span className="font-medium text-ink-800">{row.type}</span>
                      <span className="mt-1 block text-xs text-ink-400">
                        {row.match}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className="rounded-2xl border border-indigo-300/40 bg-indigo-500/10 p-6 shadow-lg backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-ink-900">
              ကိုယ့်ကိုယ်ကို တိုးတက်စေရန်
            </h2>
            <p className="mt-3 leading-relaxed text-ink-700">{copy.growth}</p>
          </section>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <button
                type="button"
                onClick={restart}
                className="glass-btn min-h-[48px] px-6 py-3 text-sm"
              >
                စမ်းသပ်မှု ပြန်စမည်
              </button>
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={pngBusy}
                className="glass-btn-primary min-h-[48px] px-6 py-3 text-sm disabled:opacity-50"
              >
                {pngBusy ? 'PNG ပြင်ဆင်နေသည်…' : 'PNG ဒေါင်းလုဒ်'}
              </button>
              {/* <button
                type="button"
                onClick={shareResult}
                className="glass-btn min-h-[48px] px-6 py-3 text-sm"
              >
                ရလဒ် မျှဝေ / ကူးယူ
              </button> */}
              {!isHistoryView && (
                <button
                  type="button"
                  onClick={goHistory}
                  className="glass-btn min-h-[48px] px-6 py-3 text-sm"
                >
                  မှတ်တမ်းကြည့်
                </button>
              )}
            </div>
            {!isHistoryView && (
              <p className="text-center text-xs text-ink-700">
                ဤရလဒ် မှတ်တမ်းတွင် အလိုအလျောက် သိမ်းထားပါသည်။
              </p>
            )}
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-700 drop-shadow-sm">
            ရလဒ်သည် ဖန်ရှင်အမှတ်၊ စတက်နှင့် ဝင်ရိုးတို့ကို ပေါင်းစပ် ခန့်မှန်းခြင်းဖြစ်သည်။
          </p>
        </div>
      </div>

      <div
        ref={exportRef}
        className="pointer-events-none fixed left-[-12000px] top-0 w-[720px] overflow-hidden"
        aria-hidden
      >
        <ResultExportPanel
          type={primary.type}
          match={primary.match}
          confidence={confidence}
          fnBreakdown={fnBreakdown}
          summary={copy.summary}
          strengthsText={copy.strengths}
          weaknessesText={copy.weaknesses}
          careersText={copy.careers}
          dominantLabel={dominantLabel}
          auxiliaryLabel={auxiliaryLabel}
        />
      </div>
    </div>
  )
}
