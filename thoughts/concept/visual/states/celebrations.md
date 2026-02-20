# Celebrations Visual Specification

**Marking Moments Without Gamification**

---

## Design Intent

Celebrations in S.T.A.R.S. acknowledge meaningful moments without reducing them to achievements or points. The goal is **witnessing**, not **rewarding**. The user should feel *seen*, not *scored*.

**Metaphor:** Celestial events—a meteor shower, an alignment, a sunrise. Natural phenomena that mark significance.

---

## The Anti-Gamification Principle

| ❌ What We Avoid | ✅ What We Do |
|------------------|---------------|
| Confetti explosions | Soft glow expansions |
| "LEVEL UP!" | "You're entering EMERGING phase" |
| Achievement badges | Star brightens, TARS observes |
| Point counters | Environmental shifts |
| Leaderboards | Personal constellation view |
| Sound fanfares | Single resonant tones |
| Streaks with punishment | Entropy without shame |

**Core Principle:** The celebration is in *the seeing*, not the fireworks.

---

## Celebration Tiers

### Tier 1: Mini Celebrations

**For:** Daily experiment completion, small insights, routine progress.

**Duration:** 400ms

**Visual:**
- Checkmark icon draws in (stroke animation)
- Progress element completes (ring fills)
- Brief color shift (base → `success-main` → base)
- Subtle scale pulse on element (1.0 → 1.02 → 1.0)

**Sound:** None or very subtle haptic

---

### Tier 2: Medium Celebrations

**For:** Star discovery, experiment completion, weekly milestones.

**Duration:** 800ms

**Visual:**
- Star spawns with discovery animation
- If new: wireframe draws, glass fills, light ignites
- 6-8 small particles emit from center
- Connected lines animate to draw
- TARS may observe

**Sound:** Gentle chime (optional)

---

### Tier 3: Major Celebrations

**For:** Phase transitions, Birth Chart reveal, major life insights.

**Duration:** 3-5 seconds (phase transitions) or 30-45 seconds (Birth Chart)

**Visual:**
- Environmental shift (fog, lighting, temperature)
- Phase toast appears with halo glow
- All connections pulse simultaneously
- Camera may slowly zoom or reposition

**Sound:** Resonant tone, building chord

---

## Star Discovery Animation

**Duration:** 800-1200ms

**Sequence:**

1. **Point of Light (0-200ms)**
   - Tiny bright point appears at spawn location
   - Subtle "ping" visual

2. **Wireframe (200-400ms)**
   - Geometric wireframe of star shape draws in
   - Like a blueprint appearing

3. **Fill (400-700ms)**
   - "Glass" material fills the wireframe
   - Internal light gradually brightens

4. **Connections (700-1000ms)**
   - If related to existing stars, lines begin drawing
   - Bezier curves grow toward connected stars

5. **Ripple (1000-1200ms)**
   - Subtle shockwave ripples through nearby constellation
   - Nearby stars briefly pulse in acknowledgment

---

## Phase Transition Toast

| Attribute | Value |
|-----------|-------|
| **Typography** | *Fraunces* Bold, 40px |
| **Color** | White (#FFFFFF) |
| **Background** | None |
| **Effect** | Heavy Gaussian blur shadow (halo glow) |
| **Position** | Center screen |
| **Animation** | Fade in (2s), Hold (2s), Fade out (1s) |

**Content Examples:**
- "SCATTERED PHASE"
- "CONNECTING PHASE"
- "EMERGING PHASE"
- "LUMINOUS PHASE"

---

## Birth Chart Reveal (Day 7)

The most significant celebration in the product. This is the culmination of The Mirror.

**Duration:** 30-45 seconds

**Sequence:**

1. **Blackout (0-2s)**
   - Screen fades to complete black
   - All UI elements disappear
   - Silence

2. **First Star (2-5s)**
   - A single star appears with soft "ping"
   - Small, bright, alone

3. **Stars Appear (5-20s)**
   - Additional stars spawn one by one
   - Each with discovery animation
   - Sound: gentle ping per star
   - Pacing: 0.5-1 second between stars

4. **Connections Draw (15-25s)**
   - Lines begin drawing between stars
   - Bezier curves flow organically
   - Pulse travels along each new connection

5. **Camera Pulls Back (20-30s)**
   - Slow dolly out
   - Constellation becomes visible as whole

6. **Full View (30-40s)**
   - Complete constellation visible
   - All connections shimmer once
   - Ambient animation resumes

7. **TARS Speaks (35-45s)**
   - TARS begins narration
   - "*This is what I see...*"

**Feel:** Revelation, recognition, "*there I am*"

---

## TARS Observations

TARS marks moments with gentle observations, not congratulations:

| Moment | TARS Might Say |
|--------|----------------|
| Star discovery | "*Something just became visible...*" |
| Strong connection | "*These two keep appearing together.*" |
| Phase transition | "*You're becoming something new.*" |
| Revival | "*This one was waiting to be remembered.*" |
| Dark star integrated | "*Even this belongs to your constellation.*" |

**Tone:** Witnessing, not judging. Observing, not rewarding.

---

## Particle Systems

For celebrations requiring particles:

### Star Discovery Particles

| Attribute | Value |
|-----------|-------|
| **Count** | 6-8 particles |
| **Colors** | Star's color palette |
| **Size** | 2-4px |
| **Motion** | Radiate outward, decelerate, fade |
| **Duration** | 600ms |

### Phase Transition Particles (Optional)

| Attribute | Value |
|-----------|-------|
| **Count** | 20-30 particles |
| **Colors** | Phase colors (warmer as phases progress) |
| **Size** | 1-3px |
| **Motion** | Drift upward gently |
| **Duration** | 2-3s |

**Note:** Not confetti. Subtle dust motes catching new light.

---

## Audio Design

| Celebration | Sound |
|-------------|-------|
| Mini | Haptic only, or silent |
| Star discovery | Soft glass "ping" |
| Connection formed | Low resonant hum |
| Phase transition | Rising tone, then chord |
| Birth Chart reveal | Gradual ambient build |

**Principle:** Sounds are organic, almost environmental. Never arcade-like.

---

## Reduced Motion Support

When `prefers-reduced-motion: reduce`:

| Normal | Reduced |
|--------|---------|
| Star spawn animation | Instant appear with pulse |
| Particle systems | Skip particles |
| Phase toast animation | Instant show/hide |
| Camera movements | Instant position changes |

Essential feedback preserved (button acknowledgment, state changes).

---

## Performance Considerations

| Celebration | Performance Cost |
|-------------|-----------------|
| Mini | Negligible |
| Star discovery | Low (6-8 particles) |
| Phase transition | Medium (environmental shift) |
| Birth Chart | High (sequence, defer if needed) |

On low-end devices:
- Reduce particle counts
- Simplify animations
- Keep core feedback intact

---

*"We don't celebrate what you did. We witness what you're becoming."*
