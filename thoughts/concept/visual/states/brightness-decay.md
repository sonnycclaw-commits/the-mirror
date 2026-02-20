# Brightness Decay Visual Specification

**Entropy & Revival — Stars fade when neglected, brighten when nurtured**

---

## Design Intent

Stars are not permanent. They respond to attention and action. Neglected stars **accumulate dust**—they don't die, but they become harder to see. This is entropy without punishment.

**Metaphor:** Dust on a specimen jar—the precious object is still there, just obscured.

---

## The Decay Cycle

```
BRIGHT          DIMMING          DUSTY           (DARK STAR)
   ☆       →       ✧       →        ·       →        ●
(active)       (cooling)       (obscured)      (gravity well)
 Day 1         Day 7-14        Day 30+         (different system)
```

**Note:** Dark Stars are not the result of decay—they are a distinct archetype representing gravity wells/vices.

---

## Decay Mechanics

### Time-Based Entropy

| Duration Since Last Interaction | Effect |
|--------------------------------|--------|
| 0-7 days | Full brightness, no decay |
| 7-14 days | Begin dimming (10% reduction) |
| 14-30 days | Visible dust accumulation (30% reduction) |
| 30+ days | Heavy dust, requires cleaning (50% reduction) |

### Shader Uniform

```glsl
uniform float uLastActive;  // Days since last interaction
uniform float uDustLevel;   // 0.0 (clean) to 1.0 (heavy dust)
```

---

## Visual Effects

### Phase 1: Dimming (7-14 days)

| Effect | Specification |
|--------|---------------|
| **Brightness** | `uIntensity` drops from 1.0 → 0.7 |
| **Saturation** | Slight desaturation begins |
| **Pulse** | Slower, less pronounced |
| **Feel** | "The star is resting" |

### Phase 2: Dust Accumulation (14-30 days)

| Effect | Specification |
|--------|---------------|
| **Noise Shell** | Perlin noise texture overlay appears around star |
| **Opacity** | Dust layer increases opacity: 0 → 0.3 |
| **Refraction** | Reduced (light doesn't pass through as cleanly) |
| **Color** | Further desaturation |
| **Feel** | "Something is being forgotten" |

### Phase 3: Heavy Dust (30+ days)

| Effect | Specification |
|--------|---------------|
| **Noise Shell** | Thicker, more opaque (0.5 opacity) |
| **Brightness** | `uIntensity` at 0.5 |
| **Motion** | Nearly frozen (minimal pulse) |
| **Internal Light** | Barely visible through dust |
| **Feel** | "This needs attention" |

---

## Dust Shader

### Visual Approach

The dust is a **noise overlay** that dulls the star's refraction and obscures its internal light.

```glsl
// Fragment shader excerpt
float dust = texture2D(uNoiseTexture, vUv * 2.0).r;
float dustLevel = smoothstep(0.0, 1.0, uDustLevel);
vec3 finalColor = mix(starColor, dustColor, dustLevel * dust);
```

### Dust Color

| Attribute | Value |
|-----------|-------|
| **Base** | `#404050` (muted blue-grey) |
| **Blend** | Multiply with star color |
| **Opacity** | Controlled by `uDustLevel` |

---

## Revival Animation

When the user interacts with a dusty star (tap, hover, or via experiment completion):

### Trigger

- Direct interaction (tap/hover)
- Completing an experiment related to this star
- TARS mentioning the star

### Duration

600-1000ms

### Sequence

1. **Shockwave (0-200ms)**
   - Radial pulse from star center outward
   - Color: Star's inherent color, bright

2. **Dust Dispersion (200-600ms)**
   - Dust particles detach from surface
   - Particles drift outward and fade
   - Noise shell opacity: current → 0

3. **Brightness Restoration (400-800ms)**
   - `uIntensity` animates back to 1.0
   - Saturation restores
   - Internal light rekindles

4. **Celebration Pulse (800-1000ms)**
   - Single bright pulse
   - Connected lines flash once
   - TARS may observe: "*This one is waking up...*"

### Feel

"Blowing dust off a precious artifact"—the star was there all along, just obscured.

---

## The Cleaning Tool (Explicit Interaction)

### When Visible

When hovering a dusty star (dust level > 0.3):

| Attribute | Value |
|-----------|-------|
| **Cursor** | "Lens cloth" icon or soft glow brush |
| **Action** | Circular rubbing motion clears dust |
| **Feedback** | Dust particles disperse with each motion |
| **Duration** | 2-4 circular motions to fully clean |

### Implementation

```javascript
// Track circular motion
const detectCircularMotion = (positions) => {
  // Analyze position history for circular pattern
  // Return progress (0-1) toward cleaning
};
```

---

## TARS Observations

| Dust Level | TARS Might Say |
|------------|----------------|
| Just appearing | "*This one hasn't been visited in a while...*" |
| Moderate | "*Some dust has gathered here. What happened?*" |
| Heavy | "*This insight is waiting to be remembered.*" |
| After revival | "*Ah, there it is. Still bright underneath.*" |

---

## Connection Decay

Connections between stars also respond to entropy:

| Star State | Connection Effect |
|------------|-------------------|
| Both active | Strong, bright connection |
| One dusty | Connection dims proportionally |
| Both dusty | Connection nearly invisible |
| One revived | Connection rebrightens to 50% |
| Both revived | Full connection restoration |

---

## Decay Notifications

### Philosophy

We do **NOT** punish or shame. We **invite** without urgency.

| ❌ Don't | ✅ Do |
|----------|------|
| "You're losing your streak!" | "*This star misses being seen...*" |
| "3 stars are dying!" | "*Some patterns are waiting in the dust*" |
| Push notifications with anxiety | Gentle in-app observation |

### Notification Policy

- No push notifications for decay
- In-app observation only when user opens app
- Frame as invitation, not shame

---

## Accessibility

| Consideration | Implementation |
|---------------|----------------|
| Color-only indication | Dust has texture, not just color change |
| Motion sensitivity | Dust dispersion can be reduced/instant |
| Screen readers | Announce: "This star has been inactive for 3 weeks" |

---

## Technical Notes

### Shader Uniforms Summary

| Uniform | Type | Description |
|---------|------|-------------|
| `uLastActive` | float | Days since last interaction |
| `uDustLevel` | float | 0.0-1.0, calculated from `uLastActive` |
| `uSaturation` | float | 0.0-1.0, desaturation level |
| `uCleaning` | float | 0.0-1.0, cleaning animation progress |

### Performance

- Dust particles are GPU-instanced
- Clean stars skip dust shader entirely
- Maximum 10-20 dust particles per star

---

*"Entropy is not punishment. It is an invitation to return—a reminder that what matters requires attention."*
