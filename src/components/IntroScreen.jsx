import { useTest } from '../context/TestContext'

export default function IntroScreen() {
  const { startTest, answeredCount, progressPercent, goHistory } = useTest()
  const hasProgress = answeredCount > 0

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-12 sm:px-8">
      <div className="fade-in-up glass-card-strong p-8 sm:p-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-600">
          စိတ်ပိုင်းဆိုင်ရာ စမ်းသပ်မှု
        </p>
        <h1 className="mb-4 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          Cognitive Functions နှင့် MBTI စမ်းသပ်မှု
        </h1>
        <p className="mb-6 text-[15px] leading-[1.75] text-ink-700">
          မေးခွန်း ၁၀၀ ပါဝင်ပြီး တစ်စာမျက်နှာလျှင် ၅ မေးခွန်း ဖြစ်သည်။ ဖြေသွားသည်များကို သိမ်းထားသဖြင့်
          စာမျက်နှာပြန်ဖွင့်လျှင် ဆက်လက်လုပ်ဆောင်နိုင်သည်။
        </p>
        <ul className="mb-8 space-y-2.5 text-sm leading-relaxed text-ink-600">
          <li className="flex gap-2">
            <span className="text-indigo-600">·</span>
            ရှေ့သို့ မသွားမီ လက်ရှိစာမျက်နှာရှိ မေးခွန်း အားလုံး ဖြေပြီးမှသာ
            ဆက်လုပ်နိုင်သည်။
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-600">·</span>
            မှန်ကန်ချက်ထက် “ကိုယ်ဘယ်လို ဖြစ်လေ့ရှိလဲ” ကို မှတ်သားပါ။
          </li>
        </ul>
        {hasProgress && (
          <p className="mb-4 rounded-xl border border-indigo-200/50 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-950 backdrop-blur-sm">
            ယခင် ဖြေထားမှု {progressPercent}% ရှိပါသည်။ ဆက်လက်လုပ်ရန် အောက်ခလုတ်ကို
            နှိပ်ပါ။
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={goHistory}
            className="glass-btn order-2 min-h-[48px] px-5 py-3 text-sm sm:order-1"
          >
            ရလဒ်မှတ်တမ်း
          </button>
          <button
            type="button"
            onClick={startTest}
            className="glass-btn-primary order-1 min-h-[48px] px-6 py-3 text-sm sm:order-2"
          >
            {hasProgress ? 'ဆက်လက်ဖြေမည်' : 'စတင်မည်'}
          </button>
        </div>
      </div>
      <p className="mt-8 text-center text-xs leading-relaxed text-ink-700 drop-shadow-sm">
        ရလဒ်သည် ပညာရပ် အကြမ်းဖျင်း လမ်းညွှန်ချက်သာ ဖြစ်သည်။ ဆေးဘက်ဆိုင်ရာ
        အချက်အလက်မဟုတ်ပါ။
      </p>
    </div>
  )
}
