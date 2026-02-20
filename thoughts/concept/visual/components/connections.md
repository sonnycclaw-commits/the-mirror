# Connections Visual Specification

**Living Mycelium — Biological networks of meaning**

> *Sources: [threejs-spec.md](../implementation/threejs-architecture.md), [design-lineage.md](../_archive/design-lineage.md)*

---

## Design Intent

Connections are **NOT** vector graphics lines. They are **organic growth**—living networks that feel like mycelium, neural synapses, or fiber optic cables transmitting data.

**Metaphor:** "The Synapse & The Weaver" — Thoughts don't follow straight vectors. They *grow* along paths of least resistance.

---

## Technical Approach

Avoid "Vector Graphics" look. Create "Organic Growth":

| Attribute | Value |
|-----------|-------|
| **Geometry** | `MeshLine` with custom shader |
| **Curve Type** | Bezier, never straight |
| **Width** | Variable (thick at source, thin at seeking tip) |
| **Texture** | Animated "dash" texture moving rapidly |
| **Color** | Gradient from Start Star color to End Star color |
| **Feel** | Fiber optic cables transferring data |

---

## The "Mycelium" Shader

Instead of a standard line, we use a custom `ShaderMaterial` on `MeshLine` geometry.

### Uniforms

| Uniform | Type | Description |
|---------|------|-------------|
| `uGrowth` | float | 0.0 to 1.0, controls "write" progress |
| `uNoiseTexture` | sampler2D | Perlin noise for width modulation |
| `uPulse` | float | Time-based float for signal transmission |
| `uStrength` | float | Connection strength (0.0 - 1.0) |
| `uStartColor` | vec3 | Source star color |
| `uEndColor` | vec3 | Destination star color |

### Vertex Logic

**Width Jitter:** Makes the line uneven, like a root.
```glsl
vWidth = baseWidth * (1.0 + texture2D(uNoiseTexture, uv).r * 0.5);
```

**Taper:** Width approaches 0 at head (uv.x) and tail (uv.x - uLength).

### Fragment Logic

- **The Head:** Bright "growth tip" (Color A + Boost)
- **The Body:** Color A mixing to Color B (Gradient)
- **Alpha Map:** Noise creates "gaps" or "spores" in the line, preventing solid plastic look

---

## Connection Types

### Strong Connection

**Meaning:** Established patterns, verified relationships.

| Attribute | Value |
|-----------|-------|
| **Visual** | Bright luminous line (`#B1B9C7`) with glow |
| **Width** | 2-3px |
| **Opacity** | 1.0 |
| **Animation** | Gentle shimmer |
| **Pulse** | Visible signal traveling along line (2-4s cycle) |

```
☆═══════════☆
  (strong)
```

### Emerging Connection

**Meaning:** Potential patterns forming, hopeful.

| Attribute | Value |
|-----------|-------|
| **Visual** | Dashed or dotted |
| **Width** | 1-2px |
| **Opacity** | 0.6 |
| **Animation** | Dots slowly filling in |
| **Growth** | `uGrowth` animates 0.0 → 1.0 over time |

```
☆ · · · · · ✦
 (emerging)
```

### Fading Connection

**Meaning:** Weakening relationships, neglect.

| Attribute | Value |
|-----------|-------|
| **Visual** | Dim, thin, barely visible |
| **Curve** | Straight-ish (less energy) |
| **Width** | 0.5-1px |
| **Opacity** | 0.3 |
| **Animation** | Slow fade |
| **Color** | Desaturated |

```
☆-----------✧
  (fading)
```

---

## Growth Animation

When a new connection forms:

**Duration:** 600-1000ms
**Easing:** ease-in-out

**Sequence:**
1. `uGrowth` animates from 0.0 → 1.0
2. Line "grows" from source star toward destination
3. Width starts thin at growing tip, fills in behind
4. Upon completion, first pulse travels along connection

**Feel:** The connection *grew*, it was not *placed*.

---

## Signal Transmission

Connections pulse with transmitted meaning:

| Trigger | Effect |
|---------|--------|
| Source star interaction | Pulse travels from source to connected stars |
| Star brightness change | Pulse radiates outward |
| Phase transition | All connections pulse simultaneously |

**Pulse Visual:**
- Traveling brightness wave
- Speed: 200-400ms per connection
- Color: Slightly brighter than base connection
- Width: Subtle expansion at pulse location

---

## Edge Labels

Floating labels on connection midpoints:

| Attribute | Value |
|-----------|-------|
| **Location** | Floating tag on line center |
| **Background** | Solid Black |
| **Text** | White Mono, 10px |
| **Icon** | Micro-icon (Link, Clash, Cause) |
| **Visibility** | Only on hover/focus, or at meso zoom level |

---

## Technical Implementation

### MeshLine Setup

```javascript
import { MeshLine, MeshLineMaterial } from 'meshline';

// Create curved path between two stars
const curve = new THREE.CubicBezierCurve3(
  starA.position,
  controlPoint1,
  controlPoint2,
  starB.position
);

const points = curve.getPoints(50);
const line = new MeshLine();
line.setPoints(points.flat());
```

### Performance Fallback

On low-end mobile:
- Disable Bloom
- Fall back to simple Sprite "glow" textures
- Reduce point count in curves
- Disable signal pulse animation

---

## Accessibility

- Connections are not the sole indicator of relationships
- Stars have aria-labels describing connections
- High contrast mode: connections render as solid 2px lines
- Reduced motion: disable pulse animations

---

*"Connections should look like growth—they jitter, they pulse, they are thick at the source and seek the destination."*
