/**
 * မေးခွန်း ကတ် + လိုက်ကာ ခလုတ်များ (glassmorphism)
 */
export default function QuestionCard({
  question,
  questionNumber,
  likertLabels,
  selectedValue,
  onSelect,
}) {
  return (
    <article className="glass-card-strong p-5 transition duration-300 hover:border-white/70 hover:shadow-[0_12px_40px_rgba(31,38,135,0.16)] sm:p-7">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-ink-600">
        မေးခွန်း {questionNumber}
      </p>
      <p className="mb-6 text-[15px] font-normal leading-[1.75] text-ink-900 sm:text-lg sm:leading-relaxed">
        {question}
      </p>
      <fieldset>
        <legend className="sr-only">လိုက်ကာ စကေး</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-2">
          {likertLabels.map((opt) => {
            const selected = selectedValue === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSelect(opt.value)}
                className={`rounded-xl border px-3 py-3 text-left text-sm font-medium backdrop-blur-md transition-all duration-200 sm:min-h-[3.25rem] sm:text-center ${
                  selected
                    ? 'border-indigo-400/60 bg-indigo-500/25 text-indigo-950 shadow-md ring-2 ring-indigo-400/40'
                    : 'border-white/45 bg-white/20 text-ink-900 hover:border-white/60 hover:bg-white/35 active:scale-[0.98]'
                }`}
              >
                <span className="text-xs tabular-nums text-ink-500 sm:hidden">
                  {opt.value}.{' '}
                </span>
                {opt.label}
              </button>
            )
          })}
        </div>
      </fieldset>
    </article>
  )
}
