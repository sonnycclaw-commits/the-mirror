# Phase Transitions - NERVES

**System:** phase-transitions
**Lens:** NERVES (3/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 02-blood.md ✓

---

## Overview

This document justifies the phase transition thresholds and formulas with research and design precedent.

---

## Research Foundation

### Developmental Psychology

| Principle | Source | How Applied |
|-----------|--------|-------------|
| Stages of development | Kegan (1994) | Four phases map to developmental awareness |
| Integration over time | Loevinger (1976) | EMERGING = ego integration |
| Self-actualization | Maslow (1943) | LUMINOUS = self-actualization state |
| Identity formation | Erikson (1968) | Phases as identity consolidation |

### Behavior Change Science

| Principle | Source | How Applied |
|-----------|--------|-------------|
| Transtheoretical Model | Prochaska (1983) | Phases loosely map to TTM stages |
| Habit formation timeline | Lally (2010) | 66 days average → LUMINOUS at 90+ days |
| Sustained change | Kwasnicka (2016) | 14-day stabilization for LUMINOUS |
| Relapse as normal | Marlatt (1985) | Regression is expected, not failure |

### Game Design

| Pattern | Source | How Applied |
|---------|--------|-------------|
| Hysteresis in state machines | Schmitt trigger (electronics) | Prevents phase flickering |
| Grace periods | Dark Souls bonfires | Time to recover before consequence |
| Milestone pacing | Destiny 2 seasons | 90-day cycle to major milestone |
| Regression with dignity | Roguelikes | Losing progress isn't shameful |

---

## Constant Justifications

### CONNECTION_THRESHOLD_FORWARD = 3

**Source:** Network science + UX minimum
**Rationale:**
- 3 connections is the minimum to form a visible "network" vs isolated pairs
- With 5 stars, 3 connections = 30% density — meaningful but not dense
- Psychologically, "I see 3 relationships" feels like a pattern, not coincidence

**Research:** Dunbar's layered relationship model suggests we naturally group connections. 3 is the minimum for pattern recognition.

### INTEGRATION_THRESHOLD = 0.5

**Source:** Design choice (midpoint)
**Rationale:**
- Integration score ranges 0-1
- 0.5 represents "half integrated" — enough structure to see a shape
- Below 0.5, the constellation is still fragmentary
- This is the "gestalt moment" — when parts become whole

**Psychology:** Gestalt theory suggests pattern recognition has a threshold — we either see the shape or we don't.

### LUMINOSITY_THRESHOLD = 0.7

**Source:** Constellation-states BRIGHT threshold
**Rationale:**
- 0.7 is the threshold for an individual star to be BRIGHT
- Using the same threshold for overall luminosity creates consistency
- "Your constellation is as bright as a single bright star should be"

**Coherence:** This aligns with constellation-states constants, reducing cognitive load.

### STABILIZATION_DAYS = 14 (for LUMINOUS)

**Source:** Kwasnicka et al. (2016) + behavior maintenance research
**Rationale:**
- Lally's 66-day average is for habit automaticity
- But maintenance (sustaining after achieving) shows a 2-week critical window
- If you can maintain new behaviors for 14 days, you're likely to sustain them
- LUMINOUS requires proving sustainability, not just peak achievement

**Citation:** Kwasnicka, D., et al. (2016). Theoretical explanations for maintenance of behaviour change: a systematic review of behaviour theories.

### HYSTERESIS_FACTOR = 0.7

**Source:** Control systems engineering + game design
**Rationale:**
- In electronics, Schmitt triggers use ~30% hysteresis to prevent oscillation
- 0.7 means regression threshold = 70% of advancement threshold
- This prevents "flickering" where user bounces between phases
- Example: Enter CONNECTING at 3 connections, don't leave until < 2

**Reference:** Schmitt trigger design principles; also used in thermostat design (heat to 72°, cool when >75°).

### REGRESSION_GRACE_LUMINOUS = 14 days

**Source:** Design choice + user kindness
**Rationale:**
- LUMINOUS is hard to achieve (90+ days)
- Losing it immediately feels punishing
- 14-day grace period allows:
  - Life disruptions (vacation, illness, crisis)
  - Time to notice and course-correct
  - TARS to warn before regression
- Matches the 14-day stabilization requirement for symmetry

**Psychology:** Loss aversion suggests losing a hard-won achievement is 2x as painful. Grace periods mitigate this.

### DARK_INFLUENCE_MAX = 0.2

**Source:** Design choice (balance)
**Rationale:**
- Dark stars shouldn't completely block LUMINOUS
- But they should matter — you can't be fully luminous while dragging unaddressed shadows
- 0.2 means "some dark influence is acceptable, but not dominant"
- A user with 1 dark star out of 10 can still reach LUMINOUS
- A user with 5 dark stars cannot — they need to address some first

**Philosophy:** Shadows are part of us. Integration doesn't mean elimination, but it means not being dominated.

### Component Weights (Integration/Luminosity formulas)

**Source:** Design iteration + balance testing
**Rationale:**

**Integration (0.4 / 0.3 / 0.3):**
- Connections (0.4): Primary driver — integration IS about relating parts
- Balance (0.3): Secondary — uneven constellations aren't integrated
- Dark confrontation (0.3): Secondary — shadows must be acknowledged

**Luminosity (0.4 / 0.25 / 0.2 / 0.15):**
- Brightness (0.4): Primary — luminosity IS about brightness
- Connections (0.25): Strong connections amplify brightness
- Stability (0.2): Sustained brightness matters
- Dark penalty (0.15): Shadows dim the glow

**Validation needed:** These weights should be tested in MIRROR simulations.

---

## Timeline Justification

### 90+ Days to LUMINOUS

**Source:** Multiple behavior change models
**Rationale:**

1. **Lally's 66 days** for habit automaticity — but LUMINOUS requires more than one habit
2. **Prochaska's Maintenance stage** begins at 6 months — we're aggressive at 3 months
3. **Kegan's developmental transitions** take months to years — 90 days is aspirational

**Design choice:** 90 days is achievable but meaningful. Faster would cheapen LUMINOUS; slower would lose users.

### 30-60 Days to EMERGING

**Source:** Habit formation midpoint
**Rationale:**
- By day 30, consistent users have built several habits
- Integration score requires connections + brightness + balance
- This gives enough time for the "shape" to form
- Not so fast that EMERGING is trivial

### 8-14 Days to CONNECTING

**Source:** The Mirror phase (7 days) + immediate patterns
**Rationale:**
- Users complete The Mirror in 7 days
- By day 8, they have their Birth Chart
- First week of The Walk reveals connections
- CONNECTING emerges naturally from post-Mirror exploration

---

## Regression Philosophy

### "Regression is information, not failure"

**Source:** Marlatt's relapse prevention model
**Rationale:**
- Marlatt (1985) showed that framing relapse as "failure" increases relapse likelihood
- Framing it as "information" helps users learn and recover
- TARS never says "you failed" — TARS says "you've shifted back"

### Grace Periods Prevent Shame Spirals

**Source:** Shame research (Brown, 2012)
**Rationale:**
- Immediate punishment for decline triggers shame
- Shame leads to avoidance, which worsens decline
- Grace periods allow dignified recovery
- User has time to notice and respond before consequence

---

## Gaps and Validation Plan

| Constant | Confidence | Validation Method |
|----------|------------|-------------------|
| Component weights | Low | MIRROR simulation + user testing |
| 14-day stabilization | Medium | Literature review on maintenance |
| 90 days to LUMINOUS | Medium | User research on motivation |
| DARK_INFLUENCE_MAX | Low | User testing on dark star experience |
| Grace periods | Medium | A/B test different durations |

---

## Key Citations

1. **Kegan, R. (1994).** *In Over Our Heads: The Mental Demands of Modern Life.* Harvard University Press.

2. **Loevinger, J. (1976).** *Ego Development.* Jossey-Bass.

3. **Prochaska, J. O., & DiClemente, C. C. (1983).** Stages and processes of self-change of smoking. *Journal of Consulting and Clinical Psychology*, 51(3), 390-395.

4. **Lally, P., et al. (2010).** How are habits formed: Modelling habit formation in the real world. *European Journal of Social Psychology*, 40(6), 998-1009.

5. **Kwasnicka, D., et al. (2016).** Theoretical explanations for maintenance of behaviour change: a systematic review of behaviour theories. *Health Psychology Review*, 10(3), 277-296.

6. **Marlatt, G. A., & Gordon, J. R. (1985).** *Relapse Prevention: Maintenance Strategies in the Treatment of Addictive Behaviors.* Guilford Press.

7. **Brown, B. (2012).** *Daring Greatly.* Gotham Books.

8. **Maslow, A. H. (1943).** A theory of human motivation. *Psychological Review*, 50(4), 370-396.

---

*NERVES complete. Every threshold has a reason. Proceed to SKIN for boundaries.*
