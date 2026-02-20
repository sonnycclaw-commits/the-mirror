# Day 0 MVP: The Brutal Cut

**Created:** 2026-01-14
**Author:** architect-agent (scope reduction)
**Purpose:** Answer ONE question in 30 days

---

## The Core Hypothesis

> A living profile that evolves through conversation → personalized pathways → behavioral transformation

**To validate this, we DON'T need:**
- Beautiful visualizations (text works)
- Mobile app (web works)
- Complex psychometrics (simple questions work)
- 7-day excavation (day 1 might work)
- AI companion with personality (ChatGPT works)

**We ONLY need to prove:**
1. Does a profile generated from conversation feel accurate?
2. Does a personalized recommendation based on that profile drive action?
3. Does that action lead to perceived positive change?

---

## Feature Triage: The Brutal Cut

### The Current MVP (8 weeks, massive)

| Feature | Current Plan | Verdict | Reason |
|---------|--------------|---------|--------|
| **7-day excavation protocol** | Core | **CUT to Day 1** | Prove insight works before commitment |
| **Daily push notifications** | v1.0 | **CUT** | Complexity, no one opts in week 1 |
| **Polar coordinate star map** | Decided | **CUT** | Text summary is enough for validation |
| **Constellation metaphor** | Decided | **CUT** | Nice branding, not validation |
| **HEXACO + SDT + Loevinger** | Planned | **CUT** | ChatGPT can do "feels accurate" |
| **TARS AI companion** | Decided | **CUT** | Just use Claude directly |
| **Mobile app (Expo)** | v1.0 | **CUT** | Web works, ships in 3 days not 3 weeks |
| **Skill tree visualization** | v1.0 | **CUT** | Text list is enough |
| **Shareable card** | v1.0 | **CUT** | Nice for virality, not for validation |
| **Stripe subscription** | v1.0 | **CUT** | Cal.com link or Typeform |
| **Phase transitions** | Designed | **CUT** | Only matters if day 1 works |
| **Decay math (Bayesian)** | Designed | **CUT** | Premature optimization |
| **Champion Marketplace** | V2 | **DEFER** | Platform play, prove product first |
| **Analytics dashboard** | v1.0 | **CUT** | Google Forms + spreadsheet |
| **Account system (Clerk)** | v1.0 | **CUT** | Email capture is enough |
| **Convex backend** | v1.0 | **CUT** | Airtable or Notion DB |
| **Profile storage** | v1.0 | **KEEP (minimal)** | Text file or Airtable row |
| **Conversational assessment** | Core | **KEEP** | The product |
| **Profile reveal** | Core | **KEEP** | The "aha" moment |
| **Personalized recommendation** | The Walk | **KEEP** | Proves the hypothesis |
| **Follow-up check** | Missing | **ADD** | Measures if action happened |

---

## What MUST Be True for This to Work

### Assumption 1: "Insight feels accurate"
**Test:** After 10-minute conversation, user rates profile 4+/5 for accuracy
**Kill criterion:** <50% rate it accurate

### Assumption 2: "Personalized rec drives action"
**Test:** User takes the ONE specific action recommended within 48 hours
**Kill criterion:** <20% take any action

### Assumption 3: "Action leads to perceived change"
**Test:** 7 days later, user reports positive impact
**Kill criterion:** <30% report positive impact

**If any assumption fails, STOP. Don't build the app.**

---

## Day 0 MVP: What Ships in 30 Days

### Week 1: The Interview (Days 1-7)

**Build:** A Claude prompt that conducts a 10-minute excavation interview via chat.

**How it works:**
1. User clicks link, lands on simple web page
2. Chat interface (Vercel AI SDK or v0.dev)
3. Claude asks Dan Koe questions (condensed to ~8-10 questions)
4. At end, Claude generates a 2-paragraph profile summary

**Tech:**
- Next.js or v0.dev landing page
- Claude API with streaming
- NO backend - session-only
- Email capture at end

**Output:** "Your Profile" - 2 paragraphs of insight

**Effort:** ~3 days dev

---

### Week 2: The Recommendation (Days 8-14)

**Build:** Based on profile, generate ONE specific action for this week.

**How it works:**
1. After profile, Claude asks: "What's one thing you want to change?"
2. Based on profile + goal, generates a specific "micro-experiment"
3. User gets a simple calendar invite (manual or Calendly)
4. Reminder email at 48 hours

**Tech:**
- Same chat interface
- Add: Calendly or Cal.com embed
- Add: Simple email via Resend

**Output:** One concrete action + reminder

**Effort:** ~2 days dev

---

### Week 3: The Follow-Up (Days 15-21)

**Build:** Check if they did it and how it felt.

**How it works:**
1. Automated email at Day 7 with Typeform/Google Form
2. Simple questions:
   - Did you do the action? (Y/N)
   - What happened?
   - How do you feel about it? (1-5)
3. If positive, offer: "Want next week's experiment?"

**Tech:**
- Typeform or Google Forms
- Simple email automation

**Output:** Data on action → outcome loop

**Effort:** ~1 day

---

### Week 4: Iterate and Validate (Days 22-30)

**Goal:** Run 20-30 people through the loop.

**Activities:**
1. Recruit users (Twitter, ProductHunt comment section, personal network)
2. Observe where they drop off
3. Interview 5 completers: "What was valuable? What wasn't?"
4. Compile results

**Output:** Go/No-Go decision

---

## The Metrics That Matter (30 Days)

| Metric | Target | Kill Threshold |
|--------|--------|----------------|
| Profile accuracy rating (1-5) | >4.0 avg | <3.5 |
| % who take recommended action | >30% | <15% |
| % who report positive outcome | >40% | <20% |
| % who want next experiment | >50% | <25% |
| NPS (would recommend) | >30 | <0 |

**Sample size needed:** 25-30 completers (aim for 50 starts to get 30 completers).

---

## What We Learn (Decision Gate)

### If metrics HIT:
- **Signal:** The loop works.
- **Next:** Build the lightweight app (still cut 80% of ideation).
- **Focus:** Week-over-week engagement, not 7-day excavation.

### If metrics MISS:
- **Signal:** Insight ≠ change (the CHALLENGES doc was right).
- **Options:**
  - A) Add accountability layer (human or AI)
  - B) Pivot to "coaching marketplace" (let humans do the walk)
  - C) Pivot to "birth chart as viral product" (no walk, just insight + share)
  - D) Kill the concept

**Either way, you've learned in 30 days, not 8+ months.**

---

## The 30-Day Build List

### Must Build
- [ ] Landing page with chat interface
- [ ] Claude prompt for 10-minute excavation
- [ ] Profile generation prompt
- [ ] Recommendation generation prompt
- [ ] Email capture
- [ ] 48-hour reminder email
- [ ] Day-7 follow-up form
- [ ] Basic tracking (who started, who finished, who acted)

### Nice-to-Have (if time)
- [ ] Simple auth (magic link)
- [ ] Profile saved to Airtable
- [ ] Second experiment for completers

### Explicitly NOT Building
- Mobile app
- Backend infrastructure
- Subscription system
- Visualizations
- Star map
- Skill tree
- Multi-day protocol
- Push notifications
- Social sharing
- Fancy UI

---

## The Stack (Minimal)

| Layer | Tool | Why |
|-------|------|-----|
| **Frontend** | v0.dev or Next.js | Ships in hours |
| **AI** | Claude API (Sonnet) | The product |
| **Email** | Resend or ConvertKit | Simple automation |
| **Forms** | Typeform | Zero dev for follow-up |
| **Data** | Airtable | Visual, no code |
| **Hosting** | Vercel | Free tier |

**Total cost:** ~$20/month (Claude API) + domains

---

## What This Tests (Restated)

The current ideation assumes:
1. 7 days of excavation is needed → **Test: Can Day 1 work?**
2. Beautiful visualizations create "aha" → **Test: Does text work?**
3. Profile leads to change → **Test: Does ONE action lead to change?**
4. Users will pay $19/mo → **Test: Do they even want experiment #2?**

**If text + Day 1 + one action works, THEN invest in polish.**
**If it doesn't work with text, polish won't save it.**

---

## Risk Acknowledgment

### What we might miss by cutting:
- **7-day depth** → Maybe shallow profile isn't enough. Mitigation: Test "do you want to go deeper?"
- **Visualization impact** → Maybe text doesn't have the same "aha." Mitigation: Ask in follow-up what was impactful.
- **Mobile convenience** → Maybe web is too much friction. Mitigation: If completion <50%, test mobile.
- **Social sharing** → Maybe virality is the only growth path. Mitigation: Add share button post-validation.

### What we definitely avoid:
- 6 months building something no one wants
- Sunk cost fallacy on beautiful infrastructure
- Solving the wrong problem (insight) before the real problem (action)

---

## The Honest Truth

The CHALLENGES document identified:
1. **The Walk doesn't exist** → This MVP DEFINES the walk as "one action + follow-up"
2. **7-day cliff** → We test Day 1 only
3. **ChatGPT can do this** → We test if personalization + follow-up adds value
4. **No unit economics** → We skip monetization entirely; validate value first
5. **Anti-vision retraumatizes** → We use lighter questions, add opt-out

**173k words of ideation. 10-minute chat. One action. 7-day check.**

That's the test.

---

## Call to Action

**Stop ideating. Start validating.**

Build the Day 0 MVP. Get 30 people through it. Make the go/no-go decision.

If it works: Build the lightweight app.
If it fails: Pivot or kill.

Either outcome is better than 8 months of building in the dark.

---

*This plan intentionally makes you uncomfortable. That discomfort is the point.*
