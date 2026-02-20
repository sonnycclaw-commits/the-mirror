# Mechanic UI Inventory: The Star Map

**Scope:** UI elements specifically for the "Star Map" visualization and interaction.
**Aesthetic:** Digital Renaissance (Perplexity) — Glass, Serif, Thin Lines, Ethereal.

## 1. The HUD (Heads-Up Display)

These controls float above the WebGL canvas.

### 1.1 The Date Scrubber (Time Travel)
*   **Function:** Navigate through the user's history ($r$ radius).
*   **Visual:**
    *   Horizontal rail at bottom center.
    *   **Thumb:** Glowing minimalist pill (Glass).
    *   **Track:** Very thin white line (opacity 0.2).
    *   **Labels:** Serif font years/months ("NOV 2025").
    *   **Interaction:** Magnetic snap to key events (Star births).

### 1.2 Domain Filters
*   **Function:** Toggle visibility of the 5 domains (Soul, Purpose, etc.).
*   **Visual:**
    *   Top-right floating stack.
    *   **Chip:** Pill-shaped, stroke-only (1px), Serif text.
    *   **Active:** Fills with low-opacity domain color (e.g., Electric Teal 10%).
    *   **Inactive:** Text only, 40% opacity.

### 1.3 State Toggles
*   **Function:** Switch view modes (e.g., "Show Connections", "Heatmap").
*   **Visual:** "Segmented Control" style, but glassmorphic.

## 2. Star Interaction Elements

### 2.1 The "Star Card" (Hover/Tap)
*   **Function:** Quick summary of a star.
*   **Visual:**
    *   **Container:** Frosted Glass (Blur 20px), Border 1px White (10%).
    *   **Typography:**
        *   Title: *Fraunces* (Serif), Large.
        *   Subtitle: Inter (Mono), Small, Uppercase ("STRENGTH • DAY 7").
    *   **Content:**
        *   "Trait Name" (e.g., "Radical Honesty").
        *   Mini-sparkline of intensity over time.
    *   **Motion:** Spring-loaded pop-in near the cursor/star.

### 2.2 The "Deep Dive" Panel (Click)
*   **Function:** Full detail view.
*   **Visual:**
    *   Slide-over panel from right (Desktop) or Bottom Sheet (Mobile).
    *   **Background:** Deep "Midnight Oil" (Solid, not glass) to focus reading.
    *   **Layout:** Magazine style layout. Large Serif headers.

## 3. Connection Elements

### 3.1 Edge Label
*   **Function:** Explains *why* two stars are connected.
*   **Visual:**
    *   Tiny floating tag on the line center.
    *   **bg:** Solid Black.
    *   **Text:** White Mono, 10px.
    *   **Icon:** Micro-icon (Link, Clash, Cause).

## 4. TARS Interface Layer

### 4.1 The "Observed" Toast
*   **Function:** TARS commenting on a change (e.g., "This connection is strengthening").
*   **Visual:**
    *   Floating pill at top center.
    *   **Icon:** TARS geometric logo (pulsing).
    *   **Text:** Italic Serif ("*A pattern is emerging here...*").
    *   **Animation:** Drift in -> Pause -> Drift out.

---

## Aesthetic Rules (Perplexity Style)

1.  **Borders:** All floating elements have a `1px solid rgba(255,255,255,0.08)` border.
2.  **Shadows:** No diffuse drop shadows. Use **Glows** (colored shadows) or distinct ambient occlusion.
3.  **Corner Radius:**
    *   **Outer Containers:** 24px (Soft).
    *   **Inner Elements:** 4px (Sharp/Tech).
4.  **Blur:** Heavy (`backdrop-filter: blur(24px)`).

## 5. Input Layer (The Walk)
*   **Component:** `<GlassTablet />`
*   **Visual:**
    *   **Backdrop:** `blur(40px)`, Tint `#111` (80%), Border `1px white` (5%).
    *   **Typography:** Large, centered Serif input.
    *   **Button:** "Cast Star" — Minimalist text button, glows on hover.
*   **Transition:**
    *   *Enter:* Slides up from bottom (Spring physics).
    *   *Exit:* Dissolves into the particle stream.

## 6. Entropy & Celebration (System Feedback)
*   **Cleaning Tool (Decay):**
    *   When hovering a "Dusty" star, the cursor becomes a "Lens Cloth" icon (or soft glow brush).
    *   *Action:* Circular rubbing motion (client-side physics) clears the noise.
*   **Phase Toast (Celebration):**
    *   **Location:** Center Screen.
    *   **Visual:** Elegant Serif text ("EMERGING PHASE").
    *   **Style:** No background. Just white text with heavy Gaussian blur shadow (Halo).Fade in slow (2s).

---

## Aesthetic Rules (Perplexity Style)
