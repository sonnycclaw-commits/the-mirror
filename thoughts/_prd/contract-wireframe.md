# Momentum Contract: The Idealized Design

> **Concept**: A "Spotify Wrapped" for your soul.
> **Format**: 6 "Story Slides" (Tap to advance) -> 1 "Final Artifact" (Save to Wallpaper).
> **Aesthetic**: Digital Renaissance (Deep Twilight, Fraunces, Glows).

---

## 1. The Story Arc (The Reveal)
Before the user sees the final contract, they swipe through the *journey*.

### Slide 1: The Refusal (The Mirror)
*   **Visual**: Dark Obsidian background. Single spotlight.
*   **Big Text (Fraunces)**: *"You said you were tired of creating chaos."*
*   **Small Text**: *"Wednesday, 8:42 PM"* (Evidence).
*   **Motion**: Text scales down slowly (The "Sink" effect).

### Slide 2: The Becoming (The Ambition)
*   **Visual**: Deep Twilight gradient. Rising particles.
*   **Big Text**: *"But you want to become a Fortress."*
*   **Data**: "Safety" and "Control" were your top 2 values to protect.

### Slide 3: The Proof (The Evidence)
*   **Visual**: Sage Green highlight.
*   **Content**: A specific quote from the user that proves they can do it.
*   **Style**: "Quote Card" aesthetic with large quotation marks.

### Slide 3.5: The Draft (The Co-authorship)
*   **Visual**: "Pencil Sketch" / "Notebook" aesthetic. Low fidelity.
*   **Content**: The AI presents the proposed "Rule" and "Goals".
*   **Interaction**: A "Confirm" button that says "This is true." and an "Edit" button.
*   **Psychology**: This prevents the "Horoscope Effect". The user *chooses* to accept the contract, giving them ownership.

### Slide 4: The Strategy Map (The Walk)
*   **Visual**: A vertical "Constellation Path" drawing downwards.
*   **Nodes**:
    1.  **The North Star** (1 Year): "The Vision" (e.g., "Full-time Creator").
    2.  **The Proof** (1 Month): "The Validation" (e.g., "$1k MRR").
    3.  **The Test** (1 Week): "The Experiment" (e.g., "Post daily").
    4.  **The Spark** (Today): "The Ignition" (e.g., "Write 1 tweet").
*   **Motion**: The line draws from Future (Top) to Present (Bottom), grounding the dream in reality.

> **Note**: This slide is dynamically generated from Phase 4. If the user was vague, this map "crystallizes" as they answer the drill-down questions.


---

## 2. The Final Artifact (The "One-Sheet")
This is the single 9:16 image the user saves. It uses a **Bento Grid** layout.

### The Layout Strategy (See Image)
We divide the screen into a 4x4 Grid.

```html
<!-- The Container: 9:16 Aspect Ratio, Deep Twilight Background -->
<div class="w-full h-full bg-[#2D3A4F] p-6 grid grid-cols-2 grid-rows-6 gap-4 font-inter text-[#FAF8F5]">

  <!-- Block 1: The Title (The Vow) spans top 2 rows -->
  <div class="col-span-2 row-span-2 rounded-3xl bg-[#0D1117]/30 border border-white/10 p-6 relative overflow-hidden flex flex-col justify-end">
    <!-- Glow Effect -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-[#E07A5F] blur-[60px] opacity-40"></div>
    <h3 class="uppercase tracking-widest text-xs text-white/60 mb-2">My Momentum Contract</h3>
    <h1 class="font-fraunces italic text-4xl leading-tight text-white">
      I Refuse the<br>
      <span class="text-[#E07A5F]">Chaos.</span>
    </h1>
  </div>

  <!-- Block 2: The Core Rule (The Compass) - Middle Left -->
  <div class="col-span-1 row-span-2 rounded-3xl bg-[#6B9080]/20 border border-white/5 p-5 flex flex-col justify-between backdrop-blur-md">
    <div class="w-8 h-8 rounded-full bg-[#6B9080] flex items-center justify-center">
      <!-- Compass Icon -->
      <svg class="w-4 h-4 text-[#0D1117] relative z-10">...</svg>
    </div>
    <div>
      <h4 class="text-[10px] uppercase opacity-70 mb-1">The Rule</h4>
      <p class="font-fraunces text-lg leading-snug">"Wait for the signal."</p>
    </div>
  </div>

  <!-- Block 3: The Proof (Data) - Middle Right -->
  <div class="col-span-1 row-span-2 rounded-3xl bg-[#0D1117]/30 border border-white/5 p-5 flex flex-col items-center justify-center text-center relative">
    <span class="text-4xl font-fraunces mb-2">3x</span>
    <p class="text-xs text-white/60">You chose <br>Safety over Speed.</p>
    <!-- Grain Texture Overlay -->
    <div class="absolute inset-0 bg-noise opacity-10"></div>
  </div>

  <!-- Block 4: The Signature (The Seal) - Bottom -->
  <div class="col-span-2 row-span-2 rounded-3xl border-2 border-[#E07A5F]/30 p-6 flex items-center justify-between bg-gradient-to-r from-[#0D1117] to-[#2D3A4F]">
    <div class="flex flex-col">
      <span class="font-dancing-script text-3xl text-white/50 rotate-[-5deg]">Joel Chan</span>
      <span class="text-[10px] uppercase tracking-widest mt-2 text-[#E07A5F]">Signed & Sealed</span>
    </div>
    <!-- Wax Seal Element -->
    <div class="w-16 h-16 rounded-full bg-[#E07A5F] shadow-[0_0_20px_rgba(224,122,95,0.4)] flex items-center justify-center">
      <span class="font-fraunces font-bold text-[#0D1117]">TRQ</span>
    </div>
  </div>

</div>
```

---

## 3. Visual Details
*   **The "Coral Bloom"**: Notice the blurred coral orb in Block 1. This separates the header from the background.
*   **Texture**: The "Proof" block has visible film grain.
*   **Typography**:
    *   *Title*: Fraunces Italic (Emotional).
    *   *Data*: Inter Tight (Structural).
    *   *Signature*: Handwritten script (Personal).
*   **Borders**: Extremely subtle (`border-white/10`). We rely on the *contrast* of the blocks against the background to define shape.
