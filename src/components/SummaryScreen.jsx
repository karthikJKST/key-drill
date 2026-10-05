import { formatClock } from '../utils/scoring.js'

/** One short line of feedback based on the final accuracy. */
function getResultMessage(total, accuracy) {
  if (total === 0) return 'No keys typed this time. Press Practice Again to try.'
  if (accuracy >= 90) return 'Great accuracy. Keep building speed.'
  if (accuracy >= 70) return 'Good work. Keep practicing for better accuracy.'
  return 'Slow down and focus on typing the correct key.'
}

/**
 * The result screen shown after 5 minutes or an early "End Session".
 * Six numbers, one feedback line and two buttons — nothing more.
 */
export default function SummaryScreen({ summary, onAgain, onHome }) {
  const { total, correct, wrong, accuracy, cpm, elapsedSeconds } = summary

  const stats = [
    { label: 'Time', value: formatClock(elapsedSeconds) },
    { label: 'Keys Typed', value: total },
    { label: 'Correct', value: correct },
    { label: 'Incorrect', value: wrong },
    { label: 'Accuracy', value: `${accuracy.toFixed(1)}%` },
    { label: 'CPM', value: cpm },
  ]

  return (
    <div className="card summary">
      <h1 className="summary__title">Practice Complete</h1>
      <p className="summary__message">{getResultMessage(total, accuracy)}</p>

      <div className="summary__grid">
        {stats.map((stat) => (
          <div className="summary__cell" key={stat.label}>
            <span className="summary__label">{stat.label}</span>
            <span className="summary__value">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="summary__actions">
        <button type="button" className="btn btn--primary" onClick={onAgain}>
          Practice Again
        </button>
        <button type="button" className="btn" onClick={onHome}>
          Back Home
        </button>
      </div>
    </div>
  )
}
