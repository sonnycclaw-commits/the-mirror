# The Sky Visual Specification

**Background & Atmosphere — The infinite canvas behind the stars**

---

## Design Intent

The sky is not a backdrop. It is **infinite possibility**—the darkness that makes stars visible, the space where meaning crystallizes. Without darkness, there are no stars.

**Metaphor:** The observatory's open dome—a view into the unknown that makes self-knowledge possible.

---

## The Infinite Dark

### Philosophy

> *"Night, not Day"* — Darkness is foundational, not an afterthought.

The purpose-built nothingness that makes stars visible.

---

## Layer Stack

From back to front:

```
┌─────────────────────────────────────┐
│          Nebula Clouds              │  z: -500 (furthest)
├─────────────────────────────────────┤
│          Distant Stars              │  z: -300
├─────────────────────────────────────┤
│          Volumetric Fog             │  z: -100 to 0
├─────────────────────────────────────┤
│          Dust Particles             │  z: varies
├─────────────────────────────────────┤
│          User's Constellation       │  z: 0 (focal plane)
└─────────────────────────────────────┘
```

---

## Background Gradient

### Shader: Midnight Oil

| Position | Color | Hex |
|----------|-------|-----|
| Zenith (0°) | True Black | `#0A0A0A` |
| Mid (45°) | Deep Blue-Black | `#0F0F10` |
| Horizon (90°) | Twilight Glow | `#121822` |

**Implementation:**
```glsl
vec3 zenith = vec3(0.04, 0.04, 0.04);
vec3 horizon = vec3(0.07, 0.09, 0.13);
float gradient = smoothstep(-1.0, 1.0, normalize(vPosition).y);
vec3 skyColor = mix(horizon, zenith, gradient);
```

### Texture Overlay

| Attribute | Value |
|-----------|-------|
| **Type** | Canvas/oil paint grain texture |
| **Blend** | Multiply or Overlay |
| **Opacity** | 0.05 - 0.10 |
| **Purpose** | Removes "digital" smoothness, adds warmth |

---

## Nebula Clouds

### Visual

| Attribute | Value |
|-----------|-------|
| **Type** | Subtle purple/blue cosmic cloud textures |
| **Opacity** | 20-30% |
| **Position** | Fixed in far background |
| **Colors** | Muted purples, teals, very desaturated |

### Implementation Options

1. **Static:** Pre-rendered nebula texture mapped to background sphere
2. **Volumetric:** SimplexNoise-based cloud shader (performance cost)
3. **Layered:** Multiple transparent PNG planes at different depths

### Color Palette

| Cloud Type | Color | Hex |
|------------|-------|-----|
| Purple Dust | Deep Violet | `#1a1025` |
| Teal Wisp | Ocean Black | `#0d1a1a` |
| Warm Glow | Ember Black | `#1a1310` |

---

## Distant Stars (Ambient)

These are **NOT** the user's stars. They are distant points of light—the universe of possibility beyond the personal constellation.

### Visual

| Attribute | Value |
|-----------|-------|
| **Count** | 500-1000 points |
| **Size** | 0.5-2px |
| **Color** | White, slight blue/yellow variation |
| **Opacity** | 0.2 - 0.6 |
| **Distribution** | Clustered (Poisson disk sampling) |

### Animation

| Effect | Specification |
|--------|---------------|
| **Twinkle** | Random opacity flicker per star |
| **Cycle** | 2-6 second period per star |
| **Correlation** | Nearby stars twinkle together |

---

## Dust Particles

Floating motes that catch the light—evidence of the atmosphere's depth.

### Visual

| Attribute | Value |
|-----------|-------|
| **Count** | 1000-2000 particles |
| **Size** | 0.5-3px |
| **Color** | Very low saturation (Digital Renaissance palette) |
| **Opacity** | 0.05 - 0.15 |

### Motion

| Attribute | Value |
|-----------|-------|
| **Drift** | Slow Brownian motion |
| **Speed** | 0.02 - 0.05 units/second |
| **Method** | Lerp toward random target, pick new target every 10-20s |

---

## Volumetric Fog

Creates depth and mystery—distant things are obscured.

### Visual

| Attribute | Value |
|-----------|-------|
| **Type** | `<fogExp2 />` |
| **Color** | `#080a10` (Dark blue-black) |
| **Density** | 0.008 |
| **Effect** | Stars at greater r (older/future) naturally dim |

### "Oil Slick" Effect

From the Digital Renaissance aesthetic:

| Attribute | Value |
|-----------|-------|
| **Effect** | Subtle animated Perlin noise on fog density |
| **Material** | `roughnessMap` animated slowly |
| **Feel** | The aether is alive, not static |

---

## God Rays (Optional)

Subtle light shafts for dramatic moments.

### Trigger Conditions
- Birth Chart Reveal
- Phase Transitions
- Major milestone celebrations

### Visual

| Attribute | Value |
|-----------|-------|
| **Type** | Volumetric light scattering |
| **Color** | Warm gold or cool teal |
| **Opacity** | 0.1 - 0.2 |
| **Duration** | Fade in/out over 2-3 seconds |

---

## Color Temperature

The sky should feel **warm** despite being dark:

| What | Wrong | Right |
|------|-------|-------|
| Black | Pure `#000000` | Warm `#0F0E0E` |
| Blue | Cold Steel | Deep Midnight Oil |
| Atmosphere | Sterile | Lived-in |

---

## Tileable Requirements

For background textures:

| Texture | Tileable? | Resolution |
|---------|-----------|------------|
| Grain overlay | Yes | 512x512 minimum |
| Nebula clouds | Optional | 2048x2048 recommended |
| Noise maps | Yes | 256x256 minimum |

---

## Performance Considerations

| Device | Adaptation |
|--------|------------|
| High-end | Full particle count, volumetric effects |
| Mid-range | Reduced particles (500), simpler fog |
| Low-end | Static background, no particles, no fog |

---

*"The darkness is not absence—it is the infinite canvas that makes the stars visible."*
