# Success Metrics

**Section:** 5-validation
**Status:** Draft

---

## Primary Metrics (MVP)

### Completion Metrics

| Metric | Definition | Kill | Target | Stretch |
|--------|------------|------|--------|---------|
| **Day 7 Completion Rate** | Users who complete Day 7 / Users who start Day 1 | <15% | 25% | 40% |
| **Day 2 Return Rate** | Users who return Day 2 / Users who complete Day 1 | <30% | 50% | 70% |

### Quality Metrics

| Metric | Definition | Kill | Target | Stretch |
|--------|------------|------|--------|---------|
| **"Felt Seen" Score** | Post-Day 7 survey (1-5 scale): "I felt truly seen by TARS" | <3.0 | 3.5 | 4.2 |
| **Birth Chart Impact** | Survey (1-5): "The Birth Chart revealed something meaningful" | <3.0 | 3.5 | 4.0 |
| **Would Recommend (NPS-style)** | % who select 9-10 on "Recommend to friend" | <20% | 40% | 60% |

---

## Engagement Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **Session Length** | Average time per session (minutes) | 5-15 min |
| **Messages per Session** | Average messages exchanged | 8-15 |
| **Stars Created per User** | Average stars after Day 7 | 12-20 |
| **Connections Formed** | Average connections after Day 7 | 5-10 |

---

## Conversion Metrics (Phase 2+)

| Metric | Definition | Kill | Target |
|--------|------------|------|--------|
| **Walk Start Rate** | Users who start Discovery Interview / Day 7 completers | <30% | 50% |
| **Paid Conversion** | Paid users / Day 7 completers | <5% | 10% |
| **Month 1 Churn** | Users who cancel within 30 days | >50% | <30% |
| **LTV** | Average lifetime revenue per user | <$40 | >$60 |

---

## Kill Thresholds

If ANY of these are true at pilot end, we must reconsider the product:

| Threshold | Action |
|-----------|--------|
| Day 7 completion <15% | 7-day structure doesn't work; consider shorter |
| "Felt seen" <3.0 | TARS not creating connection; major prompt rework |
| Day 2 return <30% | Day 1 not hooking; rethink first session |
| Zero "wow" responses | Constellation metaphor not landing |

---

## Instrumentation

### Events to Track

| Event | Properties | Purpose |
|-------|------------|---------|
| `session_start` | user_id, day, source | Engagement tracking |
| `message_sent` | user_id, conversation_id, length | Engagement depth |
| `star_created` | user_id, domain, day, label | Extraction tracking |
| `conversation_completed` | user_id, day, duration, stars_created | Completion tracking |
| `birth_chart_revealed` | user_id, duration_watched, skipped | Reveal engagement |
| `birth_chart_shared` | user_id, platform | Viral tracking |
| `walk_started` | user_id | Conversion tracking |
| `payment_completed` | user_id, amount, plan | Revenue tracking |

### Analytics Tooling

**MVP:** Simple event logging to Convex table
**Phase 2+:** PostHog or equivalent

Basic event schema:
```typescript
events: defineTable({
  userId: v.id("users"),
  event: v.string(),
  properties: v.any(),
  timestamp: v.number(),
}).index("by_user", ["userId"]),
```

---

## Surveys

### Post-Day 7 Survey

Triggered after Birth Chart reveal:

```
1. "I felt truly seen by TARS"
   [1] [2] [3] [4] [5]
   Not at all     Completely

2. "The Birth Chart revealed something meaningful about me"
   [1] [2] [3] [4] [5]

3. "I would recommend S.T.A.R.S. to a friend"
   [0-10 slider]

4. What was the most surprising insight? (optional free text)

5. What's missing? (optional free text)
```

### Exit Survey (If User Abandons)

If user doesn't return for 5+ days:

```
1. What got in the way?
   [ ] Too time-consuming
   [ ] Questions felt too personal
   [ ] Didn't see value
   [ ] Life got busy
   [ ] Other: ___

2. What would bring you back? (optional)
```

---

## Reporting

### Weekly Review (During Pilot)

| Report | Content |
|--------|---------|
| Funnel | Day 1 → 2 → 3 → ... → 7 retention |
| Quality | Average "felt seen" by day |
| Engagement | Sessions, messages, stars |
| Issues | Errors, drop-off points |

### Decision Point (End of Pilot)

Go/No-Go based on:
1. Kill thresholds not triggered
2. At least 1 target metric hit
3. Qualitative feedback suggests value
