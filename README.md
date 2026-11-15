# Legacy Guardians: NASA Discarded Space Equipment Storytelling Challenge

An interactive web-based educational adventure and visual novel developed for the **NASA Space Apps Challenge**. 

Set in the year 2150, players step into the boots of a **Heritage Ranger** guided by **ARCHIE**, an advanced archival AI. Together, they journey across the Solar System to rescue 9 historic, retired NASA space missions from impending destruction by commercial mining excavators, falling orbital debris, scrapper drones, and cosmic storms.

---

## 🚀 Key Features

- **Tactical Solar System Map:** An interactive canvas radar map spanning the inner planets, asteroid belt, and deep interstellar boundary.
- **Visual Novel Presentation:** Cinematic character standees (ARCHIE on the left, Ranger on the right) with active speaker highlighting, subtitle consoles, and live archival NASA telemetry displays.
- **Authentic NASA Mission Challenges:** 9 custom educational Codex challenges grounded 100% in official NASA science data and telemetry.
- **Anti-Bruteforce Learning Mechanism:** An incorrect answer locks choices and directly links the player to official NASA archives for research before allowing a retry.
- **Declassified Archival Gallery:** Unlocking each beacon activates historical mission photos and detailed scientific debriefs.

---

## 🛰️ Featured NASA Missions

1. **Viking 1 (1976 - Chryse Planitia, Mars):** First successful long-duration Martian landing and biological search.
2. **Mars Pathfinder & Sojourner (1997 - Ares Vallis, Mars):** Revolutionary airbag landing and the first wheeled extraterrestrial rover.
3. **Spirit & Opportunity (2004 - Meridiani Planum, Mars):** 14-year marathon driving record and discovery of water-formed hematite "Blueberries".
4. **InSight Lander (2018 - Elysium Planitia, Mars):** Planetary geophysics mapping Mars' crust, mantle, and core via 1,300+ marsquakes.
5. **Ingenuity Mars Helicopter (2021 - Jezero Crater, Mars):** 72 historic powered flights in thin Martian air carrying a swatch of the 1903 Wright Flyer.
6. **NEAR Shoemaker (1996 - Asteroid 433 Eros):** First spacecraft to orbit and gently land (at 4 mph) on an asteroid.
7. **Dawn (2007 - Vesta & Dwarf Planet Ceres):** First dual-orbit interplanetary mission powered by Xenon Ion Propulsion.
8. **Kepler / K2 (2009 - Heliocentric Orbit):** Discovered 2,600+ exoplanets, balancing on sunlight photon pressure during K2.
9. **Pioneer 10 (1972 - Interstellar Boundary):** First outer solar system scout carrying the gold-anodized interstellar plaque.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+).
- **Graphics & Audio:** HTML5 Canvas API with dynamic radar pulses, responsive UI panels, and HTML5 Audio API.
- **Performance:** In-memory asynchronous image caching (`getLoadedImage`) preventing render blocking or canvas crashes.

---

## 📦 Getting Started

1. Clone or download the repository files:
   ```text
   ├── index.html
   ├── style.css
   ├── game.js
   ├── Archie.png
   └── assets/
       ├── img/
       └── audio/
   ```
2. Open `index.html` in any modern web browser (or run via VS Code Live Server / local HTTP server).
3. Click **INITIALIZE FLIGHT COMPUTER** to begin your journey.
