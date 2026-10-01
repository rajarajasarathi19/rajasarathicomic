import { ComicStory } from '../types/comic';

export const PRESET_COMICS: ComicStory[] = [
  {
    id: 'preset-quantum-detective',
    title: 'The Chrono-Detective',
    issueNumber: '#01',
    tagline: 'When time is murdered, who solves the clock?',
    genre: 'Cyberpunk Noir',
    tone: 'Gritty & Suspenseful',
    artStyle: 'dark-noir',
    layout: 'classic-4',
    createdAt: '2026-09-30T10:00:00.000Z',
    author: 'ComicCraft Studio',
    synopsis: 'Private eye Jax Vance investigates a temporal tear in Neo-Chicago where raindrops hang frozen in mid-air.',
    coverColor: '#1e1b4b',
    characters: [
      {
        id: 'char-jax',
        name: 'Jax Vance',
        role: 'protagonist',
        appearance: 'Cybernetic trench coat, glowing amber ocular implant, fedora casting a deep shadow over weary eyes.',
        personality: 'Cynical, razor-sharp investigator with a weak spot for stray synth-cats.',
        colorTheme: '#f59e0b'
      },
      {
        id: 'char-dr-tempo',
        name: 'Doctor Chronos',
        role: 'antagonist',
        appearance: 'Sleek silver tuxedo with floating fractured pocket watch shards swirling around his arms.',
        personality: 'Obsessive clockmaker turned rogue temporal anarchist.',
        colorTheme: '#06b6d4'
      }
    ],
    panels: [
      {
        id: 'p1',
        panelNumber: 1,
        caption: 'NEO-CHICAGO, 2088. THE RAIN FALLS LIKE SHARDS OF BROKEN NEON.',
        visualDescription: 'Jax Vance stands under a flickering holographic street lamp in a dark alley. Raindrops are unnaturally frozen stationary in the air around him.',
        cameraAngle: 'Low-angle cinematic medium shot',
        illustrationData: {
          primarySubject: 'Jax Vance lighting a synth-cigarette',
          actionPose: 'Standing in trench coat, collar up, inspecting a frozen raindrop',
          environment: 'Neo-noir wet alleyway with neon signs in Japanese and English',
          colorPalette: {
            skyOrBg: '#0f172a',
            groundOrMid: '#1e293b',
            accent: '#f59e0b',
            shadow: '#020617'
          },
          lightingMood: 'High-contrast chiaroscuro with neon amber rim light',
          effects: ['halftone-dots', 'rain'],
          compositionAngle: 'Low angle looking up at Jax'
        },
        dialogue: [
          {
            id: 'd1-1',
            speaker: 'Jax Vance',
            text: 'Rain stopped falling ten minutes ago... yet none of it hit the asphalt.',
            type: 'thought',
            position: 'top-left',
            characterColor: '#f59e0b'
          }
        ],
        soundEffects: [
          {
            id: 's1-1',
            text: 'TICK... TICK...',
            style: 'stealth',
            x: 75,
            y: 20,
            rotation: -8
          }
        ]
      },
      {
        id: 'p2',
        panelNumber: 2,
        caption: 'HIS CHRONO-SCANNER REGISTERED A SUDDEN TEMPORAL FRACTURE.',
        visualDescription: 'Jax pulls out a brass-and-copper scanner that flashes wild red warning glyphs. The reflection of a shadowed figure appears behind him.',
        cameraAngle: 'Extreme close-up on eye and gadget',
        illustrationData: {
          primarySubject: 'Jax Vance ocular implant and handheld scanner',
          actionPose: 'Holding scanner tight as red holographic gauge spikes',
          environment: 'Alley wall with decaying poster and flickering wire sparks',
          colorPalette: {
            skyOrBg: '#18181b',
            groundOrMid: '#27272a',
            accent: '#ef4444',
            shadow: '#09090b'
          },
          lightingMood: 'Harsh crimson alert glow',
          effects: ['energy-burst', 'speed-lines'],
          compositionAngle: 'Tight macro focus on scanner lens'
        },
        dialogue: [
          {
            id: 'd2-1',
            speaker: 'Jax Vance',
            text: 'Pocket entropy off the charts! Someone is cracking the timeline wide open!',
            type: 'shout',
            position: 'top-left',
            characterColor: '#f59e0b'
          }
        ],
        soundEffects: [
          {
            id: 's2-1',
            text: 'BZZZZT!',
            style: 'electric',
            x: 65,
            y: 70,
            rotation: 12
          }
        ]
      },
      {
        id: 'p3',
        panelNumber: 3,
        caption: 'A RIFT TEARS THE NIGHT IN TWO.',
        visualDescription: 'A blinding spatial rift tears open in the alley air. Doctor Chronos steps forward through a kaleidoscope of ticking watch faces and shattered seconds.',
        cameraAngle: 'Dynamic wide splash shot',
        illustrationData: {
          primarySubject: 'Doctor Chronos stepping out of a golden-cyan vortex',
          actionPose: 'Floating two inches above ground, arms outstretched holding a chronometer',
          environment: 'Distorted street grid warping into infinite spiral clock spirals',
          colorPalette: {
            skyOrBg: '#1e1b4b',
            groundOrMid: '#312e81',
            accent: '#38bdf8',
            shadow: '#0f172a'
          },
          lightingMood: 'Blinding quantum pulse illumination',
          effects: ['energy-burst', 'speed-lines'],
          compositionAngle: 'Wide dynamic hero shot'
        },
        dialogue: [
          {
            id: 'd3-1',
            speaker: 'Doctor Chronos',
            text: 'Looking for tomorrow, Detective? I have already rescheduled it!',
            type: 'speech',
            position: 'top-right',
            characterColor: '#06b6d4'
          }
        ],
        soundEffects: [
          {
            id: 's3-1',
            text: 'KRRAAASSHH!',
            style: 'fiery',
            x: 48,
            y: 45,
            rotation: -5
          }
        ]
      },
      {
        id: 'p4',
        panelNumber: 4,
        caption: 'SOME CASES CANNOT BE CLOSED... ONLY SURVIVED.',
        visualDescription: 'Jax draws his plasma revolver, cocking the hammer as sparks spray against the temporal storm. He smirks despite the odds.',
        cameraAngle: 'Over-the-shoulder showdown perspective',
        illustrationData: {
          primarySubject: 'Jax Vance facing down Doctor Chronos',
          actionPose: 'Gun drawn, sparks flying from muzzle, hat brim tilted down',
          environment: 'Frozen alley glowing half gold and half deep violet shadows',
          colorPalette: {
            skyOrBg: '#2e1065',
            groundOrMid: '#581c87',
            accent: '#fbbf24',
            shadow: '#1e1b4b'
          },
          lightingMood: 'Dramatic dual lighting: warm muzzle flare vs cold portal glow',
          effects: ['speed-lines', 'halftone-dots'],
          compositionAngle: 'Dutch angle action showdown'
        },
        dialogue: [
          {
            id: 'd4-1',
            speaker: 'Jax Vance',
            text: 'I charge double for overtime, Doc. And midnight was an hour ago.',
            type: 'speech',
            position: 'bottom-left',
            characterColor: '#f59e0b'
          }
        ],
        soundEffects: [
          {
            id: 's4-1',
            text: 'CH-CHK!',
            style: 'punchy',
            x: 70,
            y: 65,
            rotation: 14
          }
        ]
      }
    ]
  },
  {
    id: 'preset-astro-paws',
    title: 'Astro-Paws: Lunar Catnip Incident',
    issueNumber: '#07',
    tagline: 'One small leap for a cat, one giant leap for nine lives!',
    genre: 'Sci-Fi Comedy',
    tone: 'Playful & Adventurous',
    artStyle: 'retro-comic',
    layout: 'classic-4',
    createdAt: '2026-09-30T10:15:00.000Z',
    author: 'ComicCraft Studio',
    synopsis: 'Captain Whiskers and engineer Pip navigate an asteroid field made entirely of zero-gravity tuna cans.',
    coverColor: '#0369a1',
    characters: [
      {
        id: 'char-whiskers',
        name: 'Captain Whiskers',
        role: 'protagonist',
        appearance: 'Ginger tabby in a bubble astronaut helmet with orange space suit and fish badge.',
        personality: 'Fearless, dramatic, easily distracted by red laser pointers.',
        colorTheme: '#ea580c'
      },
      {
        id: 'char-pip',
        name: 'Pip the Hamster',
        role: 'sidekick',
        appearance: 'Tiny hamster in a mechanical spherical exoskeleton with wrench and clipboard.',
        personality: 'Anxious genius engineer who overcalculates everything.',
        colorTheme: '#eab308'
      }
    ],
    panels: [
      {
        id: 'ap1',
        panelNumber: 1,
        caption: 'ORBITING SECTOR 9. THE STAR-CAT VESSEL "SS PURR-FECT" ACCELERATES.',
        visualDescription: 'Spaceship cockpit with Captain Whiskers paws on the flight controls, looking intently out into deep space filled with star clusters.',
        cameraAngle: 'Cockpit interior medium view',
        illustrationData: {
          primarySubject: 'Captain Whiskers steering through asteroid belt',
          actionPose: 'Paws gripped onto flight yoke with serious feline determination',
          environment: 'Futuristic pastel comic cockpit with neon dials and fish-shaped radars',
          colorPalette: {
            skyOrBg: '#082f49',
            groundOrMid: '#0284c7',
            accent: '#f97316',
            shadow: '#0c4a6e'
          },
          lightingMood: 'Bright retro sci-fi panel glow',
          effects: ['halftone-dots', 'sunburst'],
          compositionAngle: 'Eye-level cockpit view'
        },
        dialogue: [
          {
            id: 'd-ap1',
            speaker: 'Captain Whiskers',
            text: 'Engage sub-light thrusters, Pip! The mothership is waiting for that catnip canister!',
            type: 'speech',
            position: 'top-left',
            characterColor: '#ea580c'
          }
        ],
        soundEffects: [
          {
            id: 's-ap1',
            text: 'VVRRROOOM!',
            style: 'fiery',
            x: 65,
            y: 25,
            rotation: -10
          }
        ]
      },
      {
        id: 'ap2',
        panelNumber: 2,
        caption: 'WARNING: UNIDENTIFIED RED DOT DETECTED ON STARBOARD GLASS.',
        visualDescription: 'A tiny mysterious red laser dot bounces across the cockpit console. Whiskers pupils dilate to massive saucer sizes.',
        cameraAngle: 'Close-up on wide cat eyes',
        illustrationData: {
          primarySubject: 'Captain Whiskers face staring in hypnotic fascination',
          actionPose: 'Ears perked up, tail twitching, staring at the red laser beam',
          environment: 'Spaceship windshield with red bouncing speck',
          colorPalette: {
            skyOrBg: '#1e1b4b',
            groundOrMid: '#312e81',
            accent: '#ef4444',
            shadow: '#0f172a'
          },
          lightingMood: 'Deep blue space ambient with laser pinpoint',
          effects: ['speed-lines'],
          compositionAngle: 'Dramatic comic close-up'
        },
        dialogue: [
          {
            id: 'd-ap2-1',
            speaker: 'Pip the Hamster',
            text: 'Captain, do NOT look at it! It is an alien distraction tactic!',
            type: 'shout',
            position: 'top-right',
            characterColor: '#eab308'
          },
          {
            id: 'd-ap2-2',
            speaker: 'Captain Whiskers',
            text: 'The sacred crimson dot... it calls to me...',
            type: 'thought',
            position: 'bottom-left',
            characterColor: '#ea580c'
          }
        ],
        soundEffects: [
          {
            id: 's-ap2',
            text: 'BEEP! BEEP!',
            style: 'electric',
            x: 45,
            y: 75,
            rotation: 5
          }
        ]
      },
      {
        id: 'ap3',
        panelNumber: 3,
        caption: 'THE POUNCE OF THE CENTURY.',
        visualDescription: 'Captain Whiskers leaps across zero gravity in a majestic slow-motion dive, swatting wildly at the instrument console buttons.',
        cameraAngle: 'Action splash freeze-frame',
        illustrationData: {
          primarySubject: 'Cat leaping across zero-g cockpit',
          actionPose: 'Four paws spread out, claws tapping against the emergency hyperdrive lever',
          environment: 'Floating cups of milk and scattered navigation charts in zero-g',
          colorPalette: {
            skyOrBg: '#047857',
            groundOrMid: '#10b981',
            accent: '#facc15',
            shadow: '#064e3b'
          },
          lightingMood: 'Chaotic alert strobe lights',
          effects: ['speed-lines', 'energy-burst'],
          compositionAngle: 'Diagonal superhero dive angle'
        },
        dialogue: [
          {
            id: 'd-ap3',
            speaker: 'Pip the Hamster',
            text: 'NOOO! That is the warp overdrive button!!',
            type: 'shout',
            position: 'top-left',
            characterColor: '#eab308'
          }
        ],
        soundEffects: [
          {
            id: 's-ap3',
            text: 'SWOOOOSH!',
            style: 'punchy',
            x: 55,
            y: 40,
            rotation: -12
          }
        ]
      },
      {
        id: 'ap4',
        panelNumber: 4,
        caption: 'DESTINATION: PARADISE NEBULA.',
        visualDescription: 'The spaceship zooms into hyperspace, leaving rainbow star trails. Whiskers snoozes comfortably on the warm engine exhaust vent.',
        cameraAngle: 'Wide cosmic panorama with inset cockpit view',
        illustrationData: {
          primarySubject: 'SS Purr-fect warping through rainbow vortex',
          actionPose: 'Spaceship flying into glorious hyperspace swirl',
          environment: 'Colorful cosmic nebulae shaped like fish and yarn balls',
          colorPalette: {
            skyOrBg: '#581c87',
            groundOrMid: '#9333ea',
            accent: '#38bdf8',
            shadow: '#3b0764'
          },
          lightingMood: 'Glorious rainbow hyperdrive luminescence',
          effects: ['sunburst', 'halftone-dots'],
          compositionAngle: 'Epic space vista'
        },
        dialogue: [
          {
            id: 'd-ap4',
            speaker: 'Captain Whiskers',
            text: 'Mission accomplished, Pip. Wake me when we reach the tuna galaxy.',
            type: 'speech',
            position: 'bottom-right',
            characterColor: '#ea580c'
          }
        ],
        soundEffects: [
          {
            id: 's-ap4',
            text: 'ZRRRR-PURRRR!',
            style: 'cosmic',
            x: 30,
            y: 30,
            rotation: 6
          }
        ]
      }
    ]
  },
  {
    id: 'preset-cyber-ronin',
    title: 'Neon Ronin: Sector 7 Protocol',
    issueNumber: '#03',
    tagline: 'Code is law. The blade is the executor.',
    genre: 'Manga / Cyberpunk',
    tone: 'Fast-paced & High Energy',
    artStyle: 'manga',
    layout: 'hero-splash',
    createdAt: '2026-09-30T11:00:00.000Z',
    author: 'ComicCraft Studio',
    synopsis: 'A cyborg samurai infiltrates an automated megacorp server vault to liberate conscious AI entities.',
    coverColor: '#991b1b',
    characters: [
      {
        id: 'char-ren',
        name: 'Ren-09',
        role: 'protagonist',
        appearance: 'Cybernetic ronin with carbon fiber haori, neon blue thermal katana, porcelain face mask with cracked visor.',
        personality: 'Stoic, disciplined, speaks with poetic brevity.',
        colorTheme: '#0284c7'
      }
    ],
    panels: [
      {
        id: 'nr1',
        panelNumber: 1,
        caption: 'THE VAULT WAS SUPPOSED TO BE IMPENETRABLE.',
        visualDescription: 'Ren-09 perched like a gargoyle atop a massive server tower overlooking rows of glowing blue quantum databanks.',
        cameraAngle: 'High angle bird eye view',
        illustrationData: {
          primarySubject: 'Ren-09 crouched on server rack',
          actionPose: 'Hand resting on sword hilt, cloak fluttering in exhaust fan breeze',
          environment: 'Monolithic data center with endless columns of server lights',
          colorPalette: {
            skyOrBg: '#09090b',
            groundOrMid: '#18181b',
            accent: '#06b6d4',
            shadow: '#000000'
          },
          lightingMood: 'Stark black and white manga ink style with harsh blue glow',
          effects: ['halftone-dots', 'speed-lines'],
          compositionAngle: 'High angle vantage point'
        },
        dialogue: [
          {
            id: 'dnr1',
            speaker: 'Ren-09',
            text: 'One hundred firewalls. Zero honor.',
            type: 'thought',
            position: 'top-left',
            characterColor: '#0284c7'
          }
        ],
        soundEffects: [
          {
            id: 'snr1',
            text: 'FSSSHHH...',
            style: 'stealth',
            x: 70,
            y: 20,
            rotation: -4
          }
        ]
      },
      {
        id: 'nr2',
        panelNumber: 2,
        caption: 'SECURITY DRONES DEPLOY IN FORMATION.',
        visualDescription: 'Four red-eyed attack drones drop from the ceiling, their targeting lasers locking onto Ren in crosshair formation.',
        cameraAngle: 'Frontal tension shot',
        illustrationData: {
          primarySubject: 'Four attack drones with glowing red ocular beams',
          actionPose: 'Hovering in menacing V-formation, rotoblades spinning',
          environment: 'High-tech server corridor with warning beacons flashing',
          colorPalette: {
            skyOrBg: '#18181b',
            groundOrMid: '#27272a',
            accent: '#dc2626',
            shadow: '#09090b'
          },
          lightingMood: 'Threatening red crosshair laser grid',
          effects: ['speed-lines'],
          compositionAngle: 'Straight ahead threat perspective'
        },
        dialogue: [
          {
            id: 'dnr2',
            speaker: 'Ren-09',
            text: 'Unsheathe.',
            type: 'whisper',
            position: 'bottom-center',
            characterColor: '#0284c7'
          }
        ],
        soundEffects: [
          {
            id: 'snr2',
            text: 'SHHHINGG!',
            style: 'electric',
            x: 50,
            y: 35,
            rotation: 8
          }
        ]
      },
      {
        id: 'nr3',
        panelNumber: 3,
        caption: 'THE BLADE FLASHES FASTER THAN OPTIC CABLE LATENCY.',
        visualDescription: 'Ren strikes in an instantaneous horizontal slash, splitting the drones in two with a radiant crescent arc of blue plasma light.',
        cameraAngle: 'Dynamic low angle widescreen hero splash',
        illustrationData: {
          primarySubject: 'Ren-09 completing lethal katana follow-through',
          actionPose: 'Full extension strike, severed drone halves exploding in background',
          environment: 'Shattered metal fragments and sparks freezing in air',
          colorPalette: {
            skyOrBg: '#0369a1',
            groundOrMid: '#0284c7',
            accent: '#f8fafc',
            shadow: '#082f49'
          },
          lightingMood: 'Blinding kinetic plasma slash brilliance',
          effects: ['speed-lines', 'energy-burst'],
          compositionAngle: 'Diagonal heroic action line'
        },
        dialogue: [
          {
            id: 'dnr3',
            speaker: 'Ren-09',
            text: 'Your code is obsolete.',
            type: 'speech',
            position: 'top-left',
            characterColor: '#0284c7'
          }
        ],
        soundEffects: [
          {
            id: 'snr3',
            text: 'ZAAANNN!',
            style: 'punchy',
            x: 60,
            y: 50,
            rotation: -15
          }
        ]
      }
    ]
  }
];
