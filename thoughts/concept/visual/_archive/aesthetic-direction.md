# Aesthetic Direction: Digital Renaissance ("Perplexity Style")

**Goal:** Shift the visual language from "Sci-Fi Dashboard" to "Intellectual Artifact".

## Core Visual Pillars

### 1. The "Digital Renaissance" Vibe
Instead of a cold, tech-focused interface, the aesthetic is:
- **Intellectual & Human:** Feels like a high-end magazine or a library from the future.
- **Serif Typography:** Uses high-contrast serifs (e.g., *Fraunces*, *Roslindale*, *Playfair*) for headlines to evoke wisdom and history.
- **Natural + Digital:** 3D glowing interfaces placed in organic settings (fields, oceans, floating in clouds) rather than void space.

### 2. Color Palette Shift
Moving away from "Matrix Green" or "Standard Dark Mode Blue".

| Role | Old Spec | **New "Perplexity" Spec** | Feel |
|------|----------|---------------------------|------|
| **Background** | Dark Night (#121822) | **Midnight Oil** (#191919) or **Warm Black** (#0F0E0E) | Softer, richer |
| **Accent 1** | Neon Cyan | **Electric Teal** (#2EB8AC) | Sharp, precise |
| **Accent 2** | Warm Coral | **Burnt Orange** (#C86B4D) | Organic warmth |
| **Text** | White | **Paper White** (#F0F0F0) or **Warm Grey** (#E6E6E6) | Ease on eyes |

### 3. Three.js / WebGL Treatments

**A. The "Ethereal" Star**
*   **Old:** Glowing sprites.
*   **New:** Volumetric points of light that feel like fiber optics or bokeh.
*   **Effect:** Heavy usage of **Chromatic Aberration** (RGB shift) at edges to make it feel like a photographed lens.

**B. The "Flow" Connections**
*   **Old:** Solid lines.
*   **New:** Long-exposure light trails. Thousands of tiny particles flowing along the path rather than a solid geometry. "Data streaming" feel.

**C. The Fog/Nebula**
*   **Old:** Perlin noise clouds.
*   **New:** "Oil Slick" or "Iridescent" fluid simulations. Swirling, mixing colors (Teal mixing with Orange) like ink in water.

### 4. UI Elements

*   **Glassmorphism:** High blurring (backdrop-filter: blur(20px)) with very thin, subtle white borders (1px, 10% opacity).
*   **Typography:**
    *   Headers: **Serif** (Wisdom/Soul)
    *   Data/Labels: **Mono** (Precision/Tech)
    *   Body: **Sans** (Clarity)

## Revised Three.js Spec Implications

1.  **Post-Processing is King:** The "Perplexity look" relies heavily on the *camera lens* feel.
    *   `ChromaticAberration`: Essential for that modern, slightly "analog" digital feel.
    *   `Noise`: Subtle film grain.
    *   `DepthOfField`: Aggressive tilt-shift look to focus on the active star.

2.  **Geometry:**
    *   Stars aren't just circles—they might be icosahedrons or abstract geometric shards that rotate.

3.  **Lighting:**
    *   Studio lighting setup (Rim lights) even in deep space to give volume to the "stars".

---

**Decision:** We will adopt this "Intellectual/Ethereal" aesthetic. It creates a stronger "moat" of quality (feeling like a luxury object) compared to generic gamified apps.
