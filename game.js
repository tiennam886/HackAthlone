/**
 * NASA'S DISCARDED SPACE EQUIPMENT: LEGACY GUARDIANS
 * Core Game Engine with Deep Historical Storytelling & Safe Image Cache
 * 100% Grounded in Official NASA Mission Archives
 */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gameState = {
  currentSceneId: "scene_map",
  rescuedMissions: new Set(),
  dialogueQueue: [],
  dialogueIndex: 0,
  activeHotspot: null,
  mousePos: { x: 0, y: 0 }
};

/* ==========================================================================
   1. SAFE IMAGE CACHE (PREVENTS BLACK SCREEN CRASH ON CANVAS)
   ========================================================================== */
const imageCache = {};

function getLoadedImage(src) {
  if (!src) return null;
  if (!imageCache[src]) {
    const img = new Image();
    img.src = src;
    imageCache[src] = img;
  }
  return imageCache[src].complete && imageCache[src].naturalWidth > 0 ? imageCache[src] : null;
}

/* ==========================================================================
   2. ASSET REGISTRY (MEDIA INSERTION SLOTS)
   ========================================================================== */
const ASSETS = {
  characters: {
    /* CHÈN ẢNH NHÂN VẬT ARCHIE VÀ RANGER TẠI ĐÂY */
    archie: "assets/img/avatar_archie.png", // Ảnh robot AI Archie
    ranger: "assets/img/avatar_ranger.png" // Ảnh phi hành gia Ranger
  },

  backgrounds: {
    orbital_map: "assets/img/bg_sol_system.jpg",    // assets/img/bg_sol_system.jpg
    viking1: "assets/img/bg_viking1_chryse.jpg",        // assets/img/bg_viking1_chryse.jpg
    pathfinder: "assets/img/bg_ares_vallis.jpg",     // assets/img/bg_ares_vallis.jpg
    opportunity: "assets/img/bg_meridiani_plain.jpg",    // assets/img/bg_meridiani_plain.jpg
    insight: "assets/img/bg_elysium_plain.jpg",        // assets/img/bg_elysium_plain.jpg
    ingenuity: "assets/img/bg_jezero_crater.jpg", 
    near: "assets/img/bg_eros_asteroid.jpg",           // assets/img/bg_eros_asteroid.jpg
    dawn: "assets/img/bg_ceres_orbit.jpg",           // assets/img/bg_ceres_orbit.jpg
    kepler: "assets/img/bg_kepler_field.jpg",         // assets/img/bg_kepler_field.jpg
    pioneer10: "assets/img/bg_pioneer_deep_space.jpg"       // assets/img/bg_pioneer_deep_space.jpg
  },
  intros: {
    /* INSERT SECTOR ENTRY THREAT VIDEOS OR IMAGES HERE */
    viking1: { video: null, image: "assets/img/threat_viking_satellite.jpg" },
    pathfinder: { video: null, image: "assets/img/threat_pathfinder_excavator.jpg" },
    opportunity: { video: null, image: "assets/img/threat_oppy_storm.jpg" },
    insight: { video: null, image: "assets/img/threat_insight_drill.jpg" },
    ingenuity: { video: null, image: "assets/img/threat_ingenuity_drones.jpg" },
    near: { video: null, image: "assets/img/threat_near_charges.jpg" },
    dawn: { video: null, image: "assets/img/threat_dawn_scrapper.jpg" },
    kepler: { video: null, image: "assets/img/threat_kepler_debris.jpg" },
    pioneer10: { video: null, image: "assets/img/threat_pioneer_interference.jpg" }
  },
  archiveRecords: {
    /* INSERT OFFICIAL NASA HISTORIC DISCOVERY PHOTOS/VIDEOS FOR DEBRIEF HERE */
    viking1: "assets/img/archive_viking1_panorama.jpg",
    pathfinder: "assets/img/archive_sojourner_rock.jpg",
    opportunity: "assets/img/archive_oppy_blueberries.jpg",
    insight: "assets/img/archive_insight_wind_audio.jpg",
    ingenuity: "assets/img/archive_ingenuity_flight.jpg",
    near: "assets/img/archive_near_eros_craters.jpg",
    dawn: "assets/img/archive_dawn_ceres_brightspots.jpg",
    kepler: "assets/img/archive_kepler_exoplanets.jpg",
    pioneer10: "assets/img/archive_pioneer_gold_plaque.jpg"
  },
  audio: {
    /* INSERT AUDIO ASSETS */
    sfx_correct: "assets/audio/shield_up.mp3",
    sfx_wrong: "assets/audio/alarm_buzz.mp3"
  }
};

/* ==========================================================================
   3. EXPANDED SCENES: DEEP HISTORICAL STORYTELLING (ENGLISH)
   ========================================================================== */
const SCENES = {
  // Main Tactical Solar System Map
  scene_map: {
    name: "Tactical Orbital Map",
    sector: "SOLAR SYSTEM OVERVIEW",
    target: "CHOOSE MISSION",
    bgKey: "orbital_map",
    hotspots: [
      { id: "goto_viking", name: "Chryse Planitia [Viking 1]", x: 250, y: 310, r: 24, targetScene: "scene_viking" },
      { id: "goto_pathfinder", name: "Ares Vallis [Pathfinder & Sojourner]", x: 320, y: 380, r: 20, targetScene: "scene_pathfinder" },
      { id: "goto_oppy", name: "Meridiani Planum [Opportunity]", x: 380, y: 330, r: 22, targetScene: "scene_opportunity" },
      { id: "goto_insight", name: "Elysium Planitia [InSight]", x: 470, y: 370, r: 20, targetScene: "scene_insight" },
      { id: "goto_ingenuity", name: "Jezero Crater [Ingenuity]", x: 350, y: 260, r: 18, targetScene: "scene_ingenuity" },
      { id: "goto_near", name: "Asteroid 433 Eros [NEAR Shoemaker]", x: 670, y: 220, r: 20, targetScene: "scene_near" },
      { id: "goto_dawn", name: "Dwarf Planet Ceres [Dawn]", x: 800, y: 290, r: 22, targetScene: "scene_dawn" },
      { id: "goto_kepler", name: "Earth-Trailing Orbit [Kepler / K2]", x: 940, y: 410, r: 20, targetScene: "scene_kepler" },
      { id: "goto_pioneer", name: "Interstellar Boundary [Pioneer 10]", x: 1110, y: 180, r: 26, targetScene: "scene_pioneer" }
    ]
  },

  // 1. VIKING 1 (1976)
  scene_viking: {
    name: "Chryse Planitia",
    sector: "MARS EQUATORIAL BASIN",
    target: "VIKING 1 LANDER (1976)",
    bgKey: "viking1",
    intro: {
      title: "DEORBIT WARNING: IMMINENT IMPACT",
      desc: "An obsolete commercial communications satellite is decaying rapidly from orbit. Telemetry shows it will obliterate Viking 1's historic touchdown site within minutes!",
      mediaKey: "viking1"
    },
    dialogues: [
      {
        speaker: "RANGER",
        text: "ARCHIE, I'm standing amidst the rolling reddish-gray sands of Chryse Planitia. Ahead of us rests a massive hexagonal lander supported by three sturdy landing legs. An ominous shadow is looming above—the decaying satellite is coming down hot!",
        holoMedia: "assets/img/holo_viking_lander_descent.jpg",
        caption: "TELEMETRY RECON: Viking 1 Hexagonal Lander Footprint"
      },
      {
        speaker: "ARCHIE",
        text: "Ranger, behold Viking 1. On July 20, 1976, humanity achieved its very first successful long-duration touchdown on the Martian surface. Unlike later rovers, it possessed no wheels and remained forever rooted to this exact spot.",
        holoMedia: "assets/img/holo_viking_first_color_sky.jpg",
        caption: "NASA ARCHIVE: First Color Panorama - The Salmon-Pink Sky (1976)"
      },
      {
        speaker: "ARCHIE",
        text: "Viking 1 shattered centuries of astronomical speculation by beaming back the first true color panoramas, proving the Martian sky was not deep azure, but a radiant salmon-pink caused by airborne iron-rich dust particles suspended in the thin atmosphere.",
        holoMedia: "assets/img/holo_viking_sampler_arm.jpg",
        caption: "INSTRUMENTATION: Automated Surface Sampler Arm & GCMS Chamber"
      },
      {
        speaker: "ARCHIE",
        text: "Observe its robotic collector arm. In late July 1976, it reached down, carved trenches into the red soil, and deposited samples into an onboard biological laboratory and Gas Chromatograph Mass Spectrometer (GCMS) oven. To erect the Temporal Shield, we must authenticate its biological investigation parameters!",
        holoMedia: "assets/img/holo_viking_sampler_arm.jpg",
        caption: "DECRYPT PROTOCOL: Biological Science Authentication"
      }
    ],
    hotspots: [
      { id: "viking_arm", name: "Sampling Arm & GCMS Oven", x: 620, y: 440, r: 35, action: "open_puzzle" }
    ],
    puzzle: {
      title: "CODEX CHALLENGE: VIKING 1 BIOLOGY EXPERIMENT",
      prompt: "Viking 1 scooped up soil and baked it inside its automated miniaturized Gas Chromatograph Mass Spectrometer (GCMS). What was this unprecedented experiment searching for?",
      options: [
        { text: "Liquid petroleum and crude oil reserves", correct: false },
        { text: "Organic molecules and evidence of microbial life", correct: true },
        { text: "Rare volcanic gold and diamond crystallization", correct: false }
      ],
      nasaUrl: "https://science.nasa.gov/mission/viking-1/",
      missionKey: "viking1",
      debrief: "TELEMETRY SYNCHRONIZED: The Temporal Shield activated just in time, deflecting the falling orbital debris! While the biological tests yielded inconclusive evidence of active life, Viking 1 transmitted over 4,500 high-resolution images and weather monitoring data until 1982. In January 1982, NASA officially christened this site the Thomas Mutch Memorial Station in honor of the Viking imaging team leader, cementing its status as the bedrock of Martian exploration."
    }
  },

  // 2. MARS PATHFINDER & SOJOURNER (1997)
  scene_pathfinder: {
    name: "Ares Vallis",
    sector: "ANCIENT FLOODPLAIN",
    target: "MARS PATHFINDER & SOJOURNER (1997)",
    bgKey: "pathfinder",
    intro: {
      title: "HAZARD DETECTED: HEAVY EXCAVATOR TRACKS",
      desc: "A titan-class automated mining excavator is rolling across the Ares Vallis boulder fields. Its computer identifies small objects as crushable rubble—putting tiny Sojourner in immediate peril!",
      mediaKey: "pathfinder"
    },
    dialogues: [
      {
        speaker: "RANGER",
        text: "The ground is trembling! An automated strip-mining crawler the size of a five-story building is churning up the ancient riverbed. Scattered nearby are deflated Kevlar fabric air bags and a small tetrahedron lander.",
        holoMedia: "assets/img/holo_pathfinder_airbags.jpg",
        caption: "TERRAIN HAZARD: Incoming Autonomous Mining Crawler"
      },
      {
        speaker: "ARCHIE",
        text: "Directly ahead in the ancient floodplain of Ares Vallis rests the Carl Sagan Memorial Station and the miniature Sojourner rover! Touching down on July 4, 1997, Pathfinder pioneered a radical landing technique: encasing itself in giant multi-lobed airbags and bouncing over 15 times up to 50 feet high before settling.",
        holoMedia: "assets/img/holo_pathfinder_bouncing.jpg",
        caption: "NASA LOG: Airbag Cocoon Touchdown & 15 Bounces at Ares Vallis"
      },
      {
        speaker: "ARCHIE",
        text: "Sojourner made history as humanity's very first wheeled rover on another celestial body. It weighed a modest 23 pounds (10.6 kg) and stood only 1 foot (30 cm) tall. Because of its miniature size, the incoming mining excavator's radar classifies it as harmless gravel!",
        holoMedia: "assets/img/holo_sojourner_rolling.jpg",
        caption: "HISTORIC MOMENT: Sojourner Rolls onto Extraterrestrial Soil"
      },
      {
        speaker: "ARCHIE",
        text: "We must override the approaching excavator's collision avoidance radar. Upload Sojourner's exact physical footprint so the automated crawler diverts course immediately!",
        holoMedia: "assets/img/holo_sojourner_rolling.jpg",
        caption: "RADAR OVERRIDE: Calibrating Microwave-Scale Object Profile"
      }
    ],
    hotspots: [
      { id: "sojourner_chassis", name: "Sojourner Rover Chassis", x: 710, y: 530, r: 30, action: "open_puzzle" }
    ],
    puzzle: {
      title: "CODEX CHALLENGE: SOJOURNER PHYSICAL FOOTPRINT",
      prompt: "To calibrate the excavator's collision avoidance radar, select the standard real-world size equivalent of the 23-pound Sojourner rover:",
      options: [
        { text: "The size of an armored personnel carrier", correct: false },
        { text: "The size of a standard kitchen microwave oven (1 foot high)", correct: true },
        { text: "The size of an ordinary handheld smartphone", correct: false }
      ],
      nasaUrl: "[suspicious link removed]",
      missionKey: "pathfinder",
      debrief: "RADAR OVERRIDE COMPLETE: The excavator treads locked and diverted course! Originally engineered as a 7-day technology demonstration, Sojourner operated for an astonishing 83 Martian sols. Equipped with an Alpha Proton X-ray Spectrometer, it analyzed rocks such as 'Barnacle Bill' and proved that ancient Ares Vallis was once shaped by catastrophic volumes of liquid water."
    }
  },

  // 3. SPIRIT & OPPORTUNITY (2004)
  scene_opportunity: {
    name: "Meridiani Planum",
    sector: "HEMATITE EQUATORIAL PLAIN",
    target: "OPPORTUNITY ROVER (2004)",
    bgKey: "opportunity",
    intro: {
      title: "ELECTROSTATIC DUST STORM WARNING",
      desc: "A massive, globe-encircling Martian dust storm is blocking sunlight. Fine electrostatic dust is suffocating the solar arrays of the silent Opportunity rover, threatening permanent system burial!",
      mediaKey: "opportunity"
    },
    dialogues: [
      {
        speaker: "RANGER",
        text: "The sun is completely blotted out—red, choking dust is swirling everywhere! My scanner has located Opportunity ('Oppy') perched at the rim of Perseverance Valley. Its photovoltaic panels are heavily coated with abrasive sand.",
        holoMedia: "assets/img/holo_oppy_dust_storm.jpg",
        caption: "METEOROLOGY: Planet-Encircling Martian Dust Storm"
      },
      {
        speaker: "ARCHIE",
        text: "Opportunity and its twin Spirit were NASA's legendary robotic geologists, arriving in January 2004. Mission architects originally dared to hope for only a 90-day operational lifespan.",
        holoMedia: "assets/img/holo_oppy_driving_tracks.jpg",
        caption: "MARATHON RECORD: 45.16 Kilometers Traversed Across 14 Years"
      },
      {
        speaker: "ARCHIE",
        text: "Instead, Oppy embarked on an astounding 14-year odyssey across Meridiani Planum, covering a record-shattering 28.06 miles (45.16 km)—the off-Earth driving record that stood until the Perseverance rover finally surpassed it in October 2026!",
        holoMedia: "assets/img/holo_oppy_blueberries_close.jpg",
        caption: "GEOLOGIC BREAKTHROUGH: Hematite Spherules ('Blueberries')"
      },
      {
        speaker: "ARCHIE",
        text: "When the apocalyptic dust storm choked out the sun in 2018, its final transmission carried poignant poetry: 'My battery is low, and it's getting dark.' Clear its solar circuits and confirm its signature geologic discovery to activate the shield!",
        holoMedia: "assets/img/holo_oppy_blueberries_close.jpg",
        caption: "TEMPORAL LOCK: Verify Geologic Signatures of Ancient Water"
      }
    ],
    hotspots: [
      { id: "oppy_solar", name: "Pancam Mast & Solar Cells", x: 590, y: 410, r: 40, action: "open_puzzle" }
    ],
    puzzle: {
      title: "CODEX CHALLENGE: EVIDENCE OF WATER",
      prompt: "What signature geologic discovery did Opportunity uncover at Meridiani Planum that definitively proved ancient Mars once had standing pools of liquid water?",
      options: [
        { text: "Small gray hematite spheres nicknamed 'Blueberries'", correct: true },
        { text: "Fossilized seashells and petrified coral reefs", correct: false },
        { text: "Synthetically forged aluminum plates", correct: false }
      ],
      nasaUrl: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/",
      missionKey: "opportunity",
      debrief: "SOLAR EMITTER RESTORED: The temporal canopy hums to life, banishing the storm! Opportunity discovered tiny gray hematite spheres nicknamed 'Blueberries' embedded in rock outcrops across Eagle, Endurance, and Victoria craters, definitively confirming that liquid water soaked this terrain for extended epochs."
    }
  },

  // 4. INSIGHT LANDER (2018)
  scene_insight: {
    name: "Elysium Planitia",
    sector: "SMOOTH VOLCANIC PLAINS",
    target: "INSIGHT LANDER (2018)",
    bgKey: "insight",
    intro: {
      title: "GEOTHERMAL SEISMIC HAZARD",
      desc: "Illegal heavy deep-mantle drills are vibrating the crust of Elysium Planitia, creating shockwaves that threaten to shatter InSight's ultra-sensitive seismic listening dome!",
      mediaKey: "insight"
    },
    dialogues: [
      {
        speaker: "RANGER",
        text: "ARCHIE, the ground is shuddering violently! Industrial geothermal rigs in the distance are drilling deep boreholes into Elysium Planitia. Beside me sits a circular lander with outstretched solar wings and a white dome resting on the soil.",
        holoMedia: "assets/img/holo_insight_dome_placed.jpg",
        caption: "SEISMIC RECON: SEIS Wind and Thermal Shield on Martian Ground"
      },
      {
        speaker: "ARCHIE",
        text: "That circular probe is InSight, which touched down on the smooth volcanic plains of Elysium Planitia in November 2018. Unlike surface-roving vehicles, InSight was designed as Mars's premier physician—taking its pulse, internal temperature, and reflexes.",
        holoMedia: "assets/img/holo_insight_marsquake_wave.jpg",
        caption: "ACOUSTIC SENSORS: 1,300+ Marsquakes & Wind Audio Recorded"
      },
      {
        speaker: "ARCHIE",
        text: "The white structure resting on the red soil is the Wind and Thermal Shield protecting the ultra-sensitive SEIS seismometer. Over its four-year mission, InSight detected over 1,300 marsquakes and even recorded the haunting acoustic rumble of Martian wind blowing at 10 to 15 mph on December 1, 2018.",
        holoMedia: "assets/img/holo_insight_core_structure.jpg",
        caption: "GEOPHYSICS: Mapping the Crust, Mantle, and Liquid Core"
      },
      {
        speaker: "ARCHIE",
        text: "These seismic shockwaves allowed geophysicists to map the thickness of the Martian crust, the composition of its mantle, and confirm a liquid metallic core. Calibrate InSight's seismic sensor to match the natural tremor frequencies and trigger the drills' automatic safety shut-off!",
        holoMedia: "assets/img/holo_insight_core_structure.jpg",
        caption: "SHUT-OFF HARMONIC: Synchronize Seismic Frequency"
      }
    ],
    hotspots: [
      { id: "insight_seis", name: "SEIS Seismometer Dome", x: 640, y: 470, r: 35, action: "open_puzzle" }
    ],
    puzzle: {
      title: "CODEX CHALLENGE: PLANETARY GEOPHYSICS",
      prompt: "What physical seismic phenomenon did InSight measure to reveal the internal layers and crustal thickness of the Red Planet?",
      options: [
        { text: "Marsquakes (natural tectonic and impact tremors)", correct: true },
        { text: "Oceanic tidal fluctuations", correct: false },
        { text: "Atmospheric solar flares", correct: false }
      ],
      nasaUrl: "https://science.nasa.gov/mission/insight/",
      missionKey: "insight",
      debrief: "SEISMIC FREQUENCY LOCKED: The drills detected the natural harmonic and powered down! InSight solved mysteries that perplexed geologists for half a century, proving Mars is still seismically alive, mapping its crustal boundaries, and measuring the exact diameter of its dense molten iron-nickel core."
    }
  },

  // 5. INGENUITY MARS HELICOPTER (2021)
  scene_ingenuity: {
    name: "Jezero Crater",
    sector: "ANCIENT RIVER DELTA",
    target: "INGENUITY HELICOPTER (2021)",
    bgKey: "ingenuity",
    intro: {
      title: "ANTIQUE SMUGGLER RAID DETECTED",
      desc: "A clandestine squadron of salvage pirate drones has deployed magnetic winch cables to steal Ingenuity from the sands of Jezero Crater for black-market auctions!",
      mediaKey: "ingenuity"
    },
    dialogues: [
      {
        speaker: "RANGER",
        text: "I'm looking down into a dry river canyon in Jezero Crater. Resting alone on its four spindly composite legs is Ingenuity! But look above—automated scrapper drones are dropping grapple hooks right toward its carbon-fiber rotors!",
        holoMedia: "assets/img/holo_ingenuity_takeoff.jpg",
        caption: "AERIAL HERO: Ingenuity Rotorcraft on the Sands of Jezero"
      },
      {
        speaker: "ARCHIE",
        text: "Ingenuity represents a monumental leap in exploration. Remember, Ranger: Mars possesses an atmosphere less than 1% as dense as Earth's, making aerodynamic lift thought by many to be nearly impossible.",
        holoMedia: "assets/img/holo_ingenuity_air_scout.jpg",
        caption: "MISSION TRANSFORMATION: 72 Sorties Across Nearly 3 Years"
      },
      {
        speaker: "ARCHIE",
        text: "Originally deployed as a high-risk tech demo intended for just 5 short flights in 30 days, this 4-pound marvel achieved an astounding 72 flights across nearly three years, serving as an indispensable airborne scout for the Perseverance rover.",
        holoMedia: "assets/img/holo_ingenuity_wright_fabric.jpg",
        caption: "SACRED RELIC: 1903 Wright Brothers Flyer Wing Fabric"
      },
      {
        speaker: "ARCHIE",
        text: "Affixed beneath its solar panel is a sacred relic from Earth's aviation heritage: a tiny swatch of muslin fabric from the wing of the 1903 Wright Flyer. Input its aeronautical lineage to fire Ingenuity's encrypted defensive countermeasure pulse!",
        holoMedia: "assets/img/holo_ingenuity_wright_fabric.jpg",
        caption: "COUNTERMEASURE PULSE: Aeronautical Lineage Authorization"
      }
    ],
    hotspots: [
      { id: "ingenuity_rotor", name: "Rotor Blades & Solar Cell", x: 610, y: 390, r: 32, action: "open_puzzle" }
    ],
    puzzle: {
      title: "CODEX CHALLENGE: AERONAUTICAL HERITAGE",
      prompt: "Underneath its solar panel, Ingenuity carries a postage-stamp-sized swatch of wing fabric taken from which historic Earth aircraft?",
      options: [
        { text: "The Wright Brothers' 1903 Flyer (Kitty Hawk)", correct: true },
        { text: "Amelia Earhart's Lockheed 5B Vega", correct: false },
        { text: "The Apollo 11 Lunar Module Eagle", correct: false }
      ],
      nasaUrl: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/",
      missionKey: "ingenuity",
      debrief: "DEFENSIVE PULSE TRIGGERED: The pirate cables snapped, and the drones retreated into the canyon! Logging nearly 129 minutes in flight, traveling over 10.5 miles (17 km), and reaching altitudes of 79 feet, Ingenuity concluded its airborne journey in January 2024 following rotor tip damage, remaining forever as humanity's Wright Brothers moment on Mars."
    }
  },

  // 6. NEAR SHOEMAKER (1996)
  scene_near: {
    name: "Asteroid 433 Eros",
    sector: "ASTEROID BELT REGION",
    target: "NEAR SHOEMAKER (1996)",
    bgKey: "near",
    intro: {
      title: "EXPLOSIVE DEMOLITION RISK",
      desc: "Commercial asteroid-mining contractors have placed seismic charges across Asteroid 433 Eros to shatter it for nickel-iron ore. NEAR Shoemaker will be vaporized if the charges detonate!",
      mediaKey: "near"
    },
    dialogues: [
      {
        speaker: "RANGER",
        text: "We're in deep microgravity. I'm magnetized to the jagged, tumbling surface of asteroid 433 Eros. Blinking demolition timers have been strapped to the boulder ridges near NEAR Shoemaker's frame!",
        holoMedia: "assets/img/holo_near_approaching_eros.jpg",
        caption: "MICROGRAVITY DANGER: Demolition Timers on Asteroid 433 Eros"
      },
      {
        speaker: "ARCHIE",
        text: "This battered probe is NEAR Shoemaker, launched in 1996 as the vanguard of NASA's Discovery program. It achieved unmatched milestones: becoming the first spacecraft to orbit an asteroid, and the first to ever touch down upon one.",
        holoMedia: "assets/img/holo_near_gentle_landing.jpg",
        caption: "HISTORIC TOUCHDOWN: 4 mph Gentle Impact on an Asteroid (2001)"
      },
      {
        speaker: "ARCHIE",
        text: "Remarkably, NEAR was never engineered as a lander. It had no landing gear, no shock absorbers. Yet on February 12, 2001, mission controllers orchestrated an impromptu landing so exceptionally gentle that the craft survived touchdown and continued transmitting science data for two weeks!",
        holoMedia: "assets/img/holo_near_gamma_ray.jpg",
        caption: "SURFACE SPECTROMETRY: Mapping Composition in -173°C Space"
      },
      {
        speaker: "ARCHIE",
        text: "Renamed in tribute to planetary geologist Eugene Shoemaker, it mapped 70% of Eros with its gamma-ray spectrometer. Authenticate its touchdown velocity profile to transmit the override signal and disarm the mining charges!",
        holoMedia: "assets/img/holo_near_gamma_ray.jpg",
        caption: "DISARM MATRIX: Confirm Gentle Touchdown Velocity Profile"
      }
    ],
    hotspots: [
      { id: "near_spectrometer", name: "Gamma-Ray Spectrometer Array", x: 670, y: 360, r: 30, action: "open_puzzle" }
    ],
    puzzle: {
      title: "CODEX CHALLENGE: TOUCHDOWN VELOCITY",
      prompt: "At what remarkably gentle speed did NEAR Shoemaker touch down onto the cratered surface of asteroid 433 Eros?",
      options: [
        { text: "Approximately 4 miles per hour (6.4 km/h)—gentle human walking speed", correct: true },
        { text: "Over 12,000 miles per hour kinetic strike", correct: false },
        { text: "Supersonic speed (Mach 2)", correct: false }
      ],
      nasaUrl: "https://science.nasa.gov/mission/near-shoemaker/",
      missionKey: "near",
      debrief: "DEMOLITION CHARGES NEUTRALIZED: The syndicate timers disarmed! NEAR Shoemaker marked the very first time an American spacecraft was the first human emissary to touch down on a new celestial body. It returned 160,000 images and revolutionized asteroid composition science before going dormant in the -173°C cold."
    }
  },

  // 7. DAWN (2007)
  scene_dawn: {
    name: "Orbit of Dwarf Planet Ceres",
    sector: "MAIN ASTEROID BELT",
    target: "DAWN SPACECRAFT (2007)",
    bgKey: "dawn",
    intro: {
      title: "SCRAPPER TUG INTERCEPTION",
      desc: "An automated orbital scrapper tug has latched tow-cables onto the silent Dawn spacecraft, preparing to drag it into a salvage incinerator for rare titanium alloys!",
      mediaKey: "dawn"
    },
    dialogues: [
      {
        speaker: "RANGER",
        text: "We're in high orbit above Ceres. Below us, mysterious bright white spots glow inside Occator Crater. A corporate tug has clamped onto the hull of Dawn, firing thrusters to de-orbit it!",
        holoMedia: "assets/img/holo_dawn_two_worlds.jpg",
        caption: "ORBITAL INTERCEPTION: Salvage Hauler Clamped to Dawn"
      },
      {
        speaker: "ARCHIE",
        text: "Dawn was NASA's premier interplanetary trailblazer. Launched in 2007, it accomplished a celestial feat never replicated: entering orbit around two separate extraterrestrial destinations—first the protoplanet Vesta, followed by dwarf planet Ceres.",
        holoMedia: "assets/img/holo_dawn_ion_engine.jpg",
        caption: "PROPULSION REVOLUTION: Xenon Ion Thruster Engine Glowing Blue"
      },
      {
        speaker: "ARCHIE",
        text: "Its revolutionary secret was xenon ion propulsion. Rather than burning chemical propellant in violent minutes, Dawn accelerated with whisper-quiet efficiency for tens of thousands of hours on glowing beams of blue xenon ions.",
        holoMedia: "assets/img/holo_dawn_ceres_faculae.jpg",
        caption: "ANCIENT OCEANS: Sodium Carbonate Bright Spots in Occator Crater"
      },
      {
        speaker: "ARCHIE",
        text: "At Ceres, Dawn unmasked the dazzling white deposits in Occator Crater as sodium carbonate salts from an ancient subsurface brine reservoir. Re-link its communication dish to broadcast its protected status and release the clamps!",
        holoMedia: "assets/img/holo_dawn_ceres_faculae.jpg",
        caption: "PROTECTED BROADCAST: Ion Frequency Identification"
      }
    ],
    hotspots: [
      { id: "dawn_ion", name: "Xenon Ion Thruster Engine", x: 580, y: 420, r: 35, action: "open_puzzle" }
    ],
    puzzle: {
      title: "CODEX CHALLENGE: INTERPLANETARY DRIVE",
      prompt: "What advanced propulsion technology allowed Dawn to break orbit from Vesta and travel onward to orbit dwarf planet Ceres?",
      options: [
        { text: "Chemical solid rocket boosters", correct: false },
        { text: "Hyper-efficient Xenon Ion Propulsion", correct: true },
        { text: "Solar sail canvas harnessing solar wind only", correct: false }
      ],
      nasaUrl: "https://science.nasa.gov/mission/dawn/",
      missionKey: "dawn",
      debrief: "TOW-CLAMPS RELEASED: The scrapper tug verified Dawn's protected heritage treaty and disengaged! Dawn remains in a stable, unpowered perpetual orbit around Ceres for decades to come, ensuring the organic and salt deposits of the dwarf planet remain untouched by contamination."
    }
  },

  // 8. KEPLER / K2 (2009)
  scene_kepler: {
    name: "Earth-Trailing Heliocentric Orbit",
    sector: "DEEP SPACE OPTICAL OBSERVATORY",
    target: "KEPLER SPACE TELESCOPE (2009)",
    bgKey: "kepler",
    intro: {
      title: "HIGH-SPEED ORBITAL DEBRIS CLOUD",
      desc: "A cluster of derelict rocket upper stages and hypervelocity fragments is racing on an intercept course toward Kepler's 1.4-meter primary telescope mirror!",
      mediaKey: "kepler"
    },
    dialogues: [
      {
        speaker: "RANGER",
        text: "Kepler's gold-foil thermal blankets are shimmering in deep space. Radar confirms a dense debris storm of shattered satellite hulls approaching at 15 kilometers per second! Kepler's gyroscopes are locked and motionless.",
        holoMedia: "assets/img/holo_kepler_transit_method.jpg",
        caption: "IMPACT VECTOR: Hypervelocity Space Debris Intercept"
      },
      {
        speaker: "ARCHIE",
        text: "Kepler completely rewired humanity's understanding of our universe. Staring unblinkingly at 150,000 stars to detect microscopic dips in brightness as planets transited, Kepler discovered more than 2,600 confirmed exoplanets.",
        holoMedia: "assets/img/holo_kepler_solar_kayak.jpg",
        caption: "ENGINEERING MIRACLE: Balancing on Sunlight Photon Pressure (K2)"
      },
      {
        speaker: "ARCHIE",
        text: "When two reaction wheels failed in 2013, NASA engineers enacted an astonishing workaround: they harnessed the gentle pressure of sunlight striking its solar panels to stabilize the spacecraft like a kayak balanced in a river current!",
        holoMedia: "assets/img/holo_kepler_exoplanet_chart.jpg",
        caption: "PARADIGM SHIFT: Planets Outnumber Stars in the Milky Way"
      },
      {
        speaker: "ARCHIE",
        text: "This extended mission—K2—surveyed over 500,000 stars. Calibrate Kepler's solar balance angle to utilize photon pressure and dodge the incoming debris cloud!",
        holoMedia: "assets/img/holo_kepler_exoplanet_chart.jpg",
        caption: "PHOTON STEERING: Attitude Synchronization"
      }
    ],
    hotspots: [
      { id: "kepler_optics", name: "1.4-Meter Optics & Photometer", x: 650, y: 350, r: 35, action: "open_puzzle" }
    ],
    puzzle: {
      title: "CODEX CHALLENGE: EXOPLANET REVELATION",
      prompt: "What profound paradigm shift did Kepler's exoplanet catalog conclusively reveal about our Milky Way galaxy?",
      options: [
        { text: "Stars drastically outnumber planets across the cosmos", correct: false },
        { text: "Planets are everywhere, and in fact outnumber stars in the galaxy", correct: true },
        { text: "Our solar system is the sole repository of rocky planets", correct: false }
      ],
      nasaUrl: "https://science.nasa.gov/mission/kepler/",
      missionKey: "kepler",
      debrief: "SOLAR BALANCE SYNCHRONIZED: Kepler pivoted on sunlight, allowing the debris swarm to pass harmlessly! Retired in October 2018 after expending all fuel, Kepler proved that planets outnumber stars in the Milky Way and that 20 to 50 percent of stars likely harbor rocky, Earth-sized worlds within their habitable zones."
    }
  },

  // 9. PIONEER 10 (1972)
  scene_pioneer: {
    name: "Interstellar Boundary",
    sector: "DEEP VOID TOWARD ALDEBARAN",
    target: "PIONEER 10 (1972)",
    bgKey: "pioneer10",
    intro: {
      title: "INTERSTELLAR INTERFERENCE CRITICAL",
      desc: "An interstellar electromagnetic radiation vortex is scrambling Pioneer 10's coordinates. If not stabilized, humanity will permanently lose track of its oldest voyager!",
      mediaKey: "pioneer10"
    },
    dialogues: [
      {
        speaker: "RANGER",
        text: "We are billions of miles beyond the planetary orbits, hovering in total cosmic darkness. Resting in the void is an archaic probe dominated by a 2.74-meter dish antenna and twin nuclear RTG generator booms.",
        holoMedia: "assets/img/holo_pioneer_jupiter_flyby.jpg",
        caption: "COSMIC PERIMETER: Pioneer 10 Drifting Past Neptune"
      },
      {
        speaker: "ARCHIE",
        text: "Behold Pioneer 10, launched in March 1972. It was our initial scout to the outer solar system: the first probe to pierce the asteroid belt, the first to fly past Jupiter and photograph the Great Red Spot, and the first to cross Neptune's orbit into interstellar space.",
        holoMedia: "assets/img/holo_pioneer_gold_plaque_diagram.jpg",
        caption: "ETERNAL MESSAGE: The Gold-Anodized Pioneer Plaque"
      },
      {
        speaker: "ARCHIE",
        text: "Mounted to its antenna frame is the legendary gold-anodized Pioneer Plaque designed by Carl Sagan and Frank Drake, illustrating human figures, hydrogen atoms, and a map locating Earth relative to 14 pulsating celestial beacons.",
        holoMedia: "assets/img/holo_pioneer_aldebaran_trajectory.jpg",
        caption: "TWO-MILLION-YEAR VOYAGE: Heading Towards Star Aldebaran"
      },
      {
        speaker: "ARCHIE",
        text: "Its final faint signal reached Earth in January 2003 from 7.6 billion miles away. Over the next 2 million years, it will drift toward the red giant star Aldebaran. Authenticate its pulsar map to anchor its coordinates in the galactic registry!",
        holoMedia: "assets/img/holo_pioneer_aldebaran_trajectory.jpg",
        caption: "COORDINATE LOCK: 14 Pulsar Frequencies Alignment"
      }
    ],
    hotspots: [
      { id: "pioneer_plaque", name: "Gold Pioneer Plaque & Dish", x: 620, y: 380, r: 32, action: "open_puzzle" }
    ],
    puzzle: {
      title: "CODEX CHALLENGE: INTERSTELLAR MAP",
      prompt: "The Pioneer Plaque maps the location of our Sun and Earth using lines connecting to which celestial beacons?",
      options: [
        { text: "14 Pulsars with unique radio pulsation frequencies", correct: true },
        { text: "The major volcanic craters of Venus and Mars", correct: false },
        { text: "The orbital coordinates of communications satellites", correct: false }
      ],
      nasaUrl: "https://science.nasa.gov/mission/pioneer-10/",
      missionKey: "pioneer10",
      debrief: "PULSAR MATRIX STABILIZED: Pioneer 10's beacon flares with soft cyan light! Designed for a 21-month mission, Pioneer 10 endured for over 30 years. It sails forever through interstellar gas as an eternal ambassador of human curiosity, carrying humanity's story into the cosmic deep."
    }
  }
};

/* ==========================================================================
   4. GAME CONTROLLER & UI MANAGER
   ========================================================================== */

function initGame() {
  bindEvents();
  document.getElementById("welcome-modal").style.display = "flex";
  requestAnimationFrame(gameLoop);
}

function loadScene(sceneId) {
  gameState.currentSceneId = sceneId;
  const scene = SCENES[sceneId];

  document.getElementById("current-sector").innerText = scene.sector;
  document.getElementById("target-artifact").innerText = scene.target;

  if (scene.intro) {
    showIntroBanner(scene.intro);
  } else {
    initSceneDialogues(scene);
  }
}

function showIntroBanner(intro) {
  const modal = document.getElementById("sector-intro-modal");
  document.getElementById("intro-title").innerText = intro.title;
  document.getElementById("intro-desc").innerText = intro.desc;

  const vEl = document.getElementById("intro-video");
  const imgEl = document.getElementById("intro-image");
  const placeholder = document.getElementById("intro-placeholder");

  const media = ASSETS.intros[intro.mediaKey];
  if (media && media.video) {
    vEl.src = media.video;
    vEl.style.display = "block";
    imgEl.style.display = "none";
    placeholder.style.display = "none";
  } else if (media && media.image) {
    imgEl.src = media.image;
    imgEl.style.display = "block";
    vEl.style.display = "none";
    placeholder.style.display = "none";
  } else {
    vEl.style.display = "none";
    imgEl.style.display = "none";
    placeholder.style.display = "block";
    placeholder.innerText = `[THREAT RECONNAISSANCE SCAN: ${intro.mediaKey.toUpperCase()}]`;
  }

  modal.style.display = "flex";
}

function initSceneDialogues(scene) {
  if (scene.dialogues && scene.dialogues.length > 0) {
    gameState.dialogueQueue = [...scene.dialogues];
    gameState.dialogueIndex = 0;
    renderDialogue(gameState.dialogueQueue[0]);
  } else {
    document.getElementById("dialogue-box").style.display = "none";
  }
}

function renderDialogue(diag) {
  if (!diag) {
    document.getElementById("dialogue-box").style.display = "none";
    return;
  }

  const box = document.getElementById("dialogue-box");
  box.style.display = "flex";

  const archieEl = document.getElementById("character-archie");
  const rangerEl = document.getElementById("character-ranger");
  const speakerBanner = document.getElementById("speaker-name");
  const textEl = document.getElementById("dialogue-text");

  const mediaImg = document.getElementById("dialogue-media-img");
  const mediaVideo = document.getElementById("dialogue-media-video");
  const mediaPlaceholder = document.getElementById("media-placeholder");
  const mediaCaption = document.getElementById("media-caption");

  textEl.innerText = diag.text;

  if (diag.speaker === "RANGER") {
    speakerBanner.innerText = "RANGER [HERITAGE GUARDIAN]";
    speakerBanner.className = "speaker-banner ranger";
    rangerEl.className = "character-standee right-character active";
    archieEl.className = "character-standee left-character dimmed";
  } else {
    speakerBanner.innerText = "ARCHIE [MISSION AI]";
    speakerBanner.className = "speaker-banner archie";
    archieEl.className = "character-standee left-character active";
    rangerEl.className = "character-standee right-character dimmed";
  }

  if (diag.holoMedia) {
    if (diag.holoMedia.endsWith(".mp4") || diag.holoMedia.endsWith(".webm")) {
      mediaVideo.src = diag.holoMedia;
      mediaVideo.style.display = "block";
      mediaImg.style.display = "none";
      mediaPlaceholder.style.display = "none";
    } else {
      mediaImg.src = diag.holoMedia;
      mediaImg.style.display = "block";
      mediaVideo.style.display = "none";
      mediaPlaceholder.style.display = "none";
    }
  } else {
    mediaImg.style.display = "none";
    mediaVideo.style.display = "none";
    mediaPlaceholder.style.display = "block";
    mediaPlaceholder.innerHTML = `<span class="scanline-text">[NASA DATA LOG: ${diag.speaker}]</span>`;
  }

  mediaCaption.innerText = diag.caption || `TELEMETRY RECORD: ${diag.speaker}`;
}

function nextDialogue() {
  gameState.dialogueIndex++;
  if (gameState.dialogueIndex < gameState.dialogueQueue.length) {
    renderDialogue(gameState.dialogueQueue[gameState.dialogueIndex]);
  } else {
    document.getElementById("dialogue-box").style.display = "none";
  }
}

function openPuzzle(puzzle) {
  const modal = document.getElementById("puzzle-modal");
  const quizView = document.getElementById("puzzle-quiz-view");
  const feedback = document.getElementById("puzzle-feedback");

  quizView.style.display = "block";
  feedback.style.display = "none";

  document.getElementById("puzzle-title").innerText = puzzle.title;
  document.getElementById("puzzle-prompt").innerText = puzzle.prompt;

  const container = document.getElementById("puzzle-options");
  container.innerHTML = "";

  puzzle.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "hud-btn";
    btn.innerText = opt.text;
    btn.onclick = () => {
      if (opt.correct) {
        const sfxCorrect = document.getElementById("sfx-correct");
        if (sfxCorrect) {
  sfxCorrect.currentTime = 0; // Tua lại đầu file nếu bấm liên tục
  sfxCorrect.play().catch(() => {});
        }
        gameState.rescuedMissions.add(puzzle.missionKey);
        document.getElementById("beacon-count").innerText = gameState.rescuedMissions.size;
        modal.style.display = "none";

        showSuccessDebrief(puzzle);
      } else {
        quizView.style.display = "none";
        feedback.style.display = "block";
        const sfxWrong = document.getElementById("sfx-wrong");
        if (sfxWrong) {
          sfxWrong.currentTime = 0;
          sfxWrong.play().catch(() => {});
        }

        const link = document.getElementById("feedback-link");
        link.href = puzzle.nasaUrl;
        link.innerText = `[ACCESS OFFICIAL NASA ${puzzle.missionKey.toUpperCase()} MISSION ARCHIVE] \u00BB`;
      }
    };
    container.appendChild(btn);
  });

  document.getElementById("try-again-btn").onclick = () => {
    feedback.style.display = "none";
    quizView.style.display = "block";
  };

  document.getElementById("return-menu-btn").onclick = () => {
    modal.style.display = "none";
    loadScene("scene_map");
  };

  modal.style.display = "block";
}

function showSuccessDebrief(puzzle) {
  const modal = document.getElementById("success-modal");
  document.getElementById("success-debrief-text").innerText = puzzle.debrief;

  const imgEl = document.getElementById("success-artifact-img");
  const placeholder = document.getElementById("artifact-img-placeholder");
  
  // Kiểm tra đường dẫn từ ASSETS hoặc giữ nguyên src từ HTML nếu đã có
  const mediaUrl = ASSETS.archiveRecords[puzzle.missionKey] || imgEl.getAttribute("src");

  if (mediaUrl && mediaUrl.trim() !== "") {
    imgEl.src = mediaUrl;
    imgEl.style.display = "block";       // Hiện ảnh
    placeholder.style.display = "none";  // Ẩn placeholder
    
    // Nếu ảnh bị lỗi đường dẫn vật lý (404), tự động quay về hiện placeholder
    imgEl.onerror = () => {
      imgEl.style.display = "none";
      placeholder.style.display = "block";
      placeholder.innerText = `[CANNOT LOAD IMAGE: ${mediaUrl}]`;
    };
  } else {
    imgEl.style.display = "none";
    placeholder.style.display = "block";
    placeholder.innerText = `[NASA HISTORIC DISCOVERY PHOTO: ${puzzle.missionKey.toUpperCase()}]`;
  }

  modal.style.display = "block";
}

function triggerEpilogue() {
  const epilogueModal = document.getElementById("epilogue-modal");
  document.getElementById("epilogue-text").innerHTML = 
    `"All 9 Legacy Beacons burn with steady cyan light across the void, Ranger.<br><br>` +
    `Look across the Solar System: from the salmon-peach skies of Viking 1 and the airbag marks of Pathfinder, to the 45-kilometer tracks of Opportunity and the quiet rotor blades of Ingenuity. Look further out past the gentle resting place of NEAR on Eros, the orbital vigil of Dawn around Ceres, Kepler's ocean of exoplanets, and the silent interstellar voyage of Pioneer 10.<br><br>` +
    `Humanity once worried that when these machines ran out of power, their stories would end in darkness. But today, you proved that their courage, their discoveries, and their sacrifices will never be forgotten.<br><br>` +
    `The history of our first explorers is safe."`;
  epilogueModal.style.display = "flex";
}

/* ==========================================================================
   5. CANVAS RENDER LOOP (WITH RADAR HOTSPOTS & SAFE BACKGROUND DRAW)
   ========================================================================== */

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scene = SCENES[gameState.currentSceneId];

  // Draw background image safely through imageCache, fallback to high-tech radar grid
  const bgPath = ASSETS.backgrounds[scene.bgKey];
  const bgImg = getLoadedImage(bgPath);

  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } else {
    drawFallbackRadar(scene);
  }

  // Draw Interactive Radar Hotspots
  if (scene.hotspots) {
    const time = Date.now() * 0.003;
    scene.hotspots.forEach(spot => {
      const isHovered = gameState.activeHotspot === spot;
      const pulseR = spot.r + Math.sin(time) * 3;

      ctx.save();
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, Math.max(pulseR, 2), 0, Math.PI * 2);

      const isRescued = spot.targetScene && SCENES[spot.targetScene]?.puzzle && gameState.rescuedMissions.has(SCENES[spot.targetScene].puzzle.missionKey);

      ctx.strokeStyle = isRescued ? "#00ff88" : isHovered ? "#ffaa00" : "#00e5ff";
      ctx.lineWidth = isHovered ? 3 : 1.5;
      ctx.stroke();

      ctx.fillStyle = isRescued ? "rgba(0, 255, 136, 0.25)" : "rgba(0, 229, 255, 0.15)";
      ctx.fill();

      ctx.fillStyle = isHovered ? "#ffaa00" : "#e0f7fa";
      ctx.font = isHovered ? "bold 13px 'Courier New'" : "12px 'Courier New'";
      ctx.fillText(spot.name, spot.x + spot.r + 10, spot.y + 4);
      ctx.restore();
    });
  }

  requestAnimationFrame(gameLoop);
}

function drawFallbackRadar(scene) {
  ctx.fillStyle = gameState.currentSceneId === "scene_map" ? "#030a14" : "#120807";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(0, 255, 204, 0.06)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = "18px 'Courier New'";
  ctx.fillText(`TELEMETRY SECTOR: ${scene.name.toUpperCase()}`, 40, 70);
  ctx.fillStyle = "rgba(255, 255, 204, 0.4)";
  ctx.font = "13px 'Courier New'";
  ctx.fillText(`[RADAR ACTIVE - AWAITING OPTICAL FEED: ASSETS.backgrounds.${scene.bgKey}]`, 40, 95);
}

/* ==========================================================================
   6. USER INPUT & EVENT SYSTEM
   ========================================================================== */

function bindEvents() {
  document.getElementById("start-mission-btn").addEventListener("click", () => {
    document.getElementById("welcome-modal").style.display = "none";
    const bgm = document.getElementById("bgm-player");
    if (bgm) {
      bgm.volume = 0.4; // Tùy chỉnh âm lượng vừa phải (0.0 đến 1.0)
      bgm.play().catch(err => {
        console.warn("Autoplay still blocked or audio file path issue:", err);
      });
    }
    loadScene("scene_map");
  });

  document.getElementById("intro-proceed-btn").addEventListener("click", () => {
    document.getElementById("sector-intro-modal").style.display = "none";
    const scene = SCENES[gameState.currentSceneId];
    initSceneDialogues(scene);
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    gameState.mousePos.x = (e.clientX - rect.left) * scaleX;
    gameState.mousePos.y = (e.clientY - rect.top) * scaleY;

    const scene = SCENES[gameState.currentSceneId];
    gameState.activeHotspot = null;

    if (scene.hotspots) {
      for (let spot of scene.hotspots) {
        const dx = gameState.mousePos.x - spot.x;
        const dy = gameState.mousePos.y - spot.y;
        if (Math.sqrt(dx * dx + dy * dy) <= spot.r + 5) {
          gameState.activeHotspot = spot;
          canvas.style.cursor = "pointer";
          return;
        }
      }
    }
    canvas.style.cursor = "crosshair";
  });

  canvas.addEventListener("click", () => {
    if (gameState.activeHotspot) {
      const spot = gameState.activeHotspot;
      if (spot.targetScene) {
        loadScene(spot.targetScene);
      } else if (spot.action === "open_puzzle") {
        const scene = SCENES[gameState.currentSceneId];
        if (scene.puzzle) {
          openPuzzle(scene.puzzle);
        }
      }
    }
  });

  document.getElementById("dialogue-next-btn").addEventListener("click", nextDialogue);
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      const box = document.getElementById("dialogue-box");
      if (box.style.display !== "none") {
        nextDialogue();
      }
    }
  });

  document.getElementById("close-success-btn").addEventListener("click", () => {
    document.getElementById("success-modal").style.display = "none";
    if (gameState.rescuedMissions.size === 9) {
      triggerEpilogue();
    } else {
      loadScene("scene_map");
    }
  });

  document.getElementById("map-toggle-btn").addEventListener("click", () => {
    loadScene("scene_map");
  });

  document.getElementById("restart-btn").addEventListener("click", () => {
    gameState.rescuedMissions.clear();
    document.getElementById("beacon-count").innerText = "0";
    document.getElementById("epilogue-modal").style.display = "none";
    loadScene("scene_map");
  });
}

window.onload = initGame;