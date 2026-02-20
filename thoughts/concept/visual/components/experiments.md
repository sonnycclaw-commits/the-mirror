# Experiments Visual Specification

**Daily experiments — invitations to act**

---

## Core Pattern: Experiment Card

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ✦ Health · Flickering                                     │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │                                                      │  │
│   │   "When you finish your morning coffee,              │  │
│   │    stand up and stretch for 60 seconds."             │  │
│   │                                                      │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                             │
│   ┌──────────────────┐  ┌──────────────────┐               │
│   │   Accept         │  │   Not today      │               │
│   └──────────────────┘  └──────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## States

### 1. Morning: Invitation

| Element | Specification |
|---------|---------------|
| **Header** | Star icon + Domain + Star state |
| **Experiment** | Serif font, quoted, centered |
| **Accept** | Primary button, subtle glow |
| **Not today** | Secondary, no judgment |

### 2. Accepted: Active

```
┌───────────────────────────────────────┐
│  ✦ Health                    Active   │
│  "Stretch after coffee"       ○───────│
└───────────────────────────────────────┘
```

Subtle progress indicator, not intrusive.

### 3. Evening: Check-in

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Did you stretch after coffee?                             │
│                                                             │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│   │    Yes     │  │  No, life  │  │  No, I     │           │
│   │            │  │  happened  │  │  chose not │           │
│   └────────────┘  └────────────┘  └────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

All answers valid. All answers informative.

### 4. Complete: Result

**If Yes:** Star brightens, brief celebration
**If No:** TARS asks "*What got in the way?*" — learning, not judgment

---

## Experiment Card Anatomy

| Part | Typography | Color |
|------|------------|-------|
| Domain label | Caption, uppercase | Domain color, 60% |
| Star state | Caption | Star type color |
| Experiment text | Body serif | White |
| Buttons | Button font | Primary/Secondary |

---

## No Gamification

| ❌ Not This | ✅ This |
|-------------|---------|
| "Streak: 7 days!" | [nothing] |
| "You missed 2!" | "What happened?" |
| Points counter | Star brightens |
| Achievement badge | TARS observes |

---

## Aesthetic Rules

- **Implementation intention format:** "When [trigger], I will [action]"
- **One experiment at a time:** Never overwhelming
- **No timer/deadline pressure:** Today or not, that's it
- **Honest options:** "No" is data, not failure

---

*"Experiments, not habits. Data, not judgment."*
