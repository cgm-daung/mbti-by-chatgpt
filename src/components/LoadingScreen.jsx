export default function LoadingScreen() {
  return (
    <div className="fade-in-up flex min-h-screen flex-col items-center justify-center px-6">
      <div className="glass-card-strong flex flex-col items-center gap-6 px-10 py-12 sm:px-14">
        <div
          className="h-12 w-12 animate-spin rounded-full border-2 border-white/50 border-t-indigo-600"
          aria-hidden
        />
        <p className="animate-pulse-soft text-center text-base font-medium text-ink-900">
          ရလဒ်တွက်ချက်နေပါသည်…
        </p>
        <p className="max-w-sm text-center text-sm text-ink-700">
          ကိုယ့်စိတ်ပိုင်းဆိုင်ရာ ဖန်ရှင်ရှင်းများကို ခွဲခြမ်းစိတ်ဖြာနေပါသည်။
        </p>
      </div>
    </div>
  )
}
