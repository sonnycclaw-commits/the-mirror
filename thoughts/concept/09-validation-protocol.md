# Validation Protocol

**Purpose:** Prevent building something nobody wants.

**Principle:** Every validation test has a kill threshold. If you can't commit to killing the concept when thresholds fail, don't run the tests.

---

## Industry Benchmarks (2025)

From Perplexity research on consumer app retention:

| Metric | Industry Avg | "Good" | Kill Threshold |
|--------|--------------|--------|----------------|
| Day 1 retention | 25% | 30%+ | <20% |
| Day 7 retention | 10-13% | 15%+ | <8% |
| Day 30 retention | 5-6% | 7%+ | <3% |
| AI coaching/education D30 | 2-4% | 5%+ | <2% |

**For S.T.A.R.S. specifically:** AI coaching has tougher retention than average. Target the higher end.

---

## Phase 1: Pre-Build Validation (Week 0-2)

*Before writing any code.*

### 1.1 Fake Door Test

**Setup:**
- Landing page with value prop
- "Join waitlist" CTA
- Single qualifying question on signup

**Landing page elements:**
```
Headline: "Meet yourself for the first time"
Subhead: "7 days. One AI. A living map of who you really are."
CTA: "Join the Waitlist"
```

**Qualifying question:**
```
What's the biggest thing holding you back from becoming
the person you want to be?

[ ] I don't really know myself well enough
[ ] I know what to do, but I can't make myself do it
[ ] I've tried everything and nothing sticks
[ ] I can't afford coaching or therapy
[ ] Other: ____________
```

**Traffic sources:**
- Reddit (r/selfimprovement, r/productivity, r/getdisciplined)
- Twitter/X ads targeting self-improvement accounts
- Newsletter sponsorships

**Metrics:**

| Metric | Kill If | Target |
|--------|---------|--------|
| Landing page conversion | <5% | >10% |
| Email quality (not spam) | <80% | >95% |
| "Don't know myself" selected | <30% | >50% |

---

### 1.2 Mom Test Interviews (20 users)

**Recruitment:** Waitlist signups + Reddit outreach

**Key principles (from The Mom Test):**
- Don't mention your idea until the end
- Ask about past behavior, not future intentions
- Look for specifics, not generalities

**Interview script:**

**Opening (5 min):**
```
"Tell me about the last time you tried to improve something
about yourself. What happened?"

Follow-ups:
- "What specifically did you try?"
- "How long did you stick with it?"
- "Why did you stop?" (if applicable)
```

**Depth questions (10 min):**
```
"When you think about who you want to become vs who you are
now, what's the gap?"

"What have you tried to close that gap?"

"What's worked? What hasn't?"
```

**Evidence gap questions (10 min):**

| Evidence Gap | Question | Kill Signal |
|--------------|----------|-------------|
| 7-day commitment | "If something required 10 minutes a day for 7 days to work, would you finish?" | <50% yes |
| $19/mo pricing | "What would you pay monthly for this?" | <$10 unprompted |
| ChatGPT comparison | "Why not just use ChatGPT for self-reflection?" | Can't articulate difference |
| Social sharing | "Would you share a psychological profile publicly?" | Strong "no" with privacy concerns |

**Reveal (5 min):**
```
"We're building an AI that creates a 'living profile' of who
you really are over 7 days of conversation. Would you use this?"

Follow-ups:
- "What would make you more likely to try it?"
- "What concerns would you have?"
- "How is this different from ChatGPT?"
```

**Kill thresholds after 20 interviews:**

| Metric | Kill If | Target |
|--------|---------|--------|
| "Would complete 7 days" | <50% | >70% |
| "Would pay $19/mo" | <30% | >50% |
| "ChatGPT insufficient" | <40% | >60% |
| Strong beta interest | <10 people | 15+ |

---

### 1.3 Van Westendorp Pricing Survey

**Distribution:** Waitlist + interview participants

**Sample size:** 50+ responses

**Questions:**
```
Context: An AI that helps you understand your unconscious
patterns and creates a "living profile" of who you really are.

Q1: At what monthly price would this be so CHEAP you'd
    question the quality? $_____

Q2: At what monthly price would this be a BARGAIN? $_____

Q3: At what monthly price would this feel EXPENSIVE —
    you'd have to think about it? $_____

Q4: At what monthly price would this be TOO EXPENSIVE —
    you'd never consider it? $_____
```

**Analysis outputs:**
- OPP (Optimal Price Point): Where "too cheap" crosses "too expensive"
- Acceptable range: PMC to PME

**Kill thresholds:**

| Metric | Kill If | Target |
|--------|---------|--------|
| OPP | <$10/month | $15-25/month |
| % saying $19 "too expensive" | >50% | <30% |

---

### 1.4 ChatGPT Comparison Study (10 users)

**Purpose:** Definitive answer to "Why not just use ChatGPT?"

**Protocol:**
```
Group A (5): ChatGPT first, then S.T.A.R.S. concept
Group B (5): S.T.A.R.S. concept first, then ChatGPT
```

**ChatGPT session (20 min):**
```
Prompt: "I want to understand myself better. Ask me questions
to discover my patterns, blind spots, and what's holding me back."

After 15 min: Rate insight (1-10), describe what you learned.
```

**S.T.A.R.S. session (20 min):**
```
Concierge the Day 1 experience manually (you play TARS).
Show sample "First Impression" card.

After 15 min: Rate insight (1-10), describe what you learned.
```

**Comparison questions:**
```
1. "Which felt more like it understood you?"
2. "Which would you want to continue with?"
3. "What does S.T.A.R.S. do that ChatGPT doesn't?"
4. "If both cost $19/mo, which would you choose?"
5. "If S.T.A.R.S. is $19 and ChatGPT is free, which for self-improvement?"
```

**Kill thresholds:**

| Metric | Kill If | Target |
|--------|---------|--------|
| Prefer S.T.A.R.S. | <50% | >70% |
| Would continue with S.T.A.R.S. | <40% | >60% |
| Can articulate differentiation | <30% | >50% |

**If ChatGPT wins:** The differentiation isn't real. Pivot or kill.

---

## Phase 2: Concierge MVP (Week 2-4)

*Manual delivery before building.*

### 2.1 Protocol

**Delivery:** WhatsApp/Telegram/SMS

**Sample:** 15-20 users from Phase 1

**Daily flow:**

| Day | Focus | Deliverable |
|-----|-------|-------------|
| 1 | First impressions | "First Impression" text card |
| 2 | Anti-vision | "Fear Map" text summary |
| 3 | Vision | "Desire Map" text summary |
| 4 | Patterns | "Pattern Recognition" text |
| 5 | Strengths | "Strength Profile" text |
| 6 | Blockers | "Obstacle Analysis" text |
| 7 | Synthesis | Full "Birth Chart" text profile |

**Birth Chart delivery (Day 7):**
```markdown
# Your Birth Chart
*Generated from 7 days of reflection*

## Who You Are (Core Patterns)
[3-4 paragraph synthesis]

## What Drives You
- [Key motivation 1-3]

## What Holds You Back
- [Key blocker 1-3]

## Your Blind Spots
[2-3 patterns they may not see]

## First Experiment
[Specific, actionable experiment]

---
"Does this feel like you?"
Reply 1-10 (10 = perfectly accurate)
```

### 2.2 Metrics

**Daily:**
| Metric | Target |
|--------|--------|
| Same-day response | >70% |
| Avg word count | >50 words |
| Drop-off per day | <10% |

**End of journey:**
| Metric | Kill If | Target |
|--------|---------|--------|
| Day-7 completion | <30% | >50% |
| Accuracy rating | <6.0 | >7.5 |
| "Would pay $19/mo" | <20% | >40% |
| "Different from ChatGPT" | <30% | >50% |

### 2.3 A/B Test: 7-Day vs 3-Day

**Split:** 50/50

**3-Day protocol:**
| Day | Content |
|-----|---------|
| 1 | Present + Anti-Vision |
| 2 | Vision + Patterns |
| 3 | Synthesis + Action |

**Decision:**
- If 3-day completion >20% higher with similar accuracy → Shorten
- If 7-day accuracy much higher → Keep it
- If no difference → Default to 3-day (less friction)

---

## Phase 3: Alpha Validation (Week 5-10)

*First coded version.*

### 3.1 Gate Criteria

**Do NOT build until:**
- [ ] Phase 1: 3+ validation tests passed
- [ ] Phase 2: Day-7 completion >40%
- [ ] Phase 2: Accuracy rating >7.0
- [ ] Phase 2: >30% would pay $19/mo

### 3.2 A/B Tests

**Test 1: Constellation vs Text-Only**

| Metric | Measure |
|--------|---------|
| Accuracy rating | 1-10 scale |
| "This is me" agreement | 1-7 Likert |
| Time on Birth Chart | Session recording |
| Screenshot/share rate | Event tracking |
| Day-14 retention | Return visit |

Sample: 50 per group

**Kill threshold for constellation:** No significant difference → Cut visualization

**Test 2: Mystical vs Scientific Framing**

| Version | Language |
|---------|----------|
| Mystical | "Birth Chart", "Stars", "Phases" |
| Scientific | "Psychological Profile", "Dimensions", "Factors" |

Segment by user preference, compare within segments.

**Test 3: Deep First vs Quick Start**

| Version | Day 1 |
|---------|-------|
| Deep First | 10 min questions, first insight after Day 1 |
| Quick Start | 3 min questions, shallow profile immediately |

### 3.3 Retention Cohorts

| Stage | Kill If | Target |
|-------|---------|--------|
| D0→D1 | <50% | >70% |
| D1→D3 | <50% | >70% |
| D3→D7 | <40% | >60% |
| D7→D14 | <30% | >50% |
| D14→D30 | <40% | >60% |

---

## Phase 4: Beta Validation (Week 11-16)

### 4.1 Conversion Funnel

| Stage | Industry Avg | Target | Kill If |
|-------|--------------|--------|---------|
| Visitor→Signup | 2-5% | 8% | <3% |
| Signup→D1 | 40-60% | 70% | <50% |
| D1→D7 | 20-30% | 50% | <30% |
| Trial→Paid | 2-5% | 8% | <3% |
| M1→M2 Retain | 60-70% | 75% | <50% |

### 4.2 ChatGPT Differentiation Test

For users who also use ChatGPT (survey after 30 days):
```
1. "For self-improvement, which is more valuable?"
2. "What does S.T.A.R.S. do that ChatGPT doesn't?"
3. "If S.T.A.R.S. is $19/mo and ChatGPT is free, would you still pay?"
```

**Kill thresholds:**
| Metric | Kill If | Target |
|--------|---------|--------|
| Find S.T.A.R.S. more valuable | <40% | >60% |
| Would pay $19 vs free ChatGPT | <25% | >50% |
| Can articulate differentiation | <30% | >60% |

**If differentiation fails:** Product has no defensible moat. Kill or pivot.

---

## Phase 5: Kill Thresholds Summary

### Decision Tree

```
Pre-Build Validation
    │
    ├── 3+ tests PASS → Concierge MVP
    │
    └── <3 tests PASS → Pivot or Kill
            │
            ├── Clear signal on what's wrong → Pivot
            │
            └── No clear signal → Kill concept

Concierge MVP
    │
    ├── Day-7 >40% AND Accuracy >7.0 → Alpha Build
    │
    ├── Day-7 30-40% OR Accuracy 6-7 → Test 3-day version
    │
    └── Day-7 <30% AND Accuracy <6 → Kill excavation model

Alpha Build
    │
    ├── Constellation shows difference → Keep visualization
    │
    ├── No difference → Cut to text-only (save 4 weeks)
    │
    └── D7→D14 <30% → Redesign Walk before continuing

Beta Launch
    │
    ├── Trial→Paid >5% AND M2 >60% → Public Launch
    │
    ├── Trial→Paid 3-5% OR M2 50-60% → Iterate before launch
    │
    └── Trial→Paid <3% AND M2 <50% → Major pivot or kill
```

---

## Validation Timeline

| Week | Activity | Gate |
|------|----------|------|
| 0-1 | Fake door + landing page | - |
| 0-2 | Mom Test interviews (20) | - |
| 1-2 | Van Westendorp + ChatGPT comparison | **PRE-BUILD GATE** |
| 2-4 | Concierge MVP (20 users) | - |
| 3-4 | 7-day vs 3-day A/B | **CONCIERGE GATE** |
| 5-6 | Alpha: coded Day 1-7 | - |
| 7-8 | A/B: Constellation vs text | - |
| 9-10 | Retention cohort analysis | **ALPHA GATE** |
| 11-12 | Conversion funnel optimization | - |
| 13-16 | ChatGPT differentiation test | **BETA GATE** |

---

## Gate Criteria

**PRE-BUILD GATE (End Week 2):**
- [ ] Waitlist conversion >5%
- [ ] Mom Test: >50% would complete 7 days
- [ ] Mom Test: >30% would pay $19/mo
- [ ] Van Westendorp OPP >$10
- [ ] ChatGPT comparison: >50% prefer S.T.A.R.S.

**Pass:** 4 of 5 → Proceed to Concierge

**CONCIERGE GATE (End Week 4):**
- [ ] Day-7 completion >40%
- [ ] Accuracy rating >7.0
- [ ] "Would pay $19/mo" >30%
- [ ] Articulates difference from ChatGPT >40%

**Pass:** 3 of 4 → Proceed to Alpha

**ALPHA GATE (End Week 10):**
- [ ] Coded Day-7 completion >40%
- [ ] Constellation shows significant improvement (or cut it)
- [ ] D7→D14 retention >40%
- [ ] NPS >30

**Pass:** 3 of 4 → Proceed to Beta

**BETA GATE (End Week 16):**
- [ ] Trial→Paid conversion >5%
- [ ] M1→M2 retention >60%
- [ ] ChatGPT differentiation >50%
- [ ] No major safety incidents

**Pass:** All criteria → Public launch

---

*"Build the thing you believe in, but validate before you build for 12 weeks."*

---

**Document Version:** 1.0
**Created:** 2026-01-15
**Research Sources:** Perplexity (validation methodologies, retention benchmarks)
