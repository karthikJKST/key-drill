import { useEffect, useRef, useState } from 'react'
import useCountdown from '../hooks/useCountdown.js'
import { SESSION_SECONDS, isHomeRowKey } from '../utils/homeRow.js'
import { makeDrills } from '../utils/drills.js'
import { accuracyOf, cpmOf } from '../utils/scoring.js'
import ScoreBoard from './ScoreBoard.jsx'
import TypingArea from './TypingArea.jsx'
import HomeKeyboard from './HomeKeyboard.jsx'
import FingerChart from './FingerChart.jsx'

/** How long the "practice only these keys" note stays visible. */
const HINT_MS = 2200

/** How long the correct/incorrect flash stays on screen. */
const FEEDBACK_MS = 300

/** Never let the typist get closer than this to the end of the text. */
const KEEP_AHEAD = 40

/** How many drills one top-up adds (60 drills = 240 characters). */
const TOP_UP_DRILLS = 60

/**
 * The practice screen. It owns everything about the current session:
 * the generated text, the cursor, the counters, the short feedback
 * messages and the 5-minute countdown.
 *
 * Typing rules:
 *  - correct home-row key    -> correct +1, total +1, move on
 *  - wrong home-row key      -> incorrect +1, total +1, move on, brief flash
 *  - anything else           -> ignored (short note appears), no count
 */
export default function PracticeScreen({ onFinish }) {
  const [drills, setDrills] = useState(() => makeDrills(300))
  const [position, setPosition] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [feedback, setFeedback] = useState(null) // 'ok' | 'bad' | null
  const [missed, setMissed] = useState(null) // index of the key just missed
  const [hint, setHint] = useState('')

  const feedbackTimer = useRef(null)
  const hintTimer = useRef(null)
  const finishedRef = useRef(false)

  const { secondsLeft, elapsedSeconds } = useCountdown(SESSION_SECONDS)

  // The flat text is just the drills glued together. Every character in
  // it is a home-row key — there are no spaces anywhere.
  const text = drills.join('')

  const nextKey = text[position] ?? ''
  const total = correct + wrong
  const accuracy = accuracyOf(correct, total)
  const cpm = cpmOf(total, elapsedSeconds)

  // Progress follows the session timer: 0% at 05:00, 100% at 00:00.
  const progress = Math.round(
    ((SESSION_SECONDS - secondsLeft) / SESSION_SECONDS) * 100
  )

  // Clear both timeouts if the screen goes away mid-session.
  useEffect(
    () => () => {
      clearTimeout(feedbackTimer.current)
      clearTimeout(hintTimer.current)
    },
    []
  )

  // Hand the final numbers back to App exactly once.
  function finish() {
    if (finishedRef.current) return
    finishedRef.current = true
    onFinish({ total, correct, wrong, accuracy, cpm, elapsedSeconds })
  }

  // The session ends by itself when the countdown reaches 00:00. A short
  // delay lets the progress bar show 100% for a moment before the
  // result screen takes over. The cleanup cancels the timer on unmount,
  // and finish() is guarded so it can never run twice.
  useEffect(() => {
    if (secondsLeft !== 0) return undefined
    const delay = setTimeout(finish, 400)
    return () => clearTimeout(delay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft])

  function showHint(message) {
    setHint(message)
    clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => setHint(''), HINT_MS)
  }

  /**
   * Called with whatever characters the typing box received. Runs
   * through them one by one so a couple of keys arriving together are
   * still judged in the right order (the local `pos` variable keeps
   * track before React has re-rendered).
   */
  function handleTypedText(value) {
    if (secondsLeft === 0) return

    let pos = position
    let outcome = null
    let missedAt = null

    for (const char of value) {
      // Modifier/navigation keys ("Shift", "Backspace"...) are longer
      // than one character — ignore them completely.
      if (char.length !== 1) continue

      // Not one of our eight keys: never counted, never advances.
      if (!isHomeRowKey(char)) {
        showHint('Practice only: A S D F J K L ;')
        continue
      }

      const expected = text[pos]
      if (expected === undefined) continue // safety net

      const isCorrect = char.toLowerCase() === expected
      if (isCorrect) {
        setCorrect((n) => n + 1)
      } else {
        setWrong((n) => n + 1)
        missedAt = pos // remember which key was missed, for the flash
      }

      pos += 1
      outcome = isCorrect ? 'ok' : 'bad'
    }

    if (outcome === null) return

    setPosition(pos)
    setFeedback(outcome)
    setMissed(missedAt)
    clearTimeout(feedbackTimer.current)
    feedbackTimer.current = setTimeout(() => {
      setFeedback(null)
      setMissed(null)
    }, FEEDBACK_MS)

    // Add more drills when the typist gets close to the end of the
    // current text, so a fast typist can never run out.
    if (pos + KEEP_AHEAD >= text.length) {
      setDrills((prev) => [...prev, ...makeDrills(TOP_UP_DRILLS)])
    }
  }

  return (
    <div className="practice">
      <ScoreBoard
        secondsLeft={secondsLeft}
        total={total}
        correct={correct}
        wrong={wrong}
        accuracy={accuracy}
        cpm={cpm}
        onEnd={finish}
      />

      <div className="progress">
        <div className="progress__head">
          <span className="progress__label">Practice Progress</span>
          <span className="progress__value">{progress}%</span>
        </div>
        <div
          className="progress__track"
          role="progressbar"
          aria-label="Practice progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progress}
        >
          <div className="progress__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <section className="card typing">
        <TypingArea
          text={text}
          position={position}
          nextKey={nextKey}
          feedback={feedback}
          missed={missed}
          hint={hint}
          onType={handleTypedText}
        />
      </section>

      <section className="card guide">
        <div className="guide__part">
          <p className="guide__label">Keyboard — the next key is highlighted</p>
          <HomeKeyboard nextKey={nextKey} />
        </div>
        <div className="guide__part">
          <p className="guide__label">Finger guide — the finger you need is highlighted</p>
          <FingerChart activeKey={nextKey} />
        </div>
      </section>
    </div>
  )
}
