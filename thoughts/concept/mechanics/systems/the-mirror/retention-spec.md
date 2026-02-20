# 7-Day Retention Specification

**Problem (Old Framing):** ~~7 days of excavation before Birth Chart reveal risks 60-70% abandonment.~~

**Insight:** Spotify Wrapped works because users just listen to music. The reveal is *surprising* because they didn't know they were generating data.

**Reframe:** S.T.A.R.S. isn't asking users to do 7 days of "excavation work." Users are just having a conversation with TARS. The Birth Chart emerges from what they said, how they said it, and what they avoided — without them realizing they were building it.

**Solution:** The 7-day experience is a *conversation*, not a test. TARS passively extracts signals. The Birth Chart is their "Wrapped" — surprising insights from normal behavior.

---

## The Wrapped Principle

```
SPOTIFY WRAPPED                    S.T.A.R.S. BIRTH CHART
──────────────────────             ──────────────────────────
Listen to music (normal)           Talk to TARS (normal)
         ↓                                  ↓
Spotify tracks plays               TARS extracts signals:
                                   • STATED (what they say)
                                   • EMOTIONAL (how they say it)
                                   • TEMPORAL (when they engage)
                                   • RELATIONAL (who they mention)
                                   • BEHAVIORAL (what they skip)
         ↓                                  ↓
Year-end surprise reveal           Day-7 Birth Chart reveal
"You're in top 1%..."              "I noticed you said X..."
```

**Key Shift:** Users don't "earn" their Birth Chart through work. They *discover* what TARS noticed while they were just talking.

---

## Signal Extraction (What TARS Captures)

| Signal Type | Captured From | Example Insight |
|-------------|---------------|-----------------|
| **STATED** | Goals, fears, beliefs in their words | "You said 'family first' 4 times" |
| **EMOTIONAL** | Sentiment, markers like "but..." | "There's resistance whenever you mention money" |
| **TEMPORAL** | Response time, session timing | "You hesitate longest on relationship questions" |
| **RELATIONAL** | People mentioned, sentiment | "Partner mentioned 12 times, avg sentiment -0.3" |
| **BEHAVIORAL** | Questions skipped, topics avoided | "You deflected the career question twice" |

**The "Magic":** After 3+ observations, TARS detects patterns via Granger causality:
> "Every time you mention [person], you spend less time on the next question. There's a connection there."

---

## Retention Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     THE RETENTION STACK                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Day 0    ┌─────────────────────────────────────┐               │
│  HOOK     │ Example Birth Chart + Social Proof  │               │
│           └─────────────────────────────────────┘               │
│                         ↓                                        │
│  Day 1    ┌─────────────────────────────────────┐               │
│  ANCHOR   │ First Star + Name Constellation     │               │
│           └─────────────────────────────────────┘               │
│                         ↓                                        │
│  Days 2-6 ┌─────────────────────────────────────┐               │
│  DAILY    │ Conversation + TARS Notices +        │               │
│  VALUE    │ Pattern Tease + Cliffhanger         │               │
│           └─────────────────────────────────────┘               │
│                         ↓                                        │
│  Day 7    ┌─────────────────────────────────────┐               │
│  REVEAL   │ "Here's what I noticed..." Moment   │               │
│           └─────────────────────────────────────┘               │
│                                                                  │
│  ALWAYS   ┌─────────────────────────────────────┐               │
│  ON       │ Grace Period + Catch-Up + No Shame  │               │
│           └─────────────────────────────────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Day 0 Hook

**When:** Landing page / first screen BEFORE signup

| Element | Implementation |
|---------|----------------|
| **Example Birth Chart** | "Here's what Alex discovered about herself" — show completed constellation with 3-4 insights called out |
| **Social Proof** | "Join 10,000+ people discovering their Birth Chart" |
| **Hook Copy** | "You've read the books. You know what to do. So why aren't you doing it? In 7 days, we'll show you." |
| **Promise** | "Your Birth Chart is waiting. It takes 7 sessions. Are you ready?" |
| **Entry Question** | Ask ONE question before signup to create investment |

**Metric:** Landing → Start conversion

---

## Layer 2: Day 1 Anchoring

**When:** First session, after first 3-5 questions

| Element | Implementation |
|---------|----------------|
| **First Star Ceremony** | Animate first star appearing with gentle sound/haptics. "This is yours." |
| **Name Your Constellation** | Prompt: "Your constellation needs a name. What calls to you?" (optional but sticky) |
| **Progress Arc Visible** | "Day 1 of 7 — Your Birth Chart is forming" |
| **Micro-Revelation** | TARS delivers one insight: "You said X and Y — that tells me something." |
| **Cliffhanger** | "Tomorrow, we go deeper." |

**Metric:** Day 1 → Day 2 retention (target: >80%)

---

## Layer 3: Days 2-6 Daily Value

Each day follows this structure:

```
┌────────────────────────────────────────────────────────────────┐
│  DAILY SESSION FLOW (Conversation, Not Quiz)                   │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Welcome Back                                                │
│     "Welcome back. Since yesterday, something caught my eye."  │
│                                                                 │
│  2. Conversation (8-12 minutes)                                 │
│     TARS asks open-ended questions                             │
│     User talks naturally                                        │
│     System silently extracts: STATED, EMOTIONAL, TEMPORAL      │
│                                                                 │
│  3. Star Appears (surprise)                                     │
│     "Something just formed. Look."                             │
│     User didn't "answer correctly" — they just talked          │
│                                                                 │
│  4. TARS Observation (the hook)                                 │
│     "I noticed you [pattern]. You did it 3 times."             │
│     "That's not random. There's something there."              │
│                                                                 │
│  5. Cliffhanger                                                 │
│     "Tomorrow, I'll show you what I've been tracking."         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**The shift:** User doesn't feel like they're "completing" something. They feel like TARS is watching, learning, noticing.

### Day-by-Day Hooks

| Day | Star Type | TARS Observation | Cliffhanger |
|-----|-----------|------------------|-------------|
| 2 | Connection forms | "These two are linked..." | "Tomorrow, we face the shadow." |
| 3 | Dark star appears | "This is what you're running from." | "Tomorrow, I show you a pattern." |
| 4 | Cluster emerges | "I counted — you mentioned X [N] times." | "Tomorrow, I make a prediction." |
| 5 | Prediction edge | "When [trigger], you [behavior]." | "Tomorrow, we name what's hiding." |
| 6 | Shadow named | "This star has been waiting." | "Tomorrow, your Birth Chart." |

**Metric:** Day N → Day N+1 retention (target: >75% each transition)

---

## Layer 4: Day 7 Payoff

**The Reveal Moment:**

```
┌────────────────────────────────────────────────────────────┐
│  BIRTH CHART REVEAL SEQUENCE                                │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Final Integration Questions                            │
│     "Looking at everything — what do you see?"             │
│                                                             │
│  2. Pause / Tension                                         │
│     "Your Birth Chart is ready. Are you?"                  │
│     [Reveal button]                                        │
│                                                             │
│  3. Camera Pulls Back                                       │
│     Individual stars → Full constellation animation        │
│     Music/ambient sound builds                             │
│                                                             │
│  4. Connections Light Up                                    │
│     Lines draw between stars (the pattern emerges)         │
│                                                             │
│  5. TARS Narration                                          │
│     Full synthesis of what the chart reveals               │
│                                                             │
│  6. "There I am" Moment                                     │
│     Prompt for user reflection                             │
│                                                             │
│  7. Share / Save Option                                     │
│     "Your constellation. Want to share it?"                │
│                                                             │
│  8. Next Step                                               │
│     "Tomorrow, we start walking."                          │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Metric:** Day 7 completion → Accuracy rating >4.0/5

---

## Layer 5: Forgiveness Mechanisms

**Because life happens:**

| Mechanism | Implementation |
|-----------|----------------|
| **12-Hour Grace Period** | Miss a day? Get until noon next day to catch up without penalty |
| **Pause Option** | "Life got busy? Pause your journey. Resume anytime." |
| **Catch-Up Sessions** | If 2 days behind, offer combined session |
| **No Shame Messaging** | "You're back. That's what matters. Let's continue." |
| **Streak Freeze Equivalent** | Free "protection" for 1 missed day, earned back by completing next day |

**Metric:** Users who pause → Resume rate (target: >50%)

---

## Constants

| Constant | Value | Rationale |
|----------|-------|-----------|
| GRACE_PERIOD_HOURS | 12 | Duolingo research shows 21% churn reduction |
| MAX_PAUSE_DAYS | 14 | After 2 weeks, journey resets to avoid stale data |
| DAY_1_TARGET_MINUTES | 12-15 | Short enough to complete, long enough to feel invested |
| DAYS_2_6_TARGET_MINUTES | 8-12 | Sustainable daily commitment |
| DAY_7_TARGET_MINUTES | 15-20 | Longer for synthesis and reveal |
| MIN_STARS_FOR_REVEAL | 12 | Enough density for meaningful constellation |

---

## Anti-Patterns (Don't Do)

| Anti-Pattern | Why It Kills Retention |
|--------------|------------------------|
| "You're behind" messaging | Shame → Avoidance → Churn |
| Day 1 asks for payment | No value proven yet |
| No visible progress | Feels like endless excavation |
| All value on Day 7 | Most users will never see it |
| Nagging notifications | Creates resentment |
| Comparing to other users | Comparison anxiety |

---

## Success Criteria

| Metric | Kill Threshold | Target |
|--------|----------------|--------|
| Day 1 → Day 2 | <60% | >80% |
| Day 3 → Day 4 | <50% | >75% |
| Day 6 → Day 7 | <40% | >70% |
| Day 7 completion | <30% | >50% |
| Birth Chart accuracy rating | <3.5/5 | >4.0/5 |
| "This is me" feeling | <50% | >75% |

---

*"Every day is a small win. Day 7 is the graduation ceremony."*
