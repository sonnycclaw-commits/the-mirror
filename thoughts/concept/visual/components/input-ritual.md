# Input Ritual Visual Specification

**The Glass Palimpsest — Writing light onto clear sheets**

> *Source: [the-walk/visual-spec.md](../mechanics/the-walk/visual-spec.md)*

---

## Design Intent

Input does not happen in a generic text box. It is a **ritual**—etching permanent marks onto glass, casting thoughts into the sky. The user is not filling a form; they are creating artifacts.

**Metaphor:** "The Glass Palimpsest" — A manuscript where identity is not a clean page, but layers of history.

---

## The Glass Tablet (`<GlassTablet />`)

### Container

| Attribute | Value |
|-----------|-------|
| **Geometry** | Rounded Rectangle (24px radius) |
| **Backdrop** | `blur(40px)` (Heavy blur) |
| **Background** | `rgba(25, 25, 25, 0.6)` (Midnight Oil tint, 80%) |
| **Border** | `1px solid rgba(255, 255, 255, 0.1)` (5-10%) |
| **Shadow** | Colored glow (Electric Teal/Coral dependent on sentiment), not black drop shadow |

### Typography

| Element | Specification |
|---------|---------------|
| **Input Font** | *Inter* (Sans), high tracking |
| **Size** | Large, centered |
| **Placeholder** | 40% opacity, elegant prompt |

### Entry Animation

| Transition | Specification |
|------------|---------------|
| **Enter** | Slides up from bottom (Spring physics) |
| **Exit** | Dissolves into the particle stream |

---

## The Etching Effect

As the user types, they are "carving" the data into the record:

| Effect | Specification |
|--------|---------------|
| **Cursor** | Glowing caret, pulsing gently |
| **Fresh Text** | Bright White (`#FFF`) |
| **Cooling** | After a few seconds, text "cools down" to Off-White (`#CCC`) |
| **Feel** | Permanent, consequential, deliberate |

---

## The Time Stack (History)

Previous days are **NOT** a flat scrolling list. They are glass panes stacked in **Z-depth**.

### Visual

| Layer | Specification |
|-------|---------------|
| **Today** | `z-index: 100`, Blur: 0 (if active) or 20px (if viewing map) |
| **Yesterday** | `z-index: 90`, Blur: 40px, Opacity: 0.5, Transform: `translateZ(-50px)` |
| **Older** | Faded out, barely visible |

**Feel:** Physical sense of "The Past" drifting away behind you.

### Interaction

| Action | Effect |
|--------|--------|
| **Swipe Down** | Current pane slides away, revealing yesterday's pane (blurred) |
| **Swipe Up** | Return to "Now" |

---

## The Casting Ritual

When the user completes the input (Daily Calibration), the text transforms into a star:

### Sequence

**Duration:** ~1500ms

1. **Condense (0-400ms)**
   - Text on the glass pane blurs
   - Characters swirl into a single glowing point (particle system)
   - Implosion effect toward center

2. **Cast (400-1000ms)**
   - The point shoots from the UI layer (2D) into the Depth (3D)
   - Via Cubic Bezier path to target coordinates ($r, \theta, z=0$)
   - Trail of particles follows

3. **Birth (1000-1500ms)**
   - Point lands at its location and explodes into Star Geometry
   - Radial shockwave ripples through nearby stars
   - If connections exist, lines animate to draw

4. **Result**
   - UI pane dissolves
   - User left looking at their new Star

**Feel:** The thought is now permanent, visible, real.

---

## Technical Implementation

### Hybrid Scene (HTML + WebGL)

| Technology | Usage |
|------------|-------|
| **Component** | `@react-three/drei` `<Html />` |
| **Reason** | Perfect text rendering, native keyboard inputs (Mobile) |
| **Positioning** | In 3D space, interacting with lighting/blur |
| **Occlusion** | HTML pane occludes stars behind it (via blur), but stars faintly visible (Context behind Action) |

### The Particle Transfer

**Challenge:** Moving an element from DOM (2D) to Canvas (3D).

**Solution:**
1. Get `ClientRect` of the "Submit" button
2. Project to Three.js World Coordinates: `vector.unproject(camera)`
3. Spawn Three.js particles at projected 2D coordinates
4. Animate particles to target `Vector3(x, y, z)`

```javascript
// Coordinate projection
const rect = inputRef.getBoundingClientRect();
const x = (rect.x / window.innerWidth) * 2 - 1;
const y = -(rect.y / window.innerHeight) * 2 + 1;
const vector = new THREE.Vector3(x, y, 0.5);
vector.unproject(camera);
```

---

## Submit Button

| Attribute | Value |
|-----------|-------|
| **Label** | "Cast Star" |
| **Style** | Minimalist text button |
| **Hover** | Glows, text brightens |
| **Disabled** | Dim, awaiting input |

**Note:** No aggressive "Submit" styling. The action is sacred, not urgent.

---

## Mobile Considerations

| Aspect | Adaptation |
|--------|------------|
| **Touch Targets** | Minimum 44x44px |
| **Keyboard** | Native keyboard, smooth viewport adjustment |
| **Animation** | Reduced particle count on low-end devices |

---

*"Input is not a form; it is a ritual. You are carving the data into the record."*
