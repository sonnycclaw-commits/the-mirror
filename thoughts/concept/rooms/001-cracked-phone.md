# Room 001: The Cracked Phone

---

```
THE CRACKED PHONE

Your phone buzzes. 9:47pm.

Work. Subject: "Need this by EOD."

The screen glows in the dark. Your partner shifts beside you, 
still asleep.

> check it
> ignore it
> throw the phone

---

> throw the phone

It hits the wall. Cracks. Silence.

You feel something. What is it?

> relief
> guilt
> panic
> nothing

---

> relief

RELIEF.

The word sits there. You chose it.

This is the third time this week you've chosen distance over duty.
The system notes: VALUE=SELF_DIRECTION (asserted), DEFENSE=DISPLACEMENT (active), PATTERN=conflict_avoidance (intensifying).

The phone lies cracked on the floor. Your partner stirs.

> pick up the phone
> go back to sleep  
> walk out the door

---

> pick up the phone

You pick it up. The screen flickers. Still works.

The email is still there. "Need this by EOD."

You threw it. You felt relief. You picked it back up.

Why?

> I still have to do it
> I was just blowing off steam
> I don't know
> [say something else]: _____

---

> I still have to do it

Of course you do.

The system notes: NEED=AUTONOMY (FRUSTRATED, evidence: "still have to"), DEVELOPMENT=SOCIALIZED (external authority overrides internal choice).

The relief you felt — that was you. The picking it back up — that's also you.

Both are true. The question is: which one wins?

Your partner's breathing slows. They're awake. They heard.

> "Go back to sleep."
> "It's just work."
> [say nothing, leave the room]
> [tell the truth]: _____

---

> [say nothing, leave the room]

You leave. The floor creaks. You close the door behind you.

The hallway is dark. Your phone glows in your hand.

The email expects a reply. Your partner expects an explanation. 
You expect yourself to be someone who has this figured out.

None of those things are happening.

The system notes: PATTERN=emotional_withdrawal (active), ATTACHMENT=AVOIDANT (evidence: silence, departure, no repair attempt).

A new room opens. But you'll have to come back here eventually.
The cracked phone is still on the floor.

[END ROOM - MAP UPDATED]
```

---

## Extraction Map

| Choice | Domain | Type | State | What the Game Learns |
|--------|--------|------|-------|----------------------|
| throw phone | VALUE | SELF_DIRECTION | — | You want autonomy |
| throw phone | DEFENSE | DISPLACEMENT | — | You externalize pressure |
| throw phone | PATTERN | conflict_avoidance | — | You avoid rather than negotiate |
| relief | PATTERN | emotional_truth | — | You can name what you feel |
| pick up phone | — | — | — | You reassert the pattern you just broke |
| "I still have to" | NEED | AUTONOMY | FRUSTRATED | You feel trapped by obligation |
| "I still have to" | DEVELOPMENT | SOCIALIZED | STABLE | External authority wins |
| leave room | ATTACHMENT | AVOIDANT | — | You withdraw under pressure |
| leave room | PATTERN | emotional_withdrawal | — | You don't repair |

---

## What the Game Knows After This Room

```
player_state:
  dominant_value: SELF_DIRECTION (1 instance)
  frustrated_needs: [AUTONOMY]
  active_defenses: [DISPLACEMENT]
  attachment_style: AVOIDANT (preliminary)
  development_stage: SOCIALIZED (preliminary)
  patterns: [conflict_avoidance, emotional_withdrawal]
  
  unfinished_business:
    - cracked_phone: [partner is awake, email unanswered, no repair]
    
  potential_branches:
    - the_confrontation (requires: challenge authority pattern)
    - the_repair (requires: return to partner)
    - the_breakdown (requires: cumulative avoidant evidence)
```

---

## Next Room Options

Based on extraction, the game can generate:

**If AVOIDANT + SOCIALIZE:**
- A room with a direct confrontation (to test if pattern holds)
- A room with a chance to explain yourself (to test repair capacity)

**If AUTONOMY frustrated:**
- A room where you can choose for yourself (to see what you do with freedom)
- A room where someone else chooses for you (to see how you respond)

**If unfinished_business:**
- Return to partner later. They remember. The crack is still there.

---

## The Simplicity

One room. Nine choices. The game knows:
- What you want (SELF_DIRECTION)
- What stops you (SOCIALIZED, AUTONOMY frustrated)
- How you cope (DISPLACEMENT, withdrawal)
- What you avoid (confrontation, repair)

Everything else builds from here.
