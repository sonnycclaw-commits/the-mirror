# HUD Visual Specification

**The Heads-Up Display — Controls floating on the lens**

> *Source: [mechanic-ui-inventory.md](../_archive/mechanic-ui-inventory.md)*

---

## Design Intent

All UI elements float **above** the WebGL canvas, on the glass surface. They are **non-diegetic**—the user's lens controls, not objects in the world.

**Aesthetic:** Digital Renaissance (Perplexity) — Glass, Serif, Thin Lines, Ethereal.

---

## Aesthetic Rules

### Borders
All floating elements: `1px solid rgba(255,255,255,0.08)`

### Shadows
- No diffuse drop shadows
- Use **Glows** (colored shadows) or distinct ambient occlusion

### Corner Radius
- Outer containers: 24px (Soft)
- Inner elements: 4px (Sharp/Tech)

### Blur
Heavy: `backdrop-filter: blur(24px)`

---

## The Date Scrubber (`<TimeRail />`)

**Function:** Navigate through the user's history (r radius — time dimension).

| Attribute | Value |
|-----------|-------|
| **Location** | Bottom center |
| **Track** | Very thin white line, opacity 0.2 |
| **Thumb** | Glowing minimalist pill (Glass) |
| **Labels** | Serif font (*Fraunces*): "NOV 2025" |
| **Interaction** | Magnetic snap to key events (Star births) |

**Feel:** Like turning brass dials on an astrolabe—mechanical precision.

**Behavior:**
- Resistance in rotation
- Etched markings, precise ticks
- Haptic feedback on snap points (if supported)

---

## Domain Filters (`<LensFilters />`)

**Function:** Toggle visibility of the 5 domains (Soul, Purpose, Career, Relationships, Health).

| Attribute | Value |
|-----------|-------|
| **Location** | Top-right floating stack |
| **Shape** | Pill-shaped chips |
| **Border** | Stroke-only (1px) |
| **Text** | Serif font (*Fraunces*) |

### States

| State | Visual |
|-------|--------|
| **Active** | Fills with low-opacity domain color (e.g., Electric Teal 10%), border highlighted, text white |
| **Inactive** | Text only, 40% opacity |

---

## State Toggles

**Function:** Switch view modes (e.g., "Show Connections", "Heatmap").

**Visual:** Segmented Control style, but glassmorphic.

---

## Star Card (`<StarCard />`)

**Function:** Quick summary of a star on hover/tap.

### Visual

| Attribute | Value |
|-----------|-------|
| **Container** | Frosted Glass (Blur 20px), Border 1px White (10%) |
| **Title** | *Fraunces* (Serif), Large |
| **Subtitle** | Inter (Mono), Small, Uppercase: "STRENGTH • DAY 7" |
| **Content** | Trait name (e.g., "Radical Honesty"), Mini-sparkline of intensity over time |
| **Motion** | Spring-loaded pop-in near cursor/star |

---

## Deep Dive Panel

**Function:** Full detail view when clicking a star.

| Attribute | Value |
|-----------|-------|
| **Desktop** | Slide-over panel from right |
| **Mobile** | Bottom sheet |
| **Background** | Deep "Midnight Oil" (Solid, not glass) to focus reading |
| **Layout** | Magazine style, large Serif headers |

---

## Edge Labels

**Function:** Explains *why* two stars are connected.

| Attribute | Value |
|-----------|-------|
| **Location** | Tiny floating tag on connection line center |
| **Background** | Solid Black |
| **Text** | White Mono, 10px |
| **Icon** | Micro-icon (Link, Clash, Cause) |

---

## TARS Interface Layer

### The "Observed" Toast (`<TarsObservation />`)

**Function:** TARS commenting on a change (e.g., "This connection is strengthening").

| Attribute | Value |
|-----------|-------|
| **Location** | Floating pill at top center |
| **Icon** | TARS geometric logo (pulsing) |
| **Text** | Italic Serif: "*A pattern is emerging here...*" |
| **Animation** | Drift in → Pause → Drift out |

---

## Phase Toast

**Function:** Celebrate phase transitions.

| Attribute | Value |
|-----------|-------|
| **Location** | Center Screen |
| **Visual** | Elegant Serif text: "EMERGING PHASE" |
| **Style** | No background. Just white text with heavy Gaussian blur shadow (Halo) |
| **Animation** | Fade in slow (2s) |

---

## Cleaning Tool (Entropy Interaction)

When hovering a "Dusty" star:

| Attribute | Value |
|-----------|-------|
| **Cursor** | "Lens Cloth" icon or soft glow brush |
| **Action** | Circular rubbing motion (client-side physics) clears the noise |
| **Feedback** | Dust particles disperse, star brightens |

---

## Responsive Behavior

### Mobile Adaptations

| Element | Mobile Behavior |
|---------|-----------------|
| Date Scrubber | Full width, larger thumb |
| Domain Filters | Horizontal scroll or bottom sheet |
| Star Cards | Full-width bottom sheet |
| Deep Dive | Full-screen modal |

### Touch Targets

All interactive elements: minimum 44x44px hit area.

---

*"UI elements are like glass plates in an optical instrument—they slightly blur and distort what's behind them, creating depth and focus."*
