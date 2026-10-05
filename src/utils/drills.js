/**
 * Practice text generator.
 *
 * The sequence is a list of short 4-character drills ("asdf", "jkl;",
 * "ffjj" ...). Every single character comes from the home row, and no
 * spaces exist anywhere in the data — grouping is only a display thing,
 * so Space can never become a key the user has to press.
 */
import { HOME_ROW } from './homeRow.js'

/** Each drill has exactly this many characters. */
export const DRILL_LENGTH = 4

/** Hand-picked drills worth repeating. */
const READY_DRILLS = [
  'asdf', 'fdsa', 'jkl;', ';lkj', // straight runs across one hand
  'ffjj', 'ddkk', 'ssll',         // same finger, one key per hand
  'fjfk', 'djdk', 'sfjl',         // index / middle finger jumps
  'fjdk', 'dkfj',                 // hands alternating
  'fjdf', 'kdjk',                 // small loops around the index fingers
]

/** Pick a random element of a list. */
function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

/** A completely random drill, e.g. "sjfa". */
function randomDrill() {
  let drill = ''
  for (let i = 0; i < DRILL_LENGTH; i += 1) {
    drill += pick(HOME_ROW)
  }
  return drill
}

/**
 * Build `count` drills. About one in four is fully random so the text
 * does not feel like the same eight patterns on repeat.
 * @returns {string[]} array of 4-character strings
 */
export function makeDrills(count) {
  const drills = []
  for (let i = 0; i < count; i += 1) {
    drills.push(Math.random() < 0.25 ? randomDrill() : pick(READY_DRILLS))
  }
  return drills
}
