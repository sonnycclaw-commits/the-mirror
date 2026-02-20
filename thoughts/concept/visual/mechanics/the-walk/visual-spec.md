# Visual Spec: The Walk (Journal & Input)

**System:** The Daily Calibration Loop
**Metaphor:** "The Glass Palimpsest" — Writing light onto clear sheets.

## 1. Visual Identity (Perplexity Aesthetic)

### The Container: "The Tablet"
Input does not happen in a generic white box. It happens on a floating pane of glass suspended above the universe.
*   **Geometry:** Rounded Rect (24px radius).
*   **Material:**
    *   `backdrop-filter: blur(40px)` (Heavy blur).
    *   `background: rgba(25, 25, 25, 0.6)` (Midnight Oil tint).
    *   `border: 1px solid rgba(255, 255, 255, 0.1)`.
*   **Shadow:** Colored glow (Electric Teal/Coral dependent on sentiment) instead of black drop shadow.

### The Input: "Etching"
*   **Font:** *Inter* (Sans) for input, but with high tracking.
*   **Effect:** As the user types, the cursor is a glowing caret. The text "cools down" from Bright White (`#FFF`) to Off-White (`#CCC`) after a few seconds.
*   **Metaphor:** You are carving the data into the record.

## 2. Interaction Design

### The Stack (History)
We don't scroll a flat list. We thumb through a **Time Stack**.
*   **Visual:** Previous days are panes "behind" the current pane (Z-depth).
*   **Interaction:**
    *   Swipe Down: The current pane slides away, revealing yesterday's pane (blurred).
    *   Swipe Up: Return to "Now".

### The Ritual: "Casting" the Star
When the user completes the input (Daily Calibration):
1.  **Condense:** The text on the glass pane blurs and swirls into a single glowing point (particle system).
2.  **Cast:** The point shoots from the UI layer (2D) into the Depth (3D).
3.  **Birth:** It lands at its location ($r = Now, \theta = Domain$) and explodes into the Star Geometry.
4.  **Result:** The UI pane dissolves, leaving the user looking at their new Star.

## 3. Technical Implementation

### Hybrid Scene (HTML + WebGL)
*   **Tech:** `@react-three/drei` `<Html />`.
*   **Why:** We need perfect text rendering and native keyboard inputs (Mobile), but we want it positioned in 3D space to interact with the lighting/blur.
*   **Occlusion:** The HTML pane should *occlude* the stars behind it (via blur), but the stars should still be faintly visible (the "Context" behind the "Action").

### The Particle Transfer
*   **Challenge:** Moving an element from DOM (2D) to Canvas (3D).
*   **Solution:**
    *   Get ClientRect of the "Submit" button.
    *   Spawn Three.js particles at projected 2D coordinates.
    *   Animate particles to the target Vector3 ($x, y, z$).
