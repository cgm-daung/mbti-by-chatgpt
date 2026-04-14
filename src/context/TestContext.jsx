/* eslint-disable react-refresh/only-export-components -- Provider နှင့် useTest ကို တစ်ဖိုင်တည်းတွင် ထားသည် */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import questionsData from '../data/questions.json'
import { COMPATIBILITY_HINTS } from '../data/mbtiProfiles'
import { TYPE_CONTENT } from '../data/typeContent'
import { appendHistoryEntry, getHistoryEntries } from '../utils/storage'
import { hydrateHistoryEntry, serializeResultForHistory } from '../utils/historyResult'
import { resolveTestResult } from '../utils/mbti'
import { functionPercentages } from '../utils/scoring'

const STORAGE_KEY = 'mbti-cf-cognitive-test-v3'
const PAGE_SIZE = 5
const TOTAL_QUESTIONS = 100

const LIKERT_LABELS = [
  { value: 1, label: 'လုံးဝ မသဘောတူ' },
  { value: 2, label: 'သဘောမတူ' },
  { value: 3, label: 'မသေချာ' },
  { value: 4, label: 'သဘောတူ' },
  { value: 5, label: 'အလွန်သဘောတူ' },
]

const TestContext = createContext(null)

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data.version !== 3 || !data.answers) return null
    return data
  } catch {
    return null
  }
}

function readInitialSession() {
  if (typeof window === 'undefined') {
    return { phase: 'intro', answers: {}, currentPage: 0 }
  }
  const s = loadStored()
  if (s && Object.keys(s.answers || {}).length > 0) {
    return {
      phase: 'test',
      answers: s.answers,
      currentPage: Math.min(
        Math.max(0, s.currentPage || 0),
        TOTAL_QUESTIONS / PAGE_SIZE - 1,
      ),
    }
  }
  return { phase: 'intro', answers: {}, currentPage: 0 }
}

function saveStored(answers, currentPage) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 3,
        answers,
        currentPage,
        savedAt: Date.now(),
      }),
    )
  } catch {
    /* noop */
  }
}

function buildLiveResult(resolved) {
  const typeKey = resolved.primary.type
  return {
    primary: resolved.primary,
    secondary: resolved.secondary,
    scores: resolved.scores,
    fnBreakdown: functionPercentages(resolved.scores),
    copy: TYPE_CONTENT[typeKey] || TYPE_CONTENT.INTJ,
    compat: COMPATIBILITY_HINTS[typeKey] || [],
    mbtiResult: resolved.mbtiResult,
    dynamicNarrative: resolved.dynamicNarrative,
    confidence: resolved.confidence,
    whyMy: resolved.whyMy,
    axes: resolved.axes,
    inconsistency: resolved.inconsistency,
    isHistoryView: false,
  }
}

export function TestProvider({ children }) {
  const questions = questionsData
  const initialSession = useMemo(() => readInitialSession(), [])
  const [phase, setPhase] = useState(initialSession.phase)
  const [answers, setAnswers] = useState(initialSession.answers)
  const [currentPage, setCurrentPage] = useState(initialSession.currentPage)
  const [result, setResult] = useState(null)
  const [historyEntries, setHistoryEntries] = useState(() =>
    typeof window !== 'undefined' ? getHistoryEntries() : [],
  )
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState(null)

  const refreshHistory = useCallback(() => {
    setHistoryEntries(getHistoryEntries())
  }, [])

  const activeResult = useMemo(() => {
    if (phase === 'historyDetail' && selectedHistoryEntry) {
      return hydrateHistoryEntry(selectedHistoryEntry)
    }
    return result
  }, [phase, selectedHistoryEntry, result])

  useEffect(() => {
    if (phase !== 'test') return
    saveStored(answers, currentPage)
  }, [answers, currentPage, phase])

  const answeredCount = useMemo(
    () =>
      Object.keys(answers).filter((k) => answers[k] >= 1 && answers[k] <= 5)
        .length,
    [answers],
  )

  const progressPercent = Math.round((answeredCount / TOTAL_QUESTIONS) * 100)

  const pageQuestionIndices = useMemo(() => {
    const start = currentPage * PAGE_SIZE
    return questions.slice(start, start + PAGE_SIZE)
  }, [currentPage, questions])

  const pageAllAnswered = useMemo(() => {
    return pageQuestionIndices.every((q) => {
      const v = answers[String(q.id)]
      return v >= 1 && v <= 5
    })
  }, [pageQuestionIndices, answers])

  const allAnswered = answeredCount === TOTAL_QUESTIONS

  const setAnswer = useCallback((questionId, value) => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: value }))
  }, [])

  const startTest = useCallback(() => {
    setPhase('test')
    if (Object.keys(answers).length === 0) {
      setCurrentPage(0)
    }
  }, [answers])

  const goIntro = useCallback(() => {
    setSelectedHistoryEntry(null)
    setPhase('intro')
  }, [])

  const goHistory = useCallback(() => {
    setSelectedHistoryEntry(null)
    refreshHistory()
    setPhase('history')
  }, [refreshHistory])

  const openHistoryEntry = useCallback((entry) => {
    setSelectedHistoryEntry(entry)
    setPhase('historyDetail')
  }, [])

  const backToHistoryList = useCallback(() => {
    setSelectedHistoryEntry(null)
    refreshHistory()
    setPhase('history')
  }, [refreshHistory])

  const nextPage = useCallback(() => {
    if (!pageAllAnswered) return
    if (currentPage < TOTAL_QUESTIONS / PAGE_SIZE - 1) {
      setCurrentPage((p) => p + 1)
    }
  }, [currentPage, pageAllAnswered])

  const prevPage = useCallback(() => {
    if (currentPage > 0) setCurrentPage((p) => p - 1)
  }, [currentPage])

  const finishTest = useCallback(() => {
    if (!allAnswered) return
    setPhase('loading')
    window.setTimeout(() => {
      const resolved = resolveTestResult(questions, answers)
      const live = buildLiveResult(resolved)
      setResult(live)
      const serialized = serializeResultForHistory(live)
      if (serialized) {
        appendHistoryEntry(serialized)
        refreshHistory()
      }
      setSelectedHistoryEntry(null)
      setPhase('result')
    }, 1500)
  }, [allAnswered, answers, questions, refreshHistory])

  const restart = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* noop */
    }
    setAnswers({})
    setCurrentPage(0)
    setResult(null)
    setSelectedHistoryEntry(null)
    setPhase('intro')
  }, [])

  /** စမ်းသပ်မှု အလယ်တွင် အဖြေအားလုံး ရှင်းပြီး စာမျက်နှာ ၁ မှ ပြန်စသည် (အတည်ပြုကို UI modal မှ ခေါ်ပါ) */
  const restartTestFromStart = useCallback(() => {
    setAnswers({})
    setCurrentPage(0)
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 3,
          answers: {},
          currentPage: 0,
          savedAt: Date.now(),
        }),
      )
    } catch {
      /* noop */
    }
  }, [])

  const value = {
    questions,
    phase,
    answers,
    currentPage,
    totalPages: TOTAL_QUESTIONS / PAGE_SIZE,
    pageQuestionIndices,
    pageAllAnswered,
    allAnswered,
    answeredCount,
    progressPercent,
    setAnswer,
    nextPage,
    prevPage,
    startTest,
    finishTest,
    restart,
    restartTestFromStart,
    result,
    activeResult,
    isHistoryView: Boolean(activeResult?.isHistoryView),
    historyEntries,
    goIntro,
    goHistory,
    openHistoryEntry,
    backToHistoryList,
    refreshHistory,
    likertLabels: LIKERT_LABELS,
  }

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>
}

export function useTest() {
  const ctx = useContext(TestContext)
  if (!ctx) throw new Error('useTest must be used within TestProvider')
  return ctx
}
