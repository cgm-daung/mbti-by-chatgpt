import IntroScreen from './components/IntroScreen'
import HistoryList from './components/HistoryList'
import LoadingScreen from './components/LoadingScreen'
import ResultScreen from './components/ResultScreen'
import TestScreen from './components/TestScreen'
import { TestProvider, useTest } from './context/TestContext'

function AppRoutes() {
  const { phase, historyEntries, openHistoryEntry, goIntro } = useTest()

  switch (phase) {
    case 'intro':
      return <IntroScreen />
    case 'test':
      return <TestScreen />
    case 'loading':
      return <LoadingScreen />
    case 'result':
    case 'historyDetail':
      return <ResultScreen />
    case 'history':
      return (
        <HistoryList
          entries={historyEntries}
          onSelect={openHistoryEntry}
          onBack={goIntro}
        />
      )
    default:
      return <IntroScreen />
  }
}

export default function App() {
  return (
    <TestProvider>
      <AppRoutes />
    </TestProvider>
  )
}
