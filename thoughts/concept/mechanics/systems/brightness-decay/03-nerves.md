# Brightness & Decay - NERVES

**System:** brightness-decay
**Lens:** NERVES (3/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 02-blood.md ✓

---

## Overview

This document justifies every constant and formula in brightness-decay with research, game design precedent, or explicit design rationale.

---

## Research Foundation

### Behavioral Science

| Principle | Source | How Applied |
|-----------|--------|-------------|
| Habit formation takes ~66 days | Lally et al. (2010) | Half-lives calibrated for domain persistence |
| Missing one day doesn't reset habits | Lally et al. (2010) | Streak preservation at 50% |
| Implementation intentions (d=0.65) | Gollwitzer (1999) | Experiment structure |
| Self-Determination Theory | Deci & Ryan (1985) | Autonomy in engagement choice |
| Transtheoretical Model | Prochaska (1983) | Star states map to readiness stages |
| Variable reward schedules | Skinner (1957) | Spillover as passive unexpected reward |
| Loss aversion (2:1 ratio) | Kahneman & Tversky (1979) | Gains slightly outweigh losses |

### Game Design Precedent

| Pattern | Source | How Applied |
|---------|--------|-------------|
| Streak mechanics | Duolingo | Logarithmic growth, partial preservation |
| Daily caps | Destiny 2 Powerful Gear | MAX_DAILY_GAIN prevents no-life advantage |
| Soft floor / no permadeath | Roguelikes (Hades) | Stars go dormant, never die |
| Diminishing returns | WoW raid lockouts | Same-day actions have reduced impact |
| Return player bonuses | FFXIV Returner status | Recovery bonus welcomes back |
| Passive income | Idle games | Spillover as passive gain |

---

## Constant Justifications

### Experiment Impact

#### BASE_EXPERIMENT_IMPACT = 0.03

**Source:** Design choice + Lally (2010) trajectory
**Rationale:**
- At 0.03 base, daily engagement yields ~0.03-0.06 brightness gain
- Reaching BRIGHT threshold (0.7) from start (0.3) requires ~12-15 days of consistent engagement
- This matches Lally's finding that habit strength builds over 2-3 weeks before stabilizing
- Too high (>0.05) makes progress feel too easy; too low (<0.02) feels unrewarding

**Validation:** MIRROR shows ideal user reaches BRIGHT in ~12 days ✓

#### DIFFICULTY_MULTIPLIERS (0.5 / 0.75 / 1.0 / 1.5)

**Source:** Game design precedent (skill-based rewards)
**Rationale:**
- Tiny (0.5x): Easy but builds consistency. Matches Fogg's "tiny habits" approach.
- Small (0.75x): Moderate effort, moderate reward
- Medium (1.0x): Baseline — meaningful effort, meaningful reward
- Stretch (1.5x): High risk, high reward. 50% boost for pushing comfort zone.

**Reference:** Destiny 2 uses similar tiered rewards (Pinnacle > Powerful > Standard)

#### NOVELTY_BONUS = 1.2

**Source:** Design choice (exploration reward)
**Rationale:**
- First-time experiment types get 20% boost
- Encourages trying new approaches rather than repeating safe options
- Not so high that it incentivizes novelty-chasing over consistency

**Reference:** Many RPGs grant bonus XP for first-time encounters (Elden Ring, etc.)

---

### Insight Impact

#### INSIGHT_IMPACT = 0.02

**Source:** Design choice (reflection value)
**Rationale:**
- Insights are valuable but shouldn't compete with action
- An insight is worth ~67% of a tiny experiment
- This honors reflection without making the app "just journaling"

**Balance check:** User who only reflects (no experiments) progresses 3x slower than active user

#### DEPTH_MULTIPLIERS (0.5 / 1.0 / 1.5)

**Source:** Cognitive depth literature (Marton & Säljö, 1976)
**Rationale:**
- Surface insights ("I noticed...") are quick acknowledgments
- Pattern insights ("I always...") require meta-cognition
- Root insights ("I do X because...") require deep self-examination

**Reference:** Deep learning outcomes correlate with deeper processing (Marton & Säljö's surface vs deep learning)

#### SOURCE_MULTIPLIERS (0.8 / 1.0 / 1.2)

**Source:** Self-Determination Theory (autonomy)
**Rationale:**
- User-initiated insights (1.2x) honor autonomy — they discovered it themselves
- TARS-prompted (1.0x) is collaborative
- TARS-observed (0.8x) is still valuable but user didn't generate it

**Reference:** SDT shows higher motivation and internalization for autonomous discoveries

---

### Streak Mechanics

#### STREAK_GROWTH_RATE = 0.15, MAX_STREAK_BONUS = 1.3

**Source:** Duolingo analysis + diminishing returns principle
**Rationale:**
- Logarithmic curve: big early gains (Day 3 = 16% boost), then diminishing
- Cap at 30% prevents long-time users from having insurmountable advantage
- Duolingo uses similar 1.1-1.5x range for streak XP bonuses

**Formula:** bonus = 1 + 0.15 × ln(streak_days), capped at 1.3

**Reference:** Duolingo's streak mechanics (analyzed via community data)

#### STREAK_PRESERVATION_RATE = 0.5

**Source:** Lally (2010) + anti-all-or-nothing design
**Rationale:**
- Lally found "missing one opportunity did not materially affect habit formation"
- Full reset (0%) creates devastating "what-the-hell" effect
- No preservation (0%) punishes harshly; full preservation (100%) removes stakes
- 50% balances: you lose momentum but not history

**Psychology:** The "what-the-hell effect" (Polivy & Herman, 1985) shows all-or-nothing thinking leads to total abandonment after single failure

---

### Spillover Mechanics

#### SPILLOVER_RATE = 0.3

**Source:** Self-Determination Theory (competence transfer)
**Rationale:**
- Bright stars "radiate" — feeling good in one area spreads to connected areas
- 30% is significant but not dominant — you still need to engage directly
- Creates positive feedback loop without removing need for direct action

**Psychology:** SDT shows competence in one domain transfers to related domains (positive spillover)

#### SPILLOVER_THRESHOLD = 0.8

**Source:** Design choice (must be very bright to spill)
**Rationale:**
- Only truly bright stars (top 20% of range) radiate
- Prevents dim stars from "leaking" energy
- Creates aspirational target: get a star to 0.8+ to benefit connections

**Game parallel:** In Hades, boons at Epic/Legendary tier have additional effects that common boons don't

---

### Recovery Mechanics

#### RECOVERY_BASE = 0.05, RECOVERY_SCALE = 0.3, RECOVERY_MAX_MULTIPLIER = 2.0

**Source:** Return player design (FFXIV, WoW) + anti-shame psychology
**Rationale:**
- Games welcome returning players with bonuses (rest XP, catch-up mechanics)
- Longer absence = bigger welcome back (up to 2x base)
- The system literally says "I'm glad you came back"

**Psychology:** Shame leads to avoidance (Brené Brown). Welcoming return breaks the shame-avoidance cycle.

**Formula:** bonus = 0.05 × min(1 + 0.3 × ln(days/7), 2.0)

#### RECOVERY_MIN_DAYS = 7

**Source:** Weekly cycle + distinguishing routine miss from absence
**Rationale:**
- Missing a few days is normal — recovery bonus is for true absence
- 7 days = "you were gone for a real while, not just a busy week"
- Aligns with weekly review cycle

---

### Skip Penalty

#### BASE_SKIP_PENALTY = 0.008, Progressive scaling (0 / 1x / 1.5x / 2x)

**Source:** Anti-shame design + Lally (2010)
**Rationale:**
- First skip is free — life happens, no penalty
- Progressive penalty only kicks in for *patterns* of skipping
- Even at maximum (0.016), skip penalty is ~27% of base experiment gain
- This is asymmetric: gains outweigh losses (loss aversion accommodation)

**Psychology:** Kahneman & Tversky's loss aversion suggests losses feel 2x as painful. We counter this by making losses smaller than gains in absolute terms.

---

### Contradiction Penalty

#### CONTRADICTION_PENALTY = 0.04

**Source:** Cognitive dissonance theory (Festinger, 1957)
**Rationale:**
- Say-do mismatches create dissonance that must be resolved
- The penalty is information, not punishment — "this is what's happening"
- Large enough to notice (>1 experiment), small enough not to devastate

**Psychology:** Festinger showed dissonance motivates change. TARS naming contradictions surfaces dissonance for conscious processing.

---

### Decay Mechanics

#### Half-lives by domain (7 / 14 / 21 / 30 / 90 days)

**Source:** Lally (2010) + domain-specific research
**Rationale:**
- **Health (7 days):** Behavioral habits decay quickly. Lally found median 66 days to automaticity, but regression happens faster.
- **Relationships (14 days):** Gottman research shows relationship quality can shift over 2-week cycles.
- **Wealth (21 days):** Financial behaviors have moderate inertia — longer than habits, shorter than identity.
- **Purpose (30 days):** Purpose/meaning changes slowly. Monthly cycle is meaningful.
- **Soul (90 days):** Identity-level traits are highly stable. Kegan's research on adult development shows identity changes over months/years.

**Citations:**
- Lally, P., et al. (2010). How are habits formed: Modelling habit formation in the real world.
- Gottman, J. (1994). What Predicts Divorce?
- Kegan, R. (1994). In Over Our Heads: The Mental Demands of Modern Life.

#### MAINTENANCE_ZONE = 0.3

**Source:** Design choice (protect struggling stars)
**Rationale:**
- Below 0.3, decay rate halves (zone_factor = 0.5)
- This creates a "maintenance zone" where struggling stars are protected
- Prevents death spiral where low brightness leads to faster decay

**Game parallel:** Many games have "pity timers" that make bad luck streaks self-correcting

---

### Neglect Acceleration

#### NEGLECT_THRESHOLD_1 = 7, NEGLECT_THRESHOLD_2 = 21

**Source:** Weekly cycle + monthly cycle
**Rationale:**
- Week 1: Normal — life happens
- Week 2-3: Accelerating (1.5x) — you've been away a while
- Week 4+: Maximum (2.0x) — approaching dormancy

**Psychology:** 21 days is often cited as habit formation minimum. If you're absent for 3 weeks, the habit is likely broken.

#### NEGLECT_MULTIPLIER_1 = 1.5, NEGLECT_MULTIPLIER_2 = 2.0

**Source:** Design choice (urgency without panic)
**Rationale:**
- 1.5x is noticeable but not devastating
- 2.0x cap ensures losses don't spiral infinitely
- Creates urgency: "your stars are waiting, but they won't wait forever"

---

### Protection Mechanisms

#### SOFT_FLOOR_ZONE = 0.15, SOFT_FLOOR_FACTOR = 0.7

**Source:** Roguelike design (no permadeath) + psychological safety
**Rationale:**
- As brightness approaches 0.05 floor, decay slows asymptotically
- 0.7 factor means drops are reduced by 30% in the danger zone
- Stars can always be revived — there's no "too late"

**Game parallel:** Hades' persistent upgrades mean you're never back to zero. Same principle here.

#### MAX_DAILY_GAIN = 0.06

**Source:** Anti-gaming + pacing
**Rationale:**
- Prevents no-lifing (doing 20 experiments in one day for huge boost)
- Reaching BRIGHT from baseline requires minimum ~7 days
- This pacing makes progress feel earned, not purchased

**Game parallel:** Destiny 2's weekly Powerful Gear cap ensures consistent players progress steadily while preventing no-life advantage.

---

## Gaps and Validation Plan

| Constant | Confidence | Validation Method |
|----------|------------|-------------------|
| STREAK_PRESERVATION_RATE | Medium | A/B test 0.3 vs 0.5 vs 0.7 |
| SPILLOVER_THRESHOLD | Low | User testing — does 0.8 feel achievable? |
| NEGLECT_MULTIPLIER_2 | Medium | Simulate long-absence scenarios |
| DEPTH_MULTIPLIERS | Low | Depends on accurate insight classification |
| SOURCE_MULTIPLIERS | Low | Depends on TARS attribution tracking |

---

## Key Citations

1. **Lally, P., et al. (2010).** How are habits formed: Modelling habit formation in the real world. *European Journal of Social Psychology*, 40(6), 998-1009.

2. **Gollwitzer, P. M. (1999).** Implementation intentions: Strong effects of simple plans. *American Psychologist*, 54(7), 493-503.

3. **Deci, E. L., & Ryan, R. M. (1985).** *Intrinsic motivation and self-determination in human behavior.* New York: Plenum.

4. **Kahneman, D., & Tversky, A. (1979).** Prospect theory: An analysis of decision under risk. *Econometrica*, 47(2), 263-291.

5. **Festinger, L. (1957).** *A Theory of Cognitive Dissonance.* Stanford University Press.

6. **Polivy, J., & Herman, C. P. (1985).** Dieting and binging: A causal analysis. *American Psychologist*, 40(2), 193-201.

7. **Gottman, J. M. (1994).** *What Predicts Divorce?* Lawrence Erlbaum Associates.

8. **Kegan, R. (1994).** *In Over Our Heads: The Mental Demands of Modern Life.* Harvard University Press.

9. **Marton, F., & Säljö, R. (1976).** On qualitative differences in learning. *British Journal of Educational Psychology*, 46(1), 4-11.

10. **Brown, B. (2012).** *Daring Greatly.* Gotham Books. (Shame and vulnerability research)

---

*NERVES complete. Every number has a reason. Proceed to SKIN for boundaries.*
