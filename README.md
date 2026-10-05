# KeyDrill

A small touch-typing practice app for the eight home-row keys, built with
React while I was learning how React apps are put together.

## What it does

KeyDrill gives you one focused task: type the home-row keys
**A S D F J K L ;** for **5 minutes** and see how accurate and how fast you
were. It shows the next key to press, which finger owns that key, a small
keyboard with the target key highlighted, and a progress bar for the
5-minute session, so you can keep your eyes on the screen instead of
hunting for keys.

There is no login, no database and no backend — it runs entirely in the
browser.

## Features

- Start screen that explains the app: the 8 supported keys, how a session
  works and one **Start Practice** button
- 5-minute practice session with a countdown from `05:00` to `00:00`
- Simple **progress bar** showing how much of the 5 minutes has passed
  (0% at the start, 100% at the end)
- Typing line built from short 4-character drills — **only** home-row
  characters ever appear, and Space is never a key you have to press
- Next-key box showing the key to press and the finger to press it with
- Live stats: total keys, correct, incorrect, accuracy and CPM
- Correct and incorrect keys are both counted and both move you forward;
  a wrong key gives a brief, subtle red flash on the missed key and the
  typing box
- Unsupported keys (like `x`, Space or Backspace) are ignored — they never
  change the score — with a small temporary note: *"Practice only: A S D
  F J K L ;"*
- Simple visual keyboard that highlights the next key
- Finger guide that highlights the finger you need
- Result screen: **Practice Complete**, time, keys typed, correct,
  incorrect, accuracy, CPM, a short feedback line based on accuracy,
  **Practice Again** and **Back Home**
- Responsive layout that works on desktop and on small phones without
  horizontal scrolling

## Technologies used

- **React 18** (function components only)
- **JavaScript** — no TypeScript
- **Vite** for the dev server and the production build
- **Plain CSS** — CSS variables for the colour palette, flexbox and grid,
  one media query per screen. No Tailwind, no CSS framework.

The only runtime dependencies are `react` and `react-dom`.

## React concepts used in this project

- Functional components and **props** (`HomeScreen`, `PracticeScreen`,
  `TypingArea`, `ScoreBoard`, `HomeKeyboard`, `FingerChart`,
  `SummaryScreen`)
- **useState** for session data: the drills, the cursor position, the
  correct/incorrect counters, feedback and the hint text
- **useEffect** — starting the countdown, cleaning up timers when the
  screen unmounts, focusing the typing box
- **useRef** — the countdown start time, pending `setTimeout` ids, and a
  flag so the session can only finish once
- **Conditional rendering** — `App` shows one of three screens based on
  the current phase
- **Lifting state up** — the practice screen computes the final numbers
  and hands them to `App` through a callback
- **Derived values** — total, accuracy, CPM and the progress percentage
  are calculated during render from the counters and the timer instead of
  being stored
- Event handling, lists with `key`, and simple helper functions

No Redux, no Context API, no router, no state-management library, and no
`useMemo`/`useCallback` — nothing here needs them yet.

## How to install

```bash
npm install
```

(Node.js 18+ is enough.)

## How to run

```bash
npm run dev
```

Then open the printed URL (usually `http://localhost:5173`), click
**Start Practice** and type.

Production build:

```bash
npm run build
```

The static files land in `dist/`. You can preview them with
`npm run preview`.

## How the typing logic works

**The text.** The practice text is generated as a list of short
4-character drills (`"asdf"`, `"jkl;"`, `"ffjj"`, plus some random ones)
in `src/utils/drills.js`. Every character is one of the eight home-row
keys. There is no space character anywhere in the data — the gap you see
between groups in the text line is only CSS — so Space can never become a
key you have to press. If a very fast typist gets close to the end of the
text, more drills are appended so the session can never run out.

**Each key press.** `PracticeScreen` receives whatever characters the
typing box got and judges them one at a time:

| You press | What happens |
| --- | --- |
| The correct home-row key | correct +1, total +1, move to the next key |
| A wrong home-row key | incorrect +1, total +1, move to the next key, brief red flash |
| Any other key (`x`, Space, Backspace, Shift...) | nothing is counted and the cursor does not move — a short note appears for unsupported letters |

**Accuracy.**

```
accuracy = correct / total valid keys * 100
```

Only home-row key presses count as valid keys
(`total = correct + incorrect`). If you have not typed anything yet,
accuracy is 100%.

**CPM (characters per minute).**

```
CPM = valid keys typed / minutes practised
```

For example, 60 valid keys in 60 seconds = 60 CPM. It is deliberately
simple — nothing else is calculated.

**Progress bar.**

```
progress = (elapsed seconds / 300) * 100
```

It is calculated straight from the same countdown the timer uses, so it
starts at 0%, follows the clock and reaches 100% when the session ends.

**Timer.** `useCountdown` remembers the start time and recalculates the
remaining time from `Date.now()` on every tick, instead of subtracting 1
every second. Browsers slow down `setInterval` in background tabs, so
this keeps the clock accurate. When it reaches `00:00` the session stops
and the result screen appears — or you can press **End Session** to stop
early, and the result screen shows the time you actually practised.

**Next key indication.** The next character is shown in three places that
can never disagree: the big "next key" box (with the finger name), the
highlighted character in the text line, and the highlighted key on the
visual keyboard.

**Result feedback.** The closing message is chosen from the final
accuracy: 90%+ gets *"Great accuracy. Keep building speed."*, 70–89% gets
*"Good work. Keep practicing for better accuracy."*, and below 70% gets
*"Slow down and focus on typing the correct key."*

## Project structure

```
keydrill/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx              # entry point, imports the stylesheets
    ├── App.jsx               # switches between the three screens
    ├── components/
    │   ├── SiteHeader.jsx        # logo + tagline
    │   ├── HomeScreen.jsx        # start screen
    │   ├── PracticeScreen.jsx    # owns all session state + typing rules
    │   ├── TypingArea.jsx        # next-key box, text line, typing input
    │   ├── ScoreBoard.jsx        # timer, counters, End Session button
    │   ├── HomeKeyboard.jsx      # 8-key visual keyboard
    │   ├── FingerChart.jsx       # key -> finger guide
    │   └── SummaryScreen.jsx     # result screen
    ├── hooks/
    │   └── useCountdown.js       # the 5-minute countdown
    ├── utils/
    │   ├── homeRow.js            # keys, session length, finger map
    │   ├── drills.js             # practice text generator
    │   └── scoring.js            # accuracy, CPM, clock formatting
    └── styles/
        ├── base.css              # colours, page shell, buttons
        ├── home.css              # start screen
        ├── practice.css          # practice screen
        └── summary.css           # result screen
```

## A couple of design decisions

- **All colours are CSS variables.** The palette is defined once at the
  top of `base.css`, so changing the accent colour is a one-line change
  and the stylesheets stay easy to read.
- **The typing box keeps an empty value on purpose.** Every character is
  judged the moment it is typed and then discarded, so a mistake cannot
  be deleted and typed over — the counters stay honest.
- **One accent colour.** Blue is used for the active/next key, the
  progress bar and the main button; red and green only appear as
  correct/incorrect feedback.
- **State lives where it is used.** The whole session is one component
  with `useState`/`useRef`/`useEffect` — a global store would be
  overkill for three screens.

## Future improvements

Things I would like to add later (none of these exist yet):

- More lessons: top row, bottom row and numbers
- A last-result note on the start screen (stored in `localStorage`)
- Optional keystroke sounds with an on/off switch
- Weak-key reporting (which keys you miss the most)
- A WPM number alongside CPM
- A couple of difficulty levels (fixed drills vs. fully random text)
