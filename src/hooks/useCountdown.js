import { useEffect, useRef, useState } from 'react'

/**
 * A countdown that starts the moment it mounts (i.e. when the practice
 * screen appears) and stops on unmount.
 *
 * How it works: we remember the start time, and every tick recalculates
 * the remaining time from Date.now(). Browsers slow down setInterval in
 * background tabs, so counting from a fixed start time keeps the clock
 * accurate instead of drifting.
 *
 * @param {number} totalSeconds session length in seconds
 * @returns {{ secondsLeft: number, elapsedSeconds: number }}
 */
export default function useCountdown(totalSeconds) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const startedAtRef = useRef(null)

  useEffect(() => {
    startedAtRef.current = Date.now()

    function tick() {
      const passed = Math.floor((Date.now() - startedAtRef.current) / 1000)
      const left = Math.max(0, totalSeconds - passed)
      setSecondsLeft(left)
      if (left === 0) clearInterval(intervalId)
    }

    // One interval per mount. The cleanup below always clears it.
    const intervalId = setInterval(tick, 250)
    return () => clearInterval(intervalId)
  }, [totalSeconds])

  return {
    secondsLeft,
    elapsedSeconds: totalSeconds - secondsLeft,
  }
}
