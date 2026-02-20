# Sprint 9: Visual Polish & Critical Fixes

> **Goal**: Transform The Mirror from functional MVP to "God Tier" experience matching the Digital Renaissance visual identity spec.

**Created**: 2026-01-19
**Status**: PLANNING
**Predecessor**: S7-review-findings.md, visual-identity.md

---

## Executive Summary

The Mirror MVP is **functionally complete** but visually flat. A formative review revealed:

1. **Critical Bug**: Contract never displays after discovery completion
2. **Demo Cruft**: Header shows TanStack demo links
3. **Visual Identity Gap**: The `visual-identity.md` spec was never implemented
4. **Missing "WOW" Factor**: Landing page violates web dev guidelines

This sprint addresses all blocking issues and implements the Digital Renaissance aesthetic.

---

## Critical Findings (from Formative Review)

### 🔴 Blocking Issues

| Issue | Severity | Current State |
|-------|----------|---------------|
| Contract not rendered | CRITICAL | `useDiscovery` stores contract but JSX never shows `<ContractView>` |
| Demo links in Header | HIGH | "Server Functions", "API Request", "SSR Demos" visible |

### 🟡 High Priority

| Issue | Severity | Details |
|-------|----------|---------|
| Landing page flat | HIGH | Generic dark theme, no micro-animations, no "WOW" |
| No free-text input | MEDIUM | Users locked into multiple-choice only |
| Phase labels hidden on mobile | LOW | Only numbers show, not phase names |

### ✅ What Works Well

- All library integrations (TanStack, Convex, Clerk, AI SDK) solid
- Accessibility excellent (ARIA, focus, touch targets)
- TypeScript compiles cleanly
- E2E tests exist

---

## Implementation Phases

### Phase 1: Critical Fixes (30 min) ⭐️ DO FIRST

#### 1.1 Fix Contract Display

**File**: `src/routes/chat/index.tsx`

The chat route stores `contract` in state but never renders it.

```diff
+ import { ContractView } from '@/components/contract'

  function ChatPage() {
    const {
      sessionId,
      currentPhase,
      isLoading,
      error,
      pendingQuestion,
      messages,
      startSession,
      submitOption,
      isOffline,
+     contract,
    } = useDiscovery({})

+   // Show contract when generated
+   if (contract) {
+     return (
+       <ContractView
+         contract={{
+           ...contract,
+           status: 'DRAFT',
+         }}
+         onSign={() => {
+           // TODO: Call contracts.sign mutation
+           console.log('Sign contract:', contract.id)
+         }}
+       />
+     )
+   }

    // ... rest of component unchanged
  }
```

Apply same fix to `src/routes/discovery.tsx`.

---

#### 1.2 Remove Demo Cruft

**File**: `src/components/Header.tsx`

**Before** (43 lines with demo links):
```tsx
<Link to="/demo/start/server-funcs">Start - Server Functions</Link>
<Link to="/demo/start/api-request">Start - API Request</Link>
<Link to="/demo/start/ssr">Start - SSR Demos</Link>
```

**After** (minimal navigation):
```tsx
import { Link } from '@tanstack/react-router'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/tanstack-react-start'

export default function Header() {
  return (
    <header className="border-b border-white/5 bg-[var(--twilight-900)]/80 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="font-display italic font-bold text-xl tracking-tight text-[var(--twilight-50)] hover:text-[var(--coral-glow)] transition-colors"
        >
          The Mirror
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 ring-2 ring-[var(--glass-border)]"
                }
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-[var(--twilight-50)] hover:text-[var(--coral-glow)] transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  )
}
```

**Delete**: `src/routes/demo/` directory (8 files)

---

### Phase 2: Visual Identity Foundation (1-2 hours)

Implement core design tokens from `visual-identity.md`.

#### 2.1 Design Tokens

**File**: `src/styles.css`

Implement the "Deep Twilight" Dark Mode Palette from `visual_design_architecture.md`.

```css
@import "tailwindcss";
@import "tw-animate-css";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@1,9..144,400;1,9..144,600;1,9..144,700&family=JetBrains+Mono:wght@400;500;700&display=swap');

@custom-variant dark (&:is(.dark *));

:root {
  /*
    DIGITAL RENAISSANCE PALETTE
    Source: visual_design_architecture.md (Section 2.2 & 2.4)
  */

  /* Twilight Scale (Obsidian Base) */
  --twilight-900: #0D1117; /* Deep Background */
  --twilight-800: #161B22; /* Card Background */
  --twilight-700: #21262D; /* Elevated Card */
  --twilight-600: #30363D; /* Input/Surface */
  --twilight-500: #484F58; /* Borders */
  --twilight-400: #63738F; /* Muted Text */
  --twilight-300: #8B949E; /* Secondary Text */
  --twilight-200: #B1B9C7;
  --twilight-100: #C9D1D9;
  --twilight-50:  #E6EDF3; /* Primary Text */

  /* Soft Sage (Growth/Success) */
  --sage-900: #151D1A;
  --sage-500: #6B9080; /* Primary Sage */
  --sage-400: #83AB98;
  --sage-soft: rgba(107, 144, 128, 0.15);

  /* Warm Coral (Action/Energy) */
  --coral-900: #572B21;
  --coral-500: #E07A5F; /* Primary Coral */
  --coral-400: #E58A74;
  --coral-glow: #E07A5F;
  --coral-soft: rgba(224, 122, 95, 0.15);

  /* Semantic */
  --glass-bg: rgba(13, 17, 23, 0.8);
  --glass-border: rgba(255, 255, 255, 0.08); /* Twilight-500 equiv opacity */
  --glass-highlight: rgba(255, 255, 255, 0.05);

  /* Map to generic tokens for shadcn/utils */
  --background: var(--twilight-900);
  --foreground: var(--twilight-50);
  --card: var(--twilight-800);
  --card-foreground: var(--twilight-50);
  --primary: var(--coral-500);
  --primary-foreground: var(--twilight-900);
  --muted: var(--twilight-800);
  --muted-foreground: var(--twilight-400);
  --border: var(--glass-border);
}

/* The Noise Layer */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.04; /* Increased from 0.03 for more tactility */
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: overlay;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  letter-spacing: -0.01em;
  -webkit-font-smoothing: antialiased;
}

.font-display {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: "SOFT" 100, "WONK" 1;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}
```

---

#### 2.2 Spring Physics

**File**: `src/lib/springs.ts` (NEW)

```typescript
/**
 * Spring Physics - The Tension System
 * From visual-identity.md: "Things should feel like they have mass and friction"
 */
export const springs = {
  /** Fast, precise, zero bounce - for inputs/toggles */
  snappy: { stiffness: 400, damping: 30 },

  /** Confident entry, slight settle - for cards/modals */
  float: { stiffness: 250, damping: 25 },

  /** Slow, majestic, heavy - for reveals/insights */
  reveal: { stiffness: 120, damping: 20 },

  /** For scrolling bounce-back */
  elastic: { stiffness: 200, damping: 20 },
}

/** Convert to framer-motion transition format */
export const springTransition = (type: keyof typeof springs) => ({
  type: 'spring' as const,
  ...springs[type],
})
```

---

### Phase 3: Landing Page Redesign (2-3 hours)

Transform flat landing into "God Tier" experience.

#### 3.1 Key Elements

**File**: `src/routes/index.tsx`

- **Massive Typography**: Title fills screen (`text-6xl md:text-8xl lg:text-9xl`)
- **Fraunces Font**: Use for "The Mirror" title
- **Coral Glow CTA**: `shadow-[0_0_40px_-10px_rgba(224,122,95,0.5)]`
- **Glass Card**: `backdrop-blur-xl bg-twilight-900/60 border-t border-white/10`
- **Staggered Reveal**: Text enters word-by-word with spring physics
- **Cursor Glow**: Ambient gradient follows mouse (optional, adds "living" feel)

---

### Phase 4: Discovery Flow Polish (1-2 hours)

#### 4.1 Phase-Specific Thinking Messages

**File**: `src/components/chat/TypingIndicator.tsx`

Instead of generic dots, show phase-context:

```tsx
const PHASE_MESSAGES = {
  SCENARIO: "Considering your journey...",
  EXCAVATION: "Analyzing patterns...",
  SYNTHESIS: "Reflecting your truth...",
  CONTRACT: "Crafting your commitment...",
}
```

#### 4.2 QuestionCard Polish

- Coral glow and "snappy" selection
- **Exit Animation**: Elements should slide out smoothly
- **Staggered Entrance**: `stagger-children` utility

#### 4.3 The Insight Reveal (NEW)

**File**: `src/components/effects/RevealOverlay.tsx`

Implement the 4-phase sequence from `visual_design_architecture.md`:

1. **Preparation (0-300ms)**: Dim background to 10% opacity, fade chat to 50%.
2. **Container Entry (300-600ms)**: Card scales 0.95 -> 1.0, fades in.
3. **Content Reveal (600-1000ms)**: Headline slides up (15px -> 0), then body.
4. **Glow Pulse (1000-1200ms)**: Soft Coral/Insight glow pulse.

Use `motion` from `motion/react` with `onAnimationComplete` callbacks to chain these states.

---

### Phase 5: Contract Artifact (1-2 hours)

Per `visual-identity.md` section 6: "The Momentum Contract Artifact"

#### 5.1 Physical Feel

- **Aspect Ratio**: 3:4 (Portrait, like a formal document)
- **Double Border**: Thin coral inside thick obsidian
- **Deep Gradient**: Twilight → Midnight Blue

#### 5.2 Signature Seal

- Wax seal visual at bottom
- **Hold-to-Sign**: Press and hold to stamp (haptic ramp)
- Heavy thud on completion

---

## Files Changed

### Phase 1 (Critical)
| Action | File | Lines |
|--------|------|-------|
| MODIFY | `src/routes/chat/index.tsx` | +15 |
| MODIFY | `src/routes/discovery.tsx` | +15 |
| MODIFY | `src/components/Header.tsx` | -20, +15 |
| DELETE | `src/routes/demo/*` | -8 files |

### Phase 2-5 (Visual)
| Action | File |
|--------|------|
| MODIFY | `src/styles.css` |
| NEW | `src/lib/springs.ts` |
| MODIFY | `src/routes/index.tsx` |
| NEW | `src/components/effects/CursorGlow.tsx` |
| MODIFY | `src/components/chat/TypingIndicator.tsx` |
| MODIFY | `src/components/discovery/QuestionCard.tsx` |
| MODIFY | `src/components/contract/ContractView.tsx` |

---

## Verification Plan

### Automated
```bash
bun run tsc --noEmit        # TypeScript
bun run test:e2e            # Playwright
```

### Manual Checklist
- [ ] Landing loads with noise texture visible
- [ ] CTA has coral glow effect
- [ ] No demo links in header
- [ ] Complete discovery flow → contract displays
- [ ] Contract sign button works
- [ ] Mobile (375px): Touch targets OK, typography readable

---

## Timeline

| Phase | Scope | Estimate |
|-------|-------|----------|
| 1 | Critical Fixes | 30 min |
| 2 | Design Foundation | 1-2 hrs |
| 3 | Landing Redesign | 2-3 hrs |
| 4 | Discovery Polish | 1-2 hrs |
| 5 | Contract Artifact | 1-2 hrs |
| **Total** | | **6-10 hours** |

### MVP Path (if time-constrained)
Do **Phases 1-3 only** (4-5 hours):
- ✅ Critical bugs fixed
- ✅ Design foundation in place
- ✅ Landing page wows
- ⏳ Discovery/contract polish can iterate later

---

## References

- [visual-identity.md](file:///Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/Continuous-Claude-v3/thoughts/_prd/visual-identity.md) - Full design spec
- [S7-review-findings.md](file:///Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/the-mirror/docs/S7-review-findings.md) - Previous review
- [the-right-questions.prd.json](file:///Users/joelchan/Documents/Coding/App-Dev/live/unfuck-your-life/Continuous-Claude-v3/thoughts/_prd/the-right-questions.prd.json) - Full PRD
