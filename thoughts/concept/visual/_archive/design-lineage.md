# Design Lineage & Interaction Patterns

**Goal:** Anchor the visual system in historical precedents and established interaction patterns, moving beyond "trends" to "timeless utility."

## 1. Historical & Artistic Inspirations

### The Horizon → *The Astrolabe*
*   **Source:** Medieval astronomical instruments (14th Century).
*   **Why:** They managed infinite complexity (the sky) through mechanical precision and circular layers.
*   **Application:** Our "Date Scrubber" and "Polar Grid" should act like brass/glass mechanical rings. They don't just "show" data; they *mechanically operate* it.
    *   *Detail:* Etched markings, precise ticks, resistance in the rotation.

### The Walk → *The Palimpsest*
*   **Source:** Ancient manuscripts where new text was written over scrapped old text.
*   **Why:** Identity is not a clean page; it is layers of history.
*   **Application:** "The Walk" UI isn't a flat feed. It's clear glass sheets stacked in Z-space. Old entries are visible *behind* today's entry (blurred). New insights "etch" onto the top layer.

### Connections → *The Synapse & The Weaver*
*   **Source:** Biological neural networks and Microscopic Mycelium.
*   **Why:** Thoughts don't follow straight vectors. They "grow" path of least resistance.
*   **Application:** Connections shouldn't be perfect Bezier curves drawn by a computer. They should look like *growth*. They jitter, they pulse, they are thicker at the source and seek the destination.

### Stars → *The Cabinet of Curiosities*
*   **Source:** 17th Century *Wunderkammer*.
*   **Why:** Each object (Star) is a unique specimen collected from the user's psyche.
*   **Application:** When inspecting a star, it shouldn't look like a generic icon. It should float and rotate like a gemstone in a museum case. It is precious.

## 2. Core Interaction Patterns

### Diegetic vs. Non-Diegetic
*   **Diegetic (In the World):** The Stars, The Connections, The Nebula. These are *real* objects in the simulation. We interact with them via physics (touch, push).
*   **Non-Diegetic (The HUD):** The Date Scrubber, Filters. These are the "Lens" controls. They sit *on the glass*.

### Spatial Memory
*   **Pattern:** "I left it there."
*   **Rule:** The graph is deterministic. If "Career" is at 180°, it *always* stays there. If a Star was born in Nov 2025 at radius $r$, it never moves. The user builds a "Memory Palace" of their life.

### Progressive Disclosure (The "Zoom" Pattern)
*   **Macro (The Sky):** See the shape. (Pattern recognition).
*   **Meso (The Constellation):** See the connections. (Logic).
*   **Micro (The Specimen):** See the star details. (Introspection).
*   **Rule:** Labels fade in/out based on camera distance (LOD - Level of Detail).

### Ritual Input
*   **Pattern:** Input is not a form; it is a ritual.
*   **Implementation:** Answering a prompt for "The Mirror" shouldn't be a text box. It should be "Etching a Plate."
    *   *Visual:* The text glows as you type.
    *   *End:* You "Cast" the thought into the sky, and watch it become a star.
