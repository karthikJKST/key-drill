import { HOME_ROW } from '../utils/homeRow.js'

/**
 * The starting screen: what the app is, the eight keys it practises,
 * how a session works and one Start Practice button. Kept compact and
 * educational — no marketing-style hero.
 */
export default function HomeScreen({ onStart }) {
  return (
    <div className="home">
      <section className="card home__intro">
        <h1 className="home__title">KeyDrill</h1>
        <p className="home__subtitle">Home-row typing practice</p>

        <p className="home__label">Practice these 8 keys:</p>
        <ul className="keylist" aria-label="Supported keys">
          {HOME_ROW.map((key) => (
            <li className="keylist__item" key={key}>
              {key.toUpperCase()}
            </li>
          ))}
        </ul>

        <h2 className="home__label">How it works:</h2>
        <ol className="how">
          <li>Type the highlighted key.</li>
          <li>Follow the keyboard and finger guide.</li>
          <li>Practice for 5 minutes.</li>
          <li>Check your accuracy and typing speed.</li>
        </ol>

        <button type="button" className="btn btn--primary" onClick={onStart}>
          Start Practice
        </button>
      </section>
    </div>
  )
}
