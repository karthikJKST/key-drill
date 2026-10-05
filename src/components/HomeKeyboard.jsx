import { HOME_ROW } from '../utils/homeRow.js'

/**
 * The eight home-row keys in one row. The extra gap in the middle is
 * the space between the two hands, and the key the user should press
 * next gets the `keycap--active` style.
 */
export default function HomeKeyboard({ nextKey }) {
  return (
    <div className="keyboard" role="group" aria-label="Home row keyboard">
      {HOME_ROW.map((key, index) => {
        const classes = ['keycap']
        if (index === 4) classes.push('keycap--spaced') // gap between hands
        if (key === nextKey) classes.push('keycap--active')

        return (
          <span key={key} className={classes.join(' ')}>
            {key.toUpperCase()}
          </span>
        )
      })}
    </div>
  )
}
