import { useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * စမ်းသပ်မှု အစမှ ပြန်စရန် အတည်ပြု — browser confirm အစား glass UI
 */
export default function RestartTestConfirmModal({ open, onClose, onConfirm }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restart-test-title"
      aria-describedby="restart-test-desc"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink-900/35 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-label="ပိတ်မည်"
      />
      <div className="glass-card-strong relative z-[1] w-full max-w-md rounded-2xl border border-white/60 p-6 shadow-[0_24px_80px_rgba(49,46,129,0.2)] sm:p-8">
        <h2
          id="restart-test-title"
          className="text-lg font-semibold tracking-tight text-ink-900 sm:text-xl"
        >
          စမ်းသပ်မှုကို အစမှ စတင်မည်လား?
        </h2>
        <p
          id="restart-test-desc"
          className="mt-3 text-sm leading-relaxed text-ink-700 sm:text-[15px]"
        >
          ဖြေထားသော အဖြေအားလုံး ပျက်သွားပါမည်။ ဤလုပ်ဆောင်ချက်ကို နောက်ပြန်ပြင်၍ မရပါ။
        </p>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="glass-btn min-h-[48px] w-full px-5 py-3 text-sm font-medium sm:w-auto"
          >
            မလုပ်တော့ပါ
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="min-h-[48px] w-full rounded-xl border border-rose-400/50 bg-rose-500/90 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 backdrop-blur-sm transition hover:bg-rose-600 active:scale-[0.98] sm:w-auto"
          >
            အစမှ ပြန်စမည်
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
