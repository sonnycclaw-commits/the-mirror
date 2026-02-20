# The Horizon - SKIN

**System:** the-horizon
**Lens:** SKIN (4/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 01-skeleton.md ✓, 02-blood.md ✓, 03-nerves.md ✓

---

## Overview

Edge cases, boundaries, and failure modes for the Horizon system.

---

## 1. Excavation Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| User can't articulate vision | TARS offers prompts, not answers; may suggest smaller horizon | User owns the vision |
| Vision is someone else's dream | TARS surfaces: "This sounds like X's goal. Is it yours?" | Authentic vision critical |
| Anti-vision triggers trauma | Safety protocol; skip anti-vision, offer resources | Safety first |
| Anti-vision is identical to current life | TARS acknowledges: "So staying here is the fear." | Validates stuck feeling |
| User has multiple competing visions | Choose primary; others become secondary Horizons later | Focus one at a time |
| Excavation takes 2+ hours | Suggest pause, save progress; can resume | Respect user time |

---

## 2. Slingshot Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| No next Walk defined | Full slingshot stored in accumulated velocity | Bank for later |
| Next Walk is perpendicular | Reduced slingshot (alignment factor) | Changing direction costs |
| Next Walk is backwards | Zero slingshot; velocity preserved but no boost | Can't slingshot backwards |
| Slingshot would exceed MAX | Capped at MAX_ACCUMULATED_VELOCITY | Prevent runaway |
| Multiple Walks complete same day | Each gets slingshot; additive | Rare but valid |

---

## 3. Drift Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| User pauses all Walks (sabbatical) | PAUSED state at Walk level; Horizon stays ACTIVE | Intentional pause ≠ drift |
| Velocity = 0.09 (just above threshold) | No drift; close monitoring | Leeway before warning |
| Velocity fluctuates around threshold | 30 consecutive days required | Smooth detection |
| User at dark star (distance → 0) | Hard floor; can't go negative | Never fully "lost" |
| Drift during major life event | TARS offers pause, not judgment | Compassionate response |

---

## 4. Review Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| User skips review | Reminder after 7 days; then soft block | Can't ignore forever |
| User disputes milestone reached | User decides; TARS notes discrepancy | User has final say |
| Review changes everything | Full Remapping; may take 30 min | Major shifts happen |
| Review confirms exactly | Quick confirmation; continue | Don't waste time |
| North Star reached but user disputes | User decides; may not feel "arrived" | Subjective experience |

---

## 5. Arrival Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| Reaches 5-year before 10-year | Each star has own arrival; 10-year = ultimate | Intermediate wins valid |
| North Star reached but empty feeling | TARS explores: "Is this what you imagined?" | Post-achievement depression is real |
| User doesn't want new Horizon | Allowed; Horizon stays ARRIVED indefinitely | Choice respected |
| New Horizon immediately after | 50% velocity carries; fresh vision | Building on foundation |
| Life circumstances make Horizon impossible | Compassionate transition to Remapping | No shame |

---

## 6. State Transition Edge Cases

| From | To | Edge Case | Resolution |
|------|----|-----------|------------|
| EXCAVATING | UNDEFINED | Abandoned after 6 months, wants to resume | Fresh start; old drafts expired |
| MAPPED | ACTIVE | User never starts Walk | Gentle prompts; no expiry |
| ACTIVE | DRIFTING | One Walk stalled, one active | No drift; any active Walk prevents |
| REVIEWING | REMAPPING | Major life change | Full support; no rushing |
| DRIFTING | UNDEFINED | 364 days, user returns | Still in time; resumes |
| DRIFTING | UNDEFINED | 366 days, user returns | Horizon expired; new excavation |

---

## 7. Multi-Horizon Questions

| Case | Behavior | Rationale |
|------|----------|-----------|
| User wants 2 Horizons simultaneously | Allowed; but capacity shared | Advanced users |
| Horizons conflict (career vs family) | Surface conflict; user chooses priority | Can't walk two directions |
| Horizon in same domain as existing | Warn; may be refinement, not new Horizon | Prevent fragmentation |
| One Horizon arrives, one active | Celebrate one; continue other | Independent tracking |

---

## 8. Dark Star Edge Cases

| Case | Behavior | Rationale |
|------|----------|-----------|
| Anti-vision becomes true (life event) | Compassionate acknowledgment; path to recovery | Not failure, reality |
| User deliberately moves toward dark star | TARS explores intent; safety check | May be shadow work |
| Dark star integrates (user confronts) | Star transforms from DARK to DIM | Growth, not elimination |
| User wants to delete dark star | Not allowed; can only integrate | Shadow can't be erased |

---

## 9. Boundaries

| Metric | Min | Max | Behavior at Limit |
|--------|-----|-----|-------------------|
| Slingshot velocity | 0.0 | 2.0 | Capped |
| Horizon momentum | 0.0 | 1.5 | Capped |
| Drift pull | 0.0 | 0.3 | Capped (no singularity) |
| Distance to dark star | 0.1 | ∞ | Hard floor at 0.1 |
| Active Walks per Horizon | 0 | 3 | Inherited from Walk limit |
| Active Horizons per user | 1 | 2 | Soft limit; warn on 2nd |
| Excavation duration | 10 min | 120 min | Suggest pause at 45 |
| Days since review | 0 | 365 | Forced review at 180 |

---

## 10. Anti-Gaming Measures

| Gaming Attempt | Prevention |
|----------------|------------|
| Complete many small milestones for slingshots | Slingshot power proportional to timeframe |
| Set easy North Star for quick Arrival | Excavation validates significance |
| Delete and restart to reset dark star | Dark star persists in user history |
| Claim milestones without doing work | Success criteria verification |
| Avoid drift by minimal activity | Velocity threshold catches this |

---

## 11. Failure Modes

| Failure | Detection | Response | Recovery |
|---------|-----------|----------|----------|
| User sets unrealistic Horizon | Excavation flags; TARS probes | Discuss feasibility | Remapping |
| Slingshot inflation | Track accumulated > 1.5 | Cap + decay | Auto-correct |
| Perpetual drift | 365 days | Horizon expires | Fresh start |
| Review avoidance | 14 days ignored | Soft block on Walk | Must review |
| Dark star despair | User language + proximity | TARS intervention + resources | Sabbatical offer |

---

*SKIN complete. Proceed to MIRROR for simulation.*
