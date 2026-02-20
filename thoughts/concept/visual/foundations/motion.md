# Motion & Animation System

**Timing, easing, and animation principles for S.T.A.R.S.**

> *Source: Extracted from [Visual Design Architecture](../../../ideation/_deep_research/visual_design_architecture.md)*

---

## Core Principles

### 1. Purposeful

Every animation must serve a function:
- **Provide feedback** (confirm an action)
- **Guide attention** (direct focus)
- **Express brand** (create meaning)
- **Show relationships** (connect elements)

*If an animation doesn't do any of these, remove it.*

### 2. Calming, Not Stimulating

Motion should feel:
- ✓ Smooth and flowing, like breathing
- ✓ Gentle and organic, like nature
- ✗ Not jarring, flashy, or attention-demanding
- ✗ Not bouncy, springy, or hyperactive

### 3. Responsive, Not Intrusive

- Animations respond to user action immediately
- Never block interaction with unskippable animations
- Support `prefers-reduced-motion` preferences

### 4. Consistent

- Same types of actions have same animation treatment
- Timing and easing are consistent across similar elements
- Motion reinforces spatial model of the app

---

## Timing Tokens

| Token | Duration | Usage |
|-------|----------|-------|
| `instant` | 75ms | Micro-feedback (button press) |
| `fast` | 150ms | Simple state changes |
| `normal` | 250ms | Standard transitions |
| `slow` | 400ms | Complex transitions, emphasis |
| `slower` | 600ms | Major reveals, celebrations |
| `slowest` | 1000ms | Dramatic moments (use sparingly) |

---

## Easing Curves

| Token | CSS | Description | Usage |
|-------|-----|-------------|-------|
| `ease-default` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Standard easing | Page transitions, card expansions |
| `ease-in` | `cubic-bezier(0.4, 0.0, 1, 1)` | Accelerating (element leaving) | Elements exiting view, dismissals |
| `ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Decelerating (element entering) | Elements entering view, reveals |
| `ease-gentle` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Very smooth, almost linear | Progress bars, breathing animations |
| `ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Slight overshoot | Achievement celebrations only |

---

## Microinteractions

### Chat Interface

#### User Message Send
- **Trigger:** User taps send button
- **Animation:** Message bubble slides up from input
- **Duration:** 200ms
- **Easing:** ease-out
- **Details:**
  - Bubble fades in from 0.8 to 1 opacity
  - Translate Y: 20px → 0px
  - Send button: brief scale pulse (1.0 → 0.95 → 1.0)

#### AI Message Receive
- **Trigger:** AI response ready
- **Animation:** Typing indicator → Message reveal
- **Duration:** 300ms
- **Easing:** ease-out
- **Details:**
  - Typing indicator fades out (150ms)
  - Message fades in (0 → 1) and slides (10px → 0)
  - Stagger if multiple messages (100ms delay each)

#### Typing Indicator
- **Design:** Three dots in subtle wave pattern
- **Duration:** 1200ms loop
- **Color:** `sage-400`
- **Details:**
  - Dot 1: scale 1→1.2→1, opacity 0.5→1→0.5
  - Dot 2: same, 200ms delay
  - Dot 3: same, 400ms delay

---

### Star Interactions

#### Star Pulse (Ambient)
- **Duration:** 3-5s cycle
- **Easing:** ease-in-out
- **Details:**
  - Glow intensity: 0.8 → 1.0 → 0.8
  - Scale: 1.0 → 1.02 → 1.0

#### Star Hover
- **Duration:** 150ms
- **Easing:** ease-out
- **Details:**
  - Scale: 1.0 → 1.2 (spring anim)
  - Connected lines brighten
  - Glow intensifies
  - Optional: Tooltip/Label opacity 0 → 1

#### Star Discovery (Spawn)
- **Total Duration:** 800-1200ms
- **Sequence:**
  1. Point of light appears, tiny
  2. Grows to full star size (1-2 seconds)
  3. Glow expands
  4. If connected to existing star, line draws
  5. Subtle ripple effect through nearby stars

---

### Connection Lines

#### Connection Shimmer
- **Duration:** 2-4s cycle
- **Easing:** linear
- **Effect:** Traveling pulse of brightness along the line

#### Connection Draw (Growth)
- **Duration:** 600-1000ms
- **Easing:** ease-in-out
- **Details:**
  - `uGrowth` uniform: 0.0 → 1.0
  - Thickness tapers at head (growth tip brighter)
  - Organic jitter via noise texture

---

### Loading States

**Never:** Spinning wheel—too urgent, too generic.

**Instead:**
- Use flickering star as loading indicator (on-brand, calming)
- Skeleton screens for content areas (faint outlines of what's coming)
- Breathing glow, slow pulse

```
Instead of:  ⟳ Loading...

Show:        ✦ (breathing glow, slow pulse)
             "Watching patterns form..."
```

---

### Screen Transitions

#### Panel Slides
- **Duration:** 300-400ms
- **Easing:** ease-out
- **Direction:** From bottom (mobile), from right (modals)

#### View Transitions
- **Duration:** 250-300ms
- **Effect:** Crossfade with subtle scale (0.98 → 1.0)

---

## Key Moments

### Insight Reveal

**Total Duration:** ~1200ms

This is one of the most important animations—should feel like an "unveiling."

**Sequence:**
1. **Phase 1: Preparation (0-300ms)**
   - Background dims slightly (overlay fades to 10% opacity)
   - Chat interface slides up or fades to 50% opacity
   - Creates focus on reveal area

2. **Phase 2: Container Entry (300-600ms)**
   - Insight card scales from 0.95 → 1.0
   - Card fades from 0 → 1
   - Subtle box-shadow expands (0 → 24px blur)
   - Easing: ease-out

3. **Phase 3: Content Reveal (600-1000ms)**
   - Headline text fades in and slides up (opacity 0→1, Y: 15→0)
   - After 100ms delay: body text same treatment
   - After 200ms delay: any supporting elements
   - Easing: ease-gentle

4. **Phase 4: Glow Pulse (1000-1200ms)** — optional for major insights
   - Soft glow around card border (`insight-light` color)
   - Pulses once: 0 → 8px → 0 blur
   - Creates "significance" feeling

### Birth Chart Reveal (Day 7)

**Total Duration:** 30-45 seconds

The most important visual moment in the entire product.

**Sequence:**
1. Screen goes full black
2. Stars begin appearing one by one, with soft "ping" sound
3. Each star emerges where it was earned over 7 days
4. Connections draw between them, bezier curves flowing
5. Camera slowly pulls back
6. Full constellation visible
7. TARS begins narration

**Feel:** Revelation, recognition, "there I am"

---

## Celebration Without Gamification

| Not This | This |
|----------|------|
| Confetti explosion | Soft glow expansion |
| Achievement popup | Star brightens, TARS acknowledges |
| Sound effect fanfare | Single soft chime |
| "LEVEL UP!" | "You're entering EMERGING phase" |

*The celebration is in the seeing, not the fireworks.*

---

## Reduced Motion Support

When `prefers-reduced-motion: reduce`:
- Disable parallax/camera sway
- Replace animations with instant state changes or crossfades
- Keep essential feedback (e.g., button press acknowledgment)
- Disable ambient loops (star pulse, connection shimmer)

---

*"Motion in S.T.A.R.S. should feel like watching the night sky—slow, natural, inevitable."*
