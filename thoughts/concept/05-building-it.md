# Building It — Without Losing the Soul

**How to make the constellation real**

---

## The Trap We're Avoiding

The rationalized version said: "Cut the visualization. Text works. Ship faster."

But text doesn't work. Text is what every other app does. Text is why ChatGPT is "good enough" for most people. Text is why this would become just another AI coaching app in a sea of AI coaching apps.

The constellation **is** the product.

Without it, there's no soul. Without it, we're building slop.

---

## What's Actually Hard

Let's be honest about what requires engineering:

| Component | Difficulty | Why |
|-----------|------------|-----|
| Claude conversation | Easy | API call with prompt |
| Star data model | Easy | CRUD with coordinates |
| Text-based profile | Easy | String formatting |
| **Polar star map rendering** | Medium | Canvas/WebGL, coordinate math |
| **Star animations** | Medium | CSS/JS animation system |
| **Birth Chart reveal** | Medium-Hard | Choreographed animation sequence |
| **Constellation over time** | Hard | State management, temporal data |

The visual poetry requires real engineering. But it's not impossible. It's just not the "ship in 3 days" version.

---

## The Minimum Viable Constellation

What's the smallest thing that has the soul?

### Phase 1: Static Constellation (Week 1-2)

**Build:**
- Polar star map as SVG or Canvas
- 5 domain axes rendered
- Stars placed based on coordinates
- Static lines between connected stars
- Basic tap to reveal star info

**Not yet:**
- Animations
- Real-time updates
- Phase transitions
- Birth Chart reveal sequence

**Tech:** React + SVG, or Canvas 2D

This gives you a constellation you can look at. It's not animated, but it's not text either.

### Phase 2: Living Stars (Week 3-4)

**Add:**
- Star glow animations (CSS pulse)
- Connection line fade in
- Tap interactions (enlarge, brighten)
- Day/night cycle subtle background shift

**Now it breathes.** Stars pulse. Connections shimmer. The sky feels alive.

### Phase 3: The Reveal (Week 5-6)

**Add:**
- Birth Chart reveal sequence
- Stars appearing one by one
- Connections drawing after
- Camera pullback
- TARS narration overlay

**Now Day 7 has its moment.** The emotional peak exists.

### Phase 4: Evolution (Week 7-8)

**Add:**
- Stars brighten/dim based on actions
- New stars appear with animation
- Connections form/fade over time
- Phase transition sequences

**Now the constellation lives.** It responds to what you do.

---

## Tech Stack for the Soul

| Layer | Choice | Why |
|-------|--------|-----|
| **Frontend** | Next.js + React | Fast iteration, good animation support |
| **Visualization** | Canvas 2D or Pixi.js | Performant star rendering with effects |
| **Animation** | Framer Motion + custom | Smooth, choreographed sequences |
| **Backend** | Convex or Supabase | Real-time updates for living constellation |
| **AI** | Claude API | TARS conversations |
| **Mobile** | React Native later | Web first, then port the constellation |

Not Airtable. Not Typeform. Real infrastructure for a real experience.

---

## The Validation Pivot

The rationalized version wanted to validate with text before building the visual.

**Counter-proposal:** Validate the visual WITH the visual.

If the constellation experience doesn't work, no amount of text-based testing will tell us that. We'd be validating a different product.

**What we're actually testing:**
- Does watching your constellation form create the "there I am" feeling?
- Do people return to see their stars shift?
- Does the Birth Chart reveal feel like a milestone?

You can't test this with a Google Form.

---

## The Honest Timeline

| Phase | Duration | Delivers |
|-------|----------|----------|
| **MVP** | 4 weeks | Conversation + static constellation + basic interactions |
| **Living** | 2 weeks | Animations, glow, breathing sky |
| **Reveal** | 2 weeks | Birth Chart sequence, phase transitions |
| **Walk** | 2 weeks | Experiments, star response to behavior |
| **Polish** | 2 weeks | Mobile, performance, edge cases |

**Total: 12 weeks to a full experience.**

Or: 4-6 weeks to something that has the soul, even if incomplete.

---

## What We're NOT Cutting

| Element | Why It Stays |
|---------|--------------|
| Polar star map | The entire metaphor depends on it |
| Star types (bright/dim/flickering/dark) | Differentiation, not decoration |
| 7-day excavation | The depth creates the value |
| Birth Chart reveal | The emotional peak |
| TARS as character | Not just "AI assistant" |
| Night sky aesthetic | The immersion matters |

---

## What We CAN Cut for MVP

| Element | Why It's Deferrable |
|---------|---------------------|
| Mobile app | Web works first |
| Push notifications | Email reminders work |
| Device integrations (Calendar, Health) | Manual tracking first |
| Social sharing | Add after core works |
| HEXACO/SDT formal psychometrics | "Feels accurate" is enough |
| Champion Marketplace | V2 platform play |

---

## The Build Sequence

### Week 1-2: Foundation
- Next.js project setup
- Claude API integration for TARS
- Basic conversation flow (Day 1 questions)
- Polar coordinate system (math + rendering)
- Star data model

### Week 3-4: Constellation
- Star rendering with types and glows
- Connection lines (bezier curves)
- Basic tap interactions
- Domain axis labels
- Static Birth Chart view

### Week 5-6: Life
- Star pulse animations
- Connection shimmer
- Birth Chart reveal sequence
- TARS narration overlay
- Phase indicator

### Week 7-8: Walk
- Experiment generation
- Evening check-in flow
- Star brightness response to actions
- New star appearance animation
- Weekly constellation review

---

## The Test (With Soul)

Run 20 users through the real experience.

**Measure:**
- Do they complete 7 days? (Target: 50%)
- Do they describe the Birth Chart reveal as meaningful? (Target: 60% say "significant moment")
- Do they return after Day 7 to see their constellation? (Target: 40%)
- Do they take Walk experiments? (Target: 30%)
- Would they pay to continue? (Target: 25%)

**Qualitative:**
- What did the constellation mean to you?
- How did the Birth Chart reveal feel?
- What would you tell a friend about this?

If the soul is there, we'll hear it in these answers.

---

## The Honest Risk

Building the full visual experience takes 8-12 weeks, not 2.

If it fails, we've invested more than the "text MVP" approach.

But if it works, we have something that's actually different. Something that isn't just another ChatGPT wrapper. Something that has a soul.

That's the bet.

---

## Security Architecture

Psychological profile data is highly sensitive. We treat it that way.

### Data Classification

| Data Type | Sensitivity | Handling |
|-----------|-------------|----------|
| Constellation (stars, connections) | HIGH | Encrypted at rest, user-owned |
| Conversation history | HIGH | Encrypted, retention policy |
| Usage analytics | MEDIUM | Anonymized, aggregated |
| Account credentials | HIGH | Hashed, never stored plain |

### Encryption

**At Rest:**
- All user data encrypted with AES-256
- Encryption keys stored separately from data (AWS KMS or similar)
- Database-level encryption for PostgreSQL/Supabase

**In Transit:**
- TLS 1.3 minimum for all connections
- Certificate pinning for mobile (when we build it)

### Authentication

- Magic link email auth (no password to steal)
- Session tokens with 24h expiry
- Automatic logout after 7 days of inactivity

### User Data Rights (GDPR/CCPA Ready)

| Right | Implementation |
|-------|----------------|
| **Access** | "Download my data" exports full constellation + history |
| **Deletion** | "Delete my account" removes all data within 30 days |
| **Portability** | Export format: JSON + optional PDF of Birth Chart |
| **Correction** | User can edit/delete individual stars |
| **Pause** | "Pause my account" stops all processing, retains data |

### Data Retention

| Data | Retention | Reason |
|------|-----------|--------|
| Active user data | Indefinite while active | Core product |
| Inactive user data | 12 months after last login | Then prompt for deletion |
| Deleted user data | 30 days | Grace period for mistakes |
| Crisis signal logs | 90 days | Safety auditing |
| Anonymized analytics | Indefinite | Product improvement |

### What We Don't Do

- **No selling data** — Ever. Not to advertisers, researchers, or anyone.
- **No AI training on user data** — Your constellation is yours.
- **No third-party tracking** — No Google Analytics, no Facebook pixel.
- **No dark patterns** — Delete means delete. No "are you sure?" guilt.

### MVP Security Checklist

- [ ] Supabase/Convex with RLS (row-level security) enabled
- [ ] TLS for all API calls
- [ ] Input sanitization (prevent injection)
- [ ] Rate limiting on API endpoints
- [ ] Magic link auth (no passwords)
- [ ] Basic audit logging (who accessed what)
- [ ] Privacy policy written
- [ ] Data export endpoint

### Before Public Launch

- [ ] Security audit (external)
- [ ] Penetration testing
- [ ] GDPR compliance review
- [ ] SOC 2 consideration (if B2B later)

---

*Trust is earned. Security is how we earn it.*

---

*"Build the thing you believe in, not the thing that validates fastest."*
