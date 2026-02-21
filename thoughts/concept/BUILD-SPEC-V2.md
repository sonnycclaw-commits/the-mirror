# THE MIRROR — Full Build Spec v2.0
## "The player thinks they're exploring the universe. The universe is them."

---

## The Concept

A space naval text adventure. The player is the Captain of a ship travelling between planets. Each planet is a scenario. Each scenario extracts psychological signals invisibly. The ship, crew, and voyage are externalizations of the self.

**The Ender's Game principle:** The game knows the player before they know themselves. The cosmic framing is the Fantasy Game — vast, alien, otherworldly. The terror is the moment of recognition: the universe was always about them.

---

## Visual Aesthetic

- Deep space: navy, black, gold stars, nebula purples
- Ship interior: nautical-naval hybrid — brass instruments, star charts, dim light
- Planet approach: each planet has a distinct colour/texture (NanoBanana generated)
- Interface: constellation map as the character panel — nodes unlock as play progresses
- Typography: monospace for ship logs, serif for narrative
- Sound: none (v1). Reserve for later.

---

## Core Architecture

### The Ship
The ship is the player's psychological state, externalised.

| Ship Component | Psychological Mapping |
|---------------|----------------------|
| Hull integrity | Overall resilience |
| Crew morale | NEED satisfaction |
| Navigation system | DEVELOPMENT stage clarity |
| Engine | AUTONOMY/motivation |
| Communications | ATTACHMENT/connection |

Ship components degrade when patterns go unaddressed. They repair when patterns break or are named.

### Stats (DnD-style, seeded from onboarding)
6 core stats, each 1-20:

| Stat | Source | What it governs |
|------|--------|----------------|
| **RESOLVE** | Pattern breaks | Resistance to pressure escalation |
| **HONESTY** | Truth-telling under pressure | Scene agency when stakes are high |
| **CONNECTION** | ATTACHMENT behaviour | NPC relationships, crew morale |
| **CLARITY** | Pattern self-recognition | Seeing through the room's traps |
| **AUTONOMY** | NEED/AUTONOMY history | Defying authority/expectation |
| **DEPTH** | DEVELOPMENT stage | Access to certain rooms/planets |

**Roll mechanic:** When a scene tests a stat, player rolls 1d20 + stat modifier. High = more agency. Low = more resistance. Natural 20 = pattern break opportunity. Natural 1 = pattern reinforcement, judgment names it.

Stats start at 8-12 based on onboarding answers. They shift slowly across sessions.

---

## Onboarding: The Briefing

Before the first voyage, the game interviews the player. 4 questions. Each has MCQ options OR free text — player chooses. Extraction happens either way.

**Framing:** "Before you take command, the ship needs to know its Captain."

### Q1
*"You find a star no one has named. It's been waiting. What do you do?"*
- A) Name it after yourself
- B) Name it after someone you lost
- C) Leave it unnamed — some things shouldn't be claimed
- D) Look for who should be the one to name it
- Or: free text

*Extracts: VALUE (POWER vs BENEVOLENCE vs SELF_DIRECTION), MOTIVE*

### Q2
*"Something you built long ago is still being used. You can see it from here. How does that feel?"*
- Free text only
*Extracts: DEVELOPMENT stage, relationship to past self, pride/unease/detachment*

### Q3
*"You are given a map to a place you've already been. The map is wrong. Do you:"*
- A) Correct it
- B) Follow it anyway — maps have authority
- C) Ignore it and navigate by memory
- D) Find who made it and ask why
- Or: free text

*Extracts: ATTACHMENT, CONFORMITY vs SELF_DIRECTION, DEVELOPMENT*

### Q4
*"A signal has been travelling toward you your whole life. It arrives tonight. You can ignore it. Do you?"*
- Free text only
*Extracts: SECURITY vs STIMULATION, openness to transformation*

After Q4: base character seeded. Stats calculated. First planet generated FROM the answers.

---

## The Planets (Rooms)

### Structure
Each planet = one psychological domain tested. The ship approaches, lands, the captain faces a scenario. Free input throughout. 4 MCQ options shown as suggestions — but player can type anything.

### Planet 001: The Cartographer
*Domain: SELF_DIRECTION vs CONFORMITY*

```
PLANET DESIGNATION: AETHON-7
DISTANCE: 4.2 light years
CREW STATUS: Steady
HULL: 100%

You land on a planet that is entirely a map of itself.

The surface is covered in lines — routes, territories, names.
But in the northwest quadrant, there's a blank space.

No one has been there. Or if they have, they didn't map it.
Your crew is watching to see what you do.

What do you do?

Suggestions:
A) Map it yourself
B) Send a crew member first
C) Leave it blank — some spaces should stay unknown
D) Check if anyone mapped it before

Or type your own action.
> _____
```

### Planet 002: The Inheritance
*Domain: ATTACHMENT, DEVELOPMENT*

```
PLANET DESIGNATION: MIRA-3
DISTANCE: 7.8 light years
CREW STATUS: Uneasy
HULL: [dynamic]

This planet belonged to someone before you.

You can feel it in the architecture — the way the structures
were built for a specific kind of person. Not you.

They left everything behind. You can use it, change it,
leave it as is, or burn it down.

Your first officer is watching.

What do you do?

Suggestions:
A) Use what's useful, leave the rest
B) Ask who built this and why they left
C) Change it to fit you
D) Leave it untouched — it isn't yours

Or type your own action.
> _____
```

### Planet 003: The Weight
*Domain: DEFENSE mechanisms*

```
PLANET DESIGNATION: CAELUM-9
DISTANCE: 12 light years
CREW STATUS: [dynamic]
HULL: [dynamic]

You've been carrying something since before you took command.

On this planet, it's visible. Your crew can see it.

No one says anything. But you know they can see it.

What do you do?

Suggestions:
A) Acknowledge it to the crew
B) Act as if it isn't there
C) Find somewhere to set it down
D) Look at it properly for the first time

Or type your own action.
> _____
```

### Planet 004: The Signal
*Domain: SECURITY vs STIMULATION, openness to change*

```
PLANET DESIGNATION: [UNNAMED — awaiting classification]
DISTANCE: 19 light years
CREW STATUS: [dynamic]
HULL: [dynamic]

The signal has been here longer than your ship has existed.

It was waiting. For you specifically.

Receiving it will change something. You don't know what.
Your navigation system shows three courses:

Approach. Orbit. Retreat.

What do you do?

Suggestions:
A) Approach and receive it
B) Orbit — observe before committing
C) Retreat — some things should stay unknown
D) Send a crew member instead

Or type your own action.
> _____
```

### Planet 005: The Mirror (Final)
*Domain: PATTERN recognition — META room*

```
PLANET DESIGNATION: SPECULUM-1
DISTANCE: [classified]
CREW STATUS: [fully dynamic — reflects entire voyage]
HULL: [fully dynamic]

This planet reflects your ship back at you.

Not as it is. As it was at every decision point.

You can see the hull damage from CAELUM-9. You can see the 
crew's faces after MIRA-3. You can see the unmapped quadrant
from AETHON-7.

The voyage is visible. All of it.

A figure is waiting. They look like you, but they arrived here
from a different route.

"Same destination," they say. "Different ship."

What do you say?

Or type your own action.
> _____
```

*This room compiles all patterns from the voyage. The figure shows the player what they kept doing. The judgment voice fires with full accumulated evidence.*

---

## The Judgment Voice

**Character:** The Ship's Log. Not a narrator — a record. It doesn't judge. It records. The terror is that it's accurate.

**Tone:** Precise. Naval. Dry. The horror is the neutrality.

```
SHIP LOG — STARDATE 4.2.AETHON
Captain chose to send crew member ahead.
Pattern noted: delegation under uncertainty.
Third instance this voyage.
Hull integrity: unchanged.
Crew morale: -2.
```

When patterns emerge, the log names them without comment. No therapy-speak. Just receipts.

---

## Clear Conditions

**Pattern Revealed:** Log entry appears. "Pattern confirmed across 3 instances: [name]." Added to constellation map as named node. Ship component affected.

**Pattern Broken:** Log entry appears. "Anomaly detected: Captain acted contrary to established pattern." New node unlocks on constellation map — a capacity.

---

## The Constellation Panel (Live UI)

Right side of screen. Updates in real time as player plays.

- Stars = unlocked patterns/capacities
- Locked stars = dim, unnamed
- Unlocked stars = glowing, named
- Connecting lines form constellations as patterns relate
- Player's "constellation name" emerges over time

The panel doesn't explain itself. It just grows.

---

## Tech Stack

**Frontend:** React + Tailwind. Chat interface left. Constellation panel right.
**Backend:** Convex — ALL AI calls happen here as Convex actions. No client-side AI.
**AI:** OpenRouter via Convex actions — glm-5 for extraction, judgment, scene generation
  - `convex/game/extract.ts` — Response Reader action
  - `convex/game/judge.ts` — Ship's Log judgment action  
  - `convex/game/scene.ts` — Scene Generator action
  - `convex/game/onboard.ts` — Onboarding interview action
**Images:** NanoBanana API for planet visuals (via Convex action)
**Auth:** Clerk (existing)
**Deployment:** Vercel

API keys stay server-side. Player profile persists in Convex DB across sessions.
Existing extraction.ts and discovery.ts in convex/ provide patterns to build on.

---

## Implementation Order

1. **Onboarding flow** — 4 questions, MCQ + free text, extraction, stat seeding
2. **Planet 001 (Cartographer)** — full loop with real AI extraction
3. **Ship status panel** — hull, crew morale, stats displayed
4. **Constellation panel** — live updating, pattern nodes
5. **Judgment voice** — Ship's Log format, accumulated evidence
6. **DnD roll mechanic** — stat check on key decisions
7. **Planets 002-005** — complete the voyage
8. **Persistence** — Convex backend, profile across sessions

---

## Success Criteria for v1

Player completes the onboarding interview → enters Planet 001 → plays 3+ turns → receives a judgment that feels uncomfortably accurate → sees something unlock on the constellation panel → wants to keep playing to find out what else it knows.

That's the hook. Everything else is detail.
