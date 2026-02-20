# Pre-Mortem: S.T.A.R.S. Mechanics Implementation

**Mode:** Deep
**Context:** Complete mechanics folder with 7 systems + compatibility layer
**Date:** 2026-01-15

---

## Executive Summary

*"It's 6 months from now. S.T.A.R.S. has failed spectacularly. Why?"*

After systematic review of all mechanics, I've identified:

| Category | Count | Severity |
|----------|-------|----------|
| 🐯 **TIGERS** | 6 | HIGH (must address) |
| 🐘 **ELEPHANTS** | 4 | MEDIUM (unspoken concerns) |
| 📄 **PAPER TIGERS** | 5 | Low (look scary, actually fine) |

---

## 🐯 TIGERS (Clear Threats)

### 1. [HIGH] Cold Start Problem — No Stars to Walk Toward

**Location:** the-walk/01-skeleton.md, experiment-selection/06-scripture.md
**Mitigation checked:** No explicit onboarding stars created during Mirror

**The Problem:**
The Walk requires stars with brightness values. Experiment selection requires star urgency scores. But after the 7-day Mirror, stars are NASCENT (0.1 brightness, ghost-like).

```
Day 7: Mirror complete → Stars are NASCENT
Day 8: Walk begins → Experiment selection calculates urgency
       → NASCENT has base urgency 0.00 (not listed in table!)
       → No experiments selected
       → User sees nothing to do
       → Churn
```

**Suggested Fix:**
- Add "birth brightness" for stars created during Mirror (e.g., 0.3)
- Or add NASCENT to urgency table with base_urgency = 0.6 (emerging stars need nurturing)

---

### 2. [HIGH] Infinite Capacity — The Walk Allows 3 Journeys, No Reality Check

**Location:** the-walk/04-skin.md, the-walk/02-blood.md
**Mitigation checked:** Capacity pool exists, but no integration with experiment-selection

**The Problem:**
The Walk allows up to 3 simultaneous journeys with capacity weighting. But experiment-selection also has MAX_ACTIVE = 3 experiments per day. These systems use different capacity concepts.

```
Scenario: User has 3 Walks active, each requiring experiments.
→ Total daily experiments needed: 3-9
→ But MAX_ACTIVE = 3
→ Either: experiments are split across Walks (none progress meaningfully)
→ Or: experiments only go to primary Walk (others stall)
```

**Suggested Fix:**
- Define cross-system capacity: total experiments/day = f(active_walks, user_capacity)
- Ensure primary Walk gets priority in experiment allocation
- Add to SKIN: "What if user has 3 Walks but only completes 2 experiments/day?"

---

### 3. [HIGH] Stall Detection Gap — Walk Stalls But Horizon Doesn't Know

**Location:** the-walk/02-blood.md (stall), the-horizon/02-blood.md (drift)
**Mitigation checked:** No explicit signal from Walk to Horizon

**The Problem:**
Walk has its own stall detection (velocity < threshold for N days). Horizon has drift detection (all walks velocity < 0.1 for 30d). But they don't talk to each other.

```
Walk velocity = 0.08 (stalled per Walk rules)
Horizon checks: "Is velocity < 0.1?" → Yes, but uses different calculation
→ Conflicting stall/drift states
→ User gets mixed signals
```

**Suggested Fix:**
- Horizon should consume Walk's stall state, not recalculate velocity independently
- Single source of truth: Walk.velocity feeds Horizon.drift_check

---

### 4. [HIGH] Dark Star Feedback Loop — Anti-Vision Creates Despair Spiral

**Location:** the-horizon/02-blood.md (dark_pull), constellation-states/06-scripture.md (dark_drain)
**Mitigation checked:** No circuit breaker for compounding darkness

**The Problem:**
Constellation-states has dark stars that drain connected stars. The Horizon adds dark star (anti-vision) that grows brighter when velocity drops. These can compound.

```
User stalls → velocity drops
→ Horizon dark star brightens
→ Dark star drains connected constellation stars
→ Constellation brightness drops
→ Experiment selection surfaces hopeless experiments (all stars urgent/declining)
→ User overwhelmed, stalls more
→ Recursive doom spiral
```

**Suggested Fix:**
- Cap dark star brightness growth rate
- Dark drain should NOT apply to Horizon's anti-vision star (it's conceptual, not part of constellation)
- Add "hope floor": minimum one bright/stable star always visible

---

### 5. [HIGH] Slingshot Without Next Walk — Velocity Lost Forever

**Location:** the-horizon/02-blood.md (slingshot)
**Mitigation checked:** No explicit handling of slingshot without immediate next Walk

**The Problem:**
Slingshot formula assumes alignment with next Walk direction. If user completes a Walk but doesn't immediately start another, the slingshot velocity is stored. But it decays.

```
User completes 1-year milestone → slingshot = 0.4
User takes 3-month break before starting next Walk
→ slingshot decays at 1%/day
→ After 90 days, slingshot = 0.4 × 0.99^90 = 0.16 (60% lost)
→ User's earned momentum evaporated
```

**Suggested Fix:**
- Pause slingshot decay during "intentional break" state
- Or: apply slingshot immediately to user's base momentum, not stored as separate value
- Add explicit "Bank slingshot" edge case in SKIN

---

### 6. [HIGH] No Integration Between Phase Transitions and Horizon

**Location:** phase-transitions/06-scripture.md, the-horizon/01-skeleton.md
**Mitigation checked:** No cross-reference between systems

**The Problem:**
Phase transitions (Scattered → Connecting → Emerging → Luminous) is a constellation-level progression. The Horizon is also a progression system. They should inform each other but don't.

```
User in "Scattered" phase (no coherent pattern)
→ But Horizon assumes user can define 10-year vision
→ Scattered users don't KNOW their vision yet
→ Forcing Horizon excavation too early = false clarity
→ Later disappointment when "vision" was just escape fantasy
```

**Suggested Fix:**
- Gate Horizon excavation on phase: Scattered = no Horizon yet (just Walk discovery)
- Connecting+ = ready for 1-year Horizon
- Emerging+ = ready for 5-year Horizon
- Luminous = ready for 10-year North Star

---

## 🐘 ELEPHANTS (Unspoken Concerns)

### 1. [MEDIUM] 7-Day Mirror to Paid Wall — Conversion Quality Unknown

**Concern:** We've designed beautiful mechanics but have no data on whether the Mirror → Walk conversion actually works. The entire revenue model depends on it.

**Why nobody wants to discuss it:** The mechanics are elegant. It feels good. Questioning the conversion feels like questioning the art.

**Reality check:** What if users love the Mirror (free) but don't see value in the Walk (paid)?

**Suggested approach:** Define minimum viable metrics for pilot; what would prove/disprove conversion hypothesis?

---

### 2. [MEDIUM] AI Inference Quality for Anti-Vision

**Concern:** The Horizon now relies on TARS inferring anti-vision from Mirror data. This requires sophisticated psychological pattern recognition.

**Why nobody wants to discuss it:** We assume "AI will figure it out" without specifying the ML/prompt requirements.

**Reality check:** What if TARS infers wrong anti-vision? User feels misunderstood. Trust erodes.

**Suggested approach:** Define fallback prompts if confidence is low; let user correct inference explicitly.

---

### 3. [MEDIUM] Compatibility Layer Orphaned

**Concern:** Multi-user compatibility is complete but the-walk and the-horizon are single-user. There's no path from "I'm On a Walk" to "We're On a Walk Together."

**Why nobody wants to discuss it:** Multi-user is "later." But mechanics compound — retrofitting is painful.

**Reality check:** Compatibility can't just be overlaid; it needs Walk-level integration from the start.

**Suggested approach:** Stub out Walk TRIBE lens now, even if incomplete.

---

### 4. [MEDIUM] Formula Complexity — Implementability

**Concern:** There are now 50+ constants across 7 systems. Simulations run in Python. Real implementation will be TypeScript/Swift. Configuration will be in multiple places.

**Why nobody wants to discuss it:** The bible is beautiful. Implementation details are mundane.

**Reality check:** Who maintains 50 constants when they drift between simulation and production?

**Suggested approach:** Generate canonical constants.json from simulations; single source of truth.

---

## 📄 PAPER TIGERS (Looks Scary, Actually Fine)

### 1. Half-Life Differences Between Domains

**Why it seems scary:** Health decays at 9.43%/day, Soul at 0.77%/day. That's 12× difference. Won't Soul stars always be bright forever?

**Why it's fine:** This is intentional. Soul takes longer to build but persists. Health requires daily action but reflects real physiology. MIRROR validated the feel.

**Location:** constellation-states/06-scripture.md

---

### 2. Slingshot Can Exceed 1.0 Velocity

**Why it seems scary:** If slingshot_multiplier > 0.5 and approach_velocity = 1.0, exit_velocity > 1.0. Breaking the cap?

**Why it's fine:** Accumulated slingshot is capped at 2.0. And it's velocity for *Horizon*-level momentum, not Walk-level. Velocity > 1.0 means "user is ahead of expected trajectory."

**Location:** the-horizon/02-blood.md

---

### 3. MAX_DAILY_IMPACT = 0.06 Seems Low

**Why it seems scary:** User can only gain 0.06 brightness per day. At that rate, from 0.1 to 0.7 takes 10+ days minimum.

**Why it's fine:** That's intentional. Transformation requires time. MIRROR showed 21-28 days to stabilize a flickering star, matching research.

**Location:** brightness-decay/06-scripture.md

---

### 4. 365-Day Drift Is Too Long

**Why it seems scary:** User can drift for a YEAR before Horizon expires? That's a useless data point.

**Why it's fine:** It's not about retention. It's about respecting that life happens. One year of no engagement probably means they've moved on — and that's okay. The horizon is undefined, not "failed."

**Location:** the-horizon/02-blood.md

---

### 5. Dark Star "Distance" Is Abstract

**Why it seems scary:** What does "distance to dark star = 2.0" even mean? It's not physical.

**Why it's fine:** It's a metric in state space. The visualization will translate to something metaphorical (dark star brightness, proximity-like pull indicator). The formula just needs a scalar; the UX interprets it.

**Location:** the-horizon/02-blood.md

---

## False Alarms (Investigated But Not Risks)

| Finding | Why It's Not a Risk |
|---------|---------------------|
| No tests in simulations | MIRROR provides validation; unit tests for production code |
| Mermaid diagrams may not render | Markdown viewers handle this; not implementation |
| TypeScript interfaces not defined | Design phase; implementation translates from docs |

---

## Checklist Gaps

| Category | Items Failed |
|----------|--------------|
| **Integration** | Walk ↔ Horizon signal passing not specified |
| **Integration** | Phase ↔ Horizon gating not specified |
| **Scalability** | Multi-user Walk not addressed |
| **Data** | Constellation graph sharding not addressed |

---

## Risk Summary

```
                    ┌──────────────────────────────────────────┐
                    │         RISK HEATMAP                      │
                    ├──────────────────────────────────────────┤
                    │                                          │
                    │  ██ Cold Start        (Day 8 crash)      │
                    │  ██ Capacity Math     (Walk vs Exp)      │
                    │  ██ Doom Spiral       (Dark compounds)   │
                    │  █░ Stall/Drift Gap   (Signal mismatch)  │
                    │  █░ Slingshot Decay   (Momentum lost)    │
                    │  █░ Phase/Horizon Gap (Vision too early) │
                    │                                          │
                    │  ░░ Conversion Quality (Unknown)         │
                    │  ░░ AI Inference       (Trust risk)      │
                    │  ░░ Multi-user Walk    (Not designed)    │
                    │  ░░ 50+ Constants      (Config drift)    │
                    │                                          │
                    └──────────────────────────────────────────┘

                    ██ = HIGH priority    █░ = MEDIUM    ░░ = Discuss
```

---

## Recommended Actions

### Immediate (Block Implementation)

1. **Add NASCENT to urgency table** — 10 minute fix, prevents Day 8 crash
2. **Define cross-system capacity formula** — Walk experiments vs daily capacity
3. **Add dark star circuit breaker** — Cap compounding effects

### Before Beta

4. **Horizon consumes Walk stall state** — Single source of truth
5. **Gate Horizon on Phase** — Scattered users shouldn't set 10-year visions
6. **Preserve slingshot during breaks** — Intentional pauses shouldn't lose momentum

### Before Launch

7. **Define conversion metrics** — What proves Mirror → Walk works?
8. **Stub Walk TRIBE lens** — Multi-user foundation
9. **Single constants.json** — Generated from simulations

---

**Pre-Mortem Complete.**
*6 tigers identified. All addressable. Proceed with mitigations.*
