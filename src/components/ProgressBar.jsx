import { useState } from 'react'
import RestartTestConfirmModal from './RestartTestConfirmModal'

/**
 * ထိပ်တန်း တိုးတက်မှု ဘား (glassmorphism)
 */
export default function ProgressBar({
  progressPercent,
  answeredCount,
  totalQuestions = 100,
  pageLabel,
  onRestartTest,
}) {
  const [restartOpen, setRestartOpen] = useState(false)

  return (
    <header className="glass-header sticky top-0 z-40 px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-medium sm:text-sm">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {pageLabel && (
              <span className="truncate text-ink-800">{pageLabel}</span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {onRestartTest && (
              <button
                type="button"
                onClick={() => setRestartOpen(true)}
                className="rounded-lg border border-white/50 bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-ink-800 backdrop-blur-sm transition hover:border-rose-200/80 hover:bg-rose-50/50 hover:text-rose-900 sm:px-3 sm:text-xs"
              >
                အစမှ ပြန်စမည်
              </button>
            )}
            <span className="tabular-nums text-ink-900">{progressPercent}%</span>
          </div>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full border border-white/30 bg-white/30 shadow-inner backdrop-blur-sm"
          role="progressbar"
          aria-valuenow={answeredCount}
          aria-valuemin={0}
          aria-valuemax={totalQuestions}
          aria-label="စမ်းသပ်မှု တိုးတက်မှု"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500/90 via-violet-500/90 to-cyan-500/80 shadow-sm transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-1.5 text-center text-[11px] text-ink-700 sm:text-xs">
          ဖြေပြီး {answeredCount} / {totalQuestions}
        </p>
      </div>

      {onRestartTest && (
        <RestartTestConfirmModal
          open={restartOpen}
          onClose={() => setRestartOpen(false)}
          onConfirm={onRestartTest}
        />
      )}
    </header>
  )
}
