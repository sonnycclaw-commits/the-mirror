# Experiment Selection - NERVES

**System:** experiment-selection
**Lens:** NERVES (3/7)
**Created:** 2026-01-15
**Status:** Draft
**Depends on:** 02-blood.md

---

## Overview

This document provides research justifications for every constant and formula in the experiment selection system. Where we have strong empirical backing, we cite it. Where we're speculating, we flag it clearly. Intellectual honesty about our foundations enables better iteration.

---

## Research Foundation

### Behavioral Science Principles

| Principle | Source | How Applied |
|-----------|--------|-------------|
| Flow Theory | Csikszentmihalyi (1975, 1990) | Challenge-skill balance drives difficulty selection |
| Fogg Behavior Model | BJ Fogg (2009) | B=MAP formula underlies capacity calculation |
| Self-Determination Theory | Ryan & Deci (2000) | Autonomy/competence/relatedness shape priority weights |
| Temporal Motivation Theory | Steel & Konig (2006) | Time-based urgency modifiers |
| Ego Depletion / Resource Model | Baumeister et al. (1998) | Stress penalty is subtractive |
| Prospect Theory / Loss Aversion | Kahneman & Tversky (1979) | Why urgency weights higher than success |
| Implementation Intentions | Gollwitzer (1999) | Why timing matters (d=0.65 effect size) |
| Yerkes-Dodson Law | Yerkes & Dodson (1908) | Inverted-U for difficulty modifiers |
| Hyperbolic Discounting | Laibson (1997), Frederick et al. (2002) | Time constants for expiry windows |
| Goal Gradient Effect | Hull (1932), Kivetz et al. (2006) | Progress tracking, streak mechanics |

### Game Design Precedent

| Pattern | Source | How Applied |
|---------|--------|-------------|
| Streak mechanics | Duolingo (7-day threshold, streak freeze) | Grace periods, skip forgiveness |
| Dynamic Difficulty Adjustment | Resident Evil 4, Flow theory games | Star state -> difficulty mapping |
| Task dependencies | Project management, Habitica "Block Task" | BLOCKS as hard filter |
| Concurrent task limits | Habitica dailies, WoW quest log | MAX_ACTIVE = 3 |
| XP/reward curves | Duolingo, Habitica | Brightness gain scaling |
| Loss aversion in streaks | Duolingo retention research | Skip penalty escalation |

---

## Constant Justifications

### 1. Priority Weights (0.40 / 0.35 / 0.25)

**Values:**
- Urgency (w_u) = 0.40
- Capacity (w_c) = 0.35
- Success (w_s) = 0.25

**Source:** Design choice informed by behavioral economics

**Rationale:**

**Urgency highest (0.40):** This aligns with Temporal Motivation Theory's finding that motivation increases hyperbolically as deadlines approach ([Steel & Konig, 2006](https://en.wikipedia.org/wiki/Temporal_motivation_theory)). By weighting urgency highest, we ensure the system prioritizes stars that genuinely need attention now, not those with good historical success rates but no current need. This also leverages loss aversion from [Prospect Theory](https://en.wikipedia.org/wiki/Prospect_theory) - users are more motivated to prevent a star from dimming (avoiding loss) than to brighten an already-bright star (seeking gain). Kahneman & Tversky found losses are psychologically ~2x more powerful than equivalent gains.

**Capacity second (0.35):** The [Fogg Behavior Model](https://www.behaviormodel.org/) (B=MAP) shows that behavior only occurs when Motivation, Ability, and Prompt converge. Ability (capacity) is often the binding constraint - a highly motivated user who lacks time or energy won't complete the experiment regardless of urgency. Research on [cognitive load and decision-making](https://www.sciencedirect.com/science/article/pii/S0014292115000690) shows that performance degrades significantly under resource constraints. Weighting capacity at 0.35 (above success probability) ensures we don't offer experiments users can't actually complete.

**Success lowest (0.25):** Historical success rate is a lagging indicator. While valuable, over-weighting it would create a "rich get richer" dynamic where users only attempt experiments they've already succeeded at. This would violate the exploration-exploitation balance needed for growth. [Self-Determination Theory](https://selfdeterminationtheory.org/theory/) emphasizes that competence needs to be stretched (not just confirmed) for intrinsic motivation.

**Confidence:** Medium - The relative ordering is well-supported; the exact ratios are design choices. 

**Validation Method:** A/B test alternative weightings (e.g., 0.35/0.35/0.30) and measure completion rates, user satisfaction, and star health over 30 days.

---

### 2. Base Urgency by Star State

| Star State | Base Urgency | Justification |
|------------|--------------|---------------|
| FLICKERING | 0.90 | Highest - unstable, at risk |
| DARK (growing) | 0.85 | Active threat escalating |
| DARK (stable) | 0.75 | Persistent but not worsening |
| DIM (declining) | 0.70 | Slipping toward dark |
| BRIGHT (declining) | 0.65 | Protect gains |
| DIM (stable) | 0.50 | Growth ready, no crisis |
| BRIGHT (stable) | 0.20 | Maintenance only |
| DORMANT | 0.10 | User disengaged |

**Source:** Design choice informed by behavior change models

**Rationale:**

The urgency gradient maps to the [Transtheoretical Model's](https://en.wikipedia.org/wiki/Transtheoretical_model) stages of change. FLICKERING represents the critical "action-to-maintenance" boundary where relapse risk is highest. Research on habit formation shows that a week of inactivity causes significant regression ([Lally et al., 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC3505409/)).

The 0.90 ceiling for FLICKERING (not 1.0) leaves room for connection modifiers to push priority to maximum when multiple signals align.

BRIGHT (stable) at 0.20 reflects diminishing returns - [Self-Determination Theory](https://selfdeterminationtheory.org/theory/) shows that once competence is established, excessive reinforcement can feel controlling and undermine intrinsic motivation. We maintain non-zero urgency for maintenance experiments.

DORMANT at 0.10 respects user autonomy. If a user has disengaged from a star, pushing experiments feels paternalistic. The low (not zero) value allows the system to occasionally surface dormant stars for re-engagement without nagging.

**Confidence:** Medium - The ordering is strongly supported by behavior change literature. The specific values (0.90, 0.85, etc.) are interpolations.

**Gap:** We lack data on optimal spacing between urgency levels. Should the gap between FLICKERING (0.90) and DARK-growing (0.85) be larger?

**Validation Method:** Track which urgency levels lead to experiment acceptance vs. skip. If users consistently skip FLICKERING experiments, urgency may be triggering anxiety rather than motivation.

---

### 3. User Capacity Model - Stress Penalty as Subtractive

**Formula:**
```
CAPACITY = (E * 0.30) + (T * 0.25) + (H * 0.20) + (L * 0.25) - stress_penalty
```

**Source:** Baumeister's [Ego Depletion / Strength Model of Self-Control](https://en.wikipedia.org/wiki/Ego_depletion)

**Rationale:**

The stress penalty is *subtractive* rather than multiplicative because [ego depletion research](https://faculty.washington.edu/jdb/345/345%20Articles/Baumeister%20et%20al.%20(1998).pdf) shows that stress creates a *floor effect* on self-regulatory capacity. Under the strength model, self-control draws from a limited resource that can be exhausted. Stress doesn't proportionally reduce all capacity components - it creates an absolute reduction in available willpower.

From Baumeister et al. (1998): "The exertion of self-control appears to depend on a limited resource. Just as a muscle gets tired from exertion, acts of self-control cause short-term impairments in subsequent self-control."

[NASA research on stress and cognition](https://human-factors.arc.nasa.gov/flightcognition/Publications/IH_054_Staal.pdf) confirms that stress causes cognitive interference - "irrelevant thoughts overload the cognitive mechanism, thus reducing cognitive capacity" (Resource Allocation Theory, Ellis & Ashbrook 1988).

A multiplicative model would allow high energy/time scores to compensate for high stress. The subtractive model enforces that crisis-level stress (penalty = 0.35) creates a hard cap regardless of other factors.

**Stress Penalty Values:**
| Stress Level | Penalty | Rationale |
|--------------|---------|-----------|
| LOW | 0.00 | No depletion |
| MEDIUM | 0.05 | Minor interference |
| HIGH | 0.15 | Significant resource drain |
| CRISIS | 0.35 | Near-floor capacity |

The CRISIS penalty of 0.35 ensures that even perfect scores on other dimensions (E=1.0, T=1.0, H=1.0, L=1.0) yield capacity of only ~0.65, preventing complex experiments during crises.

**Confidence:** High - The subtractive approach is well-grounded in ego depletion literature. The specific penalty magnitudes are calibrated design choices.

**Validation Method:** Compare completion rates at each stress level. If users in HIGH stress complete experiments at rates matching MEDIUM stress users, we're over-penalizing.

---

### 4. Success Probability - Difficulty Modifiers

| Difficulty | Modifier | Rationale |
|------------|----------|-----------|
| TINY | 1.10 | Trivial - slight boost |
| SMALL | 1.00 | Baseline |
| MEDIUM | 0.85 | Requires sustained effort |
| STRETCH | 0.60 | Significant challenge |

**Source:** [Yerkes-Dodson Law](https://en.wikipedia.org/wiki/Yerkes–Dodson_law) + [Flow Theory](https://en.wikipedia.org/wiki/Flow_(psychology))

**Rationale:**

The [Yerkes-Dodson Law](https://www.simplypsychology.org/what-is-the-yerkes-dodson-law.html) (1908) established that performance follows an inverted-U relationship with arousal/difficulty. Simple tasks benefit from higher arousal; complex tasks require lower arousal for optimal performance.

From the research: "For simple or well-learned tasks, the relationship is monotonic, and performance improves as arousal increases. For complex, unfamiliar, or difficult tasks, the relationship between arousal and performance reverses after a point."

[Flow Theory](https://positivepsychology.com/mihaly-csikszentmihalyi-father-of-flow/) (Csikszentmihalyi) adds that the optimal challenge-skill ratio is approximately 1:1 - challenges slightly exceeding skills produce flow, while challenges far exceeding skills produce anxiety.

The 0.60 modifier for STRETCH acknowledges this anxiety zone. A 40% reduction in success probability (from baseline 1.00) reflects the real-world observation that stretch goals have substantially lower completion rates.

**Why not steeper drop-off?** [Dynamic Difficulty Adjustment](https://en.wikipedia.org/wiki/Dynamic_game_difficulty_balancing) research in games shows that too-harsh penalties for difficulty create learned helplessness. A 0.60 modifier still leaves STRETCH experiments achievable (~42% success for a user with 0.70 base probability), maintaining the [Goal Gradient Effect's](https://lawsofux.com/goal-gradient-effect/) motivational pull.

**Confidence:** High for direction, Medium for magnitudes.

**Validation Method:** Track completion rates by difficulty level. If STRETCH completion is <30%, we may need to either raise the modifier or improve difficulty selection algorithm.

---

### 5. Connection Effects - BLOCKS as Hard Filter vs. TENSION as Soft Penalty

**Current Design:**
- BLOCKS: Hard filter (blocked experiments excluded from selection)
- TENSION: Soft penalty (-0.20 to priority score)

**Source:** Project management best practices + game design patterns

**Rationale:**

**BLOCKS as Hard Filter:** In [project management](https://monday.com/blog/project-management/task-dependencies/), blocking dependencies are recognized as absolute constraints: "A prerequisite refers to something that must happen before something else can occur, creating a dependent relationship." The [critical path method](https://asana.com/resources/project-dependencies) treats blockers as schedule constraints, not preferences.

Game design reinforces this. In Habitica's ["Block Task" feature](https://www.amplenote.com/help/task_dependencies_block_task_implement_goal_task_mirror_or_connect_task): "By creating a 'Block Task' link, you can automatically remove tasks from your to-do list until their prerequisites are complete."

A soft penalty for BLOCKS would allow the system to offer impossible experiments (e.g., "practice confidence in meetings" while "address social anxiety" remains dark/blocking). This violates user trust and creates frustration.

**TENSION as Soft Penalty:** TENSION connections represent trade-offs, not impossibilities. Two stars in tension (e.g., "career ambition" and "family time") can both receive attention - just not simultaneously. The -0.20 penalty discourages but doesn't prevent concurrent experiments on tension-connected stars.

This mirrors game design patterns where competing objectives are discouraged but allowed. In RPG class systems, a character *can* invest in conflicting skill trees - it's just suboptimal.

**Confidence:** High - The categorical distinction between hard blockers and soft tensions is well-established in both project management and game design.

**Validation Method:** Track user satisfaction when experiments are offered for stars in TENSION with active experiments. If satisfaction is low, consider increasing penalty or making TENSION a hard filter.

---

### 6. Time Constants

| Constant | Value | Justification |
|----------|-------|---------------|
| OFFER_EXPIRY | 24 hours | Hyperbolic discounting, decision fatigue |
| QUEUE_EXPIRY | 7 days | Habit formation window |
| BLACKLIST_DURATION | 30 days | Learning/forgetting cycles |
| GRACE_PERIOD | 12 hours | Duolingo-style streak freeze |

**Source:** [Hyperbolic Discounting](https://en.wikipedia.org/wiki/Hyperbolic_discounting), [Habit Formation Research](https://pmc.ncbi.nlm.nih.gov/articles/PMC11641623/), [Duolingo Mechanics](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)

**Rationale:**

**24-hour offer expiry:** [Hyperbolic discounting](https://thedecisionlab.com/biases/hyperbolic-discounting) research shows that "the most important consequence of hyperbolic discounting is that it creates temporary preferences for small rewards that occur sooner over larger, later ones." A 24-hour window creates artificial urgency without being oppressive. 

From [Temporal Motivation Theory](https://en.wikipedia.org/wiki/Temporal_motivation_theory): motivation increases hyperbolically as deadlines approach. A 24-hour expiry ensures users feel the "approaching deadline" effect daily rather than letting experiments languish.

This also serves as a [commitment device](https://www.behavioraleconomics.com/resources/mini-encyclopedia-of-be/time-temporal-discounting/) - accepting an experiment within 24 hours signals genuine intention rather than vague aspiration.

**7-day queue expiry:** [Habit formation research](https://pmc.ncbi.nlm.nih.gov/articles/PMC3505409/) from Lally et al. (2010) found that "missing one opportunity to perform a behavior did not materially affect the habit formation process, but missing a week showed significant regression." A queued experiment not started within 7 days represents a failed intention-action gap.

[Duolingo's streak mechanics](https://blog.duolingo.com/how-duolingo-streak-builds-habit/) validate the 7-day threshold: "Duolingo users who maintain a streak for 7 days are 3.6x more likely to stay engaged long-term."

**30-day blacklist:** Learning research suggests that 30 days provides sufficient time for [spacing effect](https://en.wikipedia.org/wiki/Spacing_effect) benefits - if a template was declined 3 times, re-offering it after 30 days tests whether circumstances have changed.

**12-hour grace period:** [Duolingo's "Streak Freeze"](https://medium.com/@salamprem49/duolingo-streak-system-detailed-breakdown-design-flow-886f591c953f) research found that "the introduction of the 'Streak Freeze' feature reduced churn by 21% for users at risk of breaking their streak." The University of Pennsylvania/UCLA study cited by Duolingo demonstrates that "offering people a little 'slack' as they pursue their goals can actually be more motivating than having a rigid set of rules."

**Confidence:** High for 24-hour and 7-day values (well-supported by research). Medium for 30-day blacklist (design choice). High for grace period concept (Duolingo validated).

**Validation Method:** 
- Track what percentage of offers expire vs. are accepted. If >50% expire, consider extending to 36 or 48 hours.
- Track queue->start conversion. If most queued experiments expire at day 7, the queue may be serving as a procrastination buffer rather than intention signal.

---

### 7. MAX_ACTIVE = 3 (Maximum Active Experiments)

**Value:** 3 concurrent active experiments

**Source:** [Miller's Law](https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two), [Cowan's Revision](https://pmc.ncbi.nlm.nih.gov/articles/PMC4486516/), [Habitica Design](https://habitica.fandom.com/wiki/Gamifying_Your_Lists)

**Rationale:**

**Cognitive Limits Research:** While Miller's original "7 ± 2" is widely cited, [modern revisions](https://lawsofux.com/millers-law/) by Nelson Cowan suggest the true working memory capacity is closer to 3-4 chunks. From the research: "Cowan has proposed that working memory has a capacity of about four chunks in young adults."

Experiments aren't passive memory items - they're active commitments requiring attention and effort. [Kahneman's capacity model](https://www.sciencedirect.com/topics/psychology/capacity-model) suggests that "there is a limited pool of mental resources that can be divided across tasks."

**Game Design Precedent:** [Habitica's task categories](https://trophy.so/blog/habitica-gamification-case-study) (Habits, Dailies, To-Dos) create natural limits on concurrent commitments. Most quest-based games limit active quests (e.g., WoW's quest log limits, Destiny 2's bounty slots).

**Why 3, not 4?** We chose the lower bound of the 3-4 range because:
1. Experiments have variable durations (unlike simple memory tasks)
2. Users have real-life cognitive loads beyond the app
3. [Self-Determination Theory](https://selfdeterminationtheory.org/theory/) suggests that fewer, meaningful commitments better support autonomy than many diffuse ones

**Alternative Designs Considered:**
- 1 active: Too restrictive; users with available capacity feel limited
- 5 active: Exceeds cognitive limits; likely to increase skip/fail rates
- Adaptive (1-5): Added complexity without clear benefit

**Confidence:** High - The 3-4 range is well-established; choosing 3 is a conservative design choice.

**Validation Method:** Track correlation between active_count and completion rates. If users with 3 active experiments have similar completion rates to users with 2, consider increasing to 4.

---

### 8. Difficulty Time Estimates

| Difficulty | Minutes | Justification |
|------------|---------|---------------|
| TINY | 0.5 | 30-second micro-actions |
| SMALL | 5 | BJ Fogg "Tiny Habits" scale |
| MEDIUM | 20 | Pomodoro half-session |
| STRETCH | 45 | Full focus session |

**Source:** [Tiny Habits](https://www.behaviormodel.org/) (BJ Fogg), Pomodoro Technique, attention research

**Rationale:**

**TINY (30 seconds):** BJ Fogg's [Tiny Habits](https://www.growthengineering.co.uk/fogg-behavior-model/) method emphasizes that habit formation begins with behaviors that take less than 30 seconds. "When motivation is low, behavior must be tiny" - a 30-second experiment can be completed even under stress.

**SMALL (5 minutes):** This aligns with Fogg's "Starter Step" concept - behaviors small enough to complete without relying on motivation, yet substantial enough to feel meaningful. Five minutes is also the minimum unit of most calendar apps.

**MEDIUM (20 minutes):** Half a Pomodoro session. Research on [attention and flow](https://pmc.ncbi.nlm.nih.gov/articles/PMC5973526/) suggests that meaningful engagement requires sustained attention of at least 15-25 minutes. Twenty minutes is achievable within typical schedule gaps (lunch break, commute).

**STRETCH (45 minutes):** A full Pomodoro or standard meeting slot. This represents a significant calendar commitment and requires intentional scheduling. [Flow research](https://www.flowcentre.org/9-dimensions-to-flow) suggests that complex, skill-building activities require 30-90 minutes to reach flow state.

**Confidence:** Medium - These are practical estimates based on productivity frameworks rather than rigorous empirical research.

**Gap:** Individual variation in time perception and execution speed. A "5-minute" experiment might take 15 minutes for some users.

**Validation Method:** Add optional "actual time" field to experiment completion reports. Compare estimated vs. actual across user population.

---

### 9. Trajectory Modifier Range (0.8 to 1.2)

**Values:**
- Rising significantly: 0.8 (reduce urgency)
- Rising slightly: 0.9
- Stable: 1.0
- Declining slightly: 1.1
- Declining significantly: 1.2 (boost urgency)

**Source:** Design choice informed by trend analysis and loss aversion

**Rationale:**

A ±20% modifier range ensures trajectory information influences but doesn't dominate urgency calculations. This follows the [Anchoring and Adjustment](https://en.wikipedia.org/wiki/Anchoring_and_adjustment) heuristic - base urgency is the anchor; trajectory provides adjustment.

[Loss aversion](https://www.nngroup.com/articles/prospect-theory/) (Kahneman & Tversky) justifies asymmetric attention to decline vs. improvement. However, we keep the modifier symmetric (0.8 to 1.2) to avoid over-indexing on negative trends, which could create anxiety spirals.

The 3-day lookback window for trajectory calculation aligns with [habit formation research](https://pmc.ncbi.nlm.nih.gov/articles/PMC11641623/) showing that shorter windows capture genuine momentum while filtering day-to-day noise.

**Confidence:** Low - The specific range is a design choice without direct empirical backing.

**Validation Method:** A/B test wider range (0.6-1.4) vs. narrower range (0.9-1.1). Measure whether adjustments improve star health outcomes.

---

### 10. Connection Bonus Magnitudes

| Connection Type | Magnitude | Justification |
|-----------------|-----------|---------------|
| GROWTH_EDGE | +0.15 to +0.25 | Prerequisite met - window of opportunity |
| RESONANCE | +0.05 to +0.15 | Spillover effects |
| TENSION | -0.20 | Competing priorities |
| CAUSATION | +0.10 | Address root cause |
| SHADOW_MIRROR | +0.10 base + 0.02/day | Periodic surfacing |
| BLOCKS | Hard filter | Prerequisite not met |

**Source:** Design choice informed by game design patterns

**Rationale:**

**GROWTH_EDGE (+0.15 to +0.25):** This is the largest bonus because it represents a genuine window of opportunity. When a prerequisite star is bright, conditions are optimal for the dependent star. Game design calls this "unlocking" - the bonus incentivizes capitalizing on unlocked content.

The [Goal Gradient Effect](https://learningloop.io/plays/psychology/goal-gradient-effect) (Hull, 1932; Kivetz et al., 2006) suggests that motivation increases as goals become achievable. A bright prerequisite star signals achievability.

**RESONANCE (+0.05 to +0.15):** Small bonus reflecting indirect benefits. [Research on transfer of learning](https://en.wikipedia.org/wiki/Transfer_of_learning) shows that related skills can enhance each other, but the effect is modest compared to direct practice.

**TENSION (-0.20):** The penalty is significant but not disqualifying. This mirrors game design where players can pursue competing objectives but at reduced efficiency (e.g., hybrid class builds in RPGs). The magnitude ensures tension-connected experiments rarely both appear in top selections without completely blocking the possibility.

**CAUSATION (+0.10):** A moderate bonus for addressing root causes. The [5 Whys](https://en.wikipedia.org/wiki/Five_whys) technique in problem-solving emphasizes cause identification, but root causes aren't always more actionable than symptoms.

**SHADOW_MIRROR (+0.10 base + 0.02/day):** The time-escalating bonus ensures dark stars surface periodically even when users avoid them. This aligns with [shadow work](https://en.wikipedia.org/wiki/Shadow_(psychology)) concepts in depth psychology - avoidance reinforces problematic patterns.

**Confidence:** Low - These magnitudes are design choices. The relative ordering (GROWTH_EDGE > others) is more defensible than the specific numbers.

**Validation Method:** Track which connection types most strongly predict experiment success. If RESONANCE bonuses correlate more with completion than GROWTH_EDGE, we may have the magnitudes inverted.

---

## Game Design Analogies

### How Successful Apps Handle Similar Problems

| Problem | Our Solution | Duolingo | Habitica |
|---------|--------------|----------|----------|
| **Task prioritization** | Urgency-weighted selection | Daily lesson queue | User-defined dailies |
| **Capacity awareness** | Stress penalty, difficulty matching | None (user controls pace) | HP damage for undone dailies |
| **Streak protection** | 12h grace period, 2 free skips | Streak Freeze (purchasable) | No streak system |
| **Concurrent limits** | MAX_ACTIVE = 3 | Unlimited lessons | Unlimited tasks (but HP limits effort) |
| **Difficulty progression** | Star state -> difficulty mapping | XP-based course progression | User-set difficulty per task |
| **Blocking dependencies** | Hard filter | Course prerequisites | Manual "Block Task" feature |

### Key Differences from Duolingo

Duolingo optimizes for daily engagement through streak mechanics ([users with 7-day streaks are 3.6x more likely to stay engaged](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)). Our system optimizes for behavior change outcomes - completion of meaningful experiments that move stars toward brightness.

Duolingo can afford infinite content (language lessons are abundant). We have finite, personalized experiments targeting specific stars. This justifies stricter selection criteria.

### Key Differences from Habitica

[Habitica](https://trophy.so/blog/habitica-gamification-case-study) uses RPG mechanics (HP damage, XP, gold) as extrinsic motivators. Our system aims for intrinsic motivation through [Self-Determination Theory](https://selfdeterminationtheory.org/theory/) alignment - experiments should feel meaningful, not just rewarding.

Habitica lets users define their own tasks and difficulty. Our system offers personalized suggestions based on star state and user context. This reduces decision fatigue but requires more sophisticated selection logic.

---

## Identified Gaps

| Constant | Current Value | Confidence | Gap Description | Validation Plan |
|----------|---------------|------------|-----------------|-----------------|
| Priority weights | 0.40/0.35/0.25 | Medium | No direct empirical support for this ratio | A/B test alternatives |
| Urgency values | 0.90 to 0.10 | Medium | Spacing between levels is arbitrary | Track skip rates by urgency |
| Stress penalties | 0.05/0.15/0.35 | Medium | Based on ego depletion but not calibrated | Compare completion rates at stress levels |
| Trajectory range | 0.8-1.2 | Low | Design choice, no empirical basis | Test wider/narrower ranges |
| Connection magnitudes | Various | Low | Relative ordering defensible, absolutes not | Correlation analysis with outcomes |
| SHADOW_MIRROR interval | 7 days | Low | Based on habit research but not shadow-specific | User interviews on dark star avoidance |
| GROWTH_EDGE threshold | 0.65 brightness | Low | What brightness truly indicates "ready"? | Track downstream star success after unlock |

---

## Validation Hooks

### Data to Collect

1. **Experiment acceptance rate** by priority score bucket (0-0.25, 0.25-0.50, 0.50-0.75, 0.75-1.0)
2. **Completion rate** by difficulty level and stress state
3. **Time to completion** vs. estimated time by difficulty
4. **Star brightness change** after experiment completion (immediate and 7-day)
5. **Skip patterns** - which stars/templates do users consistently avoid?
6. **Connection effect correlation** - do bonuses/penalties predict outcomes?

### Metrics for Constant Validation

| Constant | Metric | Target | Action if Miss |
|----------|--------|--------|----------------|
| Priority weights | Completion rate by weight contribution | >60% completion when urgency dominates | Reduce urgency weight |
| Difficulty modifiers | Completion rate by difficulty | Aligned with modifier values (e.g., 60% for STRETCH) | Adjust modifiers |
| Stress penalties | Completion delta at each stress level | Proportional to penalty | Recalibrate penalties |
| MAX_ACTIVE | Completion rate at 3 active | >50% | Reduce to 2 |
| Time constants | Acceptance before expiry | >70% accept before 24h | Extend window |

### User Research Questions

1. "When an experiment is offered, what makes you accept vs. skip?"
2. "How does the system's timing feel - too aggressive, too passive, or right?"
3. "When you skip experiments, is it capacity (can't) or motivation (won't)?"
4. "Do the suggested experiments feel relevant to what you're struggling with?"

---

## Key Citations

### Behavioral Science

1. **Baumeister, R. F., et al. (1998).** "Ego Depletion: Is the Active Self a Limited Resource?" *Journal of Personality and Social Psychology*, 74(5), 1252-1265. [PDF](https://faculty.washington.edu/jdb/345/345%20Articles/Baumeister%20et%20al.%20(1998).pdf)

2. **Csikszentmihalyi, M. (1990).** *Flow: The Psychology of Optimal Experience*. Harper & Row. [Wikipedia](https://en.wikipedia.org/wiki/Flow_(psychology))

3. **Fogg, B. J. (2009).** "A Behavior Model for Persuasive Design." *Persuasive Technology Lab, Stanford University*. [Website](https://www.behaviormodel.org/)

4. **Gollwitzer, P. M. (1999).** "Implementation Intentions: Strong Effects of Simple Plans." *American Psychologist*, 54(7), 493-503. [ResearchGate](https://www.researchgate.net/publication/232586066_Implementation_Intentions)

5. **Kahneman, D., & Tversky, A. (1979).** "Prospect Theory: An Analysis of Decision under Risk." *Econometrica*, 47(2), 263-291. [MIT PDF](https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Behavioral_Decision_Theory/Kahneman_Tversky_1979_Prospect_theory.pdf)

6. **Lally, P., et al. (2010).** "How are habits formed: Modelling habit formation in the real world." *European Journal of Social Psychology*, 40(6), 998-1009. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3505409/)

7. **Miller, G. A. (1956).** "The Magical Number Seven, Plus or Minus Two." *Psychological Review*, 63(2), 81-97. [Wikipedia](https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two)

8. **Ryan, R. M., & Deci, E. L. (2000).** "Self-Determination Theory and the Facilitation of Intrinsic Motivation, Social Development, and Well-Being." *American Psychologist*, 55(1), 68-78. [PDF](https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf)

9. **Steel, P., & Konig, C. J. (2006).** "Integrating Theories of Motivation." *Academy of Management Review*, 31(4), 889-913. [Wikipedia](https://en.wikipedia.org/wiki/Temporal_motivation_theory)

10. **Yerkes, R. M., & Dodson, J. D. (1908).** "The Relation of Strength of Stimulus to Rapidity of Habit-Formation." *Journal of Comparative Neurology and Psychology*, 18(5), 459-482. [Wikipedia](https://en.wikipedia.org/wiki/Yerkes–Dodson_law)

### Game Design & Industry

11. **Duolingo Research.** "How Duolingo's Streak Uses Habit Research to Keep You Motivated." [Blog](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)

12. **Habitica.** Gamification Strategy Case Study. [Trophy](https://trophy.so/blog/habitica-gamification-case-study)

13. **Dynamic Difficulty Adjustment in Games.** (2018). *Advances in Human-Computer Interaction*. [Hindawi](https://www.hindawi.com/journals/ahci/2018/5681652/)

14. **Kivetz, R., Urminsky, O., & Zheng, Y. (2006).** "The Goal-Gradient Hypothesis Resurrected." *Journal of Marketing Research*, 43(1), 39-58. [PDF](https://home.uchicago.edu/ourminsky/Goal-Gradient_Illusionary_Goal_Progress.pdf)

---

## Summary

### Well-Grounded (High Confidence)

- **Subtractive stress penalty** - Strong support from ego depletion research
- **Difficulty-success relationship** - Yerkes-Dodson and Flow Theory provide solid foundation
- **BLOCKS as hard filter** - Project management and game design consensus
- **MAX_ACTIVE = 3** - Cognitive limits research supports 3-4 range
- **Time constants** (24h, 7d) - Hyperbolic discounting and habit formation research
- **Grace period concept** - Duolingo's streak freeze validation

### Design Choices (Medium Confidence)

- **Priority weight ratios** - Ordering defensible, exact numbers are calibration
- **Urgency values by star state** - Gradient makes sense, specific values interpolated
- **Difficulty time estimates** - Based on frameworks, not rigorous measurement

### Speculation (Low Confidence)

- **Connection effect magnitudes** - Relative ordering more defensible than absolutes
- **Trajectory modifier range** - No direct empirical basis
- **GROWTH_EDGE threshold** - What brightness truly indicates "ready"?
- **SHADOW_MIRROR interval** - Based on habit research, not shadow psychology

---

*NERVES complete. Proceed to SKIN to define system boundaries.*
