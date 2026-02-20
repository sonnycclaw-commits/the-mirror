# S.T.A.R.S. Visual Design Brief

**Project:** S.T.A.R.S. (Self-Tracking & Alignment Roadmap System)
**Type:** Mobile app for personal transformation
**Deliverable:** Style reference samples for AI model training

---

## Executive Summary

We're building a mobile app that visualizes personal growth as a **constellation forming in the night sky**. Users discover patterns about themselves through psychological excavation, and these insights appear as stars that connect over time to form their unique constellation.

**The core metaphor:** You are a star forming. Each insight lights a new point. Patterns emerge.

**We need 15-20 reference samples** that establish a consistent visual language. These will be used to:
1. Train a custom AI model (Layer/Scenario) for asset generation
2. Guide implementation development
3. Serve as the foundation for the full design system

---

## Project Context

### What the App Does
- **Day 1-7:** "The Mirror" - psychological excavation that generates a personal "Birth Chart"
- **Day 8+:** "The Walk" - daily rituals, goal tracking, and AI companion (TARS) guidance
- **Ongoing:** Stars light up as users gain insights, forming their unique constellation

### Core Visualization: The Polar Star Map
- **θ (angle)** = Life domains (Career, Health, Relationships, Purpose, Soul)
- **r (radius)** = Time (center = now, outer = future)
- Stars represent insights, achievements, and patterns
- Lines connect related stars, showing relationships

### The Emotional Arc
Users should feel:
- **Discovered** - "This system sees me"
- **Curious** - "What pattern am I forming?"
- **Empowered** - "I'm in control of my transformation"
- **Not judged** - Shadow aspects are invitations, not failures

---

## Brand Personality

### Voice & Tone
| Do | Don't |
|-----|-------|
| Calm but not sleepy | Overly gamified |
| Professional but not cold | Clinical/medical |
| Encouraging but not patronizing | Preachy |
| Playful but not childish | Cutesy |
| Mystical but not fantasy | Woo-woo spiritual |

### Positioning
```
Clinical/Cold ◄─────────────────► Overly Gamified
                      │
              ┌───────┴───────┐
              │  S.T.A.R.S.   │
              │  SWEET SPOT   │
              └───────────────┘
               (lean warm)
```

---

## Color System

### Primary Palette (Required)

| Name | Hex | Usage | Feeling |
|------|-----|-------|---------|
| **Deep Twilight** | #2D3A4F | Primary brand, headers | Wisdom, depth, trust |
| **Soft Sage** | #6B9080 | Growth elements, progress | Balance, nature, calm |
| **Warm Coral** | #E07A5F | CTAs, highlights, energy | Warmth, action, encouragement |
| **Dawn Cream** | #FAF8F5 | Light backgrounds | Safety, openness |
| **Dark Night** | #121822 | Dark mode background | Night sky immersion |

### Star Colors

| Star Type | Color Treatment |
|-----------|-----------------|
| **Bright Star** (proven strength) | Gold/coral center, warm glow halo |
| **Dim Star** (shadow aspect) | Muted gray-blue (#8A96AB), subtle glow |
| **Flickering Star** (emerging) | Sage green (#6B9080) with gold hints |
| **Dark Star** (gravity well) | Deep purple-black, subtle dark aura |

### Connection Lines
- Primary: Twilight-200 (#B1B9C7) with subtle glow
- Strong connections: Brighter, thicker
- Weak/fading: Dimmer, thinner

---

## Design DNA

| Element | Character | Implementation |
|---------|-----------|----------------|
| Shapes | Soft, organic | No sharp corners, 12-24px border radius |
| Lines | Flowing curves | Bezier curves, hand-drawn feel |
| Density | Spacious, breathing | Generous whitespace, not cramped |
| Motion | Smooth, purposeful | 200-400ms transitions, natural easing |
| Glow | Ethereal, soft | Diffuse halos, not harsh |

---

## Deliverables Requested

### SET 1: Star Sprites (5-8 samples)

**S1.1 Bright Star**
- Represents: Proven strength, achieved insight
- Visual: Warm golden center, soft coral/gold glow halo
- Size: ~24-32px at 1x
- Feel: Confident, warm, achieved

**S1.2 Dim Star**
- Represents: Shadow aspect needing integration
- Visual: Muted gray-blue, barely visible glow
- Feel: Inviting not ominous, honest not scary

**S1.3 Flickering Star**
- Represents: Emerging insight, not yet stable
- Visual: Sage green with gold hints, uneven glow
- Feel: Hopeful, in-progress, potential

**S1.4 Dark Star**
- Represents: Gravity well, pattern pulling away from goals
- Visual: Deep purple-black center, subtle dark aura
- Feel: Honest about difficulty, not evil or dramatic

**S1.5-S1.8 Size/Intensity Variations**
- Same star types at different sizes (small, medium, large)
- Different intensity levels within type

**Technical specs:**
- Format: PNG with transparency
- Resolution: 3x for mobile (@1x, @2x, @3x)
- Consistent visual language across all

---

### SET 2: Backgrounds (3-5 samples)

**S2.1 Deep Space Base**
- Pure dark gradient (#121822 → #2D3A4F)
- Very subtle noise texture for depth
- Tileable
- For: Base app background

**S2.2 Subtle Nebula Overlay**
- Soft purple/blue cosmic cloud texture
- Low opacity (~20-30%), for layering
- Tileable
- For: Adding depth without distraction

**S2.3 Star Field Sparse**
- Few bright distant stars scattered
- Very subtle, ambient
- For: Macro/zoomed-out view

**S2.4 Star Field Dense**
- Many dim stars
- Richer texture
- For: Micro/zoomed-in view

**Technical specs:**
- Format: PNG
- Resolution: High enough for mobile (1440x3040px)
- Must be tileable where noted

---

### SET 3: Connection Lines (3-5 samples)

**S3.1 Strong Connection**
- Bright luminous line with glow
- Bezier curve, not straight
- For: Established patterns

**S3.2 Weak/Fading Connection**
- Dim, thin, subtle
- For: Weakening relationships

**S3.3 Emerging Connection**
- Dashed or dotted, hopeful
- For: Potential patterns forming

**Technical specs:**
- Format: PNG with transparency OR stroke style guide
- Show curves at different angles

---

### SET 4: UI Elements (5-7 samples)

**S4.1 Card Container**
- Rounded corners, soft edge
- Works on dark background
- Subtle border or glow

**S4.2 Domain Labels**
- Typography treatment for "Health", "Purpose", etc.
- Positioned at angles around polar axis

**S4.3 Touch Highlight State**
- What happens when user taps a star
- Soft expansion, glow increase

**S4.4 Modal/Overlay Background**
- Translucent dark layer
- For: Chat overlay, detail views

**S4.5 Progress Indicator**
- Sage green fill
- For: Phase progress, daily completion

**Technical specs:**
- Format: PNG or Figma components
- Dark mode only (we're dark-first)

---

### SET 5: Key Moments (2-3 samples)

**S5.1 Birth Chart Reveal**
- The "aha" moment at end of 7-day excavation
- Constellation appearing dramatically
- Stars connecting one by one
- Emotional peak of the experience

**S5.2 Phase Transition**
- User advancing from "Scattered" to "Connecting"
- Celebration without being gamified
- Constellation brightening/evolving

**S5.3 Star Discovery**
- New insight being added to constellation
- Star appearing, connection drawing
- Small but meaningful moment

**Technical specs:**
- Can be static keyframes (we'll animate in code)
- Show the emotional beat, not full animation

---

## Reference Images

### Inspirations (What We Like)
- **Skyrim skill tree:** Night sky aesthetic, constellation metaphor
- **Headspace illustrations:** Soft, approachable, not childish
- **Star Walk 2 app:** Night mode, star map interaction
- **Path of Exile skill web:** Dense interconnection, zoom levels

### Anti-Inspirations (What We Avoid)
- **Duolingo:** Too gamified, bright, competitive
- **Clinical health apps:** Cold, sterile, data-heavy
- **Fantasy games:** Over-designed, dramatic, complex
- **Stock astrology apps:** Cliché zodiac imagery

---

## Budget & Timeline

**Samples needed:** 15-20 pieces total
**Purpose:** Training reference for AI model + implementation guide
**Budget range:** $200-500 (negotiable based on quality)
**Timeline:** 1-2 weeks

---

## Selection Criteria

We're looking for an artist who:
1. Can execute a **consistent visual language** across multiple asset types
2. Understands **subtle, ethereal glow effects** without being dramatic
3. Has experience with **mobile UI/dark mode** design
4. Can balance **mystical aesthetic** with **professional trustworthiness**
5. Is comfortable with **iterative feedback**

---

## Submission Format

Please provide:
1. **3-5 sample stars** (one of each type) as PNG
2. **1 background sample**
3. **Brief style rationale** explaining your approach

If selected, full deliverables due within 2 weeks.

---

## Contact

[Your contact info here]

---

## Appendix: The Constellation Archetype System

For context on what the stars represent:

**Phases (macro journey stage):**
- SCATTERED → CONNECTING → EMERGING → LUMINOUS

**Star Qualities (micro insight type):**
- BRIGHT = Verified strength
- DIM = Shadow aspect
- FLICKERING = Emerging potential
- DARK STAR = Gravity well / vice

A user's constellation reading might say:
> "You are in the **Connecting** phase. Your constellation shows 4 bright stars clustered around Purpose, but 2 dark stars in Relationships are creating drag. The path forward requires integrating your shadow around intimacy."

The visual system should make this kind of reading feel **discovered and personal**, not assigned or clinical.
