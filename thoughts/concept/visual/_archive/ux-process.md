# UX Design Process & Gap Analysis

**Goal:** Align the S.T.A.R.S. project with a rigorous UX framework (reference: roadmap.sh/ux-design) to ensure we build the *right* thing before we build the *beautiful* thing.

## The Framework

We will follow the standard Design Thinking double-diamond approach:
**Discover (Empathize/Define) → Develop (Ideate/Prototype) → Deliver (Test/Implement)**

## Gap Analysis

| Phase | Key Activities | Status | Notes |
|-------|----------------|--------|-------|
| **1. Empathize** | User Research, Personas, Competitive Audit | ✅ **Done** | `00-vision.md`, `_deep_research`, `artist-brief.md` cover the "Why" and "Who". |
| **2. Define** | Problem Statement, Value Prop | ✅ **Done** | "GPS for the Soul", "Mirror made of Starlight". |
| | **Information Architecture (IA)** | ❌ **MISSING** | **CRITICAL GAP.** We don't have a sitemap or navigation structure. |
| | **User Flows** | ❌ **MISSING** | We have "Journeys" broadly (`07-onboarding`) but no specific screen-by-screen flows. |
| **3. Ideate** | Sketching, Wireframing (Low-Fi) | ❌ **MISSING** | We jumped straight to High-Fi visual definitions. |
| | Interaction Design (IxD) | ⚠️ **Partial** | `threejs-spec.md` defines mechanic interactions, but not holistic app interaction. |
| **4. Prototype** | High-Fidelity Design, Motion Design | ⚠️ **Premature** | We defined the Look (aesthetic) before the Structure (wireframes). |
| **5. Test** | Usability Testing, Accessibility | ⏳ **Pending** | Cannot test what hasn't been designed. |

---

## The "Retroactive" Process Plan

We need to pause the implementation of the Three.js prototype and fill the **Define & Ideate** gaps.

### Step 1: Information Architecture (IA)
**Goal:** Define the structural anatomy of the application.
*   **Deliverable:** Sitemap / Object Map.
*   **Questions:**
    *   What are the core "places" in the app? (Is it just the Star Map? Is there a Journal view? Settings? Profile?)
    *   How do you navigate between "The Mirror" (7-day history) and "The Walk" (Current)?

### Step 2: User Flows
**Goal:** Map the "Red Routes" (critical paths).
*   **Deliverable:** Flow Diagrams (Mermaid).
*   **Key Flows to Map:**
    1.  **Day 1 Entry:** Opening the app -> Answering a Question -> Seeing the first "Particle".
    2.  **Day 7 Reveal:** Completing the cycle -> Transition to Star Map -> Exploring the result.
    3.  **Daily Calibration:** Notification -> Input -> Star Update.

### Step 3: Low-Fidelity Wireframing
**Goal:** Layout functionality without aesthetic distraction.
*   **Deliverable:** Block-level layouts (Excalidraw/ASCII or Gray-box).
*   **Focus:**
    *   Where does the question text sit relative to the 3D map?
    *   How visible is the "Menu" or "TARS" chat interface?
    *   Mobile thumb zones.

### Step 4: High-Fidelity Prototyping (The "Perplexity" Layer)
**Goal:** *Now* we apply the `threejs-spec.md` and `aesthetic-direction.md`.
*   **Action:** Resume the Three.js implementation plan, but grounded in the wireframes from Step 3.

---

**Recommendation:** Proceed immediately to **Step 1: Information Architecture**.
