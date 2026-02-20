# Stars Visual Specification

**The Data Crystals — Insights solidified into geometry**

> *Sources: [constellation-states/visual-spec.md](../mechanics/constellation-states/visual-spec.md), [threejs-spec.md](../implementation/threejs-architecture.md)*

---

## Design Intent

Stars are **NOT** 2D glowing sprites. They are **3D Physical Objects** floating in the aether—like jewelry or high-end semiconductor artifacts. Each star is a unique specimen collected from the user's psyche, worthy of contemplation.

**Metaphor:** "Living Data Crystals" — Insights solidified into geometry.

---

## Material Strategy: Glass & Light

We use **Physical Based Rendering (PBR)** via `MeshPhysicalMaterial`:

| Property | Value | Effect |
|----------|-------|--------|
| `transmission` | 1.0 | Glassy transparency |
| `roughness` | 0.2 | Frosted polished glass |
| `thickness` | 1.5 | Volume for refraction |
| **Internal Light** | Point light inside | Illuminates from within |

Stars refract the background nebula and catch rim light from the environment.

---

## The Four Archetypes

### ☆ BRIGHT STAR — The Diamond

**Meaning:** Strength, Proven through action.

| Attribute | Value |
|-----------|-------|
| **Geometry** | Icosahedron (20 faces) — Sharp, defined |
| **Material** | Clear Crystal |
| **Inner Light** | Gold (`#E07A5F`) |
| **Size** | 24-32px at 1x |
| **Motion** | Slow, rhythmic rotation (stable) |
| **Effect** | Casts caustic reflections on fog |

**Shader Behavior:**
- High emission, steady pulse: `sin(t)`
- Intensity: 0.8 - 1.0

---

### ✧ DIM STAR — The Stone

**Meaning:** Shadow aspect, Dormant, inviting integration.

| Attribute | Value |
|-----------|-------|
| **Geometry** | Dodecahedron (12 faces) — Blunt, heavy |
| **Material** | Matte "Moonstone" or slate |
| **Transmission** | Low |
| **Roughness** | 0.8 (high) |
| **Color** | Cool Grey (`#8A96AB`) |
| **Size** | 18-24px |
| **Motion** | Stationary or very slow wobble |
| **Effect** | Does not emit light — only visible via rim-lighting |

**Visual Note:** Not ominous. Not shameful. Just waiting to be seen.

---

### ✦ FLICKERING STAR — The Liquid

**Meaning:** Emerging potential, Unsteady, becoming.

| Attribute | Value |
|-----------|-------|
| **Geometry** | High-poly Sphere with Vertex Displacement Shader |
| **Material** | "Opals" — Iridescent, shifting colors |
| **Colors** | Sage Green (`#6B9080`) ↔ Gold |
| **Size** | 20-28px |
| **Motion** | Surface *boils* or ripples (Perlin noise) |
| **Effect** | Light intensity varies chaotically: `sin(time * noise)` |

**Visual Note:** The flicker communicates uncertainty—not instability, but becoming.

---

### ● DARK STAR — The Singularity

**Meaning:** Gravity well, Avoidance pattern.

| Attribute | Value |
|-----------|-------|
| **Geometry** | Perfect Sphere |
| **Material** | "Vantablack" — Pure black |
| **Roughness** | 1.0 |
| **Size** | 20-30px |
| **Motion** | None. It is a hole in space. |
| **Effect** | **Gravitational Lensing** — Bends light of stars behind it |

**Shader:** Refraction shader with negative IOR or screen-space distortion.

**Visual Note:** Not evil. Not dramatic. Just honest about what's happening. Dark stars don't glow—they pull.

---

## Interaction States

### Hover State

| Effect | Specification |
|--------|---------------|
| **Physics** | Star floats *up* toward camera (z-axis translation) |
| **Selection** | Rigid white wireframe appears around crystal shape (the "blueprint" overlay) |
| **Scale** | 1.0 → 1.2 (spring animation) |
| **Connections** | Connected lines brighten |
| **Sound** | Subtle "glass ting" |

### Touch State (Mobile)
- Enlarge 20%
- Glow intensifies
- Info panel slides up with star's story

### Focus State
- Clear visible focus ring
- High contrast outline for accessibility

---

## Discovery Animation (Spawn)

**Duration:** 800-1200ms

**Sequence:**
1. A wireframe draws the shape first
2. The liquid "glass" fills the volume
3. The internal light snaps on
4. If connected to existing star, line draws
5. Subtle ripple effect through nearby stars

**Feel:** Small but meaningful. Something just became visible.

---

## Size & Intensity Variations

Stars appear at different sizes based on intensity and importance:

| Size Class | Diameter | Usage |
|------------|----------|-------|
| Small | 18-20px | Background context stars |
| Medium | 22-26px | Standard insights |
| Large | 28-32px | Major discoveries, emphasized stars |

Intensity within type:
- Same star type can vary in brightness (0.5 - 1.0)
- Represents strength/certainty of the insight

---

## Dust Accumulation (Entropy)

Old/neglected stars accumulate a "noise shell" (dust):

| Effect | Specification |
|--------|---------------|
| **Trigger** | Time since last interaction exceeds threshold |
| **Visual** | Noise overlay that dulls refraction |
| **Desaturation** | `uSaturation` slowly drops via `uLastActive` uniform |
| **Revival** | Interacting triggers "Cleaning" shockwave, blowing off dust and restoring internal light |

---

## Technical Notes

### Efficient Rendering

For 50-100 stars with unique properties (color, pulse, size):
- Use `InstancedMesh` with custom `ShaderMaterial`
- Or `Drei/Instance` if strictly <100 stars
- Individual `Mesh` components acceptable for R3F ease of use, but `InstancedMesh` safer for mobile

### Shader Uniforms

| Uniform | Type | Description |
|---------|------|-------------|
| `uTime` | float | Global time for pulse/flicker |
| `uColor` | vec3 | Base color from Star Type |
| `uType` | int | 0=Bright, 1=Dim, 2=Flickering, 3=Dark |
| `uIntensity` | float | Current brightness [0.05 - 1.0] |
| `uResonance` | float | Interaction feedback |
| `uLastActive` | float | Time since last interaction (for decay) |

---

*"Each star would look at home in a 17th-century curiosity cabinet—precious specimens collected from the user's psyche."*
