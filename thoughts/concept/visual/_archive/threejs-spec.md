# S.T.A.R.S. Three.js Technical Specification

**Status:** Draft
**Context:** Defines the WebGL implementation for the "Mirror made of Starlight".
**Stack:** React 19, Vite, Three.js, React Three Fiber (R3F), Drei, Maath.

---

## 1. Scene Architecture

### Coordinate System
The app uses a **Polar Coordinate System** ($r, \theta$) mapped to 3D Cartesian ($x, y, z$).

$$
x = r \cdot \cos(\theta)
$$
$$
y = r \cdot \sin(\theta)
$$
$$
z = 0 \quad (\text{Primary Plane})
$$

- **$r$ (Radius):** Represents Time. Center ($r=0$) is "Now". Outer edge ($r=MAX$) is Future/Projection.
- **$\theta$ (Angle):** Represents Life Domains.
    - $0^{\circ} / 360^{\circ}$: **Soul**
    - $90^{\circ}$: **Purpose**
    - $180^{\circ}$: **Career**
    - $270^{\circ}$: **Relationships**
    - $315^{\circ}$: **Health**

*Note: Visual aesthetic may add slight $z$-variance (depth) to creates parallax, but logical interaction remains on the $xy$ plane.*

### Scene Graph
```mermaid
graph TD
    Canvas --> OrbitControls
    Canvas --> EffectComposer
    EffectComposer --> Bloom
    EffectComposer --> Noise/Vignette

    Canvas --> ParallaxGroup
        ParallaxGroup --> SkyBackground (Sphere)
        ParallaxGroup --> Fog

    Canvas --> MainContentGroup
        MainContentGroup --> PolarGrid (Lines/Axes)
        MainContentGroup --> ConstellationGroup
            ConstellationGroup --> ConnectionLines (Badge/MeshLine)
            ConstellationGroup --> Stars (InstancedMesh + Shader)
            ConstellationGroup --> StarLabels (Html/Text)
```

---

## 2. Component Design

### 2.1 The Stars (`<StarSystem />`)
**Challenge:** We need efficient rendering of 50-100 stars with unique properties (color, pulse, size).
**Solution:** `InstancedMesh` with custom `ShaderMaterial` or `Drei/Instance` if strictly <100 stars. Given the small count (<100), individual Mesh components with shared geometry/materials are acceptable for R3F ease of use, but `InstancedMesh` is safer for mobile performance.

**Shader Props (Uniforms):**
- `uTime`: Global time for pulse/flicker.
- `uColor`: Base color derived from Star Type.
- `uType`: Integer (0=Bright, 1=Dim, 2=Flickering, 3=Dark).
- `uIntensity`: Current "brightness" value [0.05 - 1.0].
- `uResonance`: For interaction feedback.

**Star Archetypes (Shader Logic):**
- **Bright:** High emission, steady pulse sin(t).
- **Dim:** Low opacity, no emission.
- **Flickering:** Perlin noise modulates opacity/emission speed.
- **Dark:** Negative emission (subtractive blending or black core with reverse rim light).

### 2.2 The Connections (`<SynapseWeaver />`)
**Metaphor:** "Living Mycelium" (Biological Network).
**Technical Goal:** Avoid "Vector Graphics" look. Create "Organic Growth".

**The "Mycelium" Shader:**
Instead of a standard line, we use a custom `ShaderMaterial` on a `MeshLine` geometry.
*   **Uniforms:**
    *   `uGrowth`: Float (0.0 to 1.0). Controls the "write" progress.
    *   `uNoiseTexture`: Perlin noise for width modulation.
    *   `uPulse`: Time-based float for signal transmission.
*   **Vertex Logic:**
    *   *Width Jitter:* `vWidth = baseWidth * (1.0 + texture2D(uNoiseTexture, uv).r * 0.5)`. Makes the line uneven, like a root.
    *   *Taper:* Width approaches 0 at `uv.x` (head) and `uv.x - uLength` (tail).
*   **Fragment Logic:**
    *   *The Head:* A bright "growth tip" (Color A + Boost).
    *   *The Body:* Color A mixing to Color B (Gradient).
    *   *Alpha Map:* Use noise to create "gaps" or "spores" in the line, preventing a solid plastic look.

### 2.3 The Sky (`<DeepSpace />`)
... (Existing Sky Content) ...

### 2.4 The Walk (Input Layer)
**Metaphor:** "The Glass Palimpsest" (Layered History).
**Technical Goal:** Seamless 2D DOM -> 3D WebGL transition.

**The "Particle Transfer" System:**
This mechanism bridges the separation between `<Html>` (React) and `<Canvas>` (Three.js).

1.  **The Trigger:** User hits "Enter" on the Glass Tablet.
2.  **Coordinate Projection:**
    *   Get `rect = inputRef.getBoundingClientRect()`.
    *   Project `rect.x, rect.y` to Three.js World Coordinates (`vector.unproject(camera)`).
3.  **The Swarm:**
    *   Instantiate 50 particles at the 2D projected plane.
    *   **Phase 1 (Condense):** Particles swirl inward to a single center point (Implosion).
    *   **Phase 2 (Travel):** The center point moves via Cubic Bezier to the Target Star coordinates ($r, \theta, z=0$).
    *   **Phase 3 (Impact):** Spawns the `<Star />` mesh and a radial shockwave.
4.  **Clean Up:** Unmount the HTML Tablet.

**Z-Layering Logic (The Palimpsest):**
*   **Today:** `z-index: 100`, Blur: 0 (if active) or 20px (if viewing map).
*   **Yesterday:** `z-index: 90`, Blur: 40px, Opacity: 0.5, Transform: `translateZ(-50px)`.
*   **Older:** Faded out.
*   This creates a physical sense of "The Past" drifting away.
### 2.3 The Sky (`<DeepSpace />`)
**Geometry:** Large inverted Sphere or Box.
**Material:** Custom Shader based on **Volumetric Raymarching**.
-   **Gradient:** "Midnight Oil" (#191919) -> "Deep Void" (#0F0E0E).
-   **Fog:** Volumetric "swirls" (Perlin noise) of Deep Teal and Burnt Orange.
-   **Artifacts:** Occasional "dust motes" floating in the foreground (Parallax layer).

### 2.4 The Walk (Input Layer)
**Metaphor:** "The Glass Palimpsest".
**Implementation:** Hybrid HTML/WebGL.
-   **The Pane:** `<Html transform>` plane with `backdrop-filter: blur(40px)`.
-   **The Ritual:** When submitting, the text on the pane *condenses* into a glowing particle, which physically travels (using `lerp` vector physics) from the 2D plane into the 3D grid, exploding into the new Star.

### 2.5 Brightness Decay (Entropy)
**Metaphor:** "The Garden Weeding".
**Visual:**
-   **Dust:** Old/Neglected stars accumulate a "noise shell" (dust) that dulls their refraction.
-   **Desaturation:** Color vibrancy ($uSaturation$) slowly drops over time (via `uLastActive` uniform).
-   **Revival:** Interacting with a dimmed star triggers a "Cleaning" shockwave, blowing off the dust and restoring the internal light.

### 2.6 Phase Transitions (Celebration)
**Metaphor:** "Dawn Breaking".
**Visual:**
-   **Global Illumination:** The ambient light of the entire scene shifts (e.g., from Blue-Black to dawn Gold).
-   **The Pulse:** A shockwave ripple passes through *every* connection line, lighting them up in sequence.
-   **No Fireworks:** We rely on lighting atmosphere shifts rather than particle explosions.

---

## 3. Interaction Model

### Camera & Controls
- **OrbitControls:**
  - `enableRotate`: True (constrained polar/azimuthal angles to keep view "top-down" but allow slight tilt).
  - `enableZoom`: True (clamp min/max distance).
  - `enablePan`: False (keep user centered).
  - `dampingFactor`: 0.05 (heavy, smooth feel).

### Raycasting
- Hit-testing on Stars only.
- Threshold: Increase hit radius (invisible sphere) around visible stars to 40px equivalent.

### Events
- **Hover:**
  - Cursor changes to pointer.
  - Star scale: 1.0 -> 1.2 (spring anim).
  - Connected lines brighten.
  - Optional: Tooltip/Label opacity 0 -> 1.
- **Click:**
  - Camera pans to focus star (smooth interpolate).
  - "Detail View" overlay appears (DOM).

---

## 4. Post-Processing Stack (The "Lens" Look)

**Library:** `@react-three/postprocessing`

To achieve the "Perplexity/Digital Renaissance" aesthetic, we heavily simulate camera lens artifacts to make the digital objects feel photographed.

1.  **Chromatic Aberration:**
    *   **Crucial for the style.** Adds RGB shift at edges.
    *   Offset: `[0.002, 0.002]` (Subtle but present).
2.  **Depth of Field (Bokeh):**
    *   Focus distance set to current active star ($r$).
    *   High blur for background/foreground elements to create aggressive "macro photography" feel.
3.  **Bloom (Selective):**
    *   Softer, more diffuse glow.
    *   `luminanceThreshold`: 0.6, `intensity`: 1.2.
4.  **Noise (Film Grain):**
    *   Opacity: 0.15 (Higher than standard to simulate high ISO film).
    *   Overlay mode.

---

## Revised Component Visuals

### Stars as "Data Artifacts"
Instead of flat sprites, stars are **3D Geometric Shards** (Icosahedrons) with:
- **Material:** `MeshPhysicalMaterial` with `transmission` (glass), `roughness: 0.2`, and `thickness: 1.5`.
- **Inner Light:** A point light inside the glass shell.
- **Effect:** They refract the background nebula and catch the "rim light".

### Connections as "Light Streams"
- **Geometry:** `MeshLine` with custom shader.
- **Texture:** Animated "dash" texture moving rapidly.
- **Feel:** Fiber optic cables transferring data, not precise vector lines.
- **Color:** Gradient from Start Star color to End Star color.
*Performance Check:* On low-end mobile, disable Bloom and fall back to simple Sprite "glow" textures.

---

## 5. Mobile Considerations

- **DPR:** Clamped to 2 (don't render 3x on high-end screens to save battery).
- **Geometry:** Low poly sphere for sky.
- **Touch Targets:** Minimum 44x44px hit areas.
- **Reduce Motion:** Respect system preference (disable parallax/camera sway if requested).

---

## 6. Implementation Plan (Prototype)

1.  **Setup:** `npx create-vite app --template react-ts`
2.  **Deps:** `three @types/three @react-three/fiber @react-three/drei @react-three/postprocessing maath framer-motion meshline`
3.  **Milestone 1:** Static Sky + Grid (`PolarGridHelper`).
4.  **Milestone 2:** Custom Shader for Stars (based on `react-three-fiber-shader-galaxy` concepts).
5.  **Milestone 3:** Connections using `MeshLine` for organic curves.
6.  **Milestone 4:** Bloom & Polish.

---

## 7. Resources & References

- **Stars:** `sugaith/react-three-fiber-shader-galaxy` (Shader reference)
- **Lines:** `threejs-meshline` (Active curve rendering)
- **Grid:** `THREE.PolarGridHelper` (Built-in)
- **Nebula:** Volumetric Raymarching (Gold standard) or `three-nebula` (Fallback)
