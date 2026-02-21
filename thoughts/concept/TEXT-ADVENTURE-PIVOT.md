# The Mirror: Text Adventure Pivot

**Date:** 2026-02-20
**Status:** Concept exploration
**Author:** Joel + Sonny

---

## The Core Idea

**Self-work as interactive fiction. Psychology as explorable terrain.**

Not "tell me your problems." Instead: "Here's a room. What do you do?"

The Mirror becomes a text adventure game where:
- Each room is a psychological scenario
- Each choice extracts signals automatically
- Each branch reveals more of your psyche map
- Hidden doors unlock through specific triggers (contradiction, enlightenment)

---

## The Hook

```
THE MIRROR

You wake up on a Tuesday. Your phone buzzes.

It's work. Subject: "Need this by EOD."

> check email
> ignore it  
> throw phone across room
> [do something else]: _____

> throw phone across room

The phone hits the wall. Cracks. Silence.

You feel... something. What is it?

> relief
> guilt
> panic
> nothing

> relief

RELIEF noted. This is the third time this week you've chosen 
distance over obligation.

A path opens. The phone lies cracked on the floor. Your partner 
stirs in the other room.

> pick up phone
> go back to sleep
> walk out the door
```

---

## Why This Works

### Original Problem
- Day 1-7: High engagement (Mirror excavation)
- Day 8+: "Cool, I have a contract. Now what?"
- Week 3: Forgot the app exists
- Requires active journaling = friction

### Text Adventure Solution
- **No journaling** — You're playing, not reporting
- **Extraction is invisible** — Choices are the data
- **Replayability** — "What if I'd chosen differently?"
- **Completion drive** — "4 nodes hidden"
- **Shareable maps** — Each person's tree is unique

---

## Mechanics

### Choice → Extraction → Node State

```
User chooses "throw phone"
     ↓
AI extracts: VALUE=SELF_DIRECTION, DEFENSE=DISPLACEMENT, PATTERN=conflict_avoidance
     ↓
Node unlocks: "Boundary Violence" (first step past compliance)
     ↓
Next room offers choices that test this pattern further
```

### The Player Sees
- Story branches
- "New path available"
- Inventory: "Self-knowledge fragments: 12"

### The System Tracks
- Brightness per node (how often this pattern fires)
- Branch completion (how deep into each psychological path)
- Locked nodes (parts of self not yet accessed)

---

## The Map

```
┌─────────────────────────────────────────────┐
│ YOUR PSYCHE MAP                             │
├─────────────────────────────────────────────┤
│                                             │
│  ██ COMPLIANCE CORRIDOR (explored)         │
│     └── Door 1: Say yes                    │
│     └── Door 2: Apologize                  │
│     └── Door 3: Over-explain ✓             │
│                                             │
│  ░░ BOUNDARY WILDS (locked)                │
│     Requires: Disobey once                 │
│                                             │
│  ██ THE CRACKED PHONE (current)            │
│     Relief path: ACTIVE                    │
│     Guilt path: AVAILABLE                  │
│     Panic path: AVAILABLE                  │
│                                             │
│  ?? UNKNOWN TERRITORY (4 nodes hidden)     │
│                                             │
└─────────────────────────────────────────────┘
```

### Hidden Doors

Specific triggers unlock hidden worlds:

| Trigger | What Opens |
|---------|-----------|
| **Contradiction detected** | The Shadowlands — where your stated values clash with your actions |
| **Enlightenment moment** | The Clearing — a room with no choices, just stillness |
| **Pattern break** | New branch appears on map |
| **Dark star accumulation** | The Descent — rooms get harder, choices more revealing |
| **Slingshot velocity** | Shortcut paths open |

---

## Visual Layer (NanoBanana)

Each room gets an AI-generated image:

```
┌─────────────────────────────────────────────┐
│ [AI-GENERATED: Cracked phone on floor]     │
│                                             │
│ THE CRACKED PHONE                           │
│                                             │
│ The phone lies silent. Your partner         │
│ stirs in the other room.                    │
│                                             │
│ > pick up phone                             │
│ > go back to sleep                          │
│ > walk out the door                         │
└─────────────────────────────────────────────┘
```

### Visual Strategy
- Core scenarios: Pre-generated (50 rooms)
- Deep branches: Dynamic generation on first visit
- Each playthrough: Unique visual signature
- Shareable: "This is my current room"

---

## The Grind

From Joel: *"You can't reveal too much. Make it a grind. Rewarding but a grind. Hidden worlds behind doors if you ask something — contradiction, enlightenment."*

### How the Grind Works

**Nodes have brightness:**
- 0.1 = NASCENT (you've seen it)
- 0.3 = FLICKERING (you're practicing)
- 0.5 = STABLE (it's landing)
- 0.7 = BRIGHT (it's becoming automatic)
- 0.9 = LUMINOUS (it's you)

**Brightness requires:**
- Multiple visits to the same choice type
- Consistent pattern over time
- No shortcuts — you can't fake it

**Decay applies:**
- Stop playing? Stars fade
- Inconsistent choices? Progress stalls
- The tree reflects actual behavior, not intentions

### Hidden Content Philosophy

Like old RPGs:
- You can see the locked door
- You know something's behind it
- You don't know what until you earn it
- The grind IS the transformation

---

## Integration with Existing Schema

### Extraction (Already Built)

The Mirror already extracts:
- **VALUES** (Schwartz): POWER, ACHIEVEMENT, SELF_DIRECTION, etc.
- **NEEDS** (SDT): AUTONOMY, COMPETENCE, RELATEDNESS (satisfied/frustrated)
- **MOTIVES** (McClelland): ACHIEVEMENT, POWER, AFFILIATION
- **DEFENSES** (Vaillant): DENIAL, RATIONALIZATION, SUBLIMATION, etc.
- **ATTACHMENT** (Bowlby): SECURE, ANXIOUS, AVOIDANT, DISORGANIZED
- **DEVELOPMENT** (Kegan): SOCIALIZED, SELF_AUTHORING, SELF_TRANSFORMING

### New Domain: GROWTH

May need new extraction domain for progression tracking:
- **INTEGRATION** — Pattern acknowledged and worked with
- **EMBODIMENT** — Pattern becoming automatic
- **TRANSCENDENCE** — Pattern no longer runs the show

---

## Architecture Changes

### What Stays
- 4-phase discovery flow
- Signal extraction schema
- Convex backend
- Phase machine
- Prompt builder

### What Changes
- UI: Chat interface → Text adventure interface
- Input: Open-ended questions → Choice trees
- Progress: Linear excavation → Explorable map
- Visuals: Text only → AI-generated rooms
- Engagement: Single playthrough → Replayable exploration

### New Components Needed
1. **Choice Engine** — Branches based on psychological domains
2. **Map Renderer** — Visual representation of psyche terrain
3. **Hidden Door Logic** — Trigger detection and unlock system
4. **Image Generation Pipeline** — NanoBanana integration
5. **Progress Persistence** — Node brightness, branch completion

---

## MVP Scope

### Phase 1: Core Loop
- [ ] 5-10 core scenarios with choice trees
- [ ] Basic extraction from choices
- [ ] Simple map showing explored/unexplored
- [ ] 2-3 hidden doors with triggers

### Phase 2: Visual Layer
- [ ] NanoBanana integration
- [ ] Pre-generated core room images
- [ ] Dynamic generation for branches

### Phase 3: Depth
- [ ] Full choice tree for 50+ scenarios
- [ ] Multiple endings
- [ ] "Path not taken" exploration
- [ ] Shareable maps

---

## The Edge

**Every self-help app is a tool. This is a world. Your world. Built from your choices.**

The moat:
- Extraction is the engine
- Adventure is the interface
- The grind is the transformation
- The map is the product

---

## Open Questions

1. **Scenario design** — How do we write scenarios that map to all 7 psychological domains?
2. **Branch depth** — How deep should choice trees go before forcing synthesis?
3. **Hidden triggers** — What specific patterns unlock hidden doors?
4. **Visual consistency** — How do we ensure AI-generated images feel cohesive?
5. **Replay value** — What brings users back after first playthrough?

---

## Next Steps

1. Write 5-10 core scenarios with branching choices
2. Map choices to extraction targets
3. Prototype choice engine
4. Test NanoBanana for room generation
5. Validate: Is this actually fun?

---

*Self-work as dungeon crawl. Your psyche as the map. The treasure is you.*
