# The Horizon Visual Specification

**The Star Map Canvas — Looking through the observatory lens**

> *Source: [the-horizon/visual-spec.md](../mechanics/the-horizon/visual-spec.md)*

---

## Design Intent

The Star Map is the "user looking at their constellation through an observatory telescope." The scene should feel:

- **Optics:** Visible lens imperfections (chromatic aberration, film grain)
- **Darkness:** Night sky atmosphere ("Midnight Oil")
- **Life:** Subtle particle effects, dust motes moving through beams

**Metaphor:** "The Observatory Lens" — The interface is an optical instrument, not a dashboard.

---

## Canvas Hierarchy

```
┌─────────────────────────────────────────┐
│               HUD Layer                 │  ← HTML/CSS (Date Scrubber, Filters)
├─────────────────────────────────────────┤
│         Glass Input Layer               │  ← drei/Html (GlassTablet)
├─────────────────────────────────────────┤
│            Three.js Scene               │
│  ┌─────────────────────────────────┐    │
│  │   Post-Processing               │    │  ← EffectComposer
│  │   ┌───────────────────────────┐ │    │
│  │   │   Stars & Connections     │ │    │  ← InstancedMesh, MeshLine
│  │   │   ┌─────────────────────┐ │ │    │
│  │   │   │   Background        │ │ │    │  ← Gradient, Fog, Nebula
│  │   │   └─────────────────────┘ │ │    │
│  │   └───────────────────────────┘ │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## Background: Midnight Oil

| Attribute | Value |
|-----------|-------|
| **Geometry** | `<SphereGeometry args={[500, 64, 64]}/>` |
| **Shader** | `ShaderMaterial` with vertical gradient |

### Gradient Colors (Top to Bottom)

| Position | Color | Feel |
|----------|-------|------|
| Top (Zenith) | `#0A0A0A` | Deep black, true night |
| Mid | `#0F0F10` + subtle noise | The aether |
| Bottom | `#121822` (Twilight-800) | Horizon glow |

**Texture Overlay:** Subtle canvas/"oil paint" texture for grain, not digital smoothness.

---

## Atmosphere: The Aether

### Volumetric Fog

| Attribute | Value |
|-----------|-------|
| **Type** | `<fogExp2 />` |
| **Color** | `#080a10` (Dark blue-black) |
| **Density** | 0.008 (subtle) |
| **Effect** | Stars further in z/r dim naturally |

### Nebula Dust Particles

| Attribute | Value |
|-----------|-------|
| **Count** | 1000-2000 points |
| **Color** | Very low saturation purples, teals, oranges (Digital Renaissance palette) |
| **Opacity** | 0.05 - 0.15 (barely visible) |
| **Motion** | Very slow drift (Lerp to random targets every 10-20s) |

---

## Polar Grid

The polar coordinate system backdrop:

| Attribute | Value |
|-----------|-------|
| **Material** | LineBasicMaterial or faint TubeGeometry |
| **Color** | `rgba(180,200,220,0.05)` (Twilight-200 at 5%) |
| **Origin** | Center of screen |
| **Rings** | Concentric circles, r = time milestones |
| **Sectors** | Radial lines, θ = domain boundaries |
| **Feel** | Etched, like an astrolabe—not vector graphics |

### Domain Labels

| Attribute | Value |
|-----------|-------|
| **Font** | Inter, Uppercase, 60% opacity |
| **Position** | Outer edge of each sector |
| **Labels** | Soul, Purpose, Career, Relationships, Health |

---

## Post-Processing Stack

Order matters. Apply in this sequence:

### 1. Chromatic Aberration

| Attribute | Value |
|-----------|-------|
| **Offset** | `(0.002, 0.001)` |
| **Purpose** | "Old camera lens" imperfection |
| **Effect** | Slight RGB separation at edges |

### 2. Film Grain

| Attribute | Value |
|-----------|-------|
| **Intensity** | 0.25-0.35 |
| **Purpose** | Analog photograph quality |
| **Effect** | Subtle noise overlay |

### 3. Vignette

| Attribute | Value |
|-----------|-------|
| **Offset** | 0.15 |
| **Darkness** | 0.45 |
| **Purpose** | Focus toward center, like a telescope eyepiece |

### 4. Depth of Field

| Attribute | Value |
|-----------|-------|
| **Focus Distance** | Camera's current focal plane |
| **Aperture** | 2.8 (Aggressive blur) |
| **Effect** | Stars far from camera are soft blobs; in-focus stars are sharp crystals |

### 5. Bloom (Selective)

| Attribute | Value |
|-----------|-------|
| **Intensity** | 0.4 |
| **Threshold** | 0.85 |
| **Effect** | Only Bright Stars and major highlights bloom |

---

## Camera Behavior

### Default State

| Attribute | Value |
|-----------|-------|
| **Position** | Slightly above polar plane, looking down slightly |
| **Parallax** | Subtle sway on device motion / mouse move (0.5° max) |

### View States

| State | Camera | Description |
|-------|--------|-------------|
| **Macro (Overview)** | Far, top-down | See entire constellation |
| **Meso (Mid-Range)** | Default focal plane | Stars, connection labels visible |
| **Micro (Close)** | Near focused star | Orbit around individual stars |

### Transitions

| Transition | Duration | Easing |
|------------|----------|--------|
| Zoom In/Out | 600ms | ease-in-out |
| Pan | 400ms | ease-out |
| Focus on Star | 800ms | ease-out with slight spring |

---

## Lighting

| Light | Type | Position | Effect |
|-------|------|----------|--------|
| Rim Light | Directional | Behind/above camera | Catches edges of glass stars |
| Ambient | Ambient | Global | Very low (0.1), deep space |
| Star Internal | Point (per star) | Inside each star | PBR refraction |

---

## Mobile Adaptations

| Aspect | Adaptation |
|--------|------------|
| Post-processing | Reduce or disable on low-end |
| Particle count | 500 instead of 2000 |
| Bloom | Optional (performance trade-off) |
| Touch | Pinch-to-zoom, two-finger pan |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| FPS | 60 on modern devices, 30 acceptable on low-end |
| Draw calls | < 50 per frame |
| Star count | Support up to 200 stars |

---

*"The user should feel like they're looking through an astronomical instrument at their soul's configuration."*
