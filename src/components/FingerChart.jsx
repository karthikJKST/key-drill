import { FINGERS, HOME_ROW } from '../utils/homeRow.js'

/**
 * A simple list showing which finger presses which key.
 * When `activeKey` is passed, that row is highlighted — the practice
 * screen uses it to point at the finger for the next key.
 */
export default function FingerChart({ activeKey = '' }) {
  return (
    <ul className="fingers">
      {HOME_ROW.map((key) => (
        <li
          key={key}
          className={
            key === activeKey ? 'fingers__item fingers__item--active' : 'fingers__item'
          }
        >
          <span className="fingers__key">{key.toUpperCase()}</span>
          <span className="fingers__name">{FINGERS[key]}</span>
        </li>
      ))}
    </ul>
  )
}
