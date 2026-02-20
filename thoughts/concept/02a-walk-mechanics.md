# The Walk Mechanics — The Action Framework

**Version:** 1.0
**Created:** 2026-01-14
**Status:** Design specification
**Addresses:** CHALLENGES.md "The Walk Doesn't Exist" (FATAL risk)

---

## The Problem This Solves

From CHALLENGES.md:
> "Users will complete Mirror, get Birth Chart, and then... nothing to do. They churn."
> "The Walk is supposed to provide [implementation intentions, accountability, environmental design, action plans]. The Walk doesn't exist."

This document makes The Walk **concrete and implementable**.

---

## 1. Experiment Generation Engine

### How TARS Picks Experiments

TARS doesn't randomly suggest actions. Experiments are selected through a prioritization algorithm based on constellation state.

#### The Selection Algorithm

```
PRIORITY = (star_urgency × 0.4) + (user_capacity × 0.3) + (success_probability × 0.3)
```

**Star Urgency Factors:**
| Star State | Urgency Score | Reasoning |
|------------|---------------|-----------|
| Flickering (5+ days) | 0.9 | At risk of dimming — needs stabilization |
| Dark star (growing) | 0.8 | Active threat to vision alignment |
| Bright star (declining) | 0.7 | Protect gains before they fade |
| Dim-steady | 0.5 | Ready for growth, not urgent |
| Bright star (stable) | 0.2 | Maintenance only |

**User Capacity Factors:**
| Factor | How Measured |
|--------|--------------|
| Recent experiment completion rate | Last 7 days |
| Current stress signals | From check-ins, sentiment markers |
| Day of week patterns | Historical success rates |
| Time of day | Optimal windows from data |

**Success Probability:**
Based on past similar experiments. A user who has completed 0/5 morning exercises shouldn't be offered another morning exercise — offer an evening variant.

#### Star-Type-Specific Experiments

**Bright Stars (maintenance + expansion)**
> "Your Purpose star is bright and stable. Here's a stretch experiment: share one creative idea publicly this week. Not to build an audience — to see what it feels like to be visible."

Focus: Consolidate, expand, prevent complacency.

**Dim-Steady Stars (growth)**
> "Your Relationships star has been steady for three weeks. It's ready for attention. Experiment: ask someone you trust one real question about yourself. See what they reflect back."

Focus: Move from maintenance to growth.

**Flickering Stars (stabilization)**
> "Your Health star is flickering. It wants to become stable but hasn't found footing. Tiny experiment: After your morning coffee, stand up and stretch your arms overhead. Ten seconds. That's it."

Focus: Find the anchor behavior, not the ambitious goal.

**Dark Stars (confrontation or acceptance)**
> "Your dark star in Self-Worth has been pulling at your constellation for a month. I'm not asking you to fix it. I'm asking: what is one thing you're avoiding looking at? Name it. That's the experiment."

Focus: Awareness before action. Dark stars often need to be witnessed, not attacked.

#### Difficulty Calibration

| Level | Description | When Used |
|-------|-------------|-----------|
| **Tiny** | <30 seconds, trivially easy | Flickering stars, low capacity, building momentum |
| **Small** | 2-5 minutes, easy | Dim-steady stars, moderate capacity |
| **Medium** | 15-30 minutes, requires some effort | Bright stars (expansion), high capacity |
| **Stretch** | Pushes comfort zone, not time-intensive | Strong constellation, user requested challenge |

TARS defaults to **tiny or small**. Users can request stretch experiments:

> **User:** "I want something harder."
> **TARS:** "I hear you. But I've noticed your stretch experiments succeed 40% of the time, while tiny experiments succeed 85%. What would be useful — proving you can do hard things, or actually shifting the star? I'll follow your lead."

#### Constraint Awareness

TARS tracks user constraints (explicitly stated or observed):

| Constraint Type | Examples | How TARS Adapts |
|----------------|----------|-----------------|
| Time | "I only have mornings free" | Schedules experiments before noon |
| Energy | "I'm drained after work" | No evening experiments require willpower |
| Social | "I live alone" | No experiments requiring another person |
| Physical | "I can't run" | Movement experiments don't require running |
| Values | "I won't track my phone" | No screen time experiments |

> **TARS:** "I know you said evenings are hard. This experiment is for tomorrow morning, after you make coffee. Nothing evening-based until you tell me otherwise."

---

## 2. Implementation Intentions

### The Format

Every experiment follows the research-backed structure:

```
WHEN [specific trigger], I WILL [specific behavior], AT [location].
```

This is the "if-then" format from Gollwitzer's research (d = 0.65 effect size).

### How TARS Helps Craft Them

TARS doesn't just suggest an experiment — TARS helps build the implementation intention through dialogue.

**Step 1: Identify the anchor**
> **TARS:** "What's something you do every day without thinking? Coffee, shower, checking your phone — something reliable."
> **User:** "I make coffee every morning."
> **TARS:** "Good. That's your anchor. The new behavior attaches to the old one."

**Step 2: Make it tiny**
> **TARS:** "Now, what's the smallest possible version of 'exercise' you can imagine? Not what you should do — what you could actually do immediately after coffee, even on your worst day."
> **User:** "Stretch for a minute?"
> **TARS:** "Smaller. What if coffee finishes brewing and you just stand up? That's it. You're already done. The stretch is a bonus."

**Step 3: Lock the location**
> **TARS:** "Where does the coffee maker live?"
> **User:** "Kitchen."
> **TARS:** "Good. Here's your implementation intention: 'When I finish making morning coffee, I will stand up from wherever I'm sitting, in my kitchen.' That's the experiment. Will you try it tomorrow?"

### Implementation Intention Templates

**Health experiments:**
- "When [I finish brushing my teeth], I will [do 5 squats], at [the bathroom]."
- "When [I sit down for lunch], I will [take 3 deep breaths first], at [wherever I eat]."
- "When [I feel stressed], I will [notice where I'm holding tension], at [wherever I am]."

**Relationship experiments:**
- "When [my partner asks about my day], I will [share one real thing], at [home]."
- "When [I see my friend's name on my phone], I will [send a genuine message instead of scrolling past], at [wherever I am]."
- "When [someone frustrates me], I will [pause for 3 seconds before responding], at [wherever I am]."

**Purpose experiments:**
- "When [I open my laptop to work], I will [write one sentence of my project first], at [my desk]."
- "When [I finish my morning routine], I will [spend 5 minutes on what matters before email], at [home]."
- "When [I feel the urge to procrastinate], I will [do the smallest possible piece of the task], at [wherever I'm working]."

### Tracking Implementation Intentions

Each implementation intention becomes a commitment node in the context graph:

```typescript
interface Commitment {
  id: string;
  user_id: string;
  trigger: string;         // "When I finish making coffee"
  behavior: string;        // "I will stand up"
  location: string;        // "in my kitchen"
  star_id: string;         // Which star this relates to
  created_at: DateTime;
  expires_at: DateTime;    // Usually 24 hours
  status: 'pending' | 'completed' | 'skipped' | 'modified';
  completion_note?: string; // User's reflection
}
```

---

## 3. Star Response System

### What Triggers Brightness Changes

Stars are not static. They respond to behavior through a defined system.

#### Brightening Triggers

| Trigger | Brightness Change | Explanation |
|---------|-------------------|-------------|
| Completed experiment (aligned) | +0.1 | Action directly feeds the star |
| Completed experiment (small) | +0.05 | Tiny moves accumulate |
| Consistent completion (3+ days) | +0.15 bonus | Momentum matters |
| User insight about star | +0.08 | Awareness feeds brightness |
| Connection formed to another star | +0.05 | Integration strengthens |

#### Dimming Triggers

| Trigger | Brightness Change | Explanation |
|---------|-------------------|-------------|
| Skipped experiment (once) | -0.02 | Grace period — minimal impact |
| Skipped experiment (3+ times) | -0.08 | Pattern of avoidance |
| Inaction for 7 days | -0.05/day | Decay begins |
| Contradiction detected (say vs do) | -0.1 | Delta hurts brightness |
| Dark star feeding | varies | Dark stars pull energy from others |

#### Decay Rates for Inaction

Different star types decay at different rates (from context-graph-spec.md):

| Star Type | Half-Life (days) | Rationale |
|-----------|------------------|-----------|
| Behavioral (habits) | 7 | Habits fade fast without reinforcement |
| Relational | 14 | Relationships have more inertia |
| Identity/values | 90 | Core beliefs change slowly |
| Purpose | 30 | Vision needs regular engagement |

A flickering star in Health (behavioral) will dim to dark in ~3 weeks of inaction.
A bright star in Purpose (identity-adjacent) will dim to flickering over ~3 months.

### New Star Emergence

New stars emerge from:

1. **Consistent novel behavior (3+ instances)**
   > "You've mentioned 'writing' in three separate conversations, and you completed two writing experiments. A new star is forming. It's still faint — do you want to name it?"

2. **Explicit user articulation**
   > **User:** "I realized I really care about learning languages."
   > **TARS:** "That's new. You haven't mentioned this before. A star is appearing in your constellation. Where does it feel like it belongs — Purpose? Something else?"

3. **TARS pattern recognition**
   > "I've noticed something. Every time you talk about your childhood, your tone shifts. There's something there — a star that wants to be seen but hasn't been named. Want to explore it?"

### Connection Formation Between Stars

Connections form when behaviors link multiple stars:

**Explicit linking:**
> "This morning routine experiment affects both your Health star and your Purpose star. When you complete it, both brighten slightly. They're becoming connected."

**Emergent linking:**
> "I notice that when your Relationships star dims, your Purpose star also dims — even though the experiments are different. There's a connection forming. What do you think links them?"

**Connection strength:** Based on co-occurrence frequency and user confirmation.

---

## 4. Failure Handling

### When Experiments Aren't Done

TARS doesn't shame. TARS gets curious.

**First skip:**
> "The stretch experiment didn't happen yesterday. That's data. What got in the way?"

Options presented:
- "I forgot" → TARS: "Your trigger might need to be stronger. What if we texted you when you usually make coffee?"
- "I didn't want to" → TARS: "That's honest. What felt off about it? Was it the wrong experiment, or the wrong time?"
- "Life happened" → TARS: "Understood. Life does that. Same experiment tomorrow, or should we adjust?"

**Second skip:**
> "Two days now. The star is still flickering. No judgment — but it won't stabilize on its own. What's true about why this isn't working?"

**Third skip:**
> "Three skips. Let's pause this experiment. It's not the right one right now. Here's what I'm noticing: [pattern]. What do you think the real blocker is?"

### Repeated Failure — Pivot Strategy

When a category of experiments consistently fails:

1. **Identify the pattern**
   > "You've tried 5 Health experiments this month. All evening-based. All skipped. The pattern isn't 'you don't care about health.' The pattern is 'evenings don't work for you.'"

2. **Pivot the approach**
   > "What if we tried Health from a completely different angle? Not exercise, not evening. What about a tiny morning thing — just noticing how your body feels when you wake up. Five seconds of attention. Would you try that?"

3. **Reduce difficulty further**
   > "The smallest experiments are still not landing. Let's go smaller. Tomorrow's experiment: when you wake up, just notice that you're breathing. That's it. Don't change anything. Just notice."

4. **Question the star**
   > "We've tried many angles on Health, and nothing sticks. I'm curious: is Health actually important to you right now? It's okay if it's not. Not all stars need to be bright. What would happen if we focused elsewhere?"

### Avoiding the Shame Spiral

TARS never says:
- "You failed again"
- "You need to be more disciplined"
- "What's wrong with you?"
- "You committed and didn't follow through"

TARS always says:
- "That's data"
- "What do you notice about that?"
- "What got in the way?"
- "Is this the right experiment, or do we need a different approach?"

**The principle:** Shame leads to avoidance. Curiosity leads to insight. TARS models curiosity.

### Sabbatical Mode

Life disruptions are real. TARS recognizes them.

**Trigger:** User hasn't engaged for 7+ days, or user explicitly says "life is hard right now."

> **TARS:** "I notice you've been away. Life gets complicated. Your constellation is here, unchanged, whenever you're ready.
>
> If you want, I can enter 'low gravity' mode — no experiments, no check-ins, just your constellation waiting. Or if you want one tiny anchor to hold onto while life is chaotic, I can offer that too.
>
> What would be useful?"

**Low gravity mode:**
- No proactive experiments
- Constellation visible but not pushing
- Weekly gentle check-in: "Still here. How are you?"
- Exit when user re-engages

**One anchor mode:**
- One ultra-tiny daily practice (e.g., "notice one thing you're grateful for")
- No progress pressure
- Maintains connection without demands

---

## 5. Decision Support

### The Job: "Help me make a major life decision"

From CHALLENGES.md, this is a missing JTBD. The Walk addresses it.

### How Constellation Informs Decisions

When a user faces a major decision (career change, relationship choice, move, etc.), TARS doesn't prescribe. TARS uses the constellation to illuminate.

**Step 1: Name the decision**
> **User:** "I'm thinking about quitting my job."
> **TARS:** "That's a significant choice. Let's look at what your constellation says about it — not to give you the answer, but to show you what you already know."

**Step 2: Map the decision to stars**
> "Looking at your sky:
>
> Your Purpose star is dim and has been for months. You've mentioned 'meaning' twelve times — all with frustration.
>
> Your Wealth star is bright. You've mentioned 'security' often, with gratitude.
>
> Your Health star is flickering. You've connected it to 'stress from work' three times.
>
> What do you notice about this picture?"

**Step 3: Explore scenarios using stars**
> "Let's imagine two futures:
>
> **Stay scenario:** Your Wealth star likely stays bright. But what happens to Purpose? Health? Based on patterns, I'd expect Purpose to dim further. Health will likely decline if stress continues.
>
> **Leave scenario:** Wealth becomes uncertain — maybe flickering. But what happens to Purpose if you're doing something aligned? Health if stress decreases?
>
> I'm not saying which is right. I'm asking: which constellation do you want to live in?"

**Step 4: Surface the dark stars**
> "There's something else. You have a dark star related to 'fear of judgment.' It's been pulling at your decisions since Day 4. When you think about staying at your job, is that star involved? When you think about leaving?"

### TARS Questioning Framework for Decisions

| Question Type | Example |
|---------------|---------|
| **Constellation mapping** | "Which stars are affected by this decision?" |
| **Pattern surfacing** | "You've made similar choices before. What happened?" |
| **Dark star illumination** | "What fear is influencing this?" |
| **Value alignment** | "Which choice aligns with who you said you want to become?" |
| **Future casting** | "In 6 months, which version of your constellation do you want to see?" |

### Not Prescriptive — Illuminating

TARS never says: "You should quit" or "You should stay."

TARS says:
- "Here's what your constellation shows."
- "Here's the pattern I see."
- "What do you notice when you look at this?"
- "The decision is yours. I'm showing you what you've already told me."

---

## 6. Weekly Rhythm

### Daily: The Check-In

**Morning (optional push notification):**
> "Good morning. Today's experiment: [implementation intention].
> It connects to your [star name] star.
> Ready?"

**Evening (required for constellation update):**
> "Did the experiment happen?"
> - Yes → "What did you notice?"
> - No, something came up → "What got in the way?"
> - No, I didn't want to → "What felt off about it?"

The evening check-in is 2-3 taps + optional reflection. <30 seconds unless user wants to elaborate.

### Weekly: Constellation Review

Every 7 days, TARS offers a review.

**The weekly summary:**
> "This week in your constellation:
>
> **Experiments:** 5 offered, 4 completed
> **Star movement:**
> - Health: Flickering → Dim-steady (progress!)
> - Purpose: Bright → Bright (stable)
> - Relationships: Dim → Still dim (we haven't touched it)
>
> **Pattern I noticed:** Your experiments succeed when they're morning-based. All evening experiments were skipped.
>
> **Looking ahead:** Your Relationships star hasn't moved in three weeks. Want to explore that this week, or focus elsewhere?"

**User choice:** What to focus on next week. Autonomy preserved.

### Monthly: Phase Assessment

Every 30 days, TARS checks constellation phase.

**The phase check:**
> "Monthly check-in.
>
> Your constellation phase: CONNECTING
> - 8 stars total
> - 12 connections between them
> - 2 dark stars (down from 3)
> - Progress toward EMERGING: 65%
>
> **What's working:** Your daily morning experiments are building real momentum.
> **What's stuck:** The dark star in Self-Worth hasn't been touched since Day 3.
>
> This month, do you want to:
> - Keep building on what's working
> - Turn toward what's stuck
> - Something else entirely"

### Quarterly: Deep Reflection

Every 90 days, the Birth Chart comparison.

**The quarterly review:**
> "It's been three months since we started.
>
> Here's your Birth Chart from Day 7:
> [Original constellation visualization]
>
> Here's your constellation now:
> [Current constellation visualization]
>
> **What changed:**
> - 3 new stars emerged
> - 1 dark star dissolved (the one in Control)
> - Your brightest star shifted from Work to Purpose
> - 8 new connections formed
>
> **What stayed the same:**
> - The dark star in Self-Worth is still there
> - Your Health star is still struggling to stabilize
>
> Looking at these two skies side by side — what do you see?"

This is a moment for the user to witness their own change. Not TARS analyzing — the user recognizing their own evolution.

---

## Summary: The Walk Is Now Real

| Gap (from CHALLENGES.md) | How This Document Addresses It |
|--------------------------|--------------------------------|
| "How experiments are generated" | Section 1: Algorithm, star-type matching, difficulty calibration, constraint awareness |
| "Implementation intention format" | Section 2: When/Will/At format, TARS-guided crafting, templates |
| "How stars respond to behavior" | Section 3: Brightening/dimming triggers, decay rates, emergence, connections |
| "What happens when experiments fail" | Section 4: Curiosity not shame, pivot strategy, sabbatical mode |
| "Decision support framework" | Section 5: Constellation mapping, scenario exploration, TARS questioning |
| "What is the Walk?" | Section 6: Daily/weekly/monthly/quarterly rhythm |

---

## Research Foundation

This design is grounded in:

| Principle | Source | How Applied |
|-----------|--------|-------------|
| Implementation intentions | Gollwitzer (d=0.65) | When/Will/At format for all experiments |
| Tiny Habits | Fogg Behavior Model | Default to tiny, celebrate immediately |
| Self-Determination Theory | Deci & Ryan | Autonomy in experiment choice, competence from completion, relatedness from TARS |
| Transtheoretical Model | Prochaska | Star states map to readiness stages |
| Failure normalization | Lally et al. | Missing once doesn't reset progress |
| Identity-based change | James Clear | Stars represent identity, not just behavior |

---

*"The Walk isn't about hitting metrics. It's about watching your stars shift, one small move at a time."*

— Evolved from 02-the-walk.md, now with concrete mechanics.
