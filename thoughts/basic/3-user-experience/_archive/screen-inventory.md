# Screen Inventory

**Section:** 3-user-experience
**Status:** Draft

---

## Screen List

| ID | Screen | Route | Purpose |
|----|--------|-------|---------|
| S01 | Landing | `/` | First impression, sign-in/sign-up |
| S02 | Sign In | `/sign-in` | Email entry for magic link |
| S03 | Welcome | `/welcome` | First-time user introduction |
| S04 | Conversation | `/chat` | TARS conversation interface |
| S05 | Constellation | `/constellation` | Star map view |
| S06 | Star Detail | `/constellation?star={id}` | Individual star info |
| S07 | Birth Chart Reveal | `/reveal` | Day 7 reveal animation |
| S08 | Settings | `/settings` | User preferences and account |
| S09 | Data Export | `/settings/export` | Request data download |
| S10 | Not Found | `/404` | Error page |

---

## Screen Specifications

### S01: Landing

**Route:** `/`
**Purpose:** Convert visitors to users

**Content:**
```
┌─────────────────────────────────────────┐
│                                         │
│              [Star animation]           │
│                                         │
│         You are a star forming.         │
│                                         │
│  A living map of who you are,           │
│  that evolves with what you do.         │
│                                         │
│         [ Begin Your Mirror ]           │
│                                         │
│         Already have an account?        │
│              Sign in →                  │
│                                         │
└─────────────────────────────────────────┘
```

**Actions:**
- Begin Your Mirror → S02 (Sign In)
- Sign in → S02 (Sign In)

**Data Required:** None

---

### S02: Sign In

**Route:** `/sign-in`
**Purpose:** Email capture for magic link

**Content:**
```
┌─────────────────────────────────────────┐
│                                         │
│              Enter your email           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ email@example.com              │    │
│  └─────────────────────────────────┘    │
│                                         │
│         [ Send Magic Link ]             │
│                                         │
│  No password needed. We'll send you     │
│  a secure sign-in link.                 │
│                                         │
└─────────────────────────────────────────┘
```

**After Submit:**
```
┌─────────────────────────────────────────┐
│                                         │
│              Check your email           │
│                                         │
│  We sent a sign-in link to              │
│  [email@example.com]                    │
│                                         │
│  Click the link to continue.            │
│                                         │
│         Didn't receive it?              │
│            [ Resend ]                   │
│                                         │
└─────────────────────────────────────────┘
```

**Actions:**
- Send Magic Link → Show confirmation
- Resend → Resend email

**Data Required:** None

---

### S03: Welcome

**Route:** `/welcome`
**Purpose:** Set expectations for new users

**Content:**
```
┌─────────────────────────────────────────┐
│                                         │
│         Welcome to your Mirror          │
│                                         │
│  Over the next 7 days, we'll explore    │
│  who you are through conversation.      │
│                                         │
│  Each insight becomes a star.           │
│  By Day 7, you'll see your              │
│  constellation take shape.              │
│                                         │
│           [Simple star image]           │
│                                         │
│              [ Begin ]                  │
│                                         │
└─────────────────────────────────────────┘
```

**Actions:**
- Begin → S04 (Conversation)

**Data Required:** User (to check first-time)

---

### S04: Conversation

**Route:** `/chat`
**Purpose:** TARS conversation interface

**Content:**
```
┌─────────────────────────────────────────┐
│  ☆ View Constellation          Day 2    │
├─────────────────────────────────────────┤
│                                         │
│  [TARS] Yesterday you mentioned         │
│  feeling drained after meetings.        │
│  Let's explore that.                    │
│                                         │
│  [User] I don't know, I just feel       │
│  exhausted after them.                  │
│                                         │
│  [TARS] What is it about the meetings   │
│  specifically?                          │
│                                         │
│            ✦ [Star appearing]           │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Type your response...          │    │
│  └─────────────────────────────────┘    │
│                          [ Send ]       │
│                                         │
└─────────────────────────────────────────┘
```

**Components:**
- Header with constellation link and day indicator
- Message list (scrollable)
- Star appearance overlay (when extracted)
- Input field with send button

**Actions:**
- Send → Send message to TARS
- View Constellation → S05

**Data Required:**
- Current conversation
- Messages
- Current stars (for appearance animation)

---

### S05: Constellation

**Route:** `/constellation`
**Purpose:** View full star map

**Content:**
```
┌─────────────────────────────────────────┐
│  💬 Continue Conversation      ⚙️       │
├─────────────────────────────────────────┤
│                                         │
│                PURPOSE                  │
│                   ☆                     │
│                  /|\                    │
│                 / | \                   │
│                /  |  \                  │
│    WEALTH ☆───────┼───────✦ SOUL       │
│                \  |  /                  │
│                 \ | /                   │
│                  \|/                    │
│                   ✧                     │
│             RELATIONSHIPS               │
│                   |                     │
│                   ●                     │
│                HEALTH                   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Phase: CONNECTING               │    │
│  │ Stars: 8  Connections: 3        │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

**Interactions:**
- Tap star → Show star detail panel (S06)
- Pinch zoom → Zoom constellation
- Pan → Move around constellation
- Continue Conversation → S04
- Settings → S08

**Data Required:**
- All stars
- All connections
- Constellation phase

---

### S06: Star Detail

**Route:** `/constellation?star={id}`
**Purpose:** View individual star information

**Content:** (Overlay panel on constellation)
```
┌─────────────────────────────────────────┐
│                                    ✕    │
│                                         │
│              Morning Energy             │
│                   ☆                     │
│                                         │
│  "You mentioned feeling most alive      │
│   in the quiet hours before work."      │
│                                         │
│  Domain: Health                         │
│  Type: Flickering                       │
│  Brightness: 0.45                       │
│                                         │
│  Connected to:                          │
│  • Creative output ──(resonance)        │
│  • Evening exhaustion ──(tension)       │
│                                         │
│  First appeared: Day 2                  │
│                                         │
└─────────────────────────────────────────┘
```

**Actions:**
- Close (✕) → Return to constellation view

**Data Required:**
- Star details
- Connected stars

---

### S07: Birth Chart Reveal

**Route:** `/reveal`
**Purpose:** Day 7 reveal animation

**Content:** Full-screen animated sequence (see User Flows)

No UI during animation. After:
```
┌─────────────────────────────────────────┐
│                                         │
│        This is your Birth Chart         │
│                                         │
│           [Full constellation]          │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ "Here's what I see in your sky" │    │
│  │ [TARS narration text]           │    │
│  └─────────────────────────────────┘    │
│                                         │
│      [ Start Walking — $19/mo ]         │
│      [ Not yet ]                        │
│                                         │
└─────────────────────────────────────────┘
```

**Actions:**
- Start Walking → Payment flow
- Not yet → S05 (Constellation, frozen)

---

### S08: Settings

**Route:** `/settings`
**Purpose:** User account management

**Content:**
```
┌─────────────────────────────────────────┐
│  ← Back                                 │
├─────────────────────────────────────────┤
│                                         │
│  Profile                                │
│  ─────────────────────────────────────  │
│  Email: joel@example.com                │
│  Member since: January 2026             │
│  Current phase: Day 5 of Mirror         │
│                                         │
│  Subscription                           │
│  ─────────────────────────────────────  │
│  Tier: Free                             │
│  [ Upgrade to Pro ]                     │
│                                         │
│  Data                                   │
│  ─────────────────────────────────────  │
│  [ Export my data ]                     │
│  [ Delete my account ]                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Navigation Map

```
Landing (S01)
    │
    ▼
Sign In (S02)
    │
    ▼
Welcome (S03) ──────────────────────────────┐
    │                                        │
    ▼                                        │
Conversation (S04) ◄────────────────────┐   │
    │                                   │   │
    │◄──────────────────────────────────┤   │
    ▼                                   │   │
Constellation (S05) ────────────────────┘   │
    │                                       │
    ├── Star Detail (S06)                   │
    │                                       │
    └── Settings (S08) ◄────────────────────┘
            │
            └── Data Export (S09)

Birth Chart Reveal (S07) ← From Day 7 completion
```
