# Interaction Patterns

**Section:** 3-user-experience
**Status:** Draft
**Source:** Distilled from `concept/04-visual-system.md`

---

## Conversation Interactions

### Message Input

| Interaction | Behavior |
|-------------|----------|
| Focus input | Soft highlight, keyboard opens (mobile) |
| Type | Character by character, no limit shown |
| Send (button or Enter) | Message appears immediately, input clears |
| Empty send | Button disabled |

### TARS Response

| State | Visual |
|-------|--------|
| Processing | "TARS is thinking..." indicator with subtle animation |
| Streaming | Text appears word by word (if streaming) |
| Complete | Full message shown, indicator disappears |

**Timing:**
- Typing indicator appears: <500ms after send
- Response appears: <3s typical, <5s maximum
- If >5s: Show "Taking a moment..." message

### Star Appearance

When TARS extracts a star during conversation:

| Phase | Duration | Visual |
|-------|----------|--------|
| Announcement | — | TARS says "A star is forming..." or similar |
| Overlay appears | 500ms | Semi-transparent overlay on chat |
| Star materializes | 1.5s | Star fades in at center of overlay |
| Star pulses | 2s | Gentle glow pulse 2-3 times |
| Overlay fades | 500ms | Return to conversation |
| **Total** | ~4.5s | |

**User can skip:** Tap anywhere to dismiss early.

---

## Constellation Interactions

### Star Tap/Click

| Action | Behavior |
|--------|----------|
| Tap star | Star enlarges (1.5x), detail panel slides in from bottom |
| Tap outside | Panel dismisses, star returns to normal |
| Tap another star | Current panel dismisses, new panel appears |

### Zoom

| Platform | Gesture | Behavior |
|----------|---------|----------|
| Mobile | Pinch | Zoom in/out, min 0.5x, max 3x |
| Desktop | Scroll wheel | Zoom in/out |
| Both | Double-tap/click | Zoom to fit all stars |

### Pan

| Platform | Gesture | Behavior |
|----------|---------|----------|
| Mobile | Single finger drag | Move viewport |
| Desktop | Click and drag | Move viewport |
| Both | Edge of screen | Subtle resistance, bounce back |

### Connection Highlighting

| Trigger | Behavior |
|---------|----------|
| Hover star (desktop) | Connected stars glow, connection lines brighten |
| Tap star (mobile) | Same as hover |
| View detail panel | Connected stars listed, tappable |

---

## Star Animations

### Pulse Animation (All Stars)

| Star Type | Pulse Character |
|-----------|-----------------|
| Nascent | Barely visible, slow fade in/out (4s cycle) |
| Flickering | Irregular pulse, varying brightness (2-4s random) |
| Dim | Steady low glow, very subtle pulse |
| Bright | Warm steady glow, subtle shimmer |
| Dark | No pulse, but slight gravity distortion on nearby elements |
| Dormant | No animation, grayed out |

### Appearance Animation (New Star)

```
0ms:    Invisible
0-200ms:  Point of light appears
200-800ms: Expands to full size
800-1500ms: Glow establishes
1500ms+:   Normal animation begins
```

### State Transition Animation

When a star changes type (e.g., flickering → bright):

```
0ms:    Current appearance
0-500ms:  Current glow fades
500-1000ms: New glow fades in
1000-1500ms: Celebration pulse (if brightening)
1500ms+:   New normal animation
```

---

## Loading States

### Initial App Load

```
┌─────────────────────────────────────────┐
│                                         │
│              [Single star]              │
│              [Pulsing gently]           │
│                                         │
└─────────────────────────────────────────┘
```

Duration: Until auth + initial data loaded

### Constellation Loading

```
┌─────────────────────────────────────────┐
│                                         │
│           Loading your stars...         │
│                                         │
│              [Spinner]                  │
│                                         │
└─────────────────────────────────────────┘
```

Duration: <500ms expected, show after 200ms delay

### Conversation Loading

Show existing messages immediately. Show "TARS is thinking..." for new response.

---

## Empty States

### No Stars Yet (Day 1 Start)

```
┌─────────────────────────────────────────┐
│                                         │
│           Your sky is empty             │
│                                         │
│     (But not for long. Start a          │
│      conversation with TARS.)           │
│                                         │
│           [ Start Talking ]             │
│                                         │
└─────────────────────────────────────────┘
```

### No Connections Yet

In constellation phase indicator:
```
Stars: 5  Connections: —
```

No special empty state; connections appear naturally.

---

## Error States

### Network Error

```
┌─────────────────────────────────────────┐
│  ⚠️ Connection lost                      │
│  Trying to reconnect...                 │
└─────────────────────────────────────────┘
```

Position: Top toast, dismisses automatically on reconnect.

### Message Send Failed

```
┌─────────────────────────────────────────┐
│                                         │
│  [Your message]                         │
│  ⚠️ Failed to send. Tap to retry.       │
│                                         │
└─────────────────────────────────────────┘
```

Position: Inline below failed message.

### TARS Response Failed

```
┌─────────────────────────────────────────┐
│  [TARS] I'm having trouble thinking     │
│  right now. Can you try again?          │
│                                         │
│  [ Retry ]                              │
└─────────────────────────────────────────┘
```

---

## Accessibility Patterns

### Focus Indicators

| Element | Focus Style |
|---------|-------------|
| Buttons | 2px coral outline, 2px offset |
| Input fields | 2px coral outline |
| Stars | Announce star name, show enlarged |
| Links | Underline + color change |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move between interactive elements |
| Enter | Activate focused element |
| Escape | Close modal/panel |
| Arrow keys | Navigate between stars (constellation view) |

### Screen Reader

| Element | Announcement |
|---------|--------------|
| Star | "{Label}, {Type} star, brightness {X}%" |
| Connection | "Connected to {Other star} by {Type}" |
| Phase | "Your constellation is {Phase}" |

### Motion Sensitivity

If `prefers-reduced-motion`:
- Disable star pulse animations
- Instant star appearance (no fade)
- No constellation zoom animation
- Birth Chart reveal shows static constellation

---

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | <640px | Stack layout, touch-optimized |
| Tablet | 640-1024px | Flexible layout, touch + mouse |
| Desktop | >1024px | Side-by-side layouts, hover states |
