import { formatClock } from '../utils/scoring.js'

/**
 * The row above the practice card: countdown on the left, the live
 * numbers in the middle, End Session on the right.
 */
export default function ScoreBoard({
  secondsLeft,
  total,
  correct,
  wrong,
  accuracy,
  cpm,
  onEnd,
}) {
  return (
    <div className="scorebar">
      <div className="clock" role="timer">
        <span className="clock__label">Time left</span>
        <span className="clock__value">{formatClock(secondsLeft)}</span>
      </div>

      <div className="statbox">
        <span className="statbox__label">Keys</span>
        <span className="statbox__value">{total}</span>
      </div>

      <div className="statbox">
        <span className="statbox__label">Correct</span>
        <span className="statbox__value">{correct}</span>
      </div>

      <div className="statbox">
        <span className="statbox__label">Incorrect</span>
        <span className="statbox__value">{wrong}</span>
      </div>

      <div className="statbox">
        <span className="statbox__label">Accuracy</span>
        <span className="statbox__value">{accuracy.toFixed(1)}%</span>
      </div>

      <div className="statbox">
        <span className="statbox__label">CPM</span>
        <span className="statbox__value">{cpm}</span>
      </div>

      <button type="button" className="btn scorebar__end" onClick={onEnd}>
        End Session
      </button>
    </div>
  )
}
