# Basic Tic Tac Toe App — System Architecture

## 1. Overview

### 1.1 Purpose
This document describes the complete system architecture for a browser-based Tic Tac Toe application targeting users aged 18 and older. The application is built entirely with vanilla HTML, CSS, and JavaScript — requiring no backend server, no database, and no external dependencies — making it lightweight, portable, and instantly accessible via any modern web browser.

### 1.2 Goals
- Deliver a fully functional two-player Tic Tac Toe game playable in a single browser session
- Ensure a clean, accessible, and responsive user interface suitable for adult users across desktop and mobile devices
- Maintain all game state client-side using JavaScript in-memory objects and optionally `localStorage` for session persistence
- Keep the architecture simple, maintainable, and extensible (e.g., adding an AI opponent in the future)

### 1.3 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Markup | HTML5 | Semantic structure, accessibility support |
| Styling | CSS3 | Responsive layout, animations, theming |
| Logic | Vanilla JavaScript (ES6+) | Game state, event handling, win detection |
| Storage | Browser `localStorage` | Score persistence across page refreshes |
| Hosting | Any static file server / GitHub Pages / Netlify | No server-side compute required |

### 1.4 Scope
- **In Scope:** Two-player local game, win/draw detection, score tracking, game reset, responsive UI, basic accessibility
- **Out of Scope:** Online multiplayer, user authentication, server-side logic, third-party analytics

---

## 2. Architecture Diagram

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │             │    │             │    │                     │ │
│  │  HTML5 Layer│◄──►│  CSS3 Layer │    │  JavaScript Layer   │ │
│  │  (Structure)│    │  (Presentation)   │  (Business Logic)  │ │
│  │             │    │             │    │                     │ │
│  │ index.html  │    │ styles.css  │    │  ┌───────────────┐  │ │
│  │             │    │             │    │  │  Game Module  │  │ │
│  │ - Game Board│    │ - Grid      │    │  │  (game.js)    │  │ │
│  │ - Scoreboard│    │   Layout    │    │  │               │  │ │
│  │ - Controls  │    │ - Animations│    │  │ - State Mgr   │  │ │
│  │ - Status Bar│    │ - Responsive│    │  │ - Win Detector│  │ │
│  │             │    │   Design    │    │  │ - Turn Manager│  │ │
│  └──────┬──────┘    └─────────────┘    │  └───────┬───────┘  │ │
│         │                              │          │           │ │
│         │    DOM Manipulation          │  ┌───────▼───────┐  │ │
│         └──────────────────────────────►  │   UI Module   │  │ │
│                                        │  │  (ui.js)      │  │ │
│                                        │  │               │  │ │
│                                        │  │ - Renderer    │  │ │
│                                        │  │ - Event Hndlr │  │ │
│                                        │  │ - Animations  │  │ │
│                                        │  └───────┬───────┘  │ │
│                                        │          │           │ │
│                                        │  ┌───────▼───────┐  │ │
│                                        │  │ Storage Module│  │ │
│                                        │  │ (storage.js)  │  │ │
│                                        │  │               │  │ │
│                                        │  │ - localStorage│  │ │
│                                        │  │ - Score I/O   │  │ │
│                                        │  └───────────────┘  │ │
│                                        └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 File Structure

```
tic-tac-toe/
│
├── index.html              # Single-page application shell
├── css/
│   ├── styles.css          # Core layout and component styles
│   ├── animations.css      # Transition and win animations
│   └── themes.css          # Color themes (light/dark)
├── js/
│   ├── game.js             # Core game logic and state management
│   ├── ui.js               # DOM manipulation and rendering
│   ├── storage.js          # localStorage read/write abstraction
│   └── app.js              # Entry point — wires all modules together
└── assets/
    └── favicon.ico         # App icon
```

### 2.3 Component Interaction Flow

```
  Player Clicks Cell
         │
         ▼
  Event Listener (ui.js)
         │
         ▼
  Validate Move (game.js) ──── Invalid? ──► Ignore / Feedback
         │
       Valid
         │
         ▼
  Update Game State (game.js)
         │
         ├──► Check Win Condition (game.js)
         │            │
         │       Win / Draw? ──► Update Scores ──► storage.js
         │            │
         │       Game Over UI (ui.js)
         │
         ▼
  Re-render Board (ui.js)
         │
         ▼
  Switch Player Turn (game.js)
         │
         ▼
  Update Status Display (ui.js)
```

---

## 3. Core Components

### 3.1 `index.html` — Application Shell

The single HTML file defines the complete DOM structure. No server-side rendering is involved.

```
Sections:
┌────────────────────────────┐
│        <header>            │  App title, current turn indicator
├────────────────────────────┤
│      <section#scoreboard>  │  Player X score | Draws | Player O score
├────────────────────────────┤
│      <section#board>       │  3x3 grid of <div class="cell"> elements
│                            │  Each cell has data-index="0..8"
├────────────────────────────┤
│      <section#status>      │  Win message, draw message, turn prompt
├────────────────────────────┤
│      <footer>              │  Reset Game button, Reset Scores button
└────────────────────────────┘
```

**Key HTML attributes used for logic binding:**
- `data-index` on each cell maps to the board array position (0–8)
- `data-player` set dynamically to `"X"` or `"O"` to drive CSS styling
- `aria-label` on cells for screen reader accessibility
- `role="gridcell"` and `role="grid"` for ARIA compliance

---

### 3.2 `game.js` — Game Logic Module

The brain of the application. Implemented as a self-contained JavaScript module using the **Module Pattern** (IIFE or ES6 module export).

#### 3.2.1 Game State Object

```javascript
const gameState = {
  board: Array(9).fill(null),   // null | 'X' | 'O' for each cell
  currentPlayer: 'X',           // Whose turn it is
  isGameOver: false,            // Locks input when true
  winner: null,                 // null | 'X' | 'O' | 'draw'
  winningCombination: [],       // Indices of winning cells e.g. [0,1,2]
  scores: {
    X: 0,
    O: 0,
    draws: 0
  },
  moveCount: 0                  // Tracks total moves (max 9)
};
```

#### 3.2.2 Win Detection Engine

All 8 possible winning combinations are stored as a static lookup table and evaluated after every move:

```javascript
const WIN_CONDITIONS = [
  [0, 1, 2],  // Top row
  [3, 4, 5],  // Middle row
  [6, 7, 8],  // Bottom row
  [0, 3, 6],  // Left column
  [1, 4, 7],  // Middle column
  [2, 5, 8],  // Right column
  [0, 4, 8],  // Diagonal top-left to bottom-right
  [2, 4, 6],  // Diagonal top-right to bottom-left
];
```

**Algorithm — O(1) constant time per check:**
1. After each move, iterate over all 8 `WIN_CONDITIONS`
2. For each combination `[a, b, c]`, check if `board[a] === board[b] === board[c] !== null`
3. If true → set `winner` and `winningCombination`, set `isGameOver = true`
4. If no winner and `moveCount === 9` → set `winner = 'draw'`, set `isGameOver = true`

#### 3.2.3 Public API Methods

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `makeMove(index)` | `index: number` | `GameResult` | Applies a move if valid |
| `resetGame()` | — | `void` | Clears board, resets turn to X |
| `resetScores()` | — | `void` | Zeros all scores |
| `getState()` | — | `GameState` | Returns a copy of current state |
| `getCurrentPlayer()` | — | `'X' \| 'O'` | Returns active player |
| `isValidMove(index)` | `index: number` | `boolean` | Checks cell availability |

---

### 3.3 `ui.js` — User Interface Module

Responsible for all DOM interactions. Follows a strict **one-way data flow**: game state changes trigger UI updates; the UI never mutates state directly.

#### 3.3.1 Responsibilities

| Function | Description |
|---|---|
| `renderBoard(board)` | Reads board array, sets `data-player` on each cell, injects X/O text |
| `highlightWinningCells(indices)` | Adds `.winning-cell` CSS class to the three winning cells |
| `updateStatusMessage(state)` | Displays turn prompt, win message, or draw message |
| `updateScoreboard(scores)` | Updates score counter DOM elements for X, O, and draws |
| `showGameOverOverlay(winner)` | Fades in result overlay with winner announcement |
| `bindCellClickHandlers(callback)` | Attaches click listeners to all 9 cells, passes cell index to callback |
| `bindResetButton(callback)` | Wires the Reset Game button |
| `bindResetScoresButton(callback)` | Wires the Reset Scores button |
| `applyMoveAnimation(index)` | Triggers CSS pop-in animation on the clicked cell |

#### 3.3.2 Event Delegation Pattern

Rather than attaching 9 individual listeners, a single delegated listener is placed on the `#board` container:

```
#board (click listener)
    │
    ├── click on .cell[data-index="0"] → extracts index → calls game.makeMove(0)
    ├── click on .cell[data-index="4"] → extracts index → calls game.makeMove(4)
    └── click on .cell[data-index="8"] → extracts index → calls game.makeMove(8)
```

This improves performance and simplifies reset logic (no need to rebind listeners after game reset).

---

### 3.4 `storage.js` — Persistence Module

A thin abstraction over the browser's `localStorage` API. Isolates storage logic so the rest of the app remains storage-agnostic.

#### 3.4.1 Storage Keys

| Key | Value Type | Description |
|---|---|---|
| `ttt_scores` | JSON string | Serialized scores object `{X, O, draws}` |
| `ttt_theme` | `"light" \| "dark"` | User's theme preference |

#### 3.4.2 Methods

| Method | Description |
|---|---|
| `saveScores(scores)` | Serializes and writes scores to `localStorage` |
| `loadScores()` | Reads and deserializes scores; returns default `{X:0,O:0,draws:0}` if absent |
| `saveTheme(theme)` | Persists theme preference |
| `loadTheme()` | Retrieves theme preference, defaults to `"light"` |
| `clearAll()` | Removes all app-related keys from `localStorage` |

---

### 3.5 `app.js` — Application Entry Point

Bootstraps the application by wiring all modules together. Runs on `DOMContentLoaded`.

```
DOMContentLoaded
     │
     ▼
storage.loadScores() → inject into game initial state
     │
     ▼
storage.loadTheme() → apply theme class to <body>
     │
     ▼
ui.bindCellClickHandlers(onCellClick)
ui.bindResetButton(onReset)
ui.bindResetScoresButton(onResetScores)
     │
     ▼
ui.renderBoard(game.getState().board)
ui.updateScoreboard(game.getState().scores)
ui.updateStatusMessage(game.getState())
```

---

### 3.6 `styles.css` — Layout and Design System

#### 3.6.1 CSS Grid Board Layout

```
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
  width: min(90vw, 400px);   /* Responsive, max 400px */
  aspect-ratio: 1 / 1;
}

Cell sizing is derived from grid — no hardcoded pixel values.
```

#### 3.6.2 Responsive Breakpoints

| Breakpoint | Layout Adjustments |
|---|---|
| `>= 768px` (tablet/desktop) | Full board at 400px, side-by-side scoreboard |
| `< 768px` (mobile) | Board scales to 90vw, stacked controls |
| Touch devices | Minimum 44px tap target per WCAG 2.1 guidelines |

#### 3.6.3 CSS Custom Properties (Design Tokens)

```css
:root {
  --color-bg: #f5f5f5;
  --color-surface: #ffffff;
  --color-player-x: #e74c3c;       /* Red for X */
  --color-player-o: #3498db;       /* Blue for O */
  --color-winning-highlight: #2ecc71;
  --color-border: #bdc3c7;
  --cell-border-radius: 12px;
  --transition-speed: 200ms;
}
```

Dark theme overrides applied via `body.dark-theme { --color-bg: #1a1a2e; ... }`.

---

## 4. Data Flow

### 4.1 Move Lifecycle — Detailed Flow

```
┌─────────┐     click      ┌──────────┐   index    ┌──────────┐
│  Player │ ────────────►  │  ui.js   │ ─────────► │  app.js  │
│ (User)  │               │ (Event)  │            │(Callback)│
└─────────┘               └──────────┘            └────┬─────┘
                                                        │
                                              makeMove(index)