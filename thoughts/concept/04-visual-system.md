# The Visual System — Stars, Sky, Becoming

**The product isn't the data. The product is watching your constellation form.**

---

## Design Principles

Before pixels: the principles that make the night sky feel safe.

### Trust Through Calm
Users access this during vulnerable moments. The interface should be a calming counterpoint to stress — not adding to it. This means:
- **Whitespace as breathing room** — generous negative space reduces cognitive load
- **Soft, organic shapes** — no sharp corners, 12-24px border radius everywhere
- **Gentle motion** — nothing jarring, nothing urgent
- **Night over day** — darkness creates space for emergence

### Accessibility as Care
Designing for all abilities demonstrates that we see all users.
- **WCAG 2.1 AA compliance** — minimum 4.5:1 contrast ratio for text
- **Dynamic type support** — text scales up to 200% without breaking layout
- **Color not sole indicator** — icons and labels supplement color meaning
- **Screen reader support** — all interactive elements labeled

### Transparency as Respect
Users trust us with their inner world. We honor that.
- **No dark patterns** — what you see is what you get
- **Data clarity** — obvious what we're capturing, why, where it goes
- **User control** — export, delete, pause at any time

*Reference: High-Trust UI/UX Research (visual_design_research.md)*

---

## The Night Sky

The entire experience lives in darkness.

Not depressing darkness — night sky darkness. The kind where stars become visible. The kind that makes space for emergence.

```
Background: #121822 → #2D3A4F gradient
Texture: Subtle noise for depth
Overlays: Soft nebula clouds at 20% opacity
Feel: Immersive, calm, infinite
```

---

## The Polar Star Map

Your constellation lives on a polar coordinate system:

```
                    ☆ PURPOSE (90°)
                   /|\
                  / | \
                 /  |  \
    CAREER ☆────────┼────────☆ SOUL
    (180°)       \  |  /       (0°)
                  \ | /
                   \|/
                    ☆
              RELATIONSHIPS (270°)
                    |
                    ☆
               HEALTH (315°)
```

- **θ (angle)** = Life domain — where the star lives
- **r (radius)** = Time — center is now, outer is future
- **Position** = Specific location tells its own story

A star near the center is present. A star at the edge is aspirational or feared.

---

## The Stars

### ☆ BRIGHT STAR
**What it means:** Verified strength, proven through action
**Visual:** Gold-coral center (#E07A5F), warm diffuse glow halo
**Size:** 24-32px at 1x
**Animation:** Gentle pulse, steady

```css
.bright-star {
  background: radial-gradient(#E07A5F, transparent);
  box-shadow: 0 0 20px rgba(224, 122, 95, 0.6);
  animation: pulse 4s ease-in-out infinite;
}
```

### ✧ DIM STAR
**What it means:** Shadow aspect, inviting integration
**Visual:** Muted gray-blue (#8A96AB), barely visible glow
**Size:** 18-24px
**Animation:** Slow fade in/out

Not ominous. Not shameful. Just waiting to be seen.

### ✦ FLICKERING STAR
**What it means:** Emerging potential, not yet stable
**Visual:** Sage green (#6B9080) with gold hints, uneven glow
**Size:** 20-28px
**Animation:** Irregular flicker, varying intensity

Something is forming here. The flicker communicates uncertainty — not instability, but becoming.

### ● DARK STAR
**What it means:** Gravity well, pattern pulling away from vision
**Visual:** Deep purple-black center, subtle dark aura
**Size:** 20-30px
**Animation:** Slow rotation, pulling effect on nearby stars

Not evil. Not dramatic. Just honest about what's happening. Dark stars don't glow — they pull.

---

## The Connections

Lines between stars show relationships.

### Strong Connection
**Visual:** Bright luminous line (#B1B9C7) with glow
**Curve:** Bezier, never straight
**Animation:** Gentle shimmer

```
☆═══════════☆
  (strong)
```

### Emerging Connection
**Visual:** Dashed or dotted, hopeful
**Curve:** Gentle arc
**Animation:** Dots slowly filling in

```
☆ · · · · · ✦
 (emerging)
```

### Fading Connection
**Visual:** Dim, thin, barely visible
**Curve:** Straight-ish (less energy)
**Animation:** Slow fade

```
☆-----------✧
  (fading)
```

---

## The Phases

Visual evolution as constellation develops:

### SCATTERED
```
            ·
     ·
                 ✧
         ·              ·
    ·
                    ●
```
Stars appear randomly. No connections. Raw material.

**Visual treatment:** Stars small, dim, spread far apart. Background darker. Sense of isolation.

### CONNECTING
```
            ·
     ·──────────✧
                 |
         ·───────┘     ·
    ·
                    ●
```
Lines begin forming. Clusters emerging. Pattern hints.

**Visual treatment:** First connections draw with animation. Stars slightly brighter. Background warms slightly.

### EMERGING
```
        ☆────✦
       / \    \
      /   \    \
     ✧─────●────☆
           |
           ✦
```
Clear shape forming. Identity visible.

**Visual treatment:** Constellation has recognizable form. Bright stars prominent. Dark stars visible but contained.

### LUMINOUS
```
    ☆═══════╗
    ║       ║
    ☆══✦════☆
    ║   ║   ║
    ╚═══☆═══╝
```
Blazing with clarity. Not perfect — luminous.

**Visual treatment:** Strong connections, bright stars dominate, dark stars integrated (smaller, dimmer). Subtle glow around entire constellation.

---

## Key Moments

### Birth Chart Reveal (Day 7)

The most important visual moment.

**The Animation:**
1. Screen goes full black
2. Stars begin appearing one by one, with soft "ping" sound
3. Each star emerges where it was earned over 7 days
4. Connections draw between them, bezier curves flowing
5. Camera slowly pulls back
6. Full constellation visible
7. TARS begins narration

**Duration:** 30-45 seconds
**Feel:** Revelation, recognition, "there I am"

### Star Discovery

When a new insight creates a new star.

**The Animation:**
1. Point of light appears, tiny
2. Grows to full star size (1-2 seconds)
3. Glow expands
4. If connected to existing star, line draws
5. Subtle ripple effect through nearby stars

**Feel:** Small but meaningful. Something just became visible.

### Phase Transition

When user advances to a new phase.

**The Animation:**
1. Current constellation brightens
2. New connections draw simultaneously
3. Constellation "settles" into new form
4. Subtle celebration — not fireworks, more like dawn breaking
5. TARS acknowledges

**Feel:** Milestone without gamification. Becoming, not leveling up.

### Dark Star Confrontation

When user engages with a dark star directly.

**The Animation:**
1. Tap dark star
2. Surrounding stars dim
3. Dark star enlarges slightly
4. Pulsing aura appears
5. Space opens for conversation

**Feel:** Not scary. Important. "Let's look at this together."

---

## Motion Principles

Animation in S.T.A.R.S. should feel like watching the night sky — slow, natural, inevitable.

### Timing

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| **Microinteractions** (tap feedback, button states) | 150-300ms | ease-out |
| **Star pulse** | 3-5s cycle | ease-in-out |
| **Connection shimmer** | 2-4s cycle | linear |
| **Star appearance** | 800-1200ms | ease-out |
| **Connection drawing** | 600-1000ms | ease-in-out |
| **Panel slides** | 300-400ms | ease-out |
| **Birth Chart reveal** | 30-45s total | choreographed |

### Principles

- **Natural motion** — use easing that mimics physics, never linear except for ambient loops
- **Purposeful, not decorative** — every animation communicates something
- **Interruptible** — user can tap through or skip if needed
- **Performance-first** — 60fps minimum, optimize for lower-end devices

### Loading States

When the system is thinking:

```
Instead of:  ⟳ Loading...

Show:        ✦ (breathing glow, slow pulse)
             "Watching patterns form..."
```

- Use the flickering star as a loading indicator — on-brand, calming
- Skeleton screens for content areas (faint outlines of what's coming)
- Never a spinning wheel — too urgent, too generic

### Celebration Without Gamification

When something good happens (new bright star, phase transition):

| Not This | This |
|----------|------|
| Confetti explosion | Soft glow expansion |
| Achievement popup | Star brightens, TARS acknowledges |
| Sound effect fanfare | Single soft chime |
| "LEVEL UP!" | "You're entering EMERGING phase" |

The celebration is in the *seeing*, not the fireworks.

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Deep Twilight** | #2D3A4F | Headers, primary brand |
| **Soft Sage** | #6B9080 | Growth, progress, flickering stars |
| **Warm Coral** | #E07A5F | Bright stars, CTAs, energy |
| **Dawn Cream** | #FAF8F5 | Light text on dark |
| **Dark Night** | #121822 | Background base |
| **Dim Gray** | #8A96AB | Dim stars, secondary text |
| **Deep Purple** | #1E1B2E | Dark stars |

---

## Typography

### System Typography

| Element | Font | Size | Weight | Notes |
|---------|------|------|--------|-------|
| **Body text** | Inter or SF Pro | 16-18px | 400 | High readability, generous line-height (1.5) |
| **TARS voice** | Same as body | 16-18px | 400 | Consistency with conversation |
| **Star labels** | Inter | 12px | 500 | All caps, letter-spacing: 0.1em |
| **Domain axes** | Inter | 14px | 600 | Uppercase, 60% opacity |
| **Phase names** | Inter | 20px | 600 | Small caps feel |
| **Headlines** | Inter | 24-32px | 600 | Sparse use |

### Star Map Labels

Labels appear near domain axes:

```
                PURPOSE
                  ↑
                  |
    CAREER ←——————┼——————→ SOUL
                  |
                  ↓
             RELATIONSHIPS
```

**Opacity:** 60% — visible but not competing with stars
**Position:** Outside the active constellation area

### Accessibility

- Minimum text size: 14px (12px only for tertiary labels)
- Dynamic type: Layout survives 200% scaling
- Contrast: All text meets 4.5:1 against background
- Line length: 45-75 characters for readability

---

## Interaction States

### Tap a Star
- Star enlarges 20%
- Glow intensifies
- Connected lines brighten
- Info panel slides up with star's story

### Pinch to Zoom
- Constellation scales
- More detail visible at zoom
- Individual star labels appear

### Drag to Rotate
- Map rotates around center (now)
- Different domains come into focus
- Connections redraw as perspective shifts

---

## The Anti-Pattern

What we're NOT doing:

| Common Pattern | Our Approach |
|----------------|--------------|
| Dashboard with charts | Night sky with stars |
| Progress bars | Constellation phases |
| Achievement badges | Brighter stars |
| Points/XP | Nothing. Just the sky. |
| Bright colorful UI | Dark, calm, night |
| Gamified celebrations | Quiet recognition |

---

## Inspirations

What we learned from and how we diverge:

### Headspace
**What we take:** Soft, organic shapes. Metaphorical representation of abstract concepts. Making the intangible feel approachable. Calm, purposeful illustration style.

**How we differ:** They use bright, playful colors and quirky characters. We use night sky darkness and stars. They're daytime energy. We're nighttime introspection.

### Star Walk / Stellarium
**What we take:** Night sky as canvas. Star rendering with glow effects. Pinch-zoom-rotate interaction model.

**How we differ:** They show real astronomy. We show inner astronomy. Their stars are fixed. Ours form based on who you are.

### Path of Exile Skill Tree
**What we take:** Dense interconnection. Zoom levels revealing detail. Sense of vast possibility.

**How we differ:** They're about power acquisition. We're about self-understanding. They're competitive. We're introspective.

### Duolingo (Anti-Inspiration)
**What we avoid:** XP, streaks, leaderboards, gamified dopamine loops. Competitive pressure. Loss-aversion tactics.

**What we respect:** Clear progress visualization. The skill tree concept (adapted as constellation phases).

---

## Research Foundation

This visual system draws from:
- **High-Trust UI/UX Research** (`_deep_research/visual_design_research.md`) — trust principles, color psychology, microinteraction best practices
- **Artist Brief** (`visual/artist-brief.md`) — star types, color palette, key moments
- **Headspace Case Study** — emotion-driven design, metaphorical illustration
- **WCAG 2.1 Guidelines** — accessibility standards

---

*"The visual system isn't decoration. It's the experience. You're not looking at data. You're watching yourself become."*
