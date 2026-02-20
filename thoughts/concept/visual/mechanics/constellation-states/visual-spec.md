# Visual Spec: Constellation States (The Stars)

**System:** The Nodes of the Graph
**Metaphor:** "Living Data Crystals" — Insights solidified into geometry.

## 1. Visual Identity (Perplexity Aesthetic)

Stars are **NOT** 2D glowing sprites. They are **3D Physical Objects** floating in the aether. They look like jewelry or high-end semiconductor artifacts.

### The Material Strategy: "Glass & Light"
We use **Physical Based Rendering (PBR)** via `MeshPhysicalMaterial`.
*   **Transmission:** 1.0 (Glassy).
*   **Roughness:** 0.2 (Frosted polished glass).
*   **Thickness:** 1.5 (Volume).
*   **Internal Light:** Each star contains a point light that illuminates it *from within*.

## 2. The Archetypes

### ☆ BRIGHT STAR (The Diamond)
*   **Meaning:** Strength, Proven.
*   **Geometry:** **Icosahedron** (20 faces). Sharp, defined.
*   **Material:** Clear Crystal + Inner Gold Light (`#E07A5F`).
*   **Motion:** Slow, rhythmic rotation (Stable).
*   **Effect:** Casts caustic reflections on the "fog" around it.

### ✧ DIM STAR (The Stone)
*   **Meaning:** Shadow, Dormant.
*   **Geometry:** **Dodecahedron** (12 faces). Blunt, heavy.
*   **Material:** Matte "Moonstone" or slate. Low transmission. High roughness (0.8).
*   **Color:** Cool Grey (`#8A96AB`).
*   **Motion:** Stationary or very slow wobble.
*   **Effect:** Does not emit light. Only visible via rim-lighting from the environment.

### ✦ FLICKERING STAR (The Liquid)
*   **Meaning:** Emerging, Unsteady.
*   **Geometry:** High-poly **Sphere** with Vertex Displacement Shader.
*   **Material:** "Opals" — Iridescent, shifting colors (Sage Green `#6B9080` <-> Gold).
*   **Motion:** The surface *boils* or ripples (Perlin noise).
*   **Effect:** Light intensity varies chaotically (`sin(time * noise)`).

### ● DARK STAR (The Singularity)
*   **Meaning:** Gravity Well, Avoidance.
*   **Geometry:** Perfect Sphere.
*   **Material:** "Vantablack" (Pure black, roughness 1.0).
*   **Shader Effect:** **Gravitational Lensing**. It bends the light of stars *behind* it. (Refraction shader with negative IOR or screen-space distortion).
*   **Motion:** None. It is a hole in simple space.

## 3. Interaction

### Hover State
*   **Physics:** The star floats *up* towards the camera (z-axis translation).
*   **Selection:** A rigid white wireframe appears surrounding the crystal shape (The "blueprint" overlay).
*   **Sound:** A subtle "glass ting" sound.

### Discovery Animation (Spawn)
1.  A wireframe draws the shape first.
2.  The liquid "glass" fills the volume.
3.  The internal light snaps on.
