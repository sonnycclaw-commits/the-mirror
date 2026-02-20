# MVP Definition

**Section:** 4-scope
**Status:** Draft

---

## What is MVP?

**Minimum Viable Product:** The smallest thing we can build that tests the core hypothesis.

**Core Hypothesis:**
> A structured 7-day conversational excavation, visualized as an evolving constellation, creates a "felt seen" experience that drives completion and conversion.

**What MVP Must Answer:**
1. Do users complete 7 days?
2. Does the constellation resonate?
3. Is the Birth Chart reveal a conversion moment?

---

## MVP Scope

### ✅ In Scope (Must Have)

| Feature | Why Essential | Acceptance Criteria Ref |
|---------|---------------|------------------------|
| **Magic link auth** | Frictionless entry | AC-1.1, AC-1.2 |
| **TARS conversation** | Core excavation experience | AC-2.1, AC-2.2 |
| **7-day question flow** | Structured depth | AC-2.2 |
| **Star extraction** | Visible insight accumulation | AC-3.1 |
| **Static constellation** | See your patterns | AC-3.2, AC-3.3 |
| **Birth Chart reveal** | Day 7 payoff | AC-3.4 |
| **Micro-revelations** | Daily "felt seen" | AC-2.3 |

### 🟡 Nice to Have (If Time)

| Feature | Value | Complexity |
|---------|-------|------------|
| Star pulse animations | Polish | Low |
| Connection lines | Richer visual | Medium |
| Cliffhanger messages | Retention | Low |
| Share Birth Chart image | Viral potential | Medium |

### ❌ Not In Scope (See Cut List)

| Feature | Why Cut |
|---------|---------|
| The Walk (experiments) | Validate Mirror first |
| Push notifications | After retention proven |
| Weekly summaries | V1 |
| Native mobile | Web PWA sufficient |
| Multi-user features | V2+ |

---

## MVP Success Criteria

### Kill Thresholds

If any of these are true at pilot end, reconsider the product:

| Metric | Kill If |
|--------|---------|
| Day 7 completion rate | <15% |
| "Felt seen" score (1-5) | <3.0 |
| Would recommend | <20% |
| Return rate (Day 2) | <30% |

### Target Metrics

If we hit these, proceed to V1:

| Metric | Target |
|--------|--------|
| Day 7 completion rate | ≥25% (stretch: 40%) |
| "Felt seen" score (1-5) | ≥3.5 |
| Would recommend | ≥40% |
| Return rate (Day 2) | ≥50% |

---

## MVP Technical Constraints

| Constraint | Value |
|------------|-------|
| Timeline | 6-8 weeks |
| Team | Solo developer |
| Budget (infra) | <$500/mo |
| Users (pilot) | 10-20 |

---

## MVP User Journey

```
Day 0: Sign up → Welcome
Day 1: First conversation → 2-3 stars appear
Day 2: Continue → More stars, first connection
Day 3-6: Daily excavation → Growing constellation
Day 7: Final conversation → Birth Chart Reveal
Day 8+: View constellation (frozen until subscription)
```

---

## What Makes This "Minimum"

We are explicitly NOT building:
- The Walk (experiments, milestones, journey physics)
- Animated star effects beyond basic pulse
- Context Graph predictions
- Push notifications or email
- Native mobile apps
- Social features

These all add value but don't test the core hypothesis.

---

## MVP Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| 7-day cliff (users don't complete) | High | Critical | Micro-revelations, cliffhangers |
| Constellation doesn't resonate | Medium | High | User feedback, iteration |
| Star extraction quality | Medium | High | Prompt tuning, human review |
| Claude API costs | Low | Medium | Usage monitoring, caching |
