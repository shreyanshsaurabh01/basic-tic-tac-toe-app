# Tic Tac Toe App - Test Cases

---

## TC-001: Initial Board Renders Empty
**Category:** Unit
**Priority:** High
**Preconditions:** Browser is open and the Tic Tac Toe app is loaded
**Steps:**
1. Open the application in a browser
2. Observe the game board
3. Inspect all 9 cells of the grid

**Expected Result:** All 9 cells are empty (no X or O symbols displayed), the board is fully visible, and no winner is declared

---

## TC-002: First Player is X
**Category:** Unit
**Priority:** High
**Preconditions:** App is loaded with a fresh game board
**Steps:**
1. Open the application
2. Observe the current player indicator or status message
3. Click on any empty cell

**Expected Result:** The status indicator shows it is X's turn first, and after clicking a cell, an "X" symbol appears in that cell

---

## TC-003: Players Alternate Turns Correctly
**Category:** Integration
**Priority:** High
**Preconditions:** App is loaded with a fresh game board
**Steps:**
1. Click on cell position (row 1, col 1)
2. Observe what symbol is placed and whose turn it is next
3. Click on cell position (row 1, col 2)
4. Observe what symbol is placed and whose turn it is next
5. Click on cell position (row 1, col 3)

**Expected Result:** Cell 1 shows "X", cell 2 shows "O", cell 3 shows "X". Players alternate between X and O on every turn

---

## TC-004: A Clicked Cell Cannot Be Overwritten
**Category:** Unit
**Priority:** High
**Preconditions:** App is loaded; Player X has already placed a mark on the board
**Steps:**
1. Click on cell position (row 1, col 1) — X is placed
2. Click on the same cell (row 1, col 1) again
3. Observe the cell content and whose turn it is

**Expected Result:** The cell still displays "X", the turn does not switch to the next player, and no "O" is placed in that cell

---

## TC-005: X Wins with a Horizontal Row
**Category:** E2E
**Priority:** High
**Preconditions:** App is loaded with a fresh game board
**Steps:**
1. Click cell (row 1, col 1) — X plays
2. Click cell (row 2, col 1) — O plays
3. Click cell (row 1, col 2) — X plays
4. Click cell (row 2, col 2) — O plays
5. Click cell (row 1, col 3) — X plays

**Expected Result:** A win message is displayed declaring "X wins!", the top row (row 1) is visually highlighted, and no further moves can be made

---

## TC-006: O Wins with a Vertical Column
**Category:** E2E
**Priority:** High
**Preconditions:** App is loaded with a fresh game board
**Steps:**
1. Click cell (row 1, col 1) — X plays
2. Click cell (row 1, col 2) — O plays
3. Click cell (row 2, col 1) — X plays
4. Click cell (row 2, col 2) — O plays
5. Click cell (row 3, col 3) — X plays
6. Click cell (row 3, col 2) — O plays

**Expected Result:** A win message is displayed declaring "O wins!", the middle column is visually highlighted, and no further moves can be made

---

## TC-007: X Wins with a Diagonal
**Category:** E2E
**Priority:** High
**Preconditions:** App is loaded with a fresh game board
**Steps:**
1. Click cell (row 1, col 1) — X plays
2. Click cell (row 1, col 2) — O plays
3. Click cell (row 2, col 2) — X plays
4. Click cell (row 1, col 3) — O plays
5. Click cell (row 3, col 3) — X plays

**Expected Result:** A win message is displayed declaring "X wins!" via the top-left to bottom-right diagonal, the diagonal is visually highlighted, and the board is locked from further input

---

## TC-008: Game Ends in a Draw
**Category:** E2E
**Priority:** High
**Preconditions:** App is loaded with a fresh game board
**Steps:**
1. Click cells in the following order to fill the board without a winner:
   - (row 1, col 1) X, (row 1, col 2) O, (row 1, col 3) X
   - (row 2, col 2) O, (row 2, col 1) X, (row 2, col 3) O
   - (row 3, col 2) X, (row 3, col 1) O, (row 3, col 3) X
2. Observe the game status after the 9th move

**Expected Result:** A draw/tie message is displayed (e.g., "It's a Draw!"), all 9 cells are filled, and no winner is declared

---

## TC-009: Restart / Reset Button Clears the Board
**Category:** Integration
**Priority:** High
**Preconditions:** A game is in progress with at least 3 moves made by both players
**Steps:**
1. Make several moves on the board (e.g., X on row 1 col 1, O on row 2 col 2)
2. Locate and click the "Restart" or "Reset" button
3. Observe the board and status message

**Expected Result:** All 9 cells are cleared and empty, the turn resets to Player X, any previous win/draw messages are removed, and the game is ready to be played again

---

## TC-010: No Moves Allowed After Game is Won
**Category:** Integration
**Priority:** High
**Preconditions:** A player has already won the game (e.g., X has won)
**Steps:**
1. Play the game until X wins (complete TC-005 steps)
2. After the win is declared, attempt to click on any remaining empty cell
3. Observe whether a symbol is placed

**Expected Result:** No symbol is placed in the clicked cell, the board remains locked, the win message persists, and the turn indicator does not change

---

## TC-011: Status Message Updates Dynamically Per Turn
**Category:** Unit
**Priority:** Medium
**Preconditions:** App is loaded with a fresh game board and a visible status/turn indicator element
**Steps:**
1. Observe the initial status message
2. Click on cell (row 1, col 1)
3. Observe the status message
4. Click on cell (row 2, col 2)
5. Observe the status message again

**Expected Result:** Initially shows "Player X's Turn", after X moves it updates to "Player O's Turn", and after O moves it updates back to "Player X's Turn"

---

## TC-012: App is Responsive and Usable on Mobile Viewport
**Category:** E2E
**Priority:** Medium
**Preconditions:** Browser developer tools are open; viewport is set to a mobile size (e.g., 375px × 667px — iPhone SE)
**Steps:**
1. Open the app in a browser and resize to a 375px wide mobile viewport
2. Observe the layout of the game board and buttons
3. Tap (click) each of the 9 cells to verify they are tappable
4. Verify the status message and reset button are visible without horizontal scrolling

**Expected Result:** The game board fits within the mobile viewport without horizontal scrolling, all 9 cells are individually tappable and respond correctly, and all UI elements (status, reset button) are clearly visible and accessible

---

## TC-013: Game Board Cells are Visually Distinct and Accessible
**Category:** Unit
**Priority:** Low
**Preconditions:** App is loaded in a browser; browser accessibility tools or DevTools are available
**Steps:**
1. Open the app and inspect the game board visually
2. Verify each of the 9 cells has clear visible borders or boundaries
3. Verify that X and O marks are visually different from each other (e.g., different colors or styles)
4. Check that interactive cells have a visible hover/focus state using keyboard Tab navigation

**Expected Result:** All 9 cells are clearly separated with visible boundaries, X and O symbols are visually distinguishable, and cells show a visible hover or focus state when navigated via mouse or keyboard, meeting basic accessibility expectations