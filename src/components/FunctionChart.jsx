const SHORT = {
  Ne: 'Ne',
  Ni: 'Ni',
  Se: 'Se',
  Si: 'Si',
  Te: 'Te',
  Ti: 'Ti',
  Fe: 'Fe',
  Fi: 'Fi',
}

/**
 * ဖန်ရှင် ၈ ခု ဘားချားတ် — glass track၊ ထိပ် ၂ ခု အလင်းချယှက်
 */
export default function FunctionChart({ fnBreakdown, highlightKeys = [] }) {
  const max = Math.max(...fnBreakdown.map((r) => r.score), 1e-9)
  const hl = new Set(highlightKeys.filter(Boolean))

  return (
    <ul className="space-y-4">
      {fnBreakdown.map((row) => {
        const w = Math.round((row.score / max) * 100)
        const isTop = hl.has(row.key)
        return (
          <li key={row.key}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span
                className={`font-medium ${isTop ? 'text-indigo-900' : 'text-ink-800'}`}
              >
                {SHORT[row.key] || row.key}
                {isTop && (
                  <span className="ml-2 rounded-md border border-indigo-300/50 bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-900 backdrop-blur-sm">
                    ထိပ်
                  </span>
                )}
              </span>
              <span className="tabular-nums text-ink-700">{row.pct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-lg border border-white/35 bg-white/25 shadow-inner backdrop-blur-sm">
              <div
                className={`h-full rounded-lg transition-all duration-700 ${
                  isTop
                    ? 'bg-gradient-to-r from-indigo-500/90 to-violet-500/85'
                    : 'bg-ink-400/50'
                }`}
                style={{ width: `${Math.min(100, w)}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
