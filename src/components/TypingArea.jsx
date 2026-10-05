import { useEffect, useRef } from 'react'
import { FINGERS } from '../utils/homeRow.js'

/** Characters shown around the cursor — always whole groups of 4. */
const VISIBLE_CHARS = 40

/** The sequence is made of 4-character drills, so groups line up. */
const DRILL_LENGTH = 4

/**
 * The part of the practice screen you actually type against:
 * the big "next key" box, the line of text to type, and the input.
 *
 * The text line shows the current group of 4 characters plus the next
 * groups. The space between groups is pure CSS — no space character
 * exists in the sequence, so Space is never a key to press.
 */
export default function TypingArea({
  text,
  position,
  nextKey,
  feedback,
  missed,
  hint,
  onType,
}) {
  const inputRef = useRef(null)

  // Focus the typing box as soon as the practice screen appears.
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Keep focus while practising, but let people reach the
  // "End Session" button (and anything else focusable).
  function handleBlur(event) {
    const next = event.relatedTarget
    if (next && next.tagName === 'BUTTON') return
    inputRef.current?.focus()
  }

  // Only show complete groups, starting with the group we are in.
  const groupStart = Math.floor(position / DRILL_LENGTH) * DRILL_LENGTH
  const visible = text.slice(groupStart, groupStart + VISIBLE_CHARS)

  const groups = []
  for (let i = 0; i < visible.length; i += DRILL_LENGTH) {
    groups.push(visible.slice(i, i + DRILL_LENGTH))
  }

  // A wrong key briefly turns the typing box red.
  const inputClass = feedback === 'bad' ? 'typebox typebox--bad' : 'typebox'

  return (
    <>
      <div className={`nextkey nextkey--${feedback || 'idle'}`}>
        <span className="nextkey__label">Next key</span>
        <span className="nextkey__key">{nextKey ? nextKey.toUpperCase() : '-'}</span>
        <span className="nextkey__finger">{nextKey ? FINGERS[nextKey] : ''}</span>
      </div>

      <div className="typing__body">
        <div className="drillline">
          {groups.map((group, groupIndex) => (
            <span className="drill" key={groupStart / DRILL_LENGTH + groupIndex}>
              {group.split('').map((char, charIndex) => {
                const index = groupStart + groupIndex * DRILL_LENGTH + charIndex

                let className = 'drill__char'
                if (index === missed) className += ' drill__char--missed'
                else if (index < position) className += ' drill__char--done'
                else if (index === position) className += ' drill__char--next'

                return (
                  <span className={className} key={charIndex}>
                    {char}
                  </span>
                )
              })}
            </span>
          ))}
        </div>

        {/* value is kept empty on purpose: every character is judged the
            moment it is typed, so mistakes cannot be edited away later. */}
        <input
          ref={inputRef}
          className={inputClass}
          type="text"
          value=""
          placeholder="Type the highlighted key here"
          aria-label="Typing box — type the highlighted home-row key"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={(event) => onType(event.target.value)}
          onPaste={(event) => event.preventDefault()}
          onBlur={handleBlur}
        />

        <p className="hint" role="status">
          {hint}
        </p>
      </div>
    </>
  )
}
