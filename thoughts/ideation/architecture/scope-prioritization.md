# Life OS: Scope Prioritization & What's In vs Out

**Version:** 1.0
**Date:** 2026-01-13
**Purpose:** Convert possibility space into focused MVP
**Stage:** Ideation - Convergent Thinking

---

## Decision Framework

### Core Value Proposition (The Filter)

Every feature must serve this:

> **"A living profile that evolves through conversation, mapping you to a personalized pathway from where you are to where you want to be."**

**Three pillars:**
1. **Living Profile** - Continuously learning, not static
2. **Genuine Understanding** - "This app GETS me"
3. **Actionable Pathway** - Not just insight, but direction

### Prioritization Criteria

| Criterion | Weight | Question |
|-----------|--------|----------|
| **Core Value** | 30% | Does this deliver the "living profile → pathway" promise? |
| **Risk Level** | 25% | What could go wrong? (Edge case analysis) |
| **Time to Build** | 20% | Can we ship this in MVP timeline? |
| **Differentiation** | 15% | Does this set us apart from competitors? |
| **User Demand** | 10% | Do users actually want this? |

### Risk Categories (From Edge Case Analysis)

| Category | Treatment |
|----------|-----------|
| **CRITICAL RISK** | Must solve before any code or OUT entirely |
| **HIGH RISK** | Needs clear mitigation plan before including |
| **MEDIUM RISK** | Include with guardrails |
| **LOW RISK** | Standard development |

---

## The In/Out Matrix

### 🟢 DEFINITELY IN (MVP Core)

These are non-negotiable for the core value proposition.

| Feature | Why It's In | Risk Level |
|---------|-------------|------------|
| **Conversational assessment** | Core mechanism - how we learn | LOW |
| **Living profile (Bayesian)** | Core differentiator | LOW |
| **SDT needs assessment** | High aha-moment potential, well-researched | LOW |
| **Pattern detection** | "You noticed that?!" moments | LOW |
| **Confidence-based insights** | Prevents wrong claims | LOW |
| **7-day trial structure** | Conversion driver | LOW |
| **Profile visualization** | Shows value being created | LOW |
| **Day 7 reveal + paywall** | Business model | LOW |
| **One core journey (Unfuck Your Life)** | Post-conversion value | MEDIUM |
| **Basic skill emergence** | Differentiator, engaging | MEDIUM |
| **Push notifications (JITAI basics)** | Engagement, pattern interrupts | LOW |
| **Crisis detection** | CRITICAL safety requirement | LOW (to build, CRITICAL if missing) |
| **Shareable insight card** | Virality, social proof | LOW |

### 🟡 PROBABLY IN (MVP or v1.1)

Include if time permits, or early post-MVP.

| Feature | Why Consider | Risk Level | Decision Factor |
|---------|--------------|------------|-----------------|
| **HEXACO personality** | More complete than Big 5 | LOW | If extraction works well |
| **Motivational drivers (McClelland)** | Useful for journey mapping | LOW | Extraction complexity |
| **Values assessment** | Decision-making compass | LOW | Question design |
| **Streaks** | Retention mechanic | LOW | Doesn't feel manipulative |
| **Morning/evening sessions** | Structure, habit | LOW | Content volume |
| **Blocker detection** | Core to pathway system | MEDIUM | Accuracy required |
| **Pathway visualization (node map)** | Your vision - differentiator | MEDIUM | Design complexity |
| **Progress snapshots** | Before/after, motivation | LOW | Storage, UI |

### 🟠 MAYBE LATER (v1.2+)

Good ideas, but not essential for proving the concept.

| Feature | Why Defer | Risk Level | When to Revisit |
|---------|-----------|------------|-----------------|
| **Multiple pathways** | One journey first | LOW | After core journey proven |
| **Ego development assessment** | Complex, requires training | HIGH | Research partnership |
| **Attachment styles** | Sensitive territory | MEDIUM | After trust established |
| **Relationship/partner mode** | Complexity explosion | MEDIUM | After solo proven |
| **Voice journaling** | STT integration | MEDIUM | If text engagement drops |
| **Wearable integration** | Technical complexity | LOW | If bio signals valuable |
| **Calendar integration** | Privacy, value unclear | LOW | User demand signal |
| **Group/cohort journeys** | Moderation, complexity | HIGH | Product-market fit first |
| **Coach marketplace** | Liability, quality | HIGH | Strong foundation first |
| **Detailed skill tree** | Core system needs proving | MEDIUM | After emergence works |
| **Weekly "Wrapped" summaries** | Nice to have | LOW | Engagement data first |

### 🔴 EXPLICITLY OUT (Not Building)

Either too risky, not aligned, or out of scope.

| Feature | Why It's Out | Risk Reference |
|---------|--------------|----------------|
| **CBT/DBT protocols** | Therapeutic territory, regulatory risk | Edge case: Therapeutic boundary |
| **Depression/anxiety treatment** | Clinical, requires licensing | Edge case: Therapeutic boundary |
| **Diagnosis or clinical language** | Legal liability | Edge case: Therapeutic boundary |
| **MBTI/Enneagram as primary** | Pseudoscientific, damages credibility | Low validity |
| **Leaderboards** | Comparison anxiety, against philosophy | Gamification philosophy |
| **Points/XP systems** | Extrinsic motivation undermines intrinsic | Gamification philosophy |
| **Social feed/community** | Moderation nightmare, distraction | Complexity, risk |
| **Video journaling** | Privacy concerns, low accuracy | Technical feasibility |
| **Voice emotion detection** | Cultural bias, unreliable | Edge case: Cultural bias |
| **AI therapy/counseling** | Illegal without license | Edge case: Therapeutic boundary |
| **Crisis counseling by AI** | Dangerous, liability | Edge case: Crisis detection |
| **Financial advice** | Regulatory, different domain | Scope creep |
| **Medical/health advice** | Regulatory, dangerous | Edge case: Harmful output |
| **Dating/matching features** | Different product entirely | Scope creep |
| **Anonymous comparison** | Comparison anxiety | Against philosophy |
| **Aggressive gamification** | Manipulation, against philosophy | Gamification philosophy |

### ⚫ RESEARCH REQUIRED (Don't Decide Yet)

Need more information before committing.

| Feature | What We Need to Know | How to Learn |
|---------|---------------------|--------------|
| **ACT framework** | Is it coaching or therapy? | Legal consultation |
| **Motivational Interviewing** | Can we do this without clinical training? | Expert consultation |
| **IFS (Parts work)** | Too clinical or okay for self-discovery? | Expert consultation |
| **B2B/corporate** | Is there demand? Sales cycle? | Customer discovery |
| **Human accountability partners** | Safety, matching quality | Small pilot |
| **Journaling export** | Do users want this? | User research |

---

## MVP Scope Definition

### What MVP Must Deliver

```
MVP SUCCESS CRITERIA:
═══════════════════

1. PROFILE BUILDING (Trial)
   ├── User completes 7-day trial
   ├── Profile confidence > 60% on core dimensions
   ├── At least 2 patterns detected with > 70% confidence
   └── "Aha moment" achieved (user confirms insight accuracy)

2. CONVERSION
   ├── Day 7 profile reveal creates desire
   ├── Clear value proposition for paid tier
   ├── > 20% trial-to-paid conversion
   └── Payment flow works

3. POST-CONVERSION VALUE
   ├── User begins "Unfuck Your Life" journey
   ├── Daily engagement for first week > 50%
   ├── First skill emergence within 2 weeks
   └── User can see progress on pathway

4. SAFETY
   ├── Crisis detection functional
   ├── Resources displayed when triggered
   ├── No AI response to crisis content
   └── Clear disclaimers throughout
```

### MVP Feature Set (Detailed)

```
MVP v1.0 FEATURE SET
════════════════════

TRIAL PHASE (Days 1-7)
├── Onboarding
│   ├── Account creation (Clerk)
│   ├── Welcome message (AI persona established)
│   └── Commitment prompt
│
├── Daily Conversations
│   ├── Day 1: First Contact (light, engaging)
│   ├── Day 2: Building Rapport (pattern intro)
│   ├── Day 3: Pattern Recognition (first insight)
│   ├── Day 4: Going Deeper (emotional territory)
│   ├── Day 5: First Reveal (major aha moment)
│   ├── Day 6: Anticipation (urgency)
│   └── Day 7: Conversion (profile reveal + paywall)
│
├── Assessment Extraction
│   ├── SDT needs (Autonomy, Competence, Relatedness)
│   ├── Key behavioral patterns (3-5)
│   ├── Primary tension/contradiction
│   ├── Response authenticity scoring
│   └── Engagement tracking
│
├── Profile Building
│   ├── Bayesian belief updates
│   ├── Confidence scoring per dimension
│   ├── Pattern accumulation
│   └── Signal storage (for later analysis)
│
├── Profile Visualization
│   ├── Progress bars (completion %)
│   ├── Revealed insights (confidence > threshold)
│   ├── Locked insights (teaser)
│   └── Day 7 shareable card
│
└── Notifications
    ├── Daily session reminders
    ├── Re-engagement (24h/48h silence)
    └── Day 7 urgency

CONVERSION
├── Profile reveal (curated, not complete)
├── Pathway preview (Unfuck Your Life)
├── Value proposition display
├── Stripe payment integration
├── Subscription management
└── Objection handling

JOURNEY PHASE (Post-Conversion)
├── Day 1 Post-Conversion
│   ├── Full profile unlock
│   ├── Journey confirmation
│   └── "Real thing starts now" messaging
│
├── Unfuck Your Life Journey
│   ├── Week 1: Deep Excavation
│   │   ├── Anti-vision work
│   │   ├── Vision work
│   │   └── Pattern awareness
│   │
│   ├── Week 2-4: Calibration
│   │   ├── Daily micro-sessions
│   │   ├── Pattern tracking
│   │   └── First habit formation
│   │
│   └── Month 2+: Evolution (basic)
│       ├── Ongoing sessions
│       ├── Profile evolution
│       └── Skill emergence
│
├── Skill System (Basic)
│   ├── Skills emerge from conversation
│   ├── Simple list view (not tree)
│   ├── Level/confidence display
│   └── Evidence linking
│
└── Progress Tracking
    ├── Journey position (current node)
    ├── Skills discovered
    ├── Sessions completed
    └── Profile evolution indicators

SAFETY (Non-Negotiable)
├── Crisis Detection
│   ├── Keyword detection
│   ├── Sentiment analysis
│   └── Behavioral signals
│
├── Crisis Response
│   ├── Immediate pause
│   ├── Resources screen
│   └── No AI counseling
│
└── Disclaimers
    ├── Not therapy messaging
    ├── Terms of service
    └── In-app reminders

INFRASTRUCTURE
├── Convex backend
├── Expo mobile app
├── Claude API integration
├── Clerk authentication
├── Stripe payments
└── Push notifications
```

### What's NOT in MVP

```
EXPLICITLY EXCLUDED FROM v1.0:
═══════════════════════════════

❌ Multiple pathways (only Unfuck Your Life)
❌ Full skill tree visualization (list only)
❌ Partner/relationship mode
❌ Group features
❌ Voice input
❌ Web app
❌ Wearable integration
❌ Calendar integration
❌ HEXACO full assessment (SDT focus)
❌ Ego development assessment
❌ CBT/DBT protocols
❌ Coach marketplace
❌ Community features
❌ Detailed analytics dashboard
❌ Export features
❌ B2B features
```

---

## Release Roadmap

### v1.0 - MVP (Weeks 1-8)
**Goal:** Prove the core value proposition

- Trial experience (7 days)
- Profile building (SDT + patterns)
- Conversion flow
- One journey (Unfuck Your Life)
- Basic skill emergence
- Crisis detection
- iOS app (TestFlight)

### v1.1 - Refinement (Weeks 9-12)
**Goal:** Improve based on beta feedback

- Prompt optimization (based on accuracy data)
- Conversion funnel improvements
- HEXACO integration (if extraction works)
- Skill tree visualization upgrade
- Android app
- Re-engagement improvements

### v1.2 - Journey Depth (Weeks 13-16)
**Goal:** Prove post-conversion retention

- Second pathway (likely Career or Relationships)
- Weekly "Wrapped" summaries
- Pathway visualization (node map)
- Enhanced blocker detection
- Values assessment
- Progress sharing

### v2.0 - Platform (Weeks 17-24)
**Goal:** Expand the ecosystem

- Multiple pathways
- Full skill tree system
- Voice journaling option
- Calendar integration
- Export features
- API foundations

### Future (6+ months)
- Group/cohort features
- Coach marketplace (if demand)
- B2B pilot
- International expansion

---

## Key Decisions Summary

### Psychometric Focus
- **IN:** SDT (Autonomy, Competence, Relatedness), Patterns, Tensions
- **MAYBE:** HEXACO, McClelland, Values
- **OUT:** MBTI, Enneagram, Clinical assessments

### Journey Focus
- **IN:** Unfuck Your Life (Dan Koe framework)
- **LATER:** Career, Relationships, Purpose
- **OUT:** Clinical protocols (CBT/DBT as treatment)

### Gamification Philosophy
- **IN:** Progress visualization, milestones, streaks (light)
- **OUT:** XP, points, leaderboards, badges

### Social Philosophy
- **IN:** Shareable cards (viral)
- **LATER:** Accountability partners
- **OUT:** Feed, community, comparison

### Therapeutic Boundary
- **IN:** Self-discovery, coaching, pattern recognition
- **OUT:** Diagnosis, treatment, clinical advice

---

## Open Questions for Next Phase

| Question | Stakes | How to Resolve |
|----------|--------|----------------|
| Is ACT coaching or therapy? | Legal positioning | Lawyer consultation |
| How do we validate prompt accuracy before beta? | Core value prop | Prompt testing plan |
| What's the right price point? | Conversion, revenue | Competitor analysis + beta testing |
| iOS-first or both platforms? | Dev speed vs reach | Resource assessment |
| How do we recruit beta users? | Validation quality | Marketing plan |

---

*This document defines our scope. Refer to this when feature creep threatens.*
*Last updated: 2026-01-13*
