# AI Reference: Key Prompts & Iterations Log

This document summarizes the core technical exchanges, architectural refinements, and debugging prompts used in collaboration with the AI to develop **Legacy Guardians**.

---

## 1. Quiz Enforcement & Anti-Bruteforce Logic
- **Request:** Prevent rapid random guessing when players answer incorrectly. Hide choices, display only the official NASA reference link, and provide buttons to retry or return to the main map.
- **Implemented Solution:**
  - Separated `#puzzle-quiz-view` and `#puzzle-feedback` inside `#puzzle-modal`.
  - On incorrect answer, choice buttons are immediately hidden; an access-denied telemetry warning is shown with the direct NASA URL.
  - Added dedicated `TRY AGAIN` (restores quiz) and `RETURN TO MAIN MENU` (closes modal and loads `scene_map`) buttons.

---

## 2. Visual Novel Layout & Full-Screen Immersion
- **Request:** Eliminate empty screen space during dialogues. Enlarge characters, place ARCHIE on the left and Ranger on the right, and expand the center console into a top NASA telemetry screen (images/video) and a bottom subtitle box.
- **Implemented Solution:**
  - Styled `.character-standee` elements with dynamic active/dimmed filters (`brightness`, `scale`, `grayscale`) depending on whether ARCHIE or Ranger is speaking.
  - Built `.center-console` containing `.console-screen` (for historical footage, diagrams, and captions) and `.console-text-box` (for dialogue and spacebar progression).

---

## 3. Media Asset Inventory & Canvas Image Caching
- **Request:** Catalog all necessary image/video/audio assets with required resolutions, and fix a bug where assigning background paths caused a black canvas screen and unresponsive clicks.
- **Root Cause & Fix:**
  - Canvas `ctx.drawImage()` requires a loaded `HTMLImageElement`, not a raw string path.
  - Implemented `getLoadedImage(src)` caching layer. If an asset is still loading or invalid, the game gracefully falls back to `drawFallbackRadar()` without throwing errors.

---

## 4. Deep Scientific Storytelling (English Localization)
- **Request:** Expand ARCHIE's dialogues and debriefs to provide rich, scientifically accurate historical context before and after each challenge, fully grounded in NASA sources.
- **Implemented Solution:**
  - Replaced placeholders across all 9 missions with comprehensive English logs covering propulsion (Dawn's Xenon Ion), engineering fixes (Kepler's K2 photon balance), landing mechanics (Pathfinder's airbags, NEAR's 4 mph touchdown), and scientific discoveries (Opportunity's Blueberries, InSight's Marsquakes).

---

## 5. Critical Debugging & Fixes
- **Undefined Dialogue Fields:** Fixed an array-indexing bug in `initSceneDialogues` (`renderDialogue(gameState.dialogueQueue[0])`) that caused `undefined` speaker names and captions.
- **Autoplay Audio Policy:** Shifted `bgm-player.play()` from page load to the initial user interaction click on `#start-mission-btn`.
- **Pioneer 10 Image Display Mismatch:** Resolved a key naming discrepancy between `ASSETS.archiveRecords.pioneer10` and `puzzle.missionKey: "pioneer"`.
