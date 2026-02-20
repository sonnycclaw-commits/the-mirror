# User Flows

**Section:** 3-user-experience
**Status:** Draft
**Source:** Distilled from `concept/01-the-mirror.md`, `concept/07-onboarding-paths.md`

---

## Primary Flows

### Flow 1: New User Onboarding

```mermaid
flowchart TD
    A[Visit landing page] --> B{Has account?}
    B -->|No| C[Click "Begin"]
    B -->|Yes| D[Click "Sign In"]

    C --> E[Enter email]
    D --> E

    E --> F[Receive magic link]
    F --> G[Click link]

    G --> H{First time?}
    H -->|Yes| I[Welcome screen]
    H -->|No| J[Resume position]

    I --> K[Brief TARS intro]
    K --> L[Start Day 1 conversation]
```

**Decision Points:**

| Point | Condition | Action |
|-------|-----------|--------|
| Has account? | Email in system | Route to sign-in vs. sign-up |
| First time? | No user record | Show onboarding vs. resume |

**Exit Points:**
- User abandons at email entry
- User doesn't click magic link (expires in 15 min)

---

### Flow 2: Mirror Day Session (Days 1-7)

```mermaid
flowchart TD
    A[Open app] --> B{Active session?}
    B -->|Yes| C[Resume conversation]
    B -->|No| D[Start new session]

    D --> E[Show current day intro]
    E --> F[TARS asks first question]

    F --> G[User responds]
    G --> H[TARS responds]
    H --> I{Pattern detected?}

    I -->|Yes| J[Extract star]
    J --> K[Show star appearing]
    K --> L{More questions?}

    I -->|No| L

    L -->|Yes| F
    L -->|No, enough depth| M[Micro-revelation]

    M --> N[Day summary]
    N --> O{Day 7?}

    O -->|No| P[Save progress, exit]
    O -->|Yes| Q[Birth Chart Reveal]
```

**Per-Day Structure:**

| Day | Opening | Questions | Micro-Revelation Focus |
|-----|---------|-----------|------------------------|
| 1 | "Let's begin" | Surface behaviors, complaints | First pattern identified |
| 2 | "Yesterday you mentioned..." | Energy, aliveness | First connection between stars |
| 3 | "Let's go deeper" | Fear, anti-vision | First dark star |
| 4 | "Today is about others" | Relationships, approval | Pattern you didn't mention directly |
| 5 | "What you avoid" | Triggers, giving up | Prediction about behavior |
| 6 | "The shadow" | Hidden self, forbidden wants | Shadow star named |
| 7 | "Integration" | Full reflection | Birth Chart narrative |

---

### Flow 3: Birth Chart Reveal

```mermaid
flowchart TD
    A[Complete Day 7] --> B[Transition to dark screen]
    B --> C[Stars appear one by one]
    C --> D[Connections draw]
    D --> E[Camera pulls back]
    E --> F[TARS narration begins]
    F --> G[Narration completes]
    G --> H[Show full constellation]
    H --> I[Invite to Walk]
    I --> J{User decision}

    J -->|"Start Walking"| K[Payment flow]
    J -->|"Not yet"| L[Save, show frozen path]
    J -->|Skip| M[Return to constellation]
```

**Timing:**
| Phase | Duration |
|-------|----------|
| Dark transition | 2s |
| Stars appearing | 15-20s |
| Connections drawing | 10s |
| Camera pullback | 5s |
| Narration | 30-45s |
| **Total** | ~60-90s |

---

### Flow 4: Returning User

```mermaid
flowchart TD
    A[Open app] --> B{Session active?}
    B -->|Yes| C[Resume conversation]
    B -->|No| D{Current phase?}

    D -->|Mirror| E[Show constellation + "Continue Day X"]
    D -->|Birth Chart| F[Show constellation + replay reveal?]
    D -->|Walk| G[Show constellation + today's experiment]

    E --> H[User clicks Continue]
    H --> I[Start day session]
```

---

## Secondary Flows

### Settings

```
Profile
├── View email
├── View account creation date
├── View current phase
└── View subscription status

Data Management
├── Export data → Request email with download link
└── Delete account → Confirmation → 7-day grace → Permanent

Subscription (if pro)
├── View next billing date
└── Cancel subscription → Confirmation → Downgrade at period end
```

### Navigation

```
┌─────────────────────────────────┐
│  Primary Navigation             │
├─────────────────────────────────┤
│  🏠 Constellation (Star Map)    │
│  💬 Conversation (TARS)         │
│  ⚙️ Settings                    │
└─────────────────────────────────┘
```

---

## Error Flows

### Network Failure

```mermaid
flowchart TD
    A[User action] --> B{Network available?}
    B -->|No| C[Show offline banner]
    C --> D[Retry automatically when online]
    B -->|Yes| E[Process action]
    E --> F{Success?}
    F -->|No| G[Show error toast]
    G --> H[Offer retry button]
```

### Authentication Expired

```mermaid
flowchart TD
    A[Make API request] --> B{Session valid?}
    B -->|No| C[Show sign-in modal]
    C --> D[User re-authenticates]
    D --> E[Retry original action]
    B -->|Yes| F[Process request]
```

---

## Flow Dependencies

| Flow | Requires | Produces |
|------|----------|----------|
| Onboarding | — | User, first conversation |
| Mirror Day | User | Stars, connections, messages |
| Birth Chart | Day 7 complete | Phase change |
| Walk (V1) | Birth Chart complete, subscription | Journey, experiments |
