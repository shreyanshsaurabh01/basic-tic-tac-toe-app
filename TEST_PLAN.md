# Basic Tic Tac Toe App — Test Plan

---

## 1. Overview

### 1.1 Purpose
This Test Plan defines the testing approach, scope, strategy, and criteria for validating the **Basic Tic Tac Toe App** — a browser-based application built with HTML, CSS, and JavaScript targeting users aged 18 and older. The goal is to ensure the application is functionally correct, visually consistent, and delivers a reliable user experience across supported browsers and devices.

### 1.2 Project Summary
The application is a two-player Tic Tac Toe game rendered entirely in the browser without any backend dependencies. All game logic, state management, and UI rendering are handled client-side using vanilla HTML, CSS, and JavaScript.

### 1.3 References
| Document | Description |
|---|---|
| Project Requirements | Basic Tic Tac Toe App feature specification |
| W3C HTML5 Specification | HTML structural validity standard |
| WCAG 2.1 AA | Accessibility guidelines for adult users |
| ECMAScript 2020+ | JavaScript language standard |

### 1.4 Stakeholders
| Role | Responsibility |
|---|---|
| QA Engineer | Owns this plan, executes all tests |
| Developer | Fixes defects, supports environment setup |
| Product Owner | Reviews exit criteria and signs off on release |

---

## 2. Scope

### 2.1 In Scope
The following features and behaviors are covered by this test plan:

**Core Game Mechanics**
- Rendering a 3×3 game board on page load
- Alternating turns between Player X and Player O
- Registering a valid cell click and marking the correct cell
- Preventing a player from overwriting an already-marked cell
- Detecting and declaring all eight win conditions (3 rows, 3 columns, 2 diagonals)
- Detecting and declaring a draw when all 9 cells are filled with no winner
- Resetting the board to its initial state via a "Restart" or "New Game" control

**User Interface**
- Displaying the current player's turn indicator
- Displaying the game result (win or draw) upon game end
- Visual distinction between X and O markers
- Correct layout and styling on desktop and mobile viewports
- Clear, legible typography appropriate for users aged 18+

**Browser Compatibility**
- Functional parity across Chrome, Firefox, Safari, and Edge (latest two versions each)

**Accessibility**
- Keyboard navigability for all interactive elements
- Adequate color contrast ratios (minimum 4.5:1 per WCAG 2.1 AA)

### 2.2 Out of Scope
The following are explicitly excluded from this test plan:

- Online multiplayer or networked gameplay
- AI or computer opponent logic
- User account creation, login, or session persistence
- Score history stored in a database or external API
- Native mobile application testing (iOS/Android apps)
- Performance/load testing (no server-side component exists)
- Automated CI/CD pipeline configuration

### 2.3 Assumptions
- The application runs entirely in the browser; no server, API calls, or local storage persistence is required for core gameplay.
- Two human players share the same device and browser session.
- The target user base (18+) is assumed to have basic familiarity with browser-based applications.
- Testing will be performed on physical or virtualized desktop browsers and on mobile device emulators.

---

## 3. Test Strategy

### 3.1 Overall Approach
Testing will follow a **bottom-up strategy**: unit-level game logic is validated first, followed by integration of logic with the DOM, and finally end-to-end user flow validation. This ensures defects are caught at the lowest and cheapest level possible before progressing to higher-level tests.

### 3.2 Test Design Techniques
| Technique | Application |
|---|---|
| **Equivalence Partitioning** | Valid cell clicks vs. already-occupied cells vs. post-game clicks |
| **Boundary Value Analysis** | 0 moves played, 9 moves played (draw), 5-move minimum win |
| **Decision Table Testing** | All eight win-condition combinations |
| **State Transition Testing** | Game states: Idle → In Progress → Win/Draw → Reset → Idle |
| **Exploratory Testing** | Unscripted sessions to surface unexpected edge cases |

### 3.3 Test Prioritization
Tests are prioritized using a **P1–P3 severity model**:

| Priority | Description | Examples |
|---|---|---|
| **P1 — Critical** | Core game mechanic failure; blocks play entirely | Win not detected, board does not render, reset fails |
| **P2 — High** | Significant UX defect; play is possible but degraded | Turn indicator wrong, draw not declared, cell clickable after win |
| **P3 — Medium/Low** | Visual or cosmetic issues; does not impact gameplay | Slight misalignment, font inconsistency, minor color variance |

### 3.4 Pass/Fail Criteria per Test Case
- **Pass:** The actual result matches the expected result exactly as defined in the test case.
- **Fail:** Any deviation from the expected result, including unexpected console errors, visual regressions, or incorrect game state.

### 3.5 Defect Management
| Severity | Response SLA |
|---|---|
| Critical (P1) | Fix and retest within 1 business day |
| High (P2) | Fix and retest within 2 business days |
| Medium/Low (P3) | Scheduled for next release cycle |

All defects will be logged with: steps to reproduce, expected result, actual result, browser/OS, screenshot or screen recording, and severity rating.

---

## 4. Test Types

---

### 4.1 Unit Tests

Unit tests target individual JavaScript functions that encapsulate game logic in complete isolation from the DOM. These tests validate that pure logic behaves correctly regardless of how it is rendered.

**Tooling:** Jest (or Jasmine) — functions are extracted from the main JS module and imported directly into the test suite.

---

#### UT-01 — `checkWinner()`: Detect All Row Win Conditions

| Field | Detail |
|---|---|
| **Test ID** | UT-01 |
| **Function Under Test** | `checkWinner(board)` |
| **Priority** | P1 |
| **Objective** | Verify the function correctly identifies a winner for all three row combinations |

**Test Cases:**

| Sub-ID | Board State | Input | Expected Output |
|---|---|---|---|
| UT-01a | Row 0 win | `['X','X','X', '','','', '','','']` | `'X'` |
| UT-01b | Row 1 win | `['','','', 'O','O','O', '','','']` | `'O'` |
| UT-01c | Row 2 win | `['','','', '','','', 'X','X','X']` | `'X'` |

---

#### UT-02 — `checkWinner()`: Detect All Column Win Conditions

| Field | Detail |
|---|---|
| **Test ID** | UT-02 |
| **Function Under Test** | `checkWinner(board)` |
| **Priority** | P1 |
| **Objective** | Verify winner detection for all three column combinations |

**Test Cases:**

| Sub-ID | Board State | Input | Expected Output |
|---|---|---|---|
| UT-02a | Column 0 win | `['X','','', 'X','','', 'X','','']` | `'X'` |
| UT-02b | Column 1 win | `['','O','', '','O','', '','O','']` | `'O'` |
| UT-02c | Column 2 win | `['','','X', '','','X', '','','X']` | `'X'` |

---

#### UT-03 — `checkWinner()`: Detect Both Diagonal Win Conditions

| Field | Detail |
|---|---|
| **Test ID** | UT-03 |
| **Function Under Test** | `checkWinner(board)` |
| **Priority** | P1 |
| **Objective** | Verify winner detection for top-left→bottom-right and top-right→bottom-left diagonals |

**Test Cases:**

| Sub-ID | Board State | Input | Expected Output |
|---|---|---|---|
| UT-03a | Top-left diagonal | `['X','','', '','X','', '','','X']` | `'X'` |
| UT-03b | Top-right diagonal | `['','','O', '','O','', 'O','','']` | `'O'` |

---

#### UT-04 — `checkWinner()`: Return Null When No Winner

| Field | Detail |
|---|---|
| **Test ID** | UT-04 |
| **Function Under Test** | `checkWinner(board)` |
| **Priority** | P1 |
| **Objective** | Confirm no false-positive winner is returned on an incomplete or draw board |

**Test Cases:**

| Sub-ID | Board State | Input | Expected Output |
|---|---|---|---|
| UT-04a | Empty board | `['','','','','','','','','']` | `null` |
| UT-04b | Mid-game, no winner | `['X','O','', 'O','X','', '','','']` | `null` |
| UT-04c | Full board draw | `['X','O','X', 'O','X','O', 'O','X','O']` | `null` |

---

#### UT-05 — `checkDraw()`: Detect Draw Condition

| Field | Detail |
|---|---|
| **Test ID** | UT-05 |
| **Function Under Test** | `checkDraw(board)` |
| **Priority** | P1 |
| **Objective** | Verify draw is declared only when all 9 cells are filled and `checkWinner()` returns null |

**Test Cases:**

| Sub-ID | Board State | Input | Expected Output |
|---|---|---|---|
| UT-05a | Full board, no winner | `['X','O','X','O','X','O','O','X','O']` | `true` |
| UT-05b | Full board with a winner | `['X','X','X','O','O','X','O','X','O']` | `false` |
| UT-05c | Partial board | `['X','O','','','','','','','']` | `false` |

---

#### UT-06 — `switchPlayer()`: Alternate Turn Correctly

| Field | Detail |
|---|---|
| **Test ID** | UT-06 |
| **Function Under Test** | `switchPlayer(currentPlayer)` |
| **Priority** | P1 |
| **Objective** | Confirm player alternates from X to O and O to X reliably |

**Test Cases:**

| Sub-ID | Input | Expected Output |
|---|---|---|
| UT-06a | `'X'` | `'O'` |
| UT-06b | `'O'` | `'X'` |

---

#### UT-07 — `isValidMove()`: Enforce Cell Availability Rules

| Field | Detail |
|---|---|
| **Test ID** | UT-07 |
| **Function Under Test** | `isValidMove(board, index)` |
| **Priority** | P1 |
| **Objective** | Validate that only empty cells are accepted as legal moves |

**Test Cases:**

| Sub-ID | Board State | Index | Expected Output |
|---|---|---|---|
| UT-07a | Cell empty | `['','','',...]` | `0` → `true` |
| UT-07b | Cell occupied by X | `['X','','',...]` | `0` → `false` |
| UT-07c | Cell occupied by O | `['O','','',...]` | `0` → `false` |
| UT-07d | Out-of-range index | `['','','',...]` | `9` → `false` |

---

#### UT-08 — `resetBoard()`: Return Clean Initial State

| Field | Detail |
|---|---|
| **Test ID** | UT-08 |
| **Function Under Test** | `resetBoard()` |
| **Priority** | P1 |
| **Objective** | Confirm the board array is reset to nine empty strings and current player resets to X |

**Test Cases:**

| Sub-ID | Pre-condition | Expected Output |
|---|---|---|
| UT-08a | Board mid-game | Returns `['','','','','','','','','']`, currentPlayer = `'X'` |
| UT-08b | Board after win | Returns `['','','','','','','','','']`, currentPlayer = `'X'` |
| UT-08c | Board after draw | Returns `['','','','','','','','','']`, currentPlayer = `'X'` |

---

### 4.2 Integration Tests

Integration tests validate the interaction between the JavaScript game logic and the HTML/CSS DOM. These tests confirm that user actions correctly update both the internal game state and the visual UI simultaneously.

**Tooling:** Jest + jsdom, or browser-based testing with Testing Library. Each test simulates DOM events and asserts on both DOM state and underlying JS state.

---

#### IT-01 — Cell Click Updates DOM and Internal Board State

| Field | Detail |
|---|---|
| **Test ID** | IT-01 |
| **Priority** | P1 |
| **Objective** | Confirm clicking an empty cell renders the correct marker in the DOM AND updates the board array at the correct index |

**Steps:**
1. Load the application in jsdom.
2. Query all `.cell` elements.
3. Simulate a `click` event on cell index `4` (center).
4. Assert `.cell[4]` inner text or `data-mark` attribute equals `'X'`.
5. Assert internal board state `board[4] === 'X'`.
6. Assert current player has switched to `'O'`.

**Expected Result:** Cell 4 visually displays `X`, board array index 4 is `'X'`, turn indicator shows `"Player O's Turn"`.

---

#### IT-02 — Clicking an Occupied Cell Does Not Overwrite

| Field | Detail |
|---|---|
| **Test ID** | IT-02 |
| **Priority** | P1 |
| **Objective** | Verify that a second click on an already-marked cell is ignored in both the DOM and the game state |

**Steps:**
1. Simulate click on cell index `0` (Player X marks it).
2. Simulate a second click on cell index `0` (Player O attempts to overwrite).
3. Assert `.cell[0]` still displays `'X'`.
4. Assert `board[0]` still equals `'X'`.
5. Assert current player is still `'O'` (turn was NOT consumed).

**Expected Result:** No change occurs; the cell retains `'X'`; no turn is lost.

---

#### IT-03 — Win Condition Triggers Result Display

| Field | Detail |
|---|---|
| **Test ID** | IT-03 |
| **Priority** | P1 |
| **Objective** | After Player X completes a winning row, verify the DOM renders a winner announcement and the board is disabled |

**Steps:**
1. Simulate clicks to create X win on row 0: click cells 0, 3, 1, 4, 2.
2. Assert a result message element (e.g., `#result-message`) is visible.
3. Assert the message text contains `"Player X Wins"` (case-insensitive).
4. Assert the game board is no longer responsive to further click events.

**Expected Result:** Winner banner appears; no additional moves are accepted.

---

#### IT-04 — Draw Condition Triggers Draw Display

| Field | Detail |
|---|---|
| **Test ID** | IT-04 |
| **Priority** | P1 |
| **Objective** | Confirm the draw message appears after all 9 cells are filled with no winner |

**Steps:**
1. Simulate clicks in this draw-producing sequence:
   - X: 0, O: 1, X: 2, O: 3, X: 5, O: 8, X: 6, O: 4, X: 7 — wait, verify draw sequence ensures no winner.
   - Use board: `['X','O','X','O','X','O','O','X','O']` by simulating clicks accordingly.
2. Assert `#result-message` is visible.
3. Assert message text contains `"Draw"` or `"It's