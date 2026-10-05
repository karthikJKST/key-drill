/**
 * Everything the whole app agrees on lives here: which keys we practise,
 * how long a session lasts, and which finger owns which key.
 */

/** The eight home-row keys — the only characters ever typed in this app. */
export const HOME_ROW = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';']

/** One practice session = exactly 5 minutes. */
export const SESSION_SECONDS = 5 * 60

/** Finger that presses each key (used by the finger guide). */
export const FINGERS = {
  a: 'Left pinky',
  s: 'Left ring',
  d: 'Left middle',
  f: 'Left index',
  j: 'Right index',
  k: 'Right middle',
  l: 'Right ring',
  ';': 'Right pinky',
}

/** Quick lookup used while typing: is this one of our eight keys? */
export function isHomeRowKey(char) {
  return HOME_ROW.includes(char.toLowerCase())
}
