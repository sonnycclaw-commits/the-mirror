# Phase Transitions Visual Specification

**SCATTERED → CONNECTING → EMERGING → LUMINOUS**

---

## Design Intent

Phase transitions are the macro milestones of the user's journey. They should feel like **natural phenomena**—not levels in a game, but seasons changing, dawn breaking, stars aligning.

**Metaphor:** Celestial events—not achievements, but observations of what's becoming true.

---

## The Four Phases

```
 SCATTERED          CONNECTING          EMERGING           LUMINOUS
    ·  ·               · · ·              ⭐──⭐            ⭐══⭐
   ·    ·   ───→    ·───·───·   ───→    ╱    ╲   ───→   ╱ ╲╱ ╲
  ·  ·  ·            · · ·              ⭐─⭐──⭐        ⭐══⭐══⭐
(isolated)         (linking)          (forming)        (integrated)
```

---

## Phase Visual Identity

### SCATTERED (Phase 1)

**Meaning:** Stars exist but haven't formed patterns yet.

| Attribute | Value |
|-----------|-------|
| **Star State** | Mostly dim, some flickering |
| **Connections** | None or very few, faint |
| **Atmosphere** | Darker, more fog |
| **Polar Grid** | Barely visible |
| **Colors** | Cooler, more muted |
| **Feel** | "Raw material gathering" |

### CONNECTING (Phase 2)

**Meaning:** Patterns beginning to emerge, stars linking.

| Attribute | Value |
|-----------|-------|
| **Star State** | Mix of dim and bright, more stable |
| **Connections** | Several visible, some emerging (dashed) |
| **Atmosphere** | Slightly clearer |
| **Polar Grid** | More visible, structure apparent |
| **Colors** | Warmer hints appearing |
| **Feel** | "First threads of meaning" |

### EMERGING (Phase 3)

**Meaning:** Clear constellation structure, bright stars dominant.

| Attribute | Value |
|-----------|-------|
| **Star State** | Many bright stars, fewer dim |
| **Connections** | Strong network visible |
| **Atmosphere** | Clearer, more contrast |
| **Polar Grid** | Clearly defined |
| **Colors** | Warm accents prominent |
| **Feel** | "The pattern is becoming clear" |

### LUMINOUS (Phase 4)

**Meaning:** Full integration, radiating insight.

| Attribute | Value |
|-----------|-------|
| **Star State** | Predominantly bright, dark stars integrated |
| **Connections** | Dense, flowing network |
| **Atmosphere** | Maximum clarity |
| **Polar Grid** | Full visibility |
| **Colors** | Full warmth, gold accents |
| **Feel** | "The constellation shines" |

---

## Transition Animation

### Trigger

Phase transitions occur when TARS detects sufficient progress metrics have been met.

### Duration

**Total:** 3-5 seconds

Too fast = insignificant
Too slow = tedious

### Sequence

1. **Pause (0-500ms)**
   - All ambient animations slow
   - Screen slightly dims
   - Creates "hush" moment

2. **TARS Observation (500-1500ms)**
   - Observation toast appears: "*Something is shifting...*"
   - Subtle audio cue (low resonance)

3. **Environmental Shift (1500-3000ms)**
   - Fog density shifts
   - Overall color temperature warms
   - Polar grid brightens/dims
   - All connections pulse once

4. **Phase Toast (3000-5000ms)**
   - Text appears center screen: "EMERGING PHASE"
   - No background—white text with heavy Gaussian blur shadow (halo)
   - Fade in slow (2s duration)
   - Fade out gentle (1s)

5. **Resume (5000ms+)**
   - Ambient animations resume at new baseline
   - Stars settle into new phase visual identity

---

## Phase Toast Design

| Attribute | Value |
|-----------|-------|
| **Typography** | *Fraunces* Bold, display-lg (40px) |
| **Color** | White (#FFFFFF) |
| **Background** | None |
| **Effect** | Heavy Gaussian blur shadow creating glow halo |
| **Position** | Center screen, vertical center |
| **Animation** | Fade in: 2s ease-out, Hold: 2s, Fade out: 1s ease-in |

---

## Environmental Variables by Phase

| Variable | SCATTERED | CONNECTING | EMERGING | LUMINOUS |
|----------|-----------|------------|----------|----------|
| `fogDensity` | 0.012 | 0.010 | 0.008 | 0.006 |
| `gridOpacity` | 0.03 | 0.05 | 0.08 | 0.10 |
| `ambientLight` | 0.05 | 0.08 | 0.10 | 0.12 |
| `colorTemp` | 5500K | 6000K | 6500K | 7000K |
| `bloomIntensity` | 0.2 | 0.3 | 0.4 | 0.5 |

---

## Sound Design

| Phase Transition | Sound |
|------------------|-------|
| → CONNECTING | Low, resonant hum, rising |
| → EMERGING | Gentle chime, warm |
| → LUMINOUS | Full chord, triumphant but soft |

---

## Celebration Without Gamification

### What We Avoid

| ❌ Don't | ✅ Do |
|----------|------|
| Confetti explosion | Soft glow expansion |
| "LEVEL UP!" popup | "EMERGING PHASE" text |
| Achievement badges | Environmental shift |
| Point counters | TARS observation |
| Sound effect fanfare | Single resonant tone |

### The Principle

The celebration is in **the seeing**, not the fireworks. The phase transition is an *observation* of what has already become true, not a *reward* for completing tasks.

---

## Accessibility

| Consideration | Implementation |
|---------------|----------------|
| Reduced motion | Instant state change, skip animations |
| High contrast | Phase toast uses solid white with dark outline |
| Screen readers | Announce phase change: "Phase transition: You are now in the Emerging phase" |

---

## Technical Implementation

### Shader Uniforms

| Uniform | Type | Usage |
|---------|------|-------|
| `uPhase` | int | 0-3, current phase |
| `uPhaseTransition` | float | 0.0-1.0, transition progress |
| `uTargetPhase` | int | Phase transitioning to |

### Transition Lerp

```javascript
// In animation loop
if (transitioning) {
  uPhaseTransition.value = THREE.MathUtils.lerp(
    uPhaseTransition.value,
    1.0,
    0.02 // Smooth transition
  );
}
```

---

*"Phase transitions are not levels completed. They are seasons changing—the natural unfolding of what was always becoming true."*
