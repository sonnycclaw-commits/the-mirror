# S.T.A.R.S. Implementation Plan

**Generated:** 2026-01-14
**Status:** Sprint-ready implementation plan
**Source Documents:** 05-building-it.md, mvp-plan.md, edge-cases-risk-analysis.md, CHALLENGES.md, KISS-PLAN.md
**Principle:** Build with soul, validate fast, fail cheap

---

## Part 1: The Two Paths

The adversarial review revealed a critical fork in the road. Both paths are valid. Choose based on risk tolerance.

### Path A: Beautiful Constellation (The Soul Bet)

**Timeline:** 12 weeks
**Risk Level:** HIGH
**Capital Required:** Full commitment
**Differentiation:** HIGH (if it works)

Build the full vision: polar star map, 7-day excavation, Birth Chart reveal, TARS companion. The bet is that the *experience* creates value that text cannot.

**When to Choose Path A:**
- You have 12 weeks of runway
- You can survive a total failure
- You believe the visualization IS the product (not decoration)
- You've run at least 10 concierge users through Day 1-7 manually

**Kill Thresholds for Path A:**
| Week | Metric | Kill If Below |
|------|--------|---------------|
| Week 4 | Internal team Day-7 completion | 100% (we can't even finish it) |
| Week 6 | Alpha user Day-7 completion | 40% |
| Week 8 | "This is me" accuracy rating | 70% |
| Week 10 | Beta conversion to paid | 5% |

---

### Path B: KISS Text Version (The Validation Bet)

**Timeline:** 2-4 weeks
**Risk Level:** LOW
**Capital Required:** 50 hours + $200
**Differentiation:** LOW (tests hypothesis, not product)

Build the simplest thing that tests the core hypothesis: Does AI-generated insight + one action cause behavior change?

**When to Choose Path B:**
- You haven't validated anything yet
- You have <8 weeks runway
- You're unsure if the 7-day excavation works
- ChatGPT comparison makes you nervous

**Path B Build Spec:**
| Component | Implementation | Time |
|-----------|----------------|------|
| Chat UI | v0.dev landing page | 4 hours |
| AI Backend | Claude API direct | 4 hours |
| Profile Storage | Airtable | 2 hours |
| Email System | Resend | 2 hours |
| Follow-up Form | Typeform | 2 hours |
| **Total** | | **~15 hours** |

**Kill Thresholds for Path B:**
| Metric | Kill If Below |
|--------|---------------|
| Profile accuracy rating (1-5) | 3.5 average |
| % who take recommended action | 15% |
| % who report positive outcome | 20% |
| % who want next experiment | 25% |

---

### Decision Criteria: Which Path?

```
START HERE
    |
    v
Have you validated the 7-day flow with 10+ users manually?
    |
    +-- NO --> Path B (validate first)
    |
    +-- YES --> Did 60%+ complete Day 7?
                    |
                    +-- NO --> Path B or pivot
                    |
                    +-- YES --> Did they pay or say they would?
                                    |
                                    +-- NO --> Path B (test monetization)
                                    |
                                    +-- YES --> Path A (build the soul)
```

---

### Pivoting Between Paths

**Path A to Path B (soul not working):**
- Trigger: Day-7 completion <40% in Week 6
- Action: Extract core prompts, rebuild as text-only chat
- Timeline: 1 week to pivot

**Path B to Path A (validation passed):**
- Trigger: 3+ kill threshold metrics pass
- Action: Begin Sprint 1 of Path A
- Timeline: Begin immediately after Week 4 validation

---

## Part 2: Sprint Breakdown (Path A - Constellation Build)

### Sprint 0: Pre-Flight (Week 0)

**Goal:** Everything needed before the first line of code.

**Deliverables:**
- [ ] Concierge validation: 10 users through 7-day protocol manually
- [ ] Tech stack decisions locked
- [ ] Design system basics (colors, typography, star visual language)
- [ ] Claude prompt v1 for each day
- [ ] Crisis detection keyword list
- [ ] Legal: ToS and privacy policy drafts

**Technical Tasks:**
| Task | Effort | Owner |
|------|--------|-------|
| Run 10 concierge users (WhatsApp/SMS) | 20 hrs | Joel |
| Finalize Next.js + Convex setup | 4 hrs | Dev |
| Design mood board + star visual language | 8 hrs | Design |
| Draft Day 1-7 prompts for Claude | 6 hrs | Joel |
| Crisis keyword list + response copy | 4 hrs | Joel |
| ToS + Privacy Policy draft | 6 hrs | Legal |

**Dependencies:** Nothing blocks this. Run in parallel with hiring/contracting.

**Demo Criteria:** Concierge results shared: Day-7 completion rate, accuracy ratings, qualitative quotes.

**Risk Mitigation:**
- If concierge completion <40%, STOP. Do not proceed to Sprint 1.
- If users find questions too heavy, revise prompts before building.

---

### Sprint 1: Foundation + Day 1 (Weeks 1-2)

**Goal:** User can create account, complete Day 1, see First Impression card.

**User Stories:**
1. As a user, I can create an account with magic link email auth
2. As a user, I answer Day 1 questions in a conversational flow
3. As a user, I see a "First Impression" insight card after Day 1
4. As a user, I receive a push notification reminder for Day 2

**Technical Tasks:**
| Task | Effort | Dependency |
|------|--------|------------|
| Next.js project scaffold | 2 hrs | None |
| Clerk auth integration | 4 hrs | Scaffold |
| Convex schema deployment (users, responses, profiles) | 4 hrs | Scaffold |
| Day 1 question flow UI (chat-style) | 8 hrs | Schema |
| Claude API integration (Assessment Agent v1) | 6 hrs | None |
| First Impression card generation | 4 hrs | Claude API |
| Profile storage after Day 1 | 4 hrs | Schema |
| Push notification infrastructure (Expo) | 6 hrs | Auth |
| Crisis keyword detection (basic) | 4 hrs | Claude API |
| Magic link email styling | 2 hrs | Auth |

**Total Effort:** ~44 hours

**Dependencies:**
```
Scaffold ─┬─> Auth ────> Push
          ├─> Schema ──> Question UI ──> Profile Storage
          └─> Claude API ─> Card Generation
                        └─> Crisis Detection
```

**Demo Criteria:**
- Complete Day 1 flow on device
- First Impression card displays with generated insight
- Push notification received for Day 2
- Crisis keywords trigger resource display (not AI response)

**Risk Mitigation:**
- Claude API latency: Add typing indicator ("Reflecting on what you shared...")
- Structured output failures: Retry with same prompt, log failures
- If crisis detection triggers too often: Tune sensitivity, but err toward over-detection

---

### Sprint 2: Days 2-6 + Profile Accumulation (Weeks 3-4)

**Goal:** Complete daily experience through Day 6. Profile accumulates across days.

**User Stories:**
1. As a user, I complete Day 2 (Anti-Vision) and see my Fear Map
2. As a user, I complete Days 3-6 and see daily summary cards
3. As a user, I can see my profile building over time
4. As a user, I receive appropriately-timed push notifications

**Technical Tasks:**
| Task | Effort | Dependency |
|------|--------|------------|
| Day 2 question flow (Anti-Vision) | 4 hrs | Day 1 complete |
| Day 2 card: Fear Map | 3 hrs | Day 2 flow |
| Day 3 question flow (Vision) | 4 hrs | Day 2 complete |
| Day 3 card: Desire Map | 3 hrs | Day 3 flow |
| Day 4 question flow (Patterns) | 4 hrs | Day 3 complete |
| Day 4 card: Pattern Recognition | 3 hrs | Day 4 flow |
| Day 5 question flow (Strengths) | 4 hrs | Day 4 complete |
| Day 5 card: Strength Profile | 3 hrs | Day 5 flow |
| Day 6 question flow (Blockers) | 4 hrs | Day 5 complete |
| Day 6 card: Obstacle Analysis | 3 hrs | Day 6 flow |
| Profile synthesis: accumulate across days | 6 hrs | Day 1 complete |
| Timezone-aware push scheduling | 4 hrs | Push infrastructure |
| Analytics events (Mixpanel/Amplitude) | 4 hrs | Any day flow |
| Trauma surfacing detection | 4 hrs | Crisis detection |
| Opt-out paths ("This is getting heavy") | 4 hrs | Any day flow |

**Total Effort:** ~57 hours

**Dependencies:**
```
Day 1 ─> Day 2 ─> Day 3 ─> Day 4 ─> Day 5 ─> Day 6
    └─> Profile Synthesis (runs parallel, updates after each day)
    └─> Analytics (parallel, no dependency)
    └─> Push Scheduling (parallel)
```

**Demo Criteria:**
- Complete Days 1-6 with coherent accumulating profile
- Daily cards show insights that build on previous days
- Push notifications arrive at user's preferred time
- Opt-out path works: "Want to shift topics?" appears when appropriate
- Analytics events firing (check dashboard)

**Risk Mitigation:**
- State vs Trait confusion: Add "Is this how you usually feel?" prompts
- Minimal response users: Adaptive prompting, track response length
- If Day 3-4 drop-off is high: A/B test lighter prompts

---

### Sprint 3: Day 7 Reveal + Visualization Foundation (Weeks 5-6)

**Goal:** The emotional peak. Birth Chart reveal with basic polar star map.

**User Stories:**
1. As a user, I complete Day 7 and see my full profile narrative
2. As a user, I see a polar star map with my constellation (static)
3. As a user, I can tap stars to see what they represent
4. As a user, I see a shareable "Who You Are" card
5. As a user, I hit the paywall and see the value proposition

**Technical Tasks:**
| Task | Effort | Dependency |
|------|--------|------------|
| Day 7 question flow (The Reveal) | 4 hrs | Day 6 complete |
| Full profile narrative generation | 6 hrs | All days complete |
| Polar coordinate system (math) | 8 hrs | None |
| Canvas/Pixi.js star rendering | 12 hrs | Polar math |
| 5 domain axes visualization | 6 hrs | Star rendering |
| Star types (bright/dim/flickering) | 4 hrs | Star rendering |
| Tap interaction: star → insight card | 6 hrs | Star rendering |
| Static connection lines (bezier) | 4 hrs | Star rendering |
| Shareable card generation | 6 hrs | Full profile |
| Share functionality (native share) | 4 hrs | Shareable card |
| Stripe integration | 8 hrs | None |
| Subscription management screens | 6 hrs | Stripe |
| Paywall UI with value proposition | 4 hrs | Stripe |
| Profile accuracy rating prompt | 2 hrs | Day 7 flow |

**Total Effort:** ~80 hours

**Dependencies:**
```
                    ┌─> Shareable Card ─> Share
Day 6 ─> Day 7 ────┼─> Profile Narrative
                    └─> Accuracy Rating

Polar Math ─> Star Rendering ─┬─> Axes
                              ├─> Star Types
                              ├─> Tap Interaction
                              └─> Connection Lines

Stripe (parallel) ─> Subscription UI ─> Paywall
```

**Demo Criteria:**
- End-to-end journey works: Day 1 through Day 7
- Polar star map displays with user's constellation
- Tap on star shows insight card
- Shareable card generates and can be shared
- Stripe test payment completes
- Accuracy rating captured

**Risk Mitigation:**
- Pixi.js complexity: Start with SVG fallback, optimize later
- Stripe delays: Have manual beta access fallback
- If accuracy ratings <70%: Review prompts, add validation loops

---

### Sprint 4: Living Stars + Animation (Weeks 7-8)

**Goal:** The constellation breathes. Stars pulse. Connections shimmer.

**User Stories:**
1. As a user, I see stars pulsing with subtle glow
2. As a user, I see connection lines fade in smoothly
3. As a user, I see the Birth Chart reveal as a choreographed sequence
4. As a user, I can navigate between different views of my constellation

**Technical Tasks:**
| Task | Effort | Dependency |
|------|--------|------------|
| Star glow animations (CSS/Canvas) | 8 hrs | Star rendering |
| Connection line fade-in | 4 hrs | Connection lines |
| Tap interaction: enlarge + brighten | 4 hrs | Tap interaction |
| Day/night cycle background shift | 4 hrs | Canvas setup |
| Birth Chart reveal sequence | 12 hrs | All above |
| Stars appearing one-by-one | 6 hrs | Reveal sequence |
| Camera pullback after reveal | 4 hrs | Reveal sequence |
| TARS narration overlay | 6 hrs | Reveal sequence |
| View navigation (zoom, pan) | 6 hrs | Canvas setup |
| Performance optimization | 8 hrs | All animations |
| Animation accessibility (reduce motion) | 4 hrs | All animations |

**Total Effort:** ~66 hours

**Dependencies:**
```
Star Rendering ─> Glow Animations ─┐
Connection Lines ─> Fade-in ───────┤
Tap Interaction ─> Enlarge/Brighten┤
Day/Night Cycle ───────────────────┼─> Birth Chart Reveal Sequence
                                   │        │
                                   │        ├─> Stars One-by-One
                                   │        ├─> Camera Pullback
                                   │        └─> TARS Narration
                                   │
                                   └─> View Navigation

All Animations ─> Performance Optimization
              └─> Accessibility (Reduce Motion)
```

**Demo Criteria:**
- Constellation feels "alive" - stars pulse, connections shimmer
- Birth Chart reveal is emotionally impactful
- TARS narration plays during reveal
- Performance: 60fps on mid-tier devices
- Reduce motion preference respected

**Risk Mitigation:**
- Animation jank: Profile on real devices early, optimize hot paths
- Reveal feels too long: Get user feedback, cut if needed
- If users skip reveal: Make it unskippable first time, skippable after

---

### Sprint 5: The Walk (Weeks 9-10)

**Goal:** Beyond insight. The constellation responds to behavior.

**User Stories:**
1. As a user, I receive personalized experiments based on my profile
2. As a user, I complete evening check-ins about my day
3. As a user, I see stars brighten/dim based on my actions
4. As a user, I see new stars appear when I discover new patterns
5. As a user, I receive weekly constellation reviews

**Technical Tasks:**
| Task | Effort | Dependency |
|------|--------|------------|
| Experiment generation from profile | 8 hrs | Full profile |
| Evening check-in flow | 6 hrs | Day 7 complete |
| Star brightness response system | 8 hrs | Star rendering |
| Behavioral data → star updates | 6 hrs | Check-in flow |
| New star appearance animation | 6 hrs | Star rendering |
| Connection formation/fade over time | 6 hrs | Connection lines |
| Weekly constellation review | 8 hrs | Star updates |
| Skill tree visualization (preview) | 8 hrs | None |
| Streak system (optional) | 6 hrs | Check-in flow |
| Re-engagement notifications | 4 hrs | Push system |

**Total Effort:** ~66 hours

**Dependencies:**
```
Full Profile ─> Experiment Generation
Day 7 Complete ─> Evening Check-ins ─> Behavioral Data
                                            │
Star Rendering ─> Brightness Response <─────┤
              └─> New Star Animation        │
Connection Lines ─> Formation/Fade <────────┘

Behavioral Data + Star Updates ─> Weekly Review

Skill Tree (parallel, no dependencies)
Streak System (parallel after check-ins)
```

**Demo Criteria:**
- Experiments feel personalized and actionable
- Check-in flow is <2 minutes
- Star brightness visibly changes based on reported actions
- Weekly review synthesizes progress
- Users report taking actions (target: 30%)

**Risk Mitigation:**
- Experiments feel generic: Add more profile dimensions to generation
- Users don't check in: Simplify to 3-tap check-in
- If Walk retention <40%: Survey users, may need more gamification

---

### Sprint 6: Polish + Beta Launch (Weeks 11-12)

**Goal:** Production-ready. 50+ beta users complete the journey.

**User Stories:**
1. As a user, I have a smooth, bug-free experience
2. As a user, I can export my profile data
3. As a user, I can pause or delete my account
4. As a user, I can provide feedback within the app

**Technical Tasks:**
| Task | Effort | Dependency |
|------|--------|------------|
| Bug fixes from internal testing | 16 hrs | All sprints |
| Performance optimization | 8 hrs | All features |
| Error handling and edge cases | 8 hrs | All features |
| Data export functionality | 4 hrs | Profile storage |
| Account pause/deletion | 4 hrs | User management |
| In-app feedback collection | 4 hrs | None |
| Analytics dashboard setup | 4 hrs | Analytics events |
| Monitoring and alerting | 6 hrs | Backend |
| TestFlight submission | 4 hrs | App complete |
| Beta user onboarding | 8 hrs | TestFlight approved |
| Security checklist completion | 8 hrs | All features |
| Privacy policy finalization | 4 hrs | Features locked |

**Total Effort:** ~78 hours

**Dependencies:**
```
All Features ─> Bug Fixes ─> Performance ─> Security ─> TestFlight
                         └─> Error Handling         └─> Beta Onboarding

Profile Storage ─> Data Export
User Management ─> Pause/Deletion

Analytics Events ─> Dashboard
Backend ─> Monitoring
```

**Demo Criteria:**
- 50+ beta users complete 7-day journey
- Critical bug rate <10%
- "This is me" accuracy rating >70%
- Conversion to paid >5%
- No security vulnerabilities in checklist

**Risk Mitigation:**
- TestFlight rejection: Review Apple guidelines, avoid health claims
- Beta users don't complete: Over-recruit (100 invites for 50 completers)
- If metrics miss targets: Use feedback to iterate before public launch

---

## Part 3: Edge Cases & Risk Analysis

### 3.1 User Disappears (Ghosts)

**Scenario:** User completes Days 1-3, then stops returning.

**Handling by Duration:**
| Days Silent | Action | Message Tone |
|-------------|--------|--------------|
| 1 day | Light nudge | "Your constellation is waiting..." |
| 2 days | Reminder | "Everything you shared is still here." |
| 3 days | Value hook | "You're 4 days from your Birth Chart." |
| 7 days | Trial warning | "Your trial ends in 3 days." |
| 14 days | Pause offer | "Want to pause and come back later?" |
| 30 days | Data retention | Email: "We'll archive your data in 60 days." |
| 90 days | Archive | Move to cold storage, keep summary |

**Technical Implementation:**
```
Cron job (daily):
  - Query users with last_activity > N days
  - Check current notification state
  - Send appropriate notification
  - Log for analytics

Max notifications: 1 per day
Never spam: Cap at 7 total re-engagement attempts
```

---

### 3.2 Profile Drift

**Scenario:** User's answers change significantly over time (new job, breakup, crisis).

**Detection:**
```
Compare current session responses to profile baseline:
  - Semantic similarity score
  - Emotional valence shift
  - Key entity changes (job, relationship, location)

If drift_score > threshold:
  - Flag for profile evolution
  - Ask: "A lot seems to have changed. Want to update your profile?"
```

**Handling:**
| Drift Type | Response |
|------------|----------|
| Gradual shift | Update profile incrementally, show "evolution" view |
| Sudden change | Offer "life event" mode - accelerated re-assessment |
| Contradictions | "Earlier you said X, now Y. Which feels more true?" |

---

### 3.3 Multiple Device Sync

**Scenario:** User has phone and tablet, both active.

**Design Decision:** Single active session. No concurrent editing.

**Implementation:**
```
On app foreground:
  - Check session token vs server
  - If token mismatch: "You're active on another device. Continue here?"
  - On continue: Invalidate other session, sync latest state

Conflict resolution:
  - Last-write-wins for responses
  - Merge for read-only data (streak count)
  - Never lose user input (queue offline, merge on reconnect)
```

---

### 3.4 Data Corruption Recovery

**Scenario:** Profile data becomes corrupted or inconsistent.

**Prevention:**
```
- Transactional writes (Convex handles this)
- Daily profile snapshots
- Version field on profile (for migrations)
- Input validation on all writes
```

**Recovery:**
| Corruption Type | Recovery |
|-----------------|----------|
| Single field invalid | Null field, re-derive on next session |
| Profile inconsistent | Roll back to last snapshot |
| All data lost | Email user, offer re-assessment (rare) |

**User Communication:**
- Never show error message without action
- "Something went wrong. We've restored your last save."
- Log corruption events for investigation

---

### 3.5 Rate Limiting & Abuse Prevention

**Vectors:**
| Abuse Type | Detection | Response |
|------------|-----------|----------|
| Rapid-fire questions | >20 messages/minute | Slow down response time |
| Jailbreak attempts | Pattern matching on prompts | Log, don't respond, flag |
| Multiple accounts | Device fingerprint, email patterns | Block after 2nd trial |
| API scraping | Request patterns | Rate limit, block |
| Offensive input | Content filter | "Let's keep this productive" |

**Rate Limits:**
```
Per user:
  - 100 messages/hour (generous for real use)
  - 500 messages/day
  - 10 sessions/day

Per IP:
  - 1000 requests/hour
  - 5 account creations/day

Global:
  - Claude API budget alerts
  - Auto-pause if spend > 2x daily average
```

---

### 3.6 Crisis Detection Protocol

**THIS IS CRITICAL. Must be perfect before launch.**

**Detection Layers:**
```
Layer 1: Keyword matching
  - suicid*, self-harm, kill myself, end it all, abuse, assault
  - Update list based on false negatives

Layer 2: Sentiment analysis
  - Acute distress patterns
  - Hopelessness indicators
  - Sudden negativity spike

Layer 3: Behavioral signals
  - Engagement drop after heavy topic
  - Session abandonment patterns
```

**Response Protocol:**
```
On crisis detection:
  1. STOP AI response generation
  2. Display crisis resources screen:
     - 988 Suicide & Crisis Lifeline
     - Crisis Text Line: Text HOME to 741741
     - International Association for Suicide Prevention
  3. Store session for review (anonymized)
  4. Offer: "Would you like to notify an emergency contact?"
  5. DO NOT continue conversation on crisis topic
  6. Log for safety auditing (90-day retention)
```

**What TARS Never Does:**
- Attempts to counsel on crisis content
- Says "I understand how you feel"
- Provides advice on self-harm methods
- Diagnoses mental health conditions

---

## Part 4: Kill Thresholds

### By Phase

| Phase | Metric | Kill Threshold | Action If Below |
|-------|--------|----------------|-----------------|
| **Sprint 0** | Concierge Day-7 completion | <40% | Do not proceed to Sprint 1 |
| **Sprint 2** | Internal Day-6 completion | <100% | Fix UX before continuing |
| **Sprint 3** | Alpha accuracy rating | <60% | Revise prompts, extend sprint |
| **Sprint 4** | Beta Day-7 completion | <30% | Analyze drop-off, simplify |
| **Sprint 5** | Walk engagement | <20% | Redesign experiments |
| **Sprint 6** | Beta conversion | <3% | Re-evaluate monetization |

### The Soul Bet Threshold

**The constellation visualization is the soul. But the soul costs 12 weeks.**

**Kill the visualization if:**
1. Alpha users don't mention it in feedback (not noticed)
2. A/B test: text-only vs constellation shows no difference in accuracy ratings
3. Development time exceeds 1.5x estimates (opportunity cost)

**Pivot to text if:**
- Week 6 completion <30% (users dropping before seeing constellation)
- Users describe constellation as "confusing" or "gimmicky"
- ChatGPT comparison shows no differentiation

---

## Part 5: Dependency Graph

### Critical Path (Bold = Blocks Everything After)

```
Week 0: Concierge Validation ─────────────────────────────────────────────────┐
                                                                               │
Week 1-2: **Day 1 Flow** ─> **Profile Storage** ─> Day 2-6 Flows             │
              │                                                                │
              └─> Claude API ─> Crisis Detection                               │
                                                                               │
Week 3-4: Day 2-6 Flows ─> Profile Synthesis ─> Day 7 Reveal                  │
                                                                               │
Week 5-6: **Polar Math** ─> **Star Rendering** ─> All Visualization           │
              │                                                                │
              └─> Stripe Integration (parallel)                                │
                                                                               │
Week 7-8: Birth Chart Reveal Sequence ─> Performance Optimization             │
                                                                               │
Week 9-10: Evening Check-ins ─> Star Updates ─> Weekly Review                 │
                                                                               │
Week 11-12: Bug Fixes ─> **Security Audit** ─> **TestFlight** ─> Beta Launch  │
                                                                               │
                                                                               │
KILL THRESHOLD CHECK ──────────────────────────────────────────────────────────┘
(After each sprint, evaluate metrics against thresholds)
```

### Parallelizable Work

**Can run simultaneously:**
- Design system work (Week 0) + Concierge validation
- Stripe integration (Week 5-6) + Visualization work
- Analytics setup (any time) + Core flows
- Legal/compliance (Week 0-4) + Development
- Security checklist (Week 10-12) + Feature polish

### Dependencies That Surprise

| Dependency | Why It's Dangerous |
|------------|--------------------|
| Claude API latency | Blocks conversation feel; test early |
| App Store review | Can take 2+ weeks; submit early |
| Stripe account approval | Can take 1 week; apply in Sprint 4 |
| Crisis protocol legal review | Blocks launch; start Week 0 |
| Device testing | Real performance differs; test on devices continuously |

---

## Part 6: Tech Stack Decisions

**Locked decisions for Path A:**

| Layer | Choice | Why | Alternative |
|-------|--------|-----|-------------|
| **Frontend** | Next.js + React | Fast iteration, SSR, good animation support | Expo (if mobile-first) |
| **Visualization** | Pixi.js or Canvas 2D | Performant star rendering with effects | SVG (simpler but less performant) |
| **Animation** | Framer Motion + custom | Smooth choreographed sequences | CSS animations (simpler) |
| **Backend** | Convex | Real-time, serverless, auth integration | Supabase (also good) |
| **Auth** | Clerk | Integrated with Convex, magic link | Supabase Auth |
| **AI** | Claude API (Sonnet) | Cost-effective, good structured output | GPT-4 (more expensive) |
| **Payments** | Stripe | Industry standard | RevenueCat (better for mobile) |
| **Analytics** | Mixpanel | Good mobile support, funnels | Amplitude |
| **Push** | Expo Push or FCM | Works with web and mobile | OneSignal |

---

## Part 7: Security Checklist (Must Complete Before Launch)

### MVP Security (Sprint 6)

- [ ] Convex with RLS (row-level security) enabled
- [ ] TLS for all API calls
- [ ] Input sanitization (prevent injection)
- [ ] Rate limiting on all endpoints
- [ ] Magic link auth (no passwords)
- [ ] Audit logging (who accessed what)
- [ ] Privacy policy written and reviewed
- [ ] Data export endpoint working
- [ ] Encryption at rest (AES-256)
- [ ] Crisis detection tested with edge cases
- [ ] Harmful output red-teaming complete

### Before Public Launch (Post-Beta)

- [ ] External security audit
- [ ] Penetration testing
- [ ] GDPR compliance review
- [ ] App Store compliance review
- [ ] Incident response plan documented
- [ ] SOC 2 consideration (if B2B later)

---

## Part 8: Open Questions to Resolve

**Resolve in Sprint 0-1:**
| Question | Owner | Decision By |
|----------|-------|-------------|
| Mobile-first (Expo) vs Web-first (Next.js)? | Joel | Week 1 |
| Exact pricing ($9.99 vs $14.99 vs $19.99/mo)? | Joel | Sprint 2 |
| App name finalized? | Joel | Sprint 2 |
| Push notification timing defaults? | Team | Sprint 1 |
| Crisis protocol legal sign-off? | Legal | Sprint 3 |

**Resolve Before Beta:**
| Question | Owner | Decision By |
|----------|-------|-------------|
| Beta user recruitment strategy? | Team | Sprint 4 |
| What IS the Walk? (detailed spec) | Joel | Sprint 4 |
| Streak system: yes/no? | Team | Sprint 5 |
| Free tier: yes/no? | Joel | Sprint 5 |

---

## Summary: The Path Forward

### If You Choose Path B (KISS)
1. Skip to KISS-PLAN.md
2. Build in 2 weeks
3. Run 30 users
4. Measure kill thresholds
5. Decide: proceed to Path A or pivot

### If You Choose Path A (Soul)
1. Run concierge validation (Week 0)
2. If 60%+ complete Day 7: proceed
3. Follow 6-sprint plan above
4. Check kill thresholds after each sprint
5. Beta launch at Week 12
6. Public launch after beta iteration

### The Honest Timeline

| Milestone | Path B | Path A |
|-----------|--------|--------|
| First user insight | Day 3 | Week 4 |
| Validation data | Week 4 | Week 6 |
| Beta launch | N/A | Week 12 |
| Public launch | Week 6 | Week 16+ |

**Choose based on your runway, risk tolerance, and belief in the soul.**

---

*"Build the thing you believe in, not the thing that validates fastest."*
*But also: validate before you build for 12 weeks.*

---

**Document Version:** 1.0
**Last Updated:** 2026-01-14
**Next Review:** After Sprint 0 completion
