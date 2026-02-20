# Life OS Visual Identity: The Digital Renaissance

> **Mission**: To build software that feels like a *living object*, not a tool.
> **Standard**: "God Tier" (Linear, Amie, Arc, Zenly).
> **Vibe**: The precision of a Swiss watch meets the warmth of a letter from an old friend.

---

## 1. The Physics Engine

We do not use `duration-300` or `ease-in-out`. We use **Spring Physics**.
Things should feel like they have *mass* and *friction*.

### The "Tension" System
*   **The Snappy (Inputs/Toggles)**: `stiffness: 400, damping: 30` (Fast, precise, zero bounce).
*   **The Float (Cards/Modals)**: `stiffness: 250, damping: 25` (Confident entry, slight settle).
*   **The Reveal (Insights)**: `stiffness: 120, damping: 20` (Slow, majestic, heavy).
*   **The Switch (Spatial)**: When moving between modes (Chat -> Contract), use `layoutId` morphing. The user never "navigates", they *transform* the view.

> **Rule**: If it moves, it uses a spring. No linear interpolations.
> **Rule**: Transitions are Spatial. You don't "load" a new page; you pan/zoom to it.

---

## 2. The Light Industry (Depth without Shadow)

Shadows are cheap. Light is expensive. We use **Glows** and **Reflections**.

*   **Dark Mode Elevation**: Instead of `box-shadow`, use `border-top: 1px solid rgba(255,255,255,0.1)`. This mimics light catching the top edge of glass.
*   **The "Spark" Glow**: When an insight appears, it doesn't just fade in. It casts a `shadow-[0_0_40px_-10px_rgba(224,122,95,0.5)]` (Coral) bloom that pulses once.
*   **Glassmorphism 2.0**: High blur (`backdrop-blur-xl`), low opacity (`bg-twilight-900/60`). It should look like frosted obsidian, not distinct layers.

---

## 3. The Texture of Truth (Tactility)

Clean digital vector perfection is "Tier 3". "Tier 1" has grain.

*   **The Noise Layer**: overlay a fixed `bg-noise` pattern (4% opacity) over the entire app. It stops the color banding and makes the dark mode feel like *paper*, not a screen.
*   **Haptic Choreography**:
    *   *Tap*: Crisp `impactLight` (Apple) / `tick` (Android).
    *   *Success*: `success` pattern (Double tap).
    *   *Error*: `warning` pattern (Heavy thud).
    *   *Wait*: Gentle, rhythmic `selection` clicks during AI thinking phases.

---

## 4. Typography: Editorial Power

We treat the screen like a magazine layout, not a form.

### The "Fraunces" Moment
Used *only* for "Truths" (The Contract, The Insight).
*   **Style**: Italicize heavily. Use the "Wonk" axis to make it feel hand-printed.
*   **Size**: Massive. `text-4xl` or `text-5xl` on mobile. Don't be afraid to fill the screen with 3 words.

### The "Inter" Workhorse
Used for the Chat.
*   **Tracking**: `-0.02em` (Tight).
*   **Leading**: `leading-relaxed`. Give the text room to breathe.
*   **Color**: Never pure white (`#FFFFFF`). Use `#E6EDF3` (Twilight-50) for crispness without eye bleed.

---

## 5. Micro-Interaction Choreography

### "The Elastic Chat"
When you scroll to the top of the chat, it shouldn't just stop. It should **stretch**.
*   Pulling down stretches the gap between messages slightly.
*   Releasing snaps them back with specific spring physics (`stiffness: 200`).

### "The Morphing Input"
The chat input isn't a static bar.
*   **Rest**: A pill at the bottom.
*   **Typing**: Expands to a rounded square.
*   **Sending**: The text flies *out* of the input, transforms into a bubble, and flies *into* the chat stream. The input bar *bounces* slightly from the recoil of sending.

### "The Insight Reveal"
1.  **Dim**: The entire UI fades to 20% opacity. Focus is absolute.
2.  **Ignite**: A single Coral spark appears in the center.
3.  **Unfold**: The card unfolds from the spark (Scale 0 -> 1, Y 20 -> 0).
4.  **Bloom**: The text fades in *staggered* (Headline -> Body -> Quote).

---

## 6. The "Momentum Contract" Artifact

This is the crown jewel. It must look physical.
*   **Aspect Ratio**: 3:4 (Portrait).
*   **Border**: Double border. Thin gold/coral line inside a thick obsidian frame.
*   **Background**: Sublime gradient (Deep Twilight -> Midnight Blue).
*   **Seal**: A rotatable, shiny "Wax Seal" UI element at the bottom. The user must *hold press* to stamp it (Haptic engine ramps up -> HEAVY THUD on complete).

---

## 7. Implementation Tokens (Tailwind)

```javascript
// tailwind.config.ts
colors: {
  twilight: {
    900: '#0D1117', // Obsidian
    800: '#161B22', // Charcoal
    glass: 'rgba(13, 17, 23, 0.8)'
  },
  coral: {
    glow: '#E07A5F', // The Spark
  },
  sage: {
    text: '#6B9080',
  }
},
animation: {
  'reveal': 'spring-reveal 0.6s linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 19%, 1.003 33.4%, 1.011 39.4%, 1)',
  'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',

---

## 8. The Invisible Dimensions (Audio & Empathy)

### 8.1. The Sound Design (Linear-style)
Sound is not decoration; it is confirmation.
*   **The "Click"**: Short (<50ms), crisp, high-frequency. Used for toggles.
*   **The "Thud"**: Low-frequency, heavy. Used for completing the Contract or a major section.
*   **The "Hum"**: A subtle, looping ambient texture during AI processing (Synthesis phase).
*   **Silence**: The default state. Sound is used *only* for state change confirmation.

### 8.2. The Zero State (Tabula Rasa)
A blank screen is a failure of imagination.
*   **No "Empty" Lists**: If the chat is empty, show a "Constellation" of possibility.
*   **The Canvas**: The background is never flat color. It has the `grain` texture + a subtle gradient that follows the mouse (Cursor Glow).


---

## 9. The Artifact Visualization ("Wrapped" Style)
The Momentum Contract is not a document; it is a **Story**. We steal shamelessly from **Spotify Wrapped**.

### 9.1. The Canvas (Mobile First)
*   **Aspect Ratio**: 9:16 (Vertical). This is built for Instagram Stories, not A4 paper.
*   **Color Drenching**: No white backgrounds. Deep Twilight (`#2D3A4F`) or Midnight Obsidian (`#0D1117`) floods the screen.
*   **The Grid**: Use a "Bento Box" layout to handle density.
    *   *Top Block (2x1)*: The "Title" (e.g., "The Refusal").
    *   *Middle Block (2x2)*: The "Evidence" (Data points/Quotes).
    *   *Bottom Block (2x1)*: The "Signature".

### 9.2. Kinetic Typography
Text is the hero image.
*   **Entrance**: Text does not fade in. It **flies in**. Staggered by line.
*   **Scale**: Key words ("Refusal", "Becoming") are massive (size-60px+), breaking the grid if necessary.
*   **Font**: Fraunces Italic for "Soul" words. Inter CAPS for data.

### 9.3. Shareability
*   **One Tap Export**: A floating action button "Share Design" generates a high-res PNG.
*   **The Badge**: A subtle watermark "The Right Questions" at the bottom center.

---

## 10. The Warmth Injection (Anti-Imposter Design)

> **Risk**: "This looks too 'Tech Bro'. I'm not a start-up founder."
> **Fix**: We must inject **Organic Warmth** to avoid the cold "Linear" feel.

### 10.1. Texture is Mandatory
*   **The Grain**: Never use flat hex codes. Always overlay a 4% `noise.png`.
*   **The Paper**: Light mode is not white (`#FFFFFF`); it is "Warm Milk" (`#FAF8F5`). Dark mode is "Deep Wood/Obsidian", not "Cyber Blue".

### 10.2. Color Balance
*   **Sage > Blue**: Use Sage Green (`#6B9080`) for success/growth. It implies *nature*, not *metrics*.
*   **Coral > Red**: Use Coral (`#E07A5F`) for alerts/actions. It implies *energy*, not *danger*.
*   **No "Neon"**: Avoid pure saturations (Cyan, Magenta). Keep colors earthy.

### 10.3. The Voice (TARS)
*   **Mentor, not Manager**:
    *   *Bad*: "Task complete. What's next?"
    *   *Good*: "That’s a heavy stone moved. How does it feel to put it down?"
*   **Validation**: Always validate the *effort* before asking for the *output*.



