# S.T.A.R.S. Conversion Metrics

**Purpose:** Define what success looks like for the Mirror → Walk conversion.

---

## Kill Thresholds vs Targets

| Metric | Kill If Below | Target | Source |
|--------|---------------|--------|--------|
| Day-7 completion | 30% | >50% | Session data |
| "This is me" accuracy | 3.5/5 | >4.0/5 | User rating |
| Experiments taken (Week 1) | 20% | >40% | Check-in data |
| Week-4 retention | 15% | >30% | Cohort analysis |
| Conversion to paid | 5% | >10% | Stripe |

---

## What Proves the Hypothesis

The conversion chain:

```
Day-7 Completion → Accuracy Rating → Experiment Uptake → Retention → Payment
```

**Success = all links hold:**
- Users complete 7-day excavation (>50%)
- AND rate accuracy >4/5
- AND take experiments in Week 1 (>40%)
- AND return in Week 4 (>30%)
- AND convert to paid (>10%)

## What Disproves It

| If This Breaks | Diagnosis |
|----------------|-----------|
| Day-7 <30% | 7-day protocol too heavy |
| Accuracy <3.5 | TARS not delivering insight value |
| Experiments <20% | Walk not compelling; insight ≠ action |
| Week-4 <15% | No ongoing value after initial novelty |
| Conversion <5% | Mirror is free entertainment; Walk is work |

---

## Measurement Plan

### Day 7
- [ ] Prompt: "How accurately does this Birth Chart represent you?" (1-5 scale)
- [ ] Store: `user.birth_chart_accuracy_rating`

### Week 1 (Days 8-14)
- [ ] Track: experiments offered vs accepted vs completed
- [ ] Metric: `experiments_completed / experiments_offered`

### Week 4
- [ ] Query: users who completed Day 7 AND returned in Days 21-28
- [ ] Metric: `week4_active / day7_completed`

### Conversion
- [ ] Track: Stripe subscription starts within 30 days of Day 7
- [ ] Metric: `paid_subscriptions / day7_completed`

---

*"Measure the chain. Find where it breaks."*
