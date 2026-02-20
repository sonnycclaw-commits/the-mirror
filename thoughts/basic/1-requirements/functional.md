# Functional Requirements

**Section:** 1-requirements
**Status:** Draft
**Source:** Distilled from `concept/01-the-mirror.md`, `concept/02-the-walk.md`, `concept/mechanics/`

---

## FR-1: Authentication System

### FR-1.1: User Registration

**Description:** Users can create an account to save their constellation and conversation history.

**User Story:** As a new user, I want to sign up quickly so I can start my Mirror journey without friction.

**Inputs:**
- Email address

**Outputs:**
- User account created
- Magic link sent to email
- Session established on link click

**Business Rules:**
- Magic link expires after 15 minutes
- No password required (magic link only)
- One account per email address
- Account creation triggers onboarding state

**Dependencies:** Clerk integration

---

### FR-1.2: User Sign In

**Description:** Returning users can access their existing constellation and history.

**User Story:** As a returning user, I want to sign in easily so I can continue where I left off.

**Inputs:**
- Email address

**Outputs:**
- Magic link sent
- Session restored on link click
- Redirect to last state (constellation or conversation)

**Business Rules:**
- Same magic link flow as registration
- Session persists for 30 days
- Multiple devices allowed

---

## FR-2: Conversation System (TARS)

### FR-2.1: Message Exchange

**Description:** Users converse with TARS via text messages.

**User Story:** As a user, I want to have a natural conversation with TARS so I can explore my thoughts and patterns.

**Inputs:**
- User text message

**Outputs:**
- TARS response (text)
- Optional: Star extraction (see FR-3.1)
- Optional: Connection detection (see FR-3.3)

**Business Rules:**
- TARS uses Claude API for response generation
- Context includes conversation history + constellation state
- Maximum context: Last 50 messages + full constellation summary
- Response time target: <3 seconds

---

### FR-2.2: Question Sequencing (Mirror Days 1-7)

**Description:** TARS asks specific questions based on which Mirror day the user is on.

**User Story:** As a user in the Mirror, I want to be guided through meaningful questions each day so I gradually uncover my patterns.

**Question Themes by Day:**
| Day | Theme | Question Focus |
|-----|-------|----------------|
| 1 | The Surface | Complaints, behaviors, time use |
| 2 | Energy | What energizes, what drains |
| 3 | Fear | Anti-vision, worst-case paths |
| 4 | Relationships | Support, conflict, approval |
| 5 | Triggers | Broken promises, giving up |
| 6 | Shadow | Hidden self, forbidden wants |
| 7 | Integration | Full reflection, one lever |

**Business Rules:**
- User cannot skip to next day without completing current day
- Day completion = TARS determines sufficient exploration (3-5 questions answered)
- User can end session early and resume
- Minimum 3 questions per day, maximum 10

---

### FR-2.3: Micro-Revelations

**Description:** Each day, TARS offers one small insight the user couldn't see themselves.

**User Story:** As a user, I want to feel seen each day so I'm motivated to continue to Day 7.

**Outputs:**
- One insight per day, surfaced before session ends
- Insight references specific things user said
- Insight draws a non-obvious connection

**Business Rules:**
- Micro-revelation triggers after Day X questions complete
- Must reference at least 2 things user mentioned
- Phrased as observation, not prescription

**Example:**
> "I notice you mentioned energy around writing twice today, but you haven't written in months. What's that about?"

---

## FR-3: Constellation System

### FR-3.1: Star Extraction

**Description:** System identifies insights from conversation and creates stars.

**User Story:** As a user, I want to see my insights become visible stars so I can watch my constellation form.

**Inputs:**
- Conversation content
- Existing constellation state

**Outputs:**
- New star created with:
  - Label (short name)
  - Description (insight text)
  - Domain (health, wealth, relationships, purpose, soul)
  - Initial brightness (0.3 = nascent)
  - Position (theta, radius)

**Business Rules:**
- Star extraction uses structured Claude output
- 1-3 stars per day during Mirror
- Avoid duplicate or overlapping stars
- Stars appear in real-time during conversation
- Domain assigned based on content analysis

---

### FR-3.2: Constellation Display

**Description:** User can view their full constellation as a polar star map.

**User Story:** As a user, I want to see all my stars in one view so I can understand my patterns visually.

**Display Elements:**
- Stars positioned by domain (theta) and time relevance (radius)
- Star appearance varies by type (nascent, flickering, dim, bright, dark)
- Domain labels on axes
- Connection lines between related stars
- Phase indicator (Scattered, Connecting, Emerging, Luminous)

**Interactions:**
- Tap star to see details
- Pinch to zoom (mobile)
- Scroll to zoom (desktop)
- Pan to explore

---

### FR-3.3: Connection Detection

**Description:** System identifies relationships between stars.

**User Story:** As a user, I want to see how my patterns connect so I understand my inner system.

**Inputs:**
- Conversation content mentioning multiple patterns
- User confirmation of connection

**Outputs:**
- Connection created between two stars
- Connection type assigned (resonance, tension, causation, etc.)
- Connection strength (0-1)

**Business Rules:**
- Connections detected from conversation co-occurrence
- After Mirror Day 2, TARS may ask: "Do you see a connection between X and Y?"
- User confirmation strengthens connection
- Visual: Line drawn between connected stars

---

### FR-3.4: Star State Updates

**Description:** Star brightness and type change based on conversation and behavior.

**Brightness Update Formula:**
```
new_brightness = old_brightness + (gains - decay)
gains = conversation_gain + (experiment_gain if Walk)
decay = (1 - old_brightness) * decay_rate * days_since_interaction
```

**State Transitions:**
| From | To | Condition |
|------|----|-----------|
| Nascent | Flickering | User acknowledges pattern |
| Flickering | Bright | Brightness ≥ 0.7, stable 7 days |
| Flickering | Dim | Brightness < 0.5, stable 7 days |
| Dim | Dark | Contradicted 3x consecutively |
| Any | Dormant | No interaction for 30-90 days |

---

### FR-3.5: Birth Chart Reveal

**Description:** At end of Day 7, user sees full constellation revealed with animation.

**User Story:** As a user completing the Mirror, I want a meaningful reveal moment so I feel the weight of what I've uncovered.

**Sequence:**
1. Screen transitions to full black (2s)
2. Stars appear one by one (15-20s total, order of discovery)
3. Connections draw between related stars (10s)
4. Camera pulls back to show full constellation (5s)
5. TARS narration begins (30-45s)

**Narration Elements:**
- Identifies 2-3 patterns (clusters, bright stars, dark stars)
- References specific things user said
- Ends with invitation to Walk (premium)

---

## FR-4: The Walk (V1 — Post-MVP)

### FR-4.1: Discovery Interview

**Description:** TARS guides user to define their North Star and milestones.

**Phases:**
1. Initial orientation: "What are you trying to become?"
2. Deep dive: Constraints, conflicts, skills
3. Research loops: TARS researches when user is uncertain
4. Milestone discovery: Work backwards from North Star
5. Completeness check: All milestones have success criteria

**Outputs:**
- Journey created with North Star + 3-5 Milestones
- Each milestone has description, success criteria, timeframe

---

### FR-4.2: Daily Experiment Prompt

**Description:** Each morning, TARS offers one small experiment toward the nearest milestone.

**Experiment Format:**
```
WHEN: [specific trigger]
I WILL: [specific action]
AT: [specific context]
```

**Business Rules:**
- Experiment generated based on current milestone + user patterns
- Maximum 3 active experiments
- Experiment expires at midnight if not accepted
- User can accept, modify, or decline

---

### FR-4.3: Evening Check-In

**Description:** User reports whether experiment was completed.

**Inputs:**
- Completion status: Yes / Partially / No
- Optional: Reflection text

**Outputs:**
- Star brightness update
- Velocity update (journey physics)
- TARS acknowledgment

---

### FR-4.4: Milestone Celebration

**Description:** When milestone success criteria are met, user experiences celebration.

**Trigger:**
- User and TARS agree milestone is complete
- Success criteria satisfied

**Experience:**
- Full-screen star illumination animation
- TARS narrative reflection
- Velocity boost applied
- Shareable card generated

---

## FR-5: User Profile & Settings

### FR-5.1: Profile View

**Description:** User can view their basic profile information.

**Contents:**
- Email
- Account creation date
- Current phase (Mirror day / Walk status)
- Subscription tier

---

### FR-5.2: Data Export

**Description:** User can download all their data.

**Outputs:**
- JSON file containing:
  - All stars
  - All connections
  - All conversations
  - All experiments and outcomes

**Business Rules:**
- GDPR compliance
- Available within 24 hours of request
- Delivered via email link

---

### FR-5.3: Account Deletion

**Description:** User can permanently delete their account and all data.

**Process:**
1. User requests deletion
2. Confirmation required
3. 7-day grace period (can cancel)
4. Permanent deletion after grace period

---

## Traceability

| Requirement | Source Document | User Need |
|-------------|-----------------|-----------|
| FR-1.x Auth | `concept/05a-technical-architecture.md` | Seamless access |
| FR-2.x TARS | `concept/03-tars.md`, `concept/01-the-mirror.md` | Feel witnessed |
| FR-3.x Constellation | `concept/04-visual-system.md`, `mechanics/constellation-states/` | See patterns visually |
| FR-4.x Walk | `concept/02-the-walk.md`, `mechanics/the-walk/` | Transform, not just understand |
| FR-5.x Profile | `concept/05a-technical-architecture.md` | Control over data |
