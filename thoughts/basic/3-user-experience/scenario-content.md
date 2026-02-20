# TRQ Scenario Content

*12 scenarios with follow-up conversation trees. Ready to load into the system.*

---

## Scenario 1: The 6pm Text

**Category:** boundaries
**Situation:** It's 6pm. Your boss texts: "Quick call at 7?" You had dinner planned with a friend.

**Options:**

```json
{
  "id": "s1",
  "situation": "It's 6pm. Your boss texts: \"Quick call at 7?\" You had dinner planned with a friend.",
  "options": [
    {
      "id": "s1-a",
      "label": "Cancel on my friend",
      "subtext": "Work comes first.",
      "signals": [{"dimension": "pattern", "pole": "work-priority", "weight": 0.8}, {"dimension": "values", "pole": "people-pleasing", "weight": 0.6}]
    },
    {
      "id": "s1-b",
      "label": "Say yes, keep it short",
      "subtext": "I won't.",
      "signals": [{"dimension": "pattern", "pole": "overcommit", "weight": 0.7}, {"dimension": "locus", "pole": "external", "weight": 0.5}]
    },
    {
      "id": "s1-c",
      "label": "\"Can we do tomorrow morning?\"",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "boundary-setting", "weight": 0.8}, {"dimension": "approach", "pole": "direct", "weight": 0.7}]
    },
    {
      "id": "s1-d",
      "label": "Pretend I didn't see it",
      "subtext": "Until it's too late.",
      "signals": [{"dimension": "approach", "pole": "avoidance", "weight": 0.9}, {"dimension": "pattern", "pole": "conflict-avoidance", "weight": 0.7}]
    }
  ]
}
```

**Follow-up (if s1-a or s1-b selected):**

```
TARS: Who was the friend?

USER: [responds]

TARS: And what did you tell yourself to make it okay to cancel?

USER: [responds]

TARS: Was it actually about work being urgent? Or about not wanting to be the person who says no?

USER: [responds]

TARS: So the pattern is: work asks, you say yes, you resent it later. Did you know you were doing that?
```

---

## Scenario 2: Sunday Scaries

**Category:** time
**Situation:** It's Sunday, 4pm. Tomorrow is Monday. The week ahead is full.

**Options:**

```json
{
  "id": "s2",
  "situation": "It's Sunday, 4pm. Tomorrow is Monday. The week ahead is full.",
  "options": [
    {
      "id": "s2-a",
      "label": "Open laptop, make a list",
      "subtext": "Feel briefly in control.",
      "signals": [{"dimension": "pattern", "pole": "planning", "weight": 0.6}, {"dimension": "approach", "pole": "proactive", "weight": 0.5}]
    },
    {
      "id": "s2-b",
      "label": "Think about it, watch Netflix instead",
      "subtext": null,
      "signals": [{"dimension": "approach", "pole": "avoidance", "weight": 0.7}, {"dimension": "pattern", "pole": "procrastination", "weight": 0.6}]
    },
    {
      "id": "s2-c",
      "label": "Go to bed early",
      "subtext": "Scroll until 1am.",
      "signals": [{"dimension": "pattern", "pole": "intention-gap", "weight": 0.8}, {"dimension": "approach", "pole": "avoidance", "weight": 0.5}]
    },
    {
      "id": "s2-d",
      "label": "\"Organize\" for 3 hours",
      "subtext": "Accomplish nothing real.",
      "signals": [{"dimension": "pattern", "pole": "productive-procrastination", "weight": 0.9}, {"dimension": "approach", "pole": "avoidance", "weight": 0.6}]
    },
    {
      "id": "s2-e",
      "label": "Do something fun, trust Monday-me",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "present-focus", "weight": 0.7}, {"dimension": "locus", "pole": "internal", "weight": 0.5}]
    }
  ]
}
```

**Follow-up (if s2-c or s2-d selected):**

```
TARS: What were you actually avoiding?

USER: [responds]

TARS: So the "organizing" or the "early bedtime" — that's the exit door. What's on the other side that you don't want to face?

USER: [responds]

TARS: Interesting. The phone, the Netflix, the organizing — they're not the problem. They're how you escape the problem. What is the problem?
```

---

## Scenario 3: The Gym Bag

**Category:** time
**Situation:** Gym bag by the door. 6:30am. Alarm just went off. Bed is warm.

**Options:**

```json
{
  "id": "s3",
  "situation": "Gym bag by the door. 6:30am. Alarm just went off. Bed is warm.",
  "options": [
    {
      "id": "s3-a",
      "label": "Get up, hate it until I'm there",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "discipline", "weight": 0.8}, {"dimension": "approach", "pole": "push-through", "weight": 0.7}]
    },
    {
      "id": "s3-b",
      "label": "\"I'll go after work\"",
      "subtext": "I won't.",
      "signals": [{"dimension": "pattern", "pole": "intention-gap", "weight": 0.9}, {"dimension": "approach", "pole": "delay", "weight": 0.7}]
    },
    {
      "id": "s3-c",
      "label": "Snooze for 30 minutes",
      "subtext": "Feel bad about it all day.",
      "signals": [{"dimension": "pattern", "pole": "self-negotiation", "weight": 0.7}, {"dimension": "values", "pole": "self-critical", "weight": 0.6}]
    },
    {
      "id": "s3-d",
      "label": "\"Just 5 minutes\" on phone",
      "subtext": "Suddenly it's 7:15.",
      "signals": [{"dimension": "approach", "pole": "avoidance", "weight": 0.8}, {"dimension": "pattern", "pole": "phone-escape", "weight": 0.8}]
    }
  ]
}
```

---

## Scenario 4: The Hard Conversation

**Category:** relationships
**Situation:** There's a conversation you've been avoiding. With your partner, parent, or boss.

**Options:**

```json
{
  "id": "s4",
  "situation": "There's a conversation you've been avoiding. With your partner, parent, or boss.",
  "options": [
    {
      "id": "s4-a",
      "label": "Wait for the right moment",
      "subtext": "It never comes.",
      "signals": [{"dimension": "approach", "pole": "avoidance", "weight": 0.8}, {"dimension": "pattern", "pole": "perfectionism", "weight": 0.5}]
    },
    {
      "id": "s4-b",
      "label": "Rehearse it 50 times in my head",
      "subtext": "Still don't have it.",
      "signals": [{"dimension": "pattern", "pole": "overthinking", "weight": 0.9}, {"dimension": "approach", "pole": "avoidance", "weight": 0.7}]
    },
    {
      "id": "s4-c",
      "label": "Hint, hope they bring it up",
      "subtext": "They don't.",
      "signals": [{"dimension": "approach", "pole": "indirect", "weight": 0.8}, {"dimension": "pattern", "pole": "conflict-avoidance", "weight": 0.7}]
    },
    {
      "id": "s4-d",
      "label": "Send a text instead",
      "subtext": "Easier than face-to-face.",
      "signals": [{"dimension": "approach", "pole": "indirect", "weight": 0.6}, {"dimension": "pattern", "pole": "vulnerability-avoidance", "weight": 0.5}]
    },
    {
      "id": "s4-e",
      "label": "Have it. Hard. Done.",
      "subtext": null,
      "signals": [{"dimension": "approach", "pole": "direct", "weight": 0.9}, {"dimension": "pattern", "pole": "confrontation-capable", "weight": 0.8}]
    }
  ]
}
```

**Follow-up (if s4-a, s4-b, or s4-c selected):**

```
TARS: What's the conversation about?

USER: [responds]

TARS: What's the sentence you're afraid to say?

USER: [responds]

TARS: Why haven't you said it?

USER: [responds]

TARS: So if you say it and nothing changes — then what? What would you have to accept?

USER: [responds]

TARS: That's what you're avoiding. Not the conversation. The possibility that it doesn't work.
```

---

## Scenario 5: The Project

**Category:** identity
**Situation:** You have a side project idea. You've been "about to start" for months.

**Options:**

```json
{
  "id": "s5",
  "situation": "You have a side project idea. You've been \"about to start\" for months.",
  "options": [
    {
      "id": "s5-a",
      "label": "Research more, find courses, make lists",
      "subtext": "Don't start.",
      "signals": [{"dimension": "pattern", "pole": "productive-procrastination", "weight": 0.9}, {"dimension": "approach", "pole": "avoidance", "weight": 0.7}]
    },
    {
      "id": "s5-b",
      "label": "Start with energy, burn out in 3 days",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "burst-crash", "weight": 0.8}, {"dimension": "approach", "pole": "intensity", "weight": 0.6}]
    },
    {
      "id": "s5-c",
      "label": "Tell everyone about it",
      "subtext": "Feel pressure, drop it.",
      "signals": [{"dimension": "pattern", "pole": "external-motivation", "weight": 0.7}, {"dimension": "approach", "pole": "accountability-sabotage", "weight": 0.6}]
    },
    {
      "id": "s5-d",
      "label": "Work on it quietly, tell no one",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "internal-motivation", "weight": 0.7}, {"dimension": "approach", "pole": "stealth", "weight": 0.5}]
    },
    {
      "id": "s5-e",
      "label": "Wait for the \"right time\"",
      "subtext": null,
      "signals": [{"dimension": "approach", "pole": "avoidance", "weight": 0.8}, {"dimension": "pattern", "pole": "perfectionism", "weight": 0.6}]
    }
  ]
}
```

**Follow-up (if s5-a selected):**

```
TARS: What's the project?

USER: [responds]

TARS: How long have you been "almost ready" to start?

USER: [responds]

TARS: What happens if you start and it's bad?

USER: [responds]

TARS: So not starting is protection. As long as you don't start, you can't fail. But you can't succeed either. Is that the trade-off you meant to make?
```

---

## Scenario 6: The Favor

**Category:** boundaries
**Situation:** A friend asks for help. It'll take a few hours you don't really have.

**Options:**

```json
{
  "id": "s6",
  "situation": "A friend asks for help. It'll take a few hours you don't really have.",
  "options": [
    {
      "id": "s6-a",
      "label": "Yes, of course",
      "subtext": "Even though I don't have time.",
      "signals": [{"dimension": "pattern", "pole": "people-pleasing", "weight": 0.8}, {"dimension": "values", "pole": "self-sacrifice", "weight": 0.7}]
    },
    {
      "id": "s6-b",
      "label": "Yes",
      "subtext": "Resent it the whole time.",
      "signals": [{"dimension": "pattern", "pole": "resentment-accumulation", "weight": 0.9}, {"dimension": "approach", "pole": "passive", "weight": 0.6}]
    },
    {
      "id": "s6-c",
      "label": "\"Let me check my calendar\"",
      "subtext": "Never follow up.",
      "signals": [{"dimension": "approach", "pole": "avoidance", "weight": 0.7}, {"dimension": "pattern", "pole": "conflict-avoidance", "weight": 0.6}]
    },
    {
      "id": "s6-d",
      "label": "\"I can't this time, sorry\"",
      "subtext": "Feel guilty for a week.",
      "signals": [{"dimension": "pattern", "pole": "boundary-setting", "weight": 0.6}, {"dimension": "values", "pole": "guilt-prone", "weight": 0.7}]
    },
    {
      "id": "s6-e",
      "label": "\"I can't this time, sorry\"",
      "subtext": "And mean it.",
      "signals": [{"dimension": "pattern", "pole": "boundary-confident", "weight": 0.9}, {"dimension": "locus", "pole": "internal", "weight": 0.7}]
    }
  ]
}
```

---

## Scenario 7: After the Fight

**Category:** relationships
**Situation:** You had an argument with someone you care about. It's the next morning.

**Options:**

```json
{
  "id": "s7",
  "situation": "You had an argument with someone you care about. It's the next morning.",
  "options": [
    {
      "id": "s7-a",
      "label": "Apologize first",
      "subtext": "Even if I wasn't wrong.",
      "signals": [{"dimension": "pattern", "pole": "peace-at-any-price", "weight": 0.8}, {"dimension": "values", "pole": "harmony-priority", "weight": 0.7}]
    },
    {
      "id": "s7-b",
      "label": "Wait for them to apologize",
      "subtext": "I can outlast anyone.",
      "signals": [{"dimension": "pattern", "pole": "stubborn", "weight": 0.7}, {"dimension": "approach", "pole": "passive", "weight": 0.6}]
    },
    {
      "id": "s7-c",
      "label": "Act like nothing happened",
      "subtext": "Maybe it'll go away.",
      "signals": [{"dimension": "approach", "pole": "avoidance", "weight": 0.9}, {"dimension": "pattern", "pole": "conflict-avoidance", "weight": 0.8}]
    },
    {
      "id": "s7-d",
      "label": "Bring it up again",
      "subtext": "We need to actually resolve this.",
      "signals": [{"dimension": "approach", "pole": "direct", "weight": 0.8}, {"dimension": "pattern", "pole": "resolution-oriented", "weight": 0.7}]
    },
    {
      "id": "s7-e",
      "label": "Replay it in my head all day",
      "subtext": "Say nothing.",
      "signals": [{"dimension": "pattern", "pole": "rumination", "weight": 0.9}, {"dimension": "approach", "pole": "internal", "weight": 0.7}]
    }
  ]
}
```

**Follow-up (if s7-a selected):**

```
TARS: Why do you apologize first?

USER: [responds]

TARS: Even if it means swallowing something that matters to you?

USER: [responds]

TARS: How long have you been doing that?

USER: [responds]

TARS: So peace-at-any-price. But the price adds up. Where does the swallowed stuff go?
```

---

## Scenario 8: The Offer

**Category:** identity
**Situation:** Someone offers you an opportunity you've wanted. A promotion, a partnership, something good.

**Options:**

```json
{
  "id": "s8",
  "situation": "Someone offers you an opportunity you've wanted. A promotion, a partnership, something good.",
  "options": [
    {
      "id": "s8-a",
      "label": "\"There must be a catch\"",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "suspicion", "weight": 0.6}, {"dimension": "values", "pole": "self-doubt", "weight": 0.5}]
    },
    {
      "id": "s8-b",
      "label": "\"I'm not ready yet\"",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "imposter", "weight": 0.8}, {"dimension": "approach", "pole": "avoidance", "weight": 0.6}]
    },
    {
      "id": "s8-c",
      "label": "\"What if I fail and they regret choosing me?\"",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "fear-of-exposure", "weight": 0.9}, {"dimension": "values", "pole": "external-validation", "weight": 0.7}]
    },
    {
      "id": "s8-d",
      "label": "\"Yes. Figure it out later.\"",
      "subtext": null,
      "signals": [{"dimension": "approach", "pole": "leap", "weight": 0.8}, {"dimension": "pattern", "pole": "action-orientation", "weight": 0.7}]
    },
    {
      "id": "s8-e",
      "label": "\"Let me think about it\"",
      "subtext": "Think about it forever.",
      "signals": [{"dimension": "approach", "pole": "avoidance", "weight": 0.7}, {"dimension": "pattern", "pole": "analysis-paralysis", "weight": 0.8}]
    }
  ]
}
```

**Follow-up (if s8-b or s8-c selected):**

```
TARS: What would "ready" look like?

USER: [responds]

TARS: How long have you been getting ready?

USER: [responds]

TARS: What if "not ready" is the story you tell yourself so you never have to risk being seen?

USER: [responds]

TARS: You're protecting them from disappointment by denying yourself the opportunity. That's a trade-off. Did you know you were making it?
```

---

## Scenario 9: The Scroll

**Category:** time
**Situation:** You open your phone to check one thing. 25 minutes later, you're watching a video you don't care about.

**Options:**

```json
{
  "id": "s9",
  "situation": "You open your phone to check one thing. 25 minutes later, you're watching a video you don't care about.",
  "options": [
    {
      "id": "s9-a",
      "label": "Multiple times a day",
      "subtext": "I hate it.",
      "signals": [{"dimension": "pattern", "pole": "phone-escape", "weight": 0.9}, {"dimension": "approach", "pole": "avoidance", "weight": 0.7}]
    },
    {
      "id": "s9-b",
      "label": "Once or twice a day",
      "subtext": "Usually catch myself.",
      "signals": [{"dimension": "pattern", "pole": "moderate-awareness", "weight": 0.5}, {"dimension": "approach", "pole": "self-regulation", "weight": 0.5}]
    },
    {
      "id": "s9-c",
      "label": "I've gotten better",
      "subtext": "Use app limits now.",
      "signals": [{"dimension": "pattern", "pole": "active-coping", "weight": 0.6}, {"dimension": "approach", "pole": "systems", "weight": 0.6}]
    },
    {
      "id": "s9-d",
      "label": "I don't really have this problem",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "low-phone-dependency", "weight": 0.7}]
    },
    {
      "id": "s9-e",
      "label": "I've given up fighting it",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "resignation", "weight": 0.8}, {"dimension": "approach", "pole": "passive", "weight": 0.7}]
    }
  ]
}
```

**Follow-up (if s9-a selected):**

```
TARS: What are you usually avoiding when you pick up the phone?

USER: [responds]

TARS: So the phone is the exit door. What's on the other side of the door that you don't want to face?

USER: [responds]

TARS: The scroll isn't the problem. The scroll is the symptom. What's the problem?
```

---

## Scenario 10: The Compliment

**Category:** identity
**Situation:** Someone gives you a genuine compliment about something you did well.

**Options:**

```json
{
  "id": "s10",
  "situation": "Someone gives you a genuine compliment about something you did well.",
  "options": [
    {
      "id": "s10-a",
      "label": "Deflect it",
      "subtext": "\"Oh, it was nothing.\"",
      "signals": [{"dimension": "pattern", "pole": "deflection", "weight": 0.7}, {"dimension": "values", "pole": "discomfort-with-praise", "weight": 0.6}]
    },
    {
      "id": "s10-b",
      "label": "Point out what I could have done better",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "self-criticism", "weight": 0.8}, {"dimension": "values", "pole": "perfectionism", "weight": 0.7}]
    },
    {
      "id": "s10-c",
      "label": "Say thanks, but don't believe it",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "imposter", "weight": 0.7}, {"dimension": "values", "pole": "self-doubt", "weight": 0.6}]
    },
    {
      "id": "s10-d",
      "label": "Say thanks and actually take it in",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "self-acceptance", "weight": 0.8}, {"dimension": "values", "pole": "self-worth", "weight": 0.7}]
    },
    {
      "id": "s10-e",
      "label": "Worry they'll expect this level every time",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "pressure-aversion", "weight": 0.7}, {"dimension": "values", "pole": "fear-of-expectation", "weight": 0.6}]
    }
  ]
}
```

---

## Scenario 11: The Mirror

**Category:** identity
**Situation:** Someone asks you directly: "What do you actually want?"

**Options:**

```json
{
  "id": "s11",
  "situation": "Someone asks you directly: \"What do you actually want?\"",
  "options": [
    {
      "id": "s11-a",
      "label": "Give the acceptable answer",
      "subtext": "Not the real one.",
      "signals": [{"dimension": "pattern", "pole": "self-censoring", "weight": 0.8}, {"dimension": "values", "pole": "external-validation", "weight": 0.6}]
    },
    {
      "id": "s11-b",
      "label": "\"I don't know\"",
      "subtext": "I do, but I'm not saying.",
      "signals": [{"dimension": "approach", "pole": "avoidance", "weight": 0.7}, {"dimension": "pattern", "pole": "vulnerability-avoidance", "weight": 0.7}]
    },
    {
      "id": "s11-c",
      "label": "\"I don't know\"",
      "subtext": "I genuinely don't.",
      "signals": [{"dimension": "pattern", "pole": "disconnection", "weight": 0.8}, {"dimension": "values", "pole": "lost", "weight": 0.7}]
    },
    {
      "id": "s11-d",
      "label": "Tell them the real thing",
      "subtext": "Even if it sounds ridiculous.",
      "signals": [{"dimension": "approach", "pole": "authentic", "weight": 0.9}, {"dimension": "pattern", "pole": "vulnerability-capable", "weight": 0.8}]
    },
    {
      "id": "s11-e",
      "label": "Change the subject",
      "subtext": null,
      "signals": [{"dimension": "approach", "pole": "avoidance", "weight": 0.8}, {"dimension": "pattern", "pole": "deflection", "weight": 0.7}]
    }
  ]
}
```

**Follow-up (if s11-a or s11-b selected):**

```
TARS: What's the real answer? The one you didn't say?

USER: [responds]

TARS: Why didn't you say it?

USER: [responds]

TARS: So there's a version of what you want that's acceptable to say, and a version that's true. They're not the same. Which one are we working with here?
```

---

## Scenario 12: The Choice

**Category:** identity
**Situation:** You have to choose between two things you want. You can't have both.

**Options:**

```json
{
  "id": "s12",
  "situation": "You have to choose between two things you want. You can't have both.",
  "options": [
    {
      "id": "s12-a",
      "label": "Try to have both anyway",
      "subtext": "Fail at both.",
      "signals": [{"dimension": "pattern", "pole": "overcommit", "weight": 0.8}, {"dimension": "approach", "pole": "avoidance", "weight": 0.6}]
    },
    {
      "id": "s12-b",
      "label": "Delay until someone decides for me",
      "subtext": null,
      "signals": [{"dimension": "locus", "pole": "external", "weight": 0.8}, {"dimension": "approach", "pole": "passive", "weight": 0.7}]
    },
    {
      "id": "s12-c",
      "label": "Choose, then second-guess forever",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "rumination", "weight": 0.7}, {"dimension": "values", "pole": "decision-doubt", "weight": 0.6}]
    },
    {
      "id": "s12-d",
      "label": "Choose, accept the loss",
      "subtext": "Move on.",
      "signals": [{"dimension": "pattern", "pole": "decisive", "weight": 0.9}, {"dimension": "approach", "pole": "commitment", "weight": 0.8}]
    },
    {
      "id": "s12-e",
      "label": "Resent that I have to choose",
      "subtext": null,
      "signals": [{"dimension": "pattern", "pole": "resentment", "weight": 0.6}, {"dimension": "values", "pole": "entitlement", "weight": 0.5}]
    }
  ]
}
```

---

## Scenario Selection Rules

1. Always start with Scenario 1 (6pm Text) — universal, relatable, sets tone
2. Show 8-10 scenarios per session (not all 12)
3. Category distribution: 2-3 boundaries, 2-3 time, 2-3 relationships, 2-3 identity
4. Trigger follow-up on scenarios with highest-weight avoidance signals
5. Maximum 3 follow-up conversations per session

---

## TARS Acknowledgment Bank

Brief responses after each scenario choice:

| Signal Pattern | Response |
|----------------|----------|
| Self-aware avoidance | "Yeah. That one's familiar." |
| Honest struggle | "That's a hard one." |
| Boundary-setting | "Good. That's clear." |
| Resentment pattern | "The resentment is a signal." |
| Perfectionism | "Waiting for perfect. Interesting." |
| Imposter | "The 'not ready' story." |
| Direct action | "You do the thing. Noted." |
| Resignation | "Given up fighting it. Okay." |
