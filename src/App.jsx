import { useState } from 'react'
import SiteHeader from './components/SiteHeader.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import PracticeScreen from './components/PracticeScreen.jsx'
import SummaryScreen from './components/SummaryScreen.jsx'

/**
 * App is only responsible for one thing: deciding which screen is on
 * top. There is no router and no global store — just three screens and
 * the finished-session data handed back by the practice screen.
 */
export default function App() {
  // 'home' -> 'practice' -> 'summary' -> ...
  const [screen, setScreen] = useState('home')
  const [summary, setSummary] = useState(null)

  function startPractice() {
    setSummary(null)
    setScreen('practice')
  }

  // Called by the practice screen when the 5 minutes are over or the
  // user pressed "End Session".
  function finishPractice(result) {
    setSummary(result)
    setScreen('summary')
  }

  function goHome() {
    setSummary(null)
    setScreen('home')
  }

  return (
    <div className="app">
      <SiteHeader />

      <main className="app__main">
        {screen === 'home' && <HomeScreen onStart={startPractice} />}

        {screen === 'practice' && <PracticeScreen onFinish={finishPractice} />}

        {screen === 'summary' && summary && (
          <SummaryScreen summary={summary} onAgain={startPractice} onHome={goHome} />
        )}
      </main>

      <footer className="app__footer">
        KeyDrill — home-row typing practice.
      </footer>
    </div>
  )
}
