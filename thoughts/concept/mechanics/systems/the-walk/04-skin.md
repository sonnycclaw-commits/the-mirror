# The Walk - SKIN

**System:** the-walk
**Lens:** SKIN (4/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md ✓, 02-blood.md ✓, 03-nerves.md ✓

---

## Overview

Boundaries, edge cases, and failure modes for the Journey system.

---

## 1. Journey Lifecycle Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| User abandons discovery mid-interview | Save draft, can resume within 7 days | Respect invested time |
| Discovery produces 0 milestones | Cannot proceed, TARS prompts deeper exploration | Need at least 1 star |
| User disputes AI-generated milestones | Can edit any milestone, re-run discovery | User owns their journey |
| Preview interrupted (app crash) | Resume from last position | Don't lose conversion momentum |
| User subscribes during preview | Skip to end, start walking immediately | Don't block eager users |
| Payment fails during subscription | Grace period: 3 days | Avoid punishing payment issues |
| Subscription lapses mid-journey | → PAUSED state, can resume anytime | Don't destroy progress |

---

## 2. Multi-Journey Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| User wants 4th journey | Soft block: "You have 3 active. Complete or pause one?" | Prevent overwhelm |
| Two journeys toward same star | Allowed but warn: "These journeys share a destination" | User might intentionally focus |
| Journeys in conflicting directions | Surface conflict: "Career and Relationships pulling opposite" | User decides priority |
| One journey stalls, others active | Stalled journey gets priority in experiment allocation | Prevent full abandonment |
| User completes all 3 simultaneously | Celebration cascade, then prompt new journeys | Rare but celebratory |

---

## 3. Milestone Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| User reaches star ahead of schedule | Celebrate, adjust remaining timeline | Never punish fast progress |
| User far behind schedule | TARS suggests adjustment, no shame | Timelines are flexible |
| Success criteria ambiguous | User self-reports completion | Trust user judgment |
| User disputes milestone not reached | Override available but TARS notes discrepancy | User has final say |
| Milestone skipped (directly to next) | Not allowed, must reach in order | Preserve journey structure |
| User wants to re-order milestones | Allowed with discovery re-session | Goals evolve |
| Milestone reached during sabbatical | Added to queue, processed on resume | Don't miss achievements |

---

## 4. Velocity/Momentum Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| Velocity at 0 | Can't go negative, floor at 0 | No "backwards" progress |
| Velocity at MAX (1.0) | Excess thrust → bonus milestone progress? | TBD - consider spillover |
| Momentum at 0 after long break | Recovery bonus (like brightness system) | Don't punish returns |
| Experiments boost wrong journey | Allocate based on experiment domain match | Smart routing |
| Conflicting experiments same day | User picks which journey gets credit | Manual override |

---

## 5. State Transition Edge Cases

| From | To | Edge Case | Resolution |
|------|----|-----------|------------|
| WAITING | WALKING | 29 days, user subscribes | Reset timer, proceed |
| WAITING | FADED | 30 days exactly | End of day 30 = faded |
| PAUSED | WALKING | After 89 days | Still allowed, tight window |
| PAUSED | ABANDONED | 90 days exactly | End of day 90 = abandoned |
| WALKING | MILESTONE | Two stars same distance | First in sequence wins |
| COMPLETE | DISCOVERY | Immediately after completion | Allowed, context carries |
| Any | DISCOVERY | User wants to restart | Confirm: "Your current journey will be archived" |

---

## 6. Discovery Interview Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| User gives one-word answers | TARS probes deeper, doesn't accept surface | Need real information |
| User describes impossible goal | Research agent suggests refinement | Don't shatter dreams |
| User has conflicting goals | Surface conflict, user chooses priority | Can't walk two directions |
| User's goal already achieved | Celebrate, suggest maintenance journey or new goal | Honor current state |
| User in crisis (dark content) | Pause discovery, offer resources | Safety first |
| User changes mind mid-discovery | Allow restart, don't save partial | Fresh start |
| Discovery takes 60+ minutes | Suggest break, save progress | Respect time |

---

## 7. Preview/Conversion Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| User skips preview | Allowed, direct to paywall | Some users just want to start |
| Preview generates offensive content | AI content moderation, TARS re-generates | Never embarrass user |
| Scenario contradicts user input | User can flag, regenerate specific milestone | AI isn't perfect |
| User watches preview 5 times | Allowed, no limit | They're considering |
| User screenshots/shares preview | Allowed (could be viral) | Natural sharing |
| Preview audio fails | Text fallback with animations | Graceful degradation |

---

## 8. Payment/Subscription Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| Payment fails | 3-day grace, then PAUSED | Don't destroy on glitch |
| User disputes charge | Pause journey pending resolution | Preserve goodwill |
| User requests refund | Journey reverses to WAITING (not deleted) | Can re-subscribe |
| Free trial offered | 7-day WALKING access | Standard SaaS pattern |
| User on annual, cancels | Continues until period ends | Honor payment |
| Multiple subscriptions (bug) | Only charge once, credit extra | Never double-bill |

---

## 9. Data/Privacy Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| User requests data export | Full journey history as JSON | GDPR compliance |
| User requests deletion | Hard delete all journey data | GDPR compliance |
| User wants to hide specific milestone | Archive (invisible but exists) | User control |
| Device change | Cloud sync, seamless | Continuity |
| Offline for extended period | Local queue, sync on reconnect | Offline-first |
| Account merge (two accounts) | Manual support request | Complex, rare |

---

## 10. Failure Modes

| Failure | Detection | Response | Recovery |
|---------|-----------|----------|----------|
| AI generates nonsense milestones | User flags or low confidence score | Regenerate | Auto-retry 2x |
| Velocity stuck at 0 | 7 days no change | TARS stall intervention | Adjust difficulty |
| User never completes experiments | 80%+ skip rate over 2 weeks | Pivot offer | Easier experiments |
| Journey never progresses | 30 days, 0 milestones | Offer discovery refresh | Re-plot path |
| User in death spiral (all dark) | Dark stars > bright stars | Sabbatical offer | Professional resources |
| Server down during preview | Queue for retry | Graceful error | Auto-resume |

---

## 11. Boundaries

| Metric | Min | Max | Behavior at Limit |
|--------|-----|-----|-------------------|
| Velocity | 0.0 | 1.0 | Clamped |
| Momentum | 0.0 | 2.0 | Capped (prevents runaway) |
| Active journeys | 0 | 3 | Soft block on 4th |
| Milestones per journey | 1 | 10 | Warn if > 7 |
| Experiments per day | 0 | 3 | Hard cap |
| Discovery interview time | 5 min | 60 min | Suggest break at 45 |
| Preview duration | - | 10 min | Hard cap, truncate |

---

## 12. Anti-Gaming Measures

| Gaming Attempt | Prevention |
|----------------|------------|
| Complete 50 experiments/day | MAX_DAILY_IMPACT cap |
| Claim milestone without doing work | Success criteria verification |
| Game velocity through fake completions | Pattern detection, TARS notes discrepancies |
| Create 100 micro-journeys | 3 journey cap |
| Speed-run discovery to get preview | Minimum phases required |
| Share account for multi-user journeys | Device fingerprinting, ToS |

---

*SKIN complete. Proceed to MIRROR for simulation.*
