---
name: ui
description: Opinionated constraints for building accessible, fast, delightful interfaces. Apply automatically or review files against standards.
---

# UI Skill

Opinionated constraints for building better interfaces. Uses MUST/SHOULD/NEVER to guide decisions. Based on WCAG 2.1, WAI-ARIA APG, and modern frontend best practices.

---

## Stack (TRQ Specific)

- MUST use Tailwind CSS defaults
- MUST use `motion/react` for JavaScript animation
- MUST use `cn` utility (`clsx` + `tailwind-merge`) for class logic
- MUST use Base UI or Radix for accessible primitives
- MUST add `aria-label` to icon-only buttons

---

## Critical Accessibility (Blocks Deployment)

| Rule | Check |
|------|-------|
| Images have `alt` text | All `<img>` tags |
| Icon-only buttons have `aria-label` | All icon buttons |
| Form inputs have associated labels | All inputs |
| No `div onClick` for navigation | Use `<a>` or `<Link>` |
| Visible focus rings | `:focus-visible` on all interactive |
| Full keyboard support | Per WAI-ARIA APG |

---

## QuestionCard Constraints

The QuestionCard is the key UI component. It MUST:

```tsx
// QuestionCard.tsx - UI Constraints Applied

// MUST: Touch targets ≥44px on mobile
<button className="min-h-[44px] p-4 ...">

// MUST: Visible focus rings
<button className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ...">

// MUST: Use native semantics
<button> not <div onClick>

// MUST: aria-live for selection feedback
<div aria-live="polite" aria-atomic="true">
  {selected.length} option(s) selected
</div>

// MUST: Keyboard support
// Enter/Space to select
// Arrow keys to navigate options (optional but recommended)

// NEVER: outline: none without replacement
// NEVER: transition: all

// SHOULD: Use ease-out on entrance
<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: "easeOut" }}>
```

---

## PhaseProgress Constraints

```tsx
// PhaseProgress.tsx - UI Constraints Applied

// MUST: Semantic structure
<nav aria-label="Discovery Progress">
  <ol role="list">
    <li aria-current={isCurrent ? "step" : undefined}>

// MUST: Screen reader text for phase status
<span className="sr-only">{isCompleted ? "Completed" : isCurrent ? "Current" : "Upcoming"}</span>

// SHOULD: Non-breaking space in labels
<span>Phase&nbsp;{index}/7</span>

// MUST: Use tabular-nums for numbers
<span className="tabular-nums">2/7</span>
```

---

## DiscoveryInterface Constraints

```tsx
// DiscoveryInterface.tsx - UI Constraints Applied

// MUST: Skip to content link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to conversation
</a>

// MUST: scroll-margin-top on scroll targets
<div id="main-content" className="scroll-mt-16">

// MUST: Auto-scroll respects reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });

// MUST: overscroll-behavior in scrollable areas
<div className="overflow-y-auto overscroll-contain">
```

---

## MessageBubble Constraints

```tsx
// MessageBubble.tsx - UI Constraints Applied

// MUST: Handle long content
<div className="break-words max-w-[80%]">

// MUST: Focus management for screen readers
<article role="article" aria-label={`${role} message`}>

// SHOULD: Use text-pretty for paragraphs
<p className="text-pretty">
```

---

## Form/Input Constraints (for any future inputs)

| Rule | Implementation |
|------|----------------|
| Font-size ≥16px on mobile | `text-base` minimum |
| Enter submits | `onKeyDown` handler |
| Loading button shows spinner + label | `<Spinner /> {label}` |
| Trim input values | `value.trim()` on submit |
| Never block paste | No `onPaste` prevention |

---

## Animation Constraints

| Rule | Check |
|------|-------|
| Honor `prefers-reduced-motion` | `motion-reduce:` variants |
| Only compositor props | `transform`, `opacity` only |
| Never `transition: all` | List specific properties |
| Never exceed 200ms for feedback | `duration-150` or `duration-200` |

```tsx
// Using motion/react with reduced motion
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.15, ease: "easeOut" }}
  className="motion-reduce:transition-none"
>
```

---

## Layout Constraints

| Rule | Implementation |
|------|----------------|
| Use `h-dvh` not `h-screen` | Dynamic viewport height |
| Use `size-*` for squares | Not `w-* h-*` |
| Respect safe areas | `env(safe-area-inset-*)` |
| Fixed z-index scale | `z-10`, `z-20`, `z-30`, `z-50` only |

---

## Dark Mode Constraints

```tsx
// MUST: color-scheme on html
<html className="dark" style={{ colorScheme: 'dark' }}>

// MUST: Increase contrast on hover/active
<button className="hover:bg-gray-700 active:bg-gray-600">

// SHOULD: Theme-color meta
<meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
```

---

## Quick Violations to Avoid

| ❌ Pattern | ✅ Fix |
|------------|--------|
| `outline: none` | `focus-visible:ring-2` |
| `div onClick` navigation | `<Link>` or `<a>` |
| `transition: all` | `transition-colors duration-150` |
| `h-screen` | `h-dvh` |
| `z-50` arbitrary | Use scale: 10, 20, 30, 50 |
| Missing `aria-label` on icon | Add descriptive label |
| Font <16px on mobile input | `text-base` minimum |

---

## Review Checklist

Before marking any UI story complete:

```
[ ] All interactive elements keyboard accessible
[ ] Focus visible on all focusables
[ ] Touch targets ≥44px on mobile
[ ] No outline:none without replacement
[ ] aria-labels on icon buttons
[ ] Semantic HTML (button, a, nav, article)
[ ] Reduced motion respected
[ ] Works at 50% zoom (ultra-wide test)
[ ] Safe area insets respected
```

---

*Apply these constraints automatically to all UI component work.*
