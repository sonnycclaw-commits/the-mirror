# Compatibility System - NERVES

**System:** compatibility
**Lens:** NERVES (3/7)
**Created:** 2025-01-15
**Status:** Draft
**Depends on:** 02-blood.md

---

## Overview

This document provides research justifications for the mathematical formulas and design decisions in the Compatibility System BLOOD artifact. Each design choice is traced to empirical research, psychological theory, or established UX principles.

**Confidence Levels:**
- **HIGH** - Multiple peer-reviewed sources, well-established theory
- **MEDIUM** - Single source or theoretical extrapolation from related research
- **LOW** - Design heuristic, needs user validation

---

## 1. Citation Table

| ID | Source | Key Finding | Used For |
|----|--------|-------------|----------|
| IC-1 | Interpersonal Complementarity (PMC11233140) | Warmth similarity attracts; dominance opposites complement | RESONANCE, COMPLEMENT |
| IC-2 | Interpersonal Complementarity (PMC11233140) | Complementarity increases satisfaction, lowers conflict | TENSION detection thresholds |
| IC-3 | Interpersonal Complementarity (PMC11233140) | Partners who complemented in warmth liked each other more, performed tasks faster | GROWTH_EDGE mentorship |
| SW-1 | Jungian Shadow Work (Humantold) | Shadow = neglected aspects, not inherently bad | SHADOW_MIRROR framing |
| SW-2 | Jungian Shadow Work (Humantold) | Mutual shadow work leads to emotionally connected conversations | SHADOW_MIRROR as opportunity |
| SW-3 | Jungian Shadow Work (Humantold) | Shadow integration resolves internal tensions | SHADOW_MIRROR strength formula |
| MP-1 | Mentorship Psychology (PMC9243938) | Psychosocial mentoring reduces stress through interpersonal comfort | GROWTH_EDGE value |
| MP-2 | Mentorship Psychology (PMC9243938) | Mentor-mentee problems can cause tension or termination | GROWTH_EDGE constraints |
| DA-1 | Dating App Design (DateID blog) | Hinge "Most Compatible" uses AI + behavioral data | Multi-dimensional profile |
| DA-2 | Dating App Design (DateID blog) | Multi-dimensional profiles (prompts, photos, voice) outperform single score | No single % design |
| DA-3 | Dating App Design (DateID blog) | Depth vs quick connections, not single compatibility % | Profile dimensions |
| PC-1 | GDPR Principles | Lawful basis for processing relational data | Privacy consent |
| PC-2 | Multi-party Data Ethics | Unanimous consent for data affecting multiple parties | Overlay consent |
| PC-3 | Right to Revocation | Users can withdraw consent and request deletion | Privacy blurring |
| ST-1 | Signal Detection Theory | Uncertainty reduces confidence in classification | Blur certainty formula |
| ST-2 | Signal Detection Theory | Noise propagates through composed estimates | Certainty multiplication |
| RM-1 | Relationship Maintenance (Gottman) | 5:1 positive-to-negative ratio predicts satisfaction | Dynamic type thresholds |
| RM-2 | Relationship Maintenance (Gottman) | "Bids for connection" require response matching | RESONANCE threshold |
| AT-1 | Attachment Theory (Bowlby/Ainsworth) | Secure attachment requires consistent responsiveness | GROWTH_EDGE mentor threshold |
| AT-2 | Attachment Theory | Anxious-avoidant dynamics create friction | TENSION gap threshold |
| ZPD-1 | Zone of Proximal Development (Vygotsky) | Learning occurs just beyond current capability | Mentee range [0.3, 0.55] |
| ZPD-2 | Zone of Proximal Development | Too-large gaps prevent learning | Mentee max at 0.55 |
| GM-1 | Statistical Means | Geometric mean penalizes asymmetry | Shadow/Resonance strength |
| GM-2 | Statistical Means | Harmonic mean prevents outlier dominance | Brightness factor |
| GD-1 | Group Dynamics (Tuckman) | Groups have emergent properties beyond pairs | Group pattern detection |
| GD-2 | Group Dynamics | Triangular relationships create distinct dynamics | TRIANGULAR_TENSION pattern |

---

## 2. Interaction Type Justifications

### 2.1 RESONANCE (Both Strong)

**Definition:** Both users have high brightness (>= 0.6) in the same domain.

**Threshold Justification (0.6):**

| Aspect | Justification | Confidence |
|--------|---------------|------------|
| Threshold value | Brightness 0.6 maps to STEADY/BRIGHT states (active engagement). Research IC-1 shows warmth similarity increases liking and task performance. | MEDIUM |
| Geometric mean strength | IC-1: Complementarity benefits require mutual contribution. Geometric mean rewards symmetry - if one person is barely over threshold while other is very high, strength is reduced. | HIGH |
| Base strength 0.35 | Conservative base ensures only strong mutual engagement registers as high resonance. Prevents "false positive" resonances. | MEDIUM |

**Research Basis:**
- IC-1 demonstrates that in the warmth dimension (care, support, connection), similarity predicts satisfaction
- Both parties must actively engage for resonance to be meaningful
- RM-1's 5:1 ratio suggests positive interactions need sustained presence, hence 0.6 threshold not lower

**Open Questions:**
- Should resonance have different thresholds per domain? (e.g., Soul might need higher engagement)
- Is 0.6 too high for new users with nascent stars?

**Validation Hook:** Survey users on relationship quality when resonance score > 0.5. Expect reported satisfaction correlation.

---

### 2.2 TENSION (Large Brightness Gap)

**Definition:** Brightness gap >= 0.4 in the same domain.

**Threshold Justification (0.4):**

| Aspect | Justification | Confidence |
|--------|---------------|------------|
| Gap threshold 0.4 | AT-2: Anxious-avoidant dynamics emerge when one partner is highly engaged while other withdraws. 0.4 gap represents 40% of full range - significant asymmetry. | MEDIUM |
| High priority | IC-2: Complementarity research shows friction dominates experience. Tension should be detected before growth potential. | HIGH |
| Base strength 0.4 | Tensions are felt strongly - psychological salience. Starting at 0.4 ensures detected tensions are always notable. | MEDIUM |
| Linear scaling | Tensions scale predictably with gap size. No threshold effects within tension range. | LOW |

**Research Basis:**
- IC-2: When partners don't complement (especially on warmth/engagement), conflict increases
- AT-2: Attachment literature describes pursuit-withdrawal cycles that match high/low brightness patterns
- Tension is NOT inherently negative - it's information about asymmetric engagement

**Why TENSION overrides GROWTH_EDGE:**
When a 0.45 gap exists, the experience is more "friction" than "mentorship opportunity." The brighter person may feel drained; the dimmer may feel judged. Only when gap is smaller does growth potential emerge.

**Validation Hook:** Track user feedback on relationships flagged as TENSION. Expect reports of "friction" or "imbalance" themes.

---

### 2.3 GROWTH_EDGE (Mentorship Opportunity)

**Definition:** One user >= 0.6 (mentor), other in [0.3, 0.55] (mentee).

**Threshold Justification:**

| Aspect | Justification | Confidence |
|--------|---------------|------------|
| Mentor >= 0.6 | AT-1: Secure mentorship requires consistent capability. 0.6 = STEADY+ state, actively engaged. | HIGH |
| Mentee min 0.3 | ZPD-1: Learner must have baseline capability to benefit. Below 0.3 = struggling, needs support not teaching. | MEDIUM |
| Mentee max 0.55 | ZPD-2: Too-close capability eliminates learning potential. Gap must exist but not be too large. | MEDIUM |
| Optimal mentee 0.425 | ZPD-1: Learning peaks at "just beyond current capability." Midpoint of range = optimal stretch. | MEDIUM |

**Research Basis:**
- MP-1: Psychosocial mentoring reduces stress through interpersonal comfort
- ZPD-1/ZPD-2: Vygotsky's Zone of Proximal Development directly informs the mentee range
- The mentor provides scaffolding; the mentee must be ready to receive it

**Why Mentee Factor Uses Distance from Midpoint:**
ZPD research shows learning isn't linear with capability gap. There's an optimal zone. Too close to mentor = boredom; too far = frustration. Peak learning at the sweet spot.

**Formula Rationale:**
```python
mentee_factor = 1 - (distance_from_optimal / (mentee_range / 2))
```
- At mentee brightness 0.425: distance = 0, factor = 1.0 (maximum)
- At mentee brightness 0.3 or 0.55: distance = 0.125, factor = 0 (minimum but still valid)

**Validation Hook:** Survey mentorship-flagged pairs. Expect reported learning/growth when both mentor and mentee engage.

---

### 2.4 SHADOW_MIRROR (Both Struggling)

**Definition:** Both users have brightness <= 0.4 in the same domain.

**Threshold Justification (0.4):**

| Aspect | Justification | Confidence |
|--------|---------------|------------|
| Threshold 0.4 | Brightness 0.4 = FLICKERING/DIM boundary. Below this, engagement is intermittent or rare. | MEDIUM |
| Highest priority | SW-1: Shadow aspects are often hidden/neglected. When both share, it's significant and should not be masked by other types. | HIGH |
| Geometric mean strength | SW-3: Shared wound depth matters. Both must be struggling for strong shadow mirror. | MEDIUM |
| Framing as opportunity | SW-2: Mutual shadow work leads to emotional connection. Not pathologized. | HIGH |

**Research Basis:**
- SW-1: Jung's shadow concept - not "bad" but neglected aspects of self
- SW-2: When both partners acknowledge and work on shadow aspects, connection deepens
- SW-3: Integration (acknowledging shared struggle) reduces internal tension

**Why Geometric Mean:**
```python
base_strength = sqrt(darkness_a * darkness_b)
```
- If one is barely below 0.4 (darkness = 0.125) and other is very dark (darkness = 0.75), strength = 0.31
- If both are equally dark (0.5 each), strength = 0.5
- Rewards symmetry of struggle, not just total darkness

**Psychological Framing:**
Shadow mirrors are NOT "you're both broken." They're "you both have work to do in this area - that's a potential connection point." The UI should emphasize shared journey, not shared weakness.

**Validation Hook:** Monitor shadow mirror pairs for whether they engage in "holding space" conversations. Track if mutual acknowledgment leads to brightness increases over time.

---

### 2.5 COMPLEMENT (Cross-Domain Balancing)

**Definition:** Users have opposite strengths across different domains.

**Design Justification:**

| Aspect | Justification | Confidence |
|--------|---------------|------------|
| Strong threshold 0.65 | Above RESONANCE threshold (0.6) to ensure clear strength. | MEDIUM |
| Weak threshold 0.35 | Below mentee range (0.3-0.55) to ensure clear gap. | MEDIUM |
| Cross-domain only | IC-1: Dominance dimension shows opposites complement. Applied to life domains. | MEDIUM |
| Coverage bonus 0.3 | More domain coverage = more meaningful complementarity. | LOW |

**Research Basis:**
- IC-1: Interpersonal complementarity shows different dimensions have different similarity/complementarity dynamics
- Warmth (within-domain RESONANCE) benefits from similarity
- Dominance/capability (cross-domain COMPLEMENT) benefits from opposites

**Why This Differs from Same-Domain Interactions:**
- Same domain: "We both care about Health" - similarity (RESONANCE) or asymmetry (GROWTH/TENSION)
- Cross domain: "I'm strong in Wealth, you're strong in Relationships" - balancing (COMPLEMENT)

**Validation Hook:** Survey couples flagged as BALANCING dynamic. Expect reports of "we balance each other out" or "partners in different areas."

---

## 3. Why Multi-Dimensional Profile (Not Single %)

### Research Basis

| Source | Finding | Implication |
|--------|---------|-------------|
| DA-1 | Hinge's "Most Compatible" uses AI + behavioral data, not single score | Industry leaders avoid single % |
| DA-2 | Multi-dimensional profiles (prompts, photos, voice) outperform single score | Richer data = better matching |
| DA-3 | Depth vs quick connections as key differentiator | Single % encourages superficial swiping |

### Design Rationale

**Single percentage problems:**
1. **False precision** - "72% compatible" implies we know more than we do
2. **Reductionism** - Flattens complex dynamics to one number
3. **Gaming** - Users optimize for the number, not genuine connection
4. **Meaning loss** - What does 72% mean? 72% of what?

**Multi-dimensional benefits:**
1. **Transparency** - Users see WHY compatibility exists (shared strengths, tensions, growth edges)
2. **Nuance** - Relationships can be high-resonance AND high-tension (both informative)
3. **Agency** - Users decide which dimensions matter to them
4. **Learning** - Users understand their relational patterns

### Confidence: HIGH

This is one of the most well-supported design decisions. Dating app research, UX best practices, and psychological validity all point to multi-dimensional profiles.

### Validation Hook
A/B test showing profile dimensions vs showing single % (derived from same data). Measure:
- Conversation quality after match
- Relationship satisfaction at 3 months
- User understanding of why they matched

---

## 4. Privacy Consent Justification

### Relational Data Ethics

| Principle | Source | Application |
|-----------|--------|-------------|
| Lawful basis | PC-1 (GDPR) | Consent required before overlay computation |
| Multi-party consent | PC-2 | BOTH users must consent to see overlay |
| Right to withdraw | PC-3 | Either user can blur/hide stars at any time |
| Data minimization | PC-1 | Only compute interactions for consented stars |

### Design Decisions

**Why explicit consent for overlay:**
- Compatibility data is inherently relational (about BOTH users)
- One user cannot consent on behalf of another
- Showing compatibility without consent violates autonomy

**Why blurring preserves privacy:**
- Brightness blurring reduces precision without eliminating interaction detection
- User can be "in the overlay" without revealing exact struggle levels
- Graduated privacy: full visibility, blurred, or hidden

**Why certainty decreases with blur:**
- ST-1: Signal detection theory - noise reduces classification confidence
- ST-2: Uncertainty propagates through composed estimates
- Blurred interactions should be flagged as less reliable

### Confidence: HIGH

Privacy-by-design is a regulatory requirement (GDPR) and ethical imperative. The specific mechanism (blurring vs binary hide) is MEDIUM confidence - there may be better approaches.

### Validation Hook
User research on privacy comfort:
- What % of users enable blur vs full visibility?
- Do users understand what blur reveals?
- Are blurred interactions still perceived as valuable?

---

## 5. Formula-Specific Justifications

### 5.1 Why Geometric Mean for Shadow/Resonance?

**Formula:**
```python
strength = sqrt(factor_a * factor_b)
```

**Justification:**

| Aspect | Research | Confidence |
|--------|----------|------------|
| Rewards symmetry | GM-1: Geometric mean penalizes asymmetry | HIGH |
| Both must contribute | IC-1: Mutual engagement required for benefit | HIGH |
| Prevents dominance | 0.9 * 0.1 = 0.30, not 0.50 (arithmetic) | MEDIUM |

**Example:**
- Both at 0.8: sqrt(0.8 * 0.8) = 0.8
- One at 0.9, one at 0.1: sqrt(0.9 * 0.1) = 0.30

Geometric mean ensures both parties must engage for high strength. One person cannot carry a resonance.

### 5.2 Why Harmonic Mean for Brightness Factor?

**Formula:**
```python
harmonic_mean = 2 / (1/brightness_a + 1/brightness_b)
```

**Justification:**

| Aspect | Research | Confidence |
|--------|----------|------------|
| Prevents outlier dominance | GM-2: Harmonic mean sensitive to low values | HIGH |
| Both signals matter | IC-1: Both parties contribute to interaction | MEDIUM |
| Conservative estimate | Better to underestimate than overestimate | MEDIUM |

**Example:**
- Both at 0.8: harmonic = 0.8
- One at 0.9, one at 0.2: harmonic = 0.327 (arithmetic would be 0.55)

Harmonic mean ensures dim stars don't get amplified by bright partners. A dim signal is a dim signal regardless of the other party.

### 5.3 Why These Threshold Values?

| Threshold | Value | Justification | Confidence |
|-----------|-------|---------------|------------|
| SHADOW_THRESHOLD | 0.4 | FLICKERING/DIM boundary in brightness-decay system | MEDIUM |
| TENSION_GAP | 0.4 | 40% of full range = significant asymmetry | LOW |
| RESONANCE | 0.6 | STEADY+ states = active engagement | MEDIUM |
| GROWTH_MENTOR | 0.6 | Must be actively engaged to mentor | MEDIUM |
| GROWTH_MENTEE_MIN | 0.3 | Must have baseline capability | MEDIUM |
| GROWTH_MENTEE_MAX | 0.55 | Below resonance threshold = room to grow | MEDIUM |

**Confidence Note:** Most thresholds are LOW or MEDIUM. They're principled guesses based on the brightness-decay system mapping. User research should validate or refine.

### 5.4 Why Priority Order?

```
1. SHADOW_MIRROR
2. TENSION
3. GROWTH_EDGE
4. RESONANCE
```

**Justification:**

| Priority | Reasoning | Confidence |
|----------|-----------|------------|
| Shadow first | SW-1: Rare and significant, should not be masked | HIGH |
| Tension second | IC-2: Friction dominates experience | HIGH |
| Growth before resonance | Asymmetry more informative than mutual strength | MEDIUM |
| Resonance last | "Default good" when conditions for others not met | MEDIUM |

This order prevents double-counting while ensuring the most significant interactions are captured.

---

## 6. Confidence Summary by Design Choice

### HIGH Confidence (Multiple sources, well-established)

| Decision | Sources |
|----------|---------|
| Multi-dimensional profile (not single %) | DA-1, DA-2, DA-3 |
| Explicit consent for overlay | PC-1, PC-2, PC-3 |
| Shadow mirror as opportunity (not pathology) | SW-1, SW-2, SW-3 |
| Geometric mean for mutual interactions | GM-1, IC-1 |
| Harmonic mean for brightness factor | GM-2, IC-1 |
| Priority order (shadow > tension > growth > resonance) | SW-1, IC-2 |
| Mentorship requires mentor engagement | AT-1, MP-1 |

### MEDIUM Confidence (Single source or extrapolation)

| Decision | Sources | Notes |
|----------|---------|-------|
| RESONANCE threshold 0.6 | RM-1, brightness-decay mapping | Maps to STEADY state |
| TENSION gap threshold 0.4 | AT-2 | Reasonable but arbitrary cutoff |
| GROWTH_EDGE mentee range [0.3, 0.55] | ZPD-1, ZPD-2 | Based on learning theory |
| SHADOW_THRESHOLD 0.4 | SW-1, brightness-decay mapping | Maps to FLICKERING state |
| Blur certainty 0.75 | ST-1 | Needs validation |
| Domain-based overlay (not spatial) | Design intuition | No direct research |

### LOW Confidence (Design heuristic, needs validation)

| Decision | Notes |
|----------|-------|
| COMPLEMENT thresholds (0.65/0.35) | Arbitrary cutoffs |
| Coverage bonus 0.3 | Arbitrary multiplier |
| Base strength values (0.35, 0.4) | Calibration numbers |
| Strength ranges (0.45, 0.5, 0.55) | Calibration numbers |
| MIN_INTERACTION_STRENGTH 0.2 | UI filtering threshold |
| Group pattern thresholds (0.8) | Arbitrary |

---

## 7. Validation Hooks for User Research

### 7.1 Interaction Type Validation

| Type | Method | Expected Outcome |
|------|--------|------------------|
| RESONANCE | Survey satisfaction for high-resonance pairs | Correlation > 0.5 |
| TENSION | Qualitative feedback on tension-flagged pairs | Reports of "imbalance" themes |
| GROWTH_EDGE | Track learning/growth reports | Positive outcomes when both engage |
| SHADOW_MIRROR | Monitor if pairs engage in vulnerable conversations | Increased over time |
| COMPLEMENT | Survey feeling of "balance" | Reports of complementary strengths |

### 7.2 Threshold Validation

| Threshold | Method | Adjustment Signal |
|-----------|--------|-------------------|
| RESONANCE 0.6 | A/B test 0.5 vs 0.6 vs 0.7 | User satisfaction with matches |
| TENSION_GAP 0.4 | Survey "felt tension" vs detected tension | False positive/negative rates |
| SHADOW 0.4 | Monitor shadow mirror count | Too rare = raise threshold |
| MENTEE range | Survey mentee experience | Learning reported in range? |

### 7.3 Profile vs Single Score Validation

| Metric | Method | Expected Outcome |
|--------|--------|------------------|
| Conversation quality | Content analysis of post-match messages | Profile group deeper |
| Relationship satisfaction | 3-month follow-up survey | Profile group higher |
| User understanding | Quiz on "why matched" | Profile group more accurate |
| Gaming behavior | Detect artificial star manipulation | Profile group lower |

### 7.4 Privacy Model Validation

| Question | Method | Threshold |
|----------|--------|-----------|
| Blur adoption | % of users enabling blur | > 20% = feature valued |
| Blur understanding | Quiz on what blur reveals | > 70% accuracy |
| Consent comfort | Survey after first overlay | > 80% feel respected |
| Revocation usage | % who revoke after viewing | < 10% = design working |

---

## 8. Open Questions from BLOOD (Addressed)

### Q: Why 0.4 for shadow threshold?

**Answer:** 0.4 is the FLICKERING/DIM boundary in the brightness-decay system. Below 0.4, engagement is intermittent or rare. This maps psychological state to system state. **Confidence: MEDIUM** - needs user validation.

### Q: Why geometric mean for shadow/resonance?

**Answer:** Geometric mean rewards symmetry (GM-1). For shadow mirrors, both must be struggling for the shared wound to be meaningful. For resonance, both must be engaged. See Section 5.1.

### Q: Why harmonic mean for brightness factor?

**Answer:** Harmonic mean prevents outlier dominance (GM-2). A dim signal cannot be amplified by a bright partner - both must contribute. See Section 5.2.

### Q: Research on group dynamics threshold (0.8)?

**Answer:** 0.8 (80%) is a heuristic for "overwhelming majority." GD-1 and GD-2 establish that groups have emergent properties, but specific thresholds are design choices. **Confidence: LOW** - needs validation.

### Q: Why these dynamic type thresholds?

**Answer:** Thresholds prioritize rare/significant patterns (shadow mirrors) with lower thresholds, and require sustained presence for common patterns (resonance). See BLOOD Section 4.3 and Table above.

### Q: Blur uncertainty of 0.75 - research basis?

**Answer:** ST-1 and ST-2 establish that uncertainty reduces confidence. 0.75 is a heuristic representing "substantially confident but not certain." When both blur, confidence is 0.56 (floored to 0.5). **Confidence: LOW** - needs validation.

### Q: Adjacent domain interactions - worth implementing?

**Answer:** Deferred. IC-1 suggests within-domain dynamics are primary. Cross-domain is handled by COMPLEMENT at the profile level. Adjacent-domain interactions add complexity without clear benefit. **Recommendation:** Validate current system before adding.

---

## 9. Research Gaps

### Needs More Research

| Topic | Current State | Needed |
|-------|---------------|--------|
| Optimal thresholds | Principled guesses | User validation |
| Group dynamics | Pairwise decomposition | True N-way research |
| Cultural variation | Western research bias | Cross-cultural validation |
| Temporal dynamics | Snapshot only | Longitudinal studies |
| Domain relationships | Equal treatment | Domain-specific thresholds? |

### Potential Future Research

1. **Longitudinal tracking:** How do compatibility profiles change over time?
2. **Causality:** Do compatible profiles predict relationship success, or does success create compatible profiles?
3. **Intervention effects:** Does showing compatibility information change behavior?
4. **Privacy-utility tradeoff:** Optimal blur level for privacy vs usefulness?

---

## 10. Implementation Recommendations

### High-Confidence Implementations

Implement with confidence:
- Multi-dimensional profile display
- Explicit consent before overlay
- Shadow mirror as "shared journey" framing
- Geometric/harmonic means for strength calculation
- Priority order for type detection

### Requires A/B Testing

Implement with testing:
- All threshold values (0.4, 0.6, etc.)
- Base strength and range values
- Certainty reduction for blur
- Group pattern detection

### Defer Until Validation

Do not implement yet:
- Adjacent domain interactions
- Domain-specific thresholds
- Predictive matching ("you might resonate")
- Automated compatibility recommendations

---

*NERVES complete. Research justifications documented. Proceed to LIGAMENT for system integration contracts.*
