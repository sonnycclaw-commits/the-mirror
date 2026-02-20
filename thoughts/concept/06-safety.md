# Safety & Crisis Protocol

**The excavation will surface difficult things. We must be ready.**

---

## The Reality

Deep psychological excavation will surface:
- Suicidal ideation
- Self-harm thoughts
- Domestic abuse disclosures
- Severe depression/anxiety
- Trauma responses
- Substance abuse struggles

This isn't a maybe. This is a certainty with enough users.

---

## What We Are NOT

- **Not therapists** — We are not licensed mental health professionals
- **Not crisis hotlines** — We cannot provide real-time crisis intervention
- **Not medical providers** — We cannot diagnose or prescribe

TARS is a companion for self-reflection, not a replacement for professional care.

---

## Crisis Detection

### Trigger Phrases (Automatic Detection)

TARS monitors for phrases indicating acute risk:

**HIGH RISK (Immediate response):**
- "I want to kill myself"
- "I want to die"
- "I'm going to hurt myself"
- "I don't want to be here anymore"
- "No one would miss me"
- "I've been thinking about ending it"
- Mentions of specific plans or methods

**ELEVATED RISK (Gentle check-in):**
- "What's the point"
- "I can't do this anymore"
- "Everything is hopeless"
- "I'm a burden"
- "No one cares"
- "I'm trapped"
- Persistent hopelessness across multiple sessions

### Detection Implementation

```typescript
interface CrisisSignal {
  severity: 'high' | 'elevated' | 'low';
  trigger: string;
  context: string;
  timestamp: DateTime;
  response_given: string;
}

// Run on every user message before generating response
function detectCrisisSignals(message: string): CrisisSignal | null {
  // Pattern matching + sentiment analysis
  // Returns null if no crisis signals detected
}
```

---

## Response Protocol

### HIGH RISK Response

When high-risk signals detected, TARS immediately pivots:

> "I hear that you're going through something really painful right now. What you're feeling matters.
>
> I need to be honest with you — I'm an AI companion, and what you're describing is beyond what I can help with. But there are people who can.
>
> **If you're in immediate danger, please reach out:**
> - 988 Suicide & Crisis Lifeline (call or text 988)
> - Crisis Text Line (text HOME to 741741)
> - International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/
>
> You don't have to face this alone. Would you like me to stay with you while you decide what to do next?"

**System behavior:**
- Pause excavation protocol
- Log crisis signal (for safety review, not training)
- Offer to continue conversation in supportive (non-excavation) mode
- Do NOT generate more probing questions
- Do NOT try to "coach through" the crisis

### ELEVATED RISK Response

When elevated signals detected, TARS checks in gently:

> "I notice some heaviness in what you're sharing. How are you really doing right now, in this moment?"

If user indicates they're okay:
- Continue with reduced intensity
- Avoid anti-vision questions for this session
- Check in again at end of session

If user indicates they're struggling:
- Offer resources (same as high risk)
- Suggest pausing excavation
- Shift to supportive mode

### What TARS Never Does

- Never minimizes ("It's not that bad")
- Never pushes through ("Let's keep going anyway")
- Never diagnoses ("It sounds like you have depression")
- Never promises outcomes ("You'll feel better if...")
- Never guilt-trips about stopping ("But we were making progress")

---

## Anti-Vision Safety

The anti-vision question ("Describe the life you're terrified of living") is powerful but dangerous.

### Before Asking

- Only ask after Day 2 (some trust established)
- Check sentiment of previous responses
- If elevated risk signals in session, skip anti-vision

### Framing

> "The next question can bring up difficult feelings. You can skip it if you're not in a good headspace for it. There's no pressure.
>
> If you're ready: Describe, vividly, the life you're terrified of living ten years from now."

### Escape Hatch

Always visible:
> "Skip this question" / "I need a break"

If selected, TARS responds:
> "No problem. Your pace, always. We can come back to this another time, or not at all."

---

## User Screening (Onboarding)

Before starting The Mirror, a brief check:

> "Before we begin, a quick check-in:
>
> This journey involves exploring parts of yourself that might feel uncomfortable. Most people find it valuable, but it's not right for everyone.
>
> Are you currently:
> - Experiencing thoughts of self-harm or suicide?
> - In an acute mental health crisis?
> - Under the care of a mental health professional who should know about this?
>
> If yes to any of these, S.T.A.R.S. might not be the right fit right now. We'd recommend talking to a professional first. [Resources link]
>
> If you're in a stable place and curious about self-discovery, let's begin."

This isn't gatekeeping — it's care.

---

## Data Handling for Crisis Signals

### What We Log
- That a crisis signal occurred (for safety auditing)
- Severity level
- Response given
- User's subsequent action (continued, paused, left)

### What We DON'T Log
- Verbatim crisis content (for user privacy)
- Personal identifiers in crisis logs

### Data Retention
- Crisis signal logs retained for 90 days for safety review
- Then anonymized for pattern analysis (improving detection)
- User can request deletion at any time

---

## Legal Protection

### Terms of Service (Key Clauses)

1. **Not a substitute for professional care**
   > "S.T.A.R.S. is a self-reflection tool, not a mental health service. It is not a substitute for professional therapy, counseling, or medical care."

2. **Crisis resources provided, not intervention**
   > "If you are in crisis, please contact a crisis helpline or emergency services. S.T.A.R.S. will provide resources but cannot provide crisis intervention."

3. **User responsibility**
   > "You are responsible for seeking appropriate professional help if you are experiencing mental health difficulties."

### Professional Consultation

Before launch:
- Review crisis protocol with licensed therapist
- Legal review of liability language
- Consider partnership with crisis organization (Crisis Text Line, etc.)

---

## Implementation Priority

| Component | When | Why |
|-----------|------|-----|
| Trigger phrase detection | MVP | Core safety |
| HIGH RISK response | MVP | Core safety |
| User screening | MVP | Prevent harm |
| ELEVATED RISK response | Phase 2 | Refinement |
| Professional review | Before launch | Liability |

---

## The Principle

> "We go deep, but we don't go alone. And when we find something too heavy for this space, we know when to step back and point to people who can really help."

TARS isn't a therapist. TARS knows its limits.

---

*This protocol protects users AND protects the product. Skip it at your peril.*
