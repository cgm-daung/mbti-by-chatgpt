import QuestionCard from './QuestionCard'
import ProgressBar from './ProgressBar'
import { useTest } from '../context/TestContext'

export default function TestScreen() {
  const {
    pageQuestionIndices,
    currentPage,
    totalPages,
    answers,
    setAnswer,
    nextPage,
    prevPage,
    pageAllAnswered,
    allAnswered,
    progressPercent,
    answeredCount,
    likertLabels,
    finishTest,
    restartTestFromStart,
  } = useTest()

  const isLast = currentPage >= totalPages - 1

  return (
    <div className="min-h-screen pb-36 sm:pb-32">
      <ProgressBar
        progressPercent={progressPercent}
        answeredCount={answeredCount}
        totalQuestions={100}
        pageLabel={`စာမျက်နှာ ${currentPage + 1} / ${totalPages}`}
        onRestartTest={restartTestFromStart}
      />

      <main className="mx-auto max-w-2xl px-4 pb-8 pt-6 sm:px-6 sm:pt-8">
        <div key={currentPage} className="fade-in-up space-y-8">
          {pageQuestionIndices.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q.question}
              questionNumber={currentPage * 5 + idx + 1}
              likertLabels={likertLabels}
              selectedValue={answers[String(q.id)]}
              onSelect={(v) => setAnswer(q.id, v)}
            />
          ))}
        </div>
      </main>

      <nav className="glass-footer fixed bottom-0 left-0 right-0 z-50 px-4 py-3 sm:py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevPage}
            disabled={currentPage === 0}
            className="glass-btn min-h-[48px] min-w-[100px] px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-35"
          >
            နောက်သို့
          </button>
          {!isLast && (
            <button
              type="button"
              onClick={nextPage}
              disabled={!pageAllAnswered}
              className="glass-btn-primary min-h-[48px] flex-1 px-4 py-3 text-sm disabled:cursor-not-allowed sm:max-w-xs sm:flex-none sm:px-10"
            >
              ရှေ့သို့
            </button>
          )}
          {isLast && (
            <button
              type="button"
              onClick={finishTest}
              disabled={!allAnswered}
              title={
                !allAnswered
                  ? 'မေးခွန်း အားလုံး ဖြေပြီးမှ ရလဒ်ကြည့်နိုင်သည်'
                  : undefined
              }
              className="glass-btn-primary min-h-[48px] flex-1 px-4 py-3 text-sm disabled:cursor-not-allowed sm:max-w-xs sm:flex-none sm:px-10"
            >
              ရလဒ်ကြည့်မည်
            </button>
          )}
        </div>
      </nav>
    </div>
  )
}
