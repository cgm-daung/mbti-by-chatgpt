/**
 * မှတ်တမ်း စာရင်း — glassmorphism
 */
function formatDate(iso) {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d)
  } catch {
    return iso
  }
}

export default function HistoryList({ entries, onSelect, onBack }) {
  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-10 sm:px-6">
      <div className="fade-in-up mb-8 flex items-center justify-between gap-4">
        <div className="glass-card rounded-xl px-4 py-3">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
            ရလဒ်မှတ်တမ်း
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            ယခင်စမ်းသပ်မှုများ — နှိပ်ပြီး အသေးစိတ် ကြည့်ရှုနိုင်သည်
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="glass-btn shrink-0 px-4 py-2 text-sm"
        >
          နောက်သို့
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="glass-card border-dashed border-white/60 p-10 text-center text-ink-600">
          မှတ်တမ်း မရှိသေးပါ။ စမ်းသပ်မှု ပြီးမြောက်လျှင် ဤနေရာတွင် ပေါ်လာပါမည်။
        </div>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => onSelect(e)}
                className="glass-card w-full p-4 text-left transition duration-200 hover:border-white/70 hover:bg-white/40 active:scale-[0.99] sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-2xl font-semibold text-ink-900">
                    {e.type}
                  </span>
                  <span className="shrink-0 text-right text-xs text-ink-500">
                    {formatDate(e.date)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-ink-600">
                  <span>ကိုက်ညီမှု {e.match}%</span>
                  <span className="text-ink-400">·</span>
                  <span>ယုံကြည်မှု {e.confidence}%</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
