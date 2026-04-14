/**
 * ရလဒ် ဟီးရို — glassmorphism
 */
export default function ResultHero({
  type,
  matchPercent,
  confidencePercent,
  subtitle = 'သင်၏ ကိုယ်ရည်ကိုယ်သွေး',
}) {
  return (
    <section className="fade-in-up glass-card-strong relative overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-12">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-2xl" />
      <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">
        MBTI ရလဒ်
      </p>
      <h1 className="relative mt-3 font-sans text-5xl font-semibold tracking-tight text-ink-900 sm:text-6xl md:text-7xl">
        {type}
      </h1>
      <p className="relative mt-3 text-base text-ink-600 sm:text-lg">{subtitle}</p>
      <div className="relative mt-8 flex flex-wrap items-end justify-center gap-8 sm:gap-12">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
            ကိုက်ညီမှု
          </p>
          <p className="text-4xl font-semibold tabular-nums text-ink-900 sm:text-5xl">
            {matchPercent}
            <span className="text-2xl text-ink-400">%</span>
          </p>
        </div>
        <div className="hidden h-12 w-px bg-white/50 sm:block" aria-hidden />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
            ယုံကြည်စိတ်ချရမှု
          </p>
          <p className="text-4xl font-semibold tabular-nums text-indigo-800 sm:text-5xl">
            {confidencePercent}
            <span className="text-2xl text-ink-400">%</span>
          </p>
        </div>
      </div>
    </section>
  )
}
