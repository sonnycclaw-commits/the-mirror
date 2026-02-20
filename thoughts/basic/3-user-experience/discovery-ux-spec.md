# TRQ Discovery UX Spec

*Everything an engineer needs to build the discovery flow.*

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        DISCOVERY FLOW                        │
├──────────────┬──────────────────┬──────────────┬────────────┤
│   SCENARIOS  │   FOLLOW-UPS     │  REFLECTION  │  CONTRACT  │
│  (buttons)   │  (conversation)  │   (mirror)   │  (output)  │
├──────────────┼──────────────────┼──────────────┼────────────┤
│  8-12 cards  │  2-3 deep dives  │  1 synthesis │  1 screen  │
│  ~3 min      │  ~8 min          │  ~2 min      │  ~2 min    │
└──────────────┴──────────────────┴──────────────┴────────────┘
                         Total: ~15 min
```

---

## Phase 1: Scenarios

### Interaction Model

- User sees scenario card with 3-5 options
- Taps one option
- Brief TARS acknowledgment (streaming, 1-2 sentences)
- Next scenario appears
- 8-12 scenarios total

### Card Structure

```typescript
interface ScenarioCard {
  id: string;
  situation: string;       // The moment ("6pm. Boss texts.")
  options: ScenarioOption[];
  category: 'boundaries' | 'time' | 'relationships' | 'identity';
}

interface ScenarioOption {
  id: string;
  label: string;           // Short ("Cancel on Sarah")
  subtext?: string;        // Honest aside ("Work first.")
  signals: Signal[];       // What this choice reveals
}

interface Signal {
  dimension: 'pattern' | 'approach' | 'locus' | 'values';
  pole: string;            // e.g., "people-pleasing", "avoidance"
  weight: number;          // 0.0 - 1.0
}
```

### TARS Acknowledgments

Brief. No praise. Just recognition.

| Choice Type | Response Pattern |
|-------------|------------------|
| Self-aware bad | "Yeah. That one's familiar." |
| Aspirational | "That's the version you want to be." |
| Honest struggle | "Hard one. No wrong answer." |
| Avoidance | "The phone is an exit door." |

---

## Phase 2: Follow-Ups

After specific scenario choices, TARS goes deeper.

### Trigger Rules

- Pick 2-3 scenarios with strongest signals
- Priority: choices that reveal conflict or avoidance
- Never more than 3 follow-up conversations

### Conversation Structure

```
TARS: [Opening question - specific to their choice]
USER: [Free text response]
TARS: [Reflection + deeper question]
USER: [Free text response]
TARS: [Pattern naming, no judgment]
→ Return to next scenario OR move to reflection
```

### Question Types

| Type | Example |
|------|---------|
| The unsaid | "What's the sentence you're afraid to say?" |
| The underneath | "What's underneath that?" |
| The awareness | "Did you know you were doing that?" |
| The stakes | "What would you have to accept if it doesn't work?" |
| The trade | "You're trading X for Y. Did you know?" |

### TARS Voice Rules

- Short sentences
- No "I understand" or "That makes sense"
- Questions land, then silence
- Reflects their words back, doesn't paraphrase into therapy-speak
- Occasionally wry: "That's interesting. Not wrong — interesting."

---

## Phase 3: Reflection

One screen. TARS synthesizes what the choices revealed.

### Structure

```
THE PATTERN
What you actually do.

THE ANTI-PATTERN
What you wish you did.

THE VISION
What you're moving toward.

THE ANTI-VISION
What you're running from.

THE TRADE-OFF
What something has to give.
```

### Generation Rules

- Use exact phrases from their scenario choices
- Use actual quotes from follow-up conversations
- Maximum 2-3 sentences per section
- End with: "Ready to make it concrete?"

---

## Phase 4: Contract

The output. What they leave with.

### Contract Schema

```typescript
interface MomentumContract {
  objective: string;           // Clear, measurable
  timeframe: string;           // "in 6 months"
  milestones: Milestone[];     // 3-5 sequential steps
  constraints: string[];       // Their real limitations
  tradeoffs: Tradeoff[];       // What they chose to sacrifice
  spark: Spark;                // Immediate action
}

interface Tradeoff {
  chose: string;               // "Speed"
  over: string;                // "Quality"
  reason: string;              // Their words
}

interface Spark {
  action: string;              // Specific, doable now
  duration: string;            // "5 minutes"
  connection: string;          // Links to milestone 1
}
```

### Spark Rules

- Under 15 minutes
- No dependencies (can do right now)
- Verifiable (you know if you did it)
- Connected to first milestone

---

## Visual Design

### Palette

| Element | Color |
|---------|-------|
| Background | Deep slate (#0f172a) |
| Card surface | Slate 800 (#1e293b) |
| Primary text | Slate 100 (#f1f5f9) |
| Secondary text | Slate 400 (#94a3b8) |
| Accent | Amber 400 (#fbbf24) |
| TARS text | Slate 200, slightly warm |

### Typography

- Headings: Inter 600
- Body: Inter 400
- TARS streaming: Inter 400, letter-spacing slightly loose

### Animation

- Card appear: 150ms fade + 10px slide up
- Option select: 100ms background/border transition
- TARS streaming: ~35 words/sec
- `prefers-reduced-motion`: instant, no animation

---

## Mobile Considerations

- Touch targets: min 44px
- Scenario options: full-width cards, stacked
- Follow-up input: fixed bottom, keyboard-aware
- Contract: scrollable, export buttons sticky

---

## Error States

| Error | Message | Action |
|-------|---------|--------|
| Network lost | "Connection lost. Reconnecting..." | Auto-retry |
| AI timeout (>5s) | "Still thinking..." | Retry button at 15s |
| AI failed | "Something went wrong. Progress saved." | Retry |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Scenario completion | >80% complete all |
| Follow-up engagement | Avg 2+ messages per conversation |
| Contract generation | >70% reach contract |
| Spark commitment | >50% commit to "now" |
| Time to complete | 12-18 minutes |
