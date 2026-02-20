# Visual Spec: The Horizon (Star Map)

**System:** The Core Visualization Canvas
**Metaphor:** "The Observatory Lens" — Looking through a high-end optical instrument at a private universe.

## 1. Visual Identity (Perplexity Aesthetic)

### Background: "Midnight Oil"
Instead of a generic black/blue space, we use a rich, warm dark tone that feels like paper or old library leather in low light.
*   **Gradient:** Radial. Center: `#1A1A1A` (Warm Grey) → Edge: `#0F0E0E` (Deep Espresso Black).
*   **Texture:** Subtle "Canvas" or "Paper" grain noise overlay (3% opacity).

### Atmosphere: "The Aether"
The space is not empty. It has a palpable thickness, like fluid.
*   **Technique:** Volumetric Fog (Raymarched or Layered Sprites).
*   **Color:** Deep Teal `#1A2F33` mixing with Burnt Orange `#331A15` in very subtle, dark swirls.
*   **Effect:** Light from stars "catches" in the fog, creating shafts of light (God Rays).

### The Lens (Post-Processing)
Crucial for the "Intellectual/Artifact" feel. The view is not raw data; it is *photographed*.
1.  **Chromatic Aberration:** RGB split at the edges (0.2%). Makes it feel like a physical lens.
2.  **Film Grain:** ISO 1600 noise. Removes the "digital smoothness".
3.  **Vignette:** heavy soft darkening at corners to focus attention.
4.  **Depth of Field:** Aggressive tilt-shift. Only the center (or selected star) is sharp. Foreground/Background is creamy bokeh.

## 2. Three.js Implementation

### The Polar Grid (`<PolarManifold />`)
The grid lines ($r, \theta$) are not glowing "Tron" lines. They are subtle "etchings" in the glass of the lens.
*   **Visual:** Thin lines (0.5px), White at 5% opacity.
*   **Behavior:** They fade in/out based on zoom level.
*   **Geometry:** `PolarGridHelper` modified to act as a "floor" or "ceiling" to the star volume.

### Camera State
*   **Default:** Top-down (Polar view).
*   **Parallax:** When dragging, the camera rotates slightly (Azimuthal) to reveal the 3D depth of the stars (they are not all on $z=0$, they wobble by $\pm 5$ units).

## 3. UI Overlay (The HUD)

All UI elements float *above* the lens, on the glass surface.

### Date Scrubber (`<TimeRail />`)
*   **Location:** Bottom Center.
*   **Visual:** A thin "hairline" track.
*   **Thumb:** A glowing "prism" (glass pill).
*   **Labels:** Serif font (*Fraunces*). "NOV 2025".

### Domain Filters (`<LensFilters />`)
*   **Location:** Top Right stack.
*   **Visual:** Glass chips.
*   **State:**
    *   *Active:* Border highlighted (Electric Teal), text white.
    *   *Inactive:* Transparent, text grey.

## 4. Interaction Design
*   **Pinch:** Zoom in (Blur increases on edges).
*   **Drag:** Pan around the timeline.
*   **Double Tap:** Reset to "Now".
