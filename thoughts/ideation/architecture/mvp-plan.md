# Life OS MVP Plan

**Generated:** 2026-01-13
**Status:** Ready for Implementation
**Timeline:** 8 weeks to beta launch

---

## Executive Summary

Life OS MVP delivers the "This is me" moment in 7 days through daily micro-sessions (2-5 minutes) that build a psychometric profile. The free experience culminates in a shareable personality insight card that drives both conversion and virality. We ruthlessly cut social features, voice, and deep therapy tools to focus on one thing: making users feel deeply seen. Success means >80% of Day 7 users say "yes, this is accurate" and >10% convert to paid. The technical stack is Expo (mobile-first) + Convex (backend) + multi-agent architecture for conversational assessment.

---

## 1. The 7-Day Free Experience

### Day 1: The Hook
**Theme:** "Let's find out who you really are"

| Element | Details |
|---------|---------|
| Duration | 3-5 minutes |
| Experience | Welcome video/animation explaining the journey. First conversational assessment (5-7 questions) covering surface-level identity: values, current life situation, immediate desires. |
| Output | "First Impression" card - a single, punchy insight that feels surprisingly accurate |
| Aha Moment | "How did it know that about me?" |
| Retention Hook | Preview of "what we'll discover together" |

### Day 2: The Anti-Vision
**Theme:** "What are you running from?"

| Element | Details |
|---------|---------|
| Duration | 2-4 minutes |
| Experience | Deep prompt about fears and the life you're terrified of living. Questions about what you're avoiding and why. |
| Output | Anti-vision summary - "You're most afraid of becoming..." |
| Aha Moment | Confronting fears makes them concrete and actionable |
| Retention Hook | "Tomorrow: what you actually want" |

### Day 3: The Vision
**Theme:** "What are you moving toward?"

| Element | Details |
|---------|---------|
| Duration | 2-4 minutes |
| Experience | Aspirational questions. What does your ideal day look like? Who do you want to become? Strip away "shoulds" - what do you actually want? |
| Output | Vision summary with contrast to anti-vision |
| Aha Moment | Clarity on the gap between fear and desire |
| Retention Hook | "We're starting to see your patterns..." |

### Day 4: The Patterns
**Theme:** "How you actually operate"

| Element | Details |
|---------|---------|
| Duration | 3-5 minutes |
| Experience | Questions about behavior patterns. When do you procrastinate? What triggers you? How do you self-sabotage? |
| Output | "Pattern Map" - 2-3 recurring patterns identified |
| Aha Moment | "I never realized I always do that" |
| Retention Hook | "Tomorrow: your hidden strengths" |

### Day 5: The Strengths
**Theme:** "What you're actually good at"

| Element | Details |
|---------|---------|
| Duration | 2-4 minutes |
| Experience | Questions about what comes naturally, what others ask you for help with, when you feel in flow. |
| Output | Strength identification - 3-5 core strengths with examples |
| Aha Moment | Recognition of undervalued strengths |
| Retention Hook | "We're building your skill tree..." |

### Day 6: The Blockers
**Theme:** "What's holding you back"

| Element | Details |
|---------|---------|
| Duration | 3-5 minutes |
| Experience | Questions about what's preventing growth. Fear of failure? Fear of success? External circumstances? Internal resistance? |
| Output | "Blocker Analysis" - primary obstacles mapped |
| Aha Moment | Understanding the specific mechanism of stuckness |
| Retention Hook | "Tomorrow: your complete profile" |

### Day 7: The Reveal
**Theme:** "This is you"

| Element | Details |
|---------|---------|
| Duration | 5-10 minutes |
| Experience | Profile reveal with narrative summary. Interactive exploration of your psychometric profile. Skill tree preview (locked sections). |
| Output | Complete "Who You Are" card (shareable) + detailed profile |
| Aha Moment | "THIS IS ME" - the north star moment |
| Conversion Point | "Continue your journey with full access..." |

### 7-Day Journey Summary

```
Day 1: Hook         -> First Impression Card
Day 2: Anti-Vision  -> Fear Map
Day 3: Vision       -> Desire Map
Day 4: Patterns     -> Pattern Recognition
Day 5: Strengths    -> Strength Profile
Day 6: Blockers     -> Obstacle Analysis
Day 7: Reveal       -> Complete Profile + Paywall
```

**Total Time Investment:** ~20-30 minutes across 7 days

---

## 2. Feature Priority Matrix

### MUST HAVE (v1.0 - Launch)

| Feature | Description | Why Essential |
|---------|-------------|---------------|
| **Onboarding Flow** | Account creation, intro video, journey commitment | Users need context for why they're answering questions |
| **Daily Prompt System** | Push notifications + in-app prompts at scheduled times | Core engagement mechanism |
| **Conversational Assessment** | AI-guided question flow with adaptive follow-ups | The product IS the assessment |
| **Profile Storage** | Persist user responses and derived insights | Required for profile building |
| **Profile Visualization** | Summary cards, narrative description, basic metrics | The "reveal" moment needs visual impact |
| **Skill Tree (Preview)** | Visual tree showing dimensions with locked/unlocked states | Creates desire for paid tier |
| **Shareable Card** | Beautiful, branded card for social sharing | Virality mechanic |
| **Paywall/Subscription** | Stripe integration, subscription management | Revenue |
| **Basic Analytics** | Track completion rates, drop-off points | Required for iteration |

### SHOULD HAVE (v1.1 - Post-Launch)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Streak System** | Duolingo-style daily streaks | High - retention |
| **Progress History** | See how profile evolves over time | High - demonstrates value |
| **Full Skill Tree** | Interactive exploration with unlockable nodes | High - paid feature |
| **Push Notification Optimization** | Personalized timing based on engagement | Medium - retention |
| **Referral System** | Share codes, rewards for invites | Medium - growth |
| **"Compare with Friend"** | Limited anonymous comparison | Medium - social proof |

### COULD HAVE (v1.2+)

| Feature | Description | Notes |
|---------|-------------|-------|
| **Pathways/Journeys** | Multi-week guided development programs | Post-validation |
| **AI Coaching Chat** | On-demand conversational coaching | Resource intensive |
| **Weekly Wrapped** | Weekly insight summaries | Post core loop proven |
| **Mood/State Tracking** | Lightweight check-ins throughout day | Expansion feature |
| **Dark Mode** | UI preference | Nice to have |

### WON'T HAVE (v1.x - Explicit Cuts)

| Feature | Reason for Cutting |
|---------|-------------------|
| **Social Feed** | Complexity + distraction from core value |
| **Voice Input** | Technical complexity, mobile transcription unreliable |
| **Deep CBT Tools** | Regulatory risk, requires clinical validation |
| **Career Mapping** | Premium expansion, not core |
| **Relationship Mapping** | Premium expansion, not core |
| **AI Roleplay (Future Self Chat)** | Experimental, defer post-validation |
| **Web App** | Mobile-first, web is v2 |
| **Gamified Leaderboards** | Against "minimal gamification" decision |
| **Wearable Integration** | Technical complexity, defer |
| **Multi-language** | Localization is v2+ |

---

## 3. Technical MVP Scope

### 3.1 Architecture Overview

```
+------------------+     +------------------+     +------------------+
|   Expo Mobile    |<--->|   Convex         |<--->|   AI Agents      |
|   (React Native) |     |   (Backend)      |     |   (Claude API)   |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        v                        v                        v
   - UI Components          - User Data             - Assessment Agent
   - Navigation             - Profiles              - Synthesis Agent
   - Push Notifications     - Responses             - Insight Generator
   - Local State            - Subscriptions
```

### 3.2 Convex Schema (Simplified)

```typescript
// Core tables for MVP

// Users
users: {
  clerkId: string,           // Auth provider ID
  email: string,
  createdAt: number,
  subscriptionStatus: "free" | "trial" | "paid" | "churned",
  currentDay: number,        // 1-7 for free tier
  timezone: string,
  preferredTime: string,     // Daily prompt time
}

// Daily Responses
responses: {
  userId: Id<"users">,
  day: number,               // 1-7
  questionId: string,
  response: string,
  createdAt: number,
}

// Derived Profile
profiles: {
  userId: Id<"users">,
  version: number,           // Increments as profile evolves

  // Day 1: First Impression
  firstImpression: {
    summary: string,
    keyTraits: string[],
  },

  // Day 2: Anti-Vision
  antiVision: {
    fears: string[],
    avoidances: string[],
    summary: string,
  },

  // Day 3: Vision
  vision: {
    desires: string[],
    idealLife: string,
    summary: string,
  },

  // Day 4: Patterns
  patterns: {
    identified: { name: string, description: string, triggers: string[] }[],
  },

  // Day 5: Strengths
  strengths: {
    core: { name: string, evidence: string }[],
    latent: string[],
  },

  // Day 6: Blockers
  blockers: {
    primary: { name: string, mechanism: string }[],
    beliefs: string[],
  },

  // Day 7: Full Profile
  fullProfile: {
    narrative: string,       // 2-3 paragraph story of who they are
    dimensions: {            // For skill tree
      selfAwareness: number,
      emotionalIntelligence: number,
      resilience: number,
      clarity: number,
      action: number,
    },
    shareableCard: {
      headline: string,
      traits: string[],
      quote: string,
    },
  },

  updatedAt: number,
}

// Subscriptions
subscriptions: {
  userId: Id<"users">,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  status: "active" | "canceled" | "past_due",
  currentPeriodEnd: number,
}
```

### 3.3 Agent Architecture (Simplified)

For MVP, we use a **single orchestrator agent** rather than full multi-agent:

```
User Input
    |
    v
+------------------+
| Assessment Agent |  <- Single Claude call with structured output
| (Orchestrator)   |
+------------------+
    |
    +---> Asks follow-up questions (adaptive)
    |
    +---> Extracts structured data (Pydantic-style)
    |
    +---> Generates insights
    |
    v
Profile Update
```

**Key Simplification:** No separate agents for synthesis, coaching, etc. One agent handles the entire daily session. Multi-agent can be added post-MVP.

### 3.4 Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Mobile** | Expo (React Native) | Cross-platform, fast iteration |
| **Backend** | Convex | Real-time, serverless, auth integration |
| **Auth** | Clerk | Integrated with Convex, handles mobile well |
| **AI** | Claude API (Sonnet) | Cost-effective, good structured output |
| **Payments** | Stripe | Industry standard, Convex integration |
| **Analytics** | Mixpanel or Amplitude | Mobile event tracking |
| **Push** | Expo Push Notifications | Built into Expo |

### 3.5 Out of Technical Scope

- **No web app** - Mobile only for MVP
- **No real-time sync** - Users operate solo
- **No complex caching** - Convex handles state
- **No custom ML models** - Claude API only
- **No voice transcription** - Text input only

---

## 4. Success Metrics

### 4.1 North Star Metric

**"This Is Me" Rate:** Percentage of Day 7 users who rate their profile as "accurate" or "very accurate"

**Target:** >80%

**Measurement:** Post-reveal survey: "How accurate is this profile?" (1-5 scale, 4+ = success)

### 4.2 Funnel Metrics

| Stage | Metric | Target | Industry Benchmark |
|-------|--------|--------|-------------------|
| **Acquisition** | Installs | 10K first month | - |
| **Activation** | Complete Day 1 | >70% of signups | 50% |
| **Day 3 Retention** | Return on Day 3 | >40% | 20% |
| **Day 7 Completion** | Finish 7-day journey | >25% | 10% |
| **Conversion** | Free to Paid | >10% of Day 7 | 2-5% |
| **Day 30 Retention** | Still active at Day 30 | >15% | 3% |

### 4.3 Engagement Metrics

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **Session Duration** | 3-5 min average | Sweet spot for micro-sessions |
| **Questions per Session** | 5-8 answered | Enough for insight, not overwhelming |
| **Share Rate** | >20% of Day 7 users | Virality indicator |
| **Streak Length** | 5+ day avg (paid users) | Habit formation |

### 4.4 Qualitative Metrics

| Signal | Collection Method |
|--------|-------------------|
| **"This is me" quotes** | In-app feedback, app store reviews |
| **Word-of-mouth** | "How did you hear about us?" survey |
| **Emotional response** | Optional post-Day 7 interview |
| **Feature requests** | In-app feedback, support tickets |

### 4.5 Anti-Metrics (What NOT to Optimize)

| Metric | Why We Don't Optimize |
|--------|----------------------|
| **Time in App** | We want micro-sessions, not addiction |
| **Daily Active Users (raw)** | Quality > quantity at this stage |
| **Social shares** | Vanity metric without conversion |

---

## 5. Sprint Breakdown

### Sprint 1 (Weeks 1-2): Foundation + Day 1

**Goal:** User can download app, create account, complete Day 1, see First Impression card

**Deliverables:**
- [ ] Expo project setup with navigation
- [ ] Clerk authentication integration
- [ ] Convex schema deployment
- [ ] Day 1 question flow (5-7 questions)
- [ ] Assessment Agent v1 (single prompt)
- [ ] First Impression card UI
- [ ] Basic profile storage
- [ ] Push notification infrastructure

**Definition of Done:** Internal team can complete Day 1 flow and see generated insight

### Sprint 2 (Weeks 3-4): Days 2-6 + Profile Building

**Goal:** Complete daily experience through Day 6, profile accumulates data

**Deliverables:**
- [ ] Day 2 flow (Anti-Vision)
- [ ] Day 3 flow (Vision)
- [ ] Day 4 flow (Patterns)
- [ ] Day 5 flow (Strengths)
- [ ] Day 6 flow (Blockers)
- [ ] Profile synthesis after each day
- [ ] Daily summary cards
- [ ] Push notification scheduling by user timezone
- [ ] Basic analytics events

**Definition of Done:** Internal team completes Days 1-6 with coherent accumulating profile

### Sprint 3 (Weeks 5-6): Day 7 + Visualization + Paywall

**Goal:** Complete reveal experience with shareable card and working payment

**Deliverables:**
- [ ] Day 7 reveal flow
- [ ] Full profile narrative generation
- [ ] Skill tree visualization (preview mode)
- [ ] Shareable card generation
- [ ] Share functionality (social media)
- [ ] Stripe integration
- [ ] Subscription management screens
- [ ] Paywall UI with value proposition

**Definition of Done:** End-to-end journey works including payment

### Sprint 4 (Weeks 7-8): Polish + Beta Launch

**Goal:** Production-ready beta with real users

**Deliverables:**
- [ ] Bug fixes from internal testing
- [ ] Performance optimization
- [ ] Error handling and edge cases
- [ ] Analytics dashboard setup
- [ ] App store submission (TestFlight)
- [ ] Beta user onboarding
- [ ] Feedback collection system
- [ ] Monitoring and alerting

**Definition of Done:** 50+ beta users complete 7-day journey with <10% critical bug rate

### Post-Beta Sprints (Optional Planning)

**Sprint 5-6:** Iterate based on beta feedback
- Address "This is me" accuracy issues
- Optimize conversion funnel
- Add streak system if retention data supports

**Sprint 7-8:** Public launch preparation
- App store optimization
- Marketing site
- Scale infrastructure

---

## 6. Risk Register

### 6.1 High Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **"This is me" rate too low** | Medium | Critical | A/B test question sets, add user feedback loop to improve prompts, validate prompts with target users before launch |
| **Day 7 drop-off** | High | High | Strong Day 1 hook, push notification optimization, anti-vision reminder on Day 5-6 ("remember what you're avoiding") |
| **AI accuracy/hallucination** | Medium | High | Use structured output mode, validate responses before showing, human review of edge cases |
| **App store rejection** | Low | High | Follow guidelines strictly, avoid therapeutic claims, clear disclaimers |

### 6.2 Medium Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Stripe integration delays** | Medium | Medium | Start integration Sprint 2, have manual fallback for beta |
| **Push notification deliverability** | Medium | Medium | Test across devices early, have in-app fallback |
| **Claude API costs higher than expected** | Medium | Medium | Monitor usage closely, have Sonnet/Haiku toggle ready |
| **Scope creep** | High | Medium | Product owner gate on all feature additions, ruthless cuts |

### 6.3 Low Risks (But Monitor)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Convex scaling issues** | Low | Medium | Their managed infrastructure handles this |
| **Competitor launches similar** | Low | Low | Speed to market, focus on execution |
| **Legal/regulatory** | Low | High | Avoid therapy claims, clear terms of service |

### 6.4 De-risking Activities

| Activity | Timeline | Purpose |
|----------|----------|---------|
| **Prompt validation study** | Week 1 | Test Day 1-2 questions with 10 users for accuracy |
| **Internal dogfooding** | Weeks 2-4 | Team uses app daily to find issues |
| **Closed beta (50 users)** | Week 7 | Real user validation before public |
| **Conversion rate test** | Week 8 | A/B test paywall messaging |

---

## 7. Open Questions (To Resolve in Sprint 1)

| Question | Owner | Decision By |
|----------|-------|-------------|
| Exact pricing ($14.99/mo vs $19.99/mo vs $9.99/mo) | Joel | End of Sprint 2 |
| Profile framework (Big Five vs Dan Koe vs custom) | Joel + AI | End of Sprint 1 |
| Push notification timing defaults | Team | End of Sprint 1 |
| App name finalized (Life OS vs Unfuck Your Life vs other) | Joel | End of Sprint 2 |
| Beta user recruitment strategy | Team | End of Sprint 3 |

---

## 8. What Success Looks Like

### Week 8 (Beta Launch)
- 50+ users complete 7-day journey
- >70% "This is me" accuracy rating
- >5% conversion in beta
- <10% critical bug rate
- Clear patterns in qualitative feedback

### Month 3 (Public Launch Ready)
- 1,000+ completed journeys
- >80% "This is me" accuracy
- >10% conversion rate
- Day 30 retention >15%
- Word-of-mouth signal (organic installs)

### Month 6 (Product-Market Fit Signal)
- 10,000+ users
- Organic growth exceeding paid acquisition
- Users describing product to friends accurately
- Retention curves flattening (not declining to zero)
- Clear expansion revenue opportunity (upsells working)

---

## Appendix A: Day-by-Day Question Examples

### Day 1: First Impression
1. "What's one thing you wish people understood about you that they usually don't?"
2. "When you have free time with no obligations, what do you actually do (not what you think you should do)?"
3. "What kind of conversations energize you vs drain you?"
4. "If you could change one thing about your life tomorrow, what would it be?"
5. "What's something you're proud of that you don't often talk about?"

### Day 2: Anti-Vision
1. "Describe the life you're terrified of living in 10 years."
2. "What patterns from your parents' lives are you afraid of repeating?"
3. "What's something you keep avoiding that you know you should face?"
4. "When do you feel most like a fraud or impostor?"
5. "What would make you look back on your life with regret?"

### Day 3: Vision
1. "Describe your ideal Tuesday (not vacation, regular life)."
2. "What would you do if you knew you couldn't fail?"
3. "Who do you admire, and what specifically do you admire about them?"
4. "What's something you want that you're embarrassed to admit?"
5. "If money were no object, how would you spend your time?"

(Additional question sets in separate document)

---

## Appendix B: Shareable Card Mockup

```
+------------------------------------------+
|           LIFE OS                        |
|                                          |
|    "The Reluctant Visionary"             |
|                                          |
|    You see possibilities others miss,    |
|    but fear of failure keeps you         |
|    playing smaller than you should.      |
|                                          |
|    Core Strengths:                       |
|    - Pattern Recognition                 |
|    - Deep Empathy                        |
|    - Strategic Thinking                  |
|                                          |
|    Your Edge:                            |
|    "You're most alive when creating      |
|     something from nothing."             |
|                                          |
|    [Get Your Profile] lifeos.app         |
+------------------------------------------+
```

---

*Document Version: 1.0*
*Next Review: End of Sprint 1*
