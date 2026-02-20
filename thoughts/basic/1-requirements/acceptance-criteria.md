# Acceptance Criteria

**Section:** 1-requirements
**Status:** Draft
**Purpose:** Testable conditions that prove features are complete

---

## Definition of Done (All Features)

A feature is complete when:

1. ✅ Code complete and merged to main
2. ✅ Unit tests passing (≥70% coverage for feature)
3. ✅ Integration tests passing
4. ✅ Deployed to staging
5. ✅ Manual QA completed
6. ✅ Performance benchmarks met
7. ✅ Accessibility reviewed
8. ✅ Product owner approval

---

## AC-1: Authentication

### AC-1.1: User Registration

**Given** I am a new visitor
**When** I enter my email and request a magic link
**Then:**
- [ ] I receive an email within 60 seconds
- [ ] The email contains a valid magic link
- [ ] Clicking the link creates my account
- [ ] I am automatically signed in
- [ ] I am redirected to onboarding

**Edge Cases:**
- [ ] Invalid email format shows error
- [ ] Already registered email sends sign-in link instead
- [ ] Expired link (>15 min) shows expiry message with resend option

### AC-1.2: User Sign In

**Given** I am a registered user who is signed out
**When** I enter my email and request a magic link
**Then:**
- [ ] I receive an email within 60 seconds
- [ ] Clicking the link signs me in
- [ ] I am returned to my last location (constellation or conversation)
- [ ] My session persists for 30 days

---

## AC-2: Conversation System (TARS)

### AC-2.1: Message Exchange

**Given** I am in a conversation with TARS
**When** I send a message
**Then:**
- [ ] My message appears immediately in the chat
- [ ] TARS typing indicator appears within 500ms
- [ ] TARS responds within 5 seconds (typical <3s)
- [ ] Response is contextually relevant to my message
- [ ] Response references my constellation state when appropriate

### AC-2.2: Question Sequencing

**Given** I am on Mirror Day N
**When** I start a conversation session
**Then:**
- [ ] TARS asks questions appropriate to Day N theme
- [ ] Questions build on previous days' discoveries
- [ ] At least 3 questions are asked before day can complete
- [ ] Day completion is determined by TARS, not message count

### AC-2.3: Micro-Revelations

**Given** I have completed the questions for Day N
**When** TARS provides the micro-revelation
**Then:**
- [ ] Revelation references at least 2 things I said
- [ ] Revelation makes a connection I hadn't explicitly made
- [ ] Revelation is framed as observation, not advice
- [ ] Revelation feels personally relevant (subjective, test via user feedback)

---

## AC-3: Constellation System

### AC-3.1: Star Extraction

**Given** I am in conversation with TARS
**When** I share an insight about myself
**Then:**
- [ ] TARS acknowledges the pattern
- [ ] A new star appears on my constellation (if novel)
- [ ] Star is labeled with a name I would recognize
- [ ] Star is placed in the correct domain
- [ ] Star appearance is animated

### AC-3.2: Constellation Display

**Given** I navigate to constellation view
**When** the constellation loads
**Then:**
- [ ] All my stars are visible
- [ ] Stars are positioned correctly by domain
- [ ] Star types are visually distinguishable
- [ ] Connections are drawn between related stars
- [ ] Phase indicator is correct
- [ ] Render completes in <500ms

### AC-3.3: Star Interaction

**Given** I am viewing my constellation
**When** I tap on a star
**Then:**
- [ ] Star enlarges or highlights
- [ ] Detail panel appears with:
  - Star label
  - Description
  - Type
  - Brightness
  - Connected stars
- [ ] I can dismiss the panel

### AC-3.4: Birth Chart Reveal

**Given** I have completed Mirror Day 7
**When** the Birth Chart reveal begins
**Then:**
- [ ] Screen transitions to dark
- [ ] Stars appear in order of discovery
- [ ] Each star appearance is animated
- [ ] Connections draw after stars appear
- [ ] Camera pulls back to show full constellation
- [ ] TARS narration plays (audio or text)
- [ ] Total sequence is 30-60 seconds
- [ ] I can skip if needed, but prompted to confirm

---

## AC-4: User Experience Quality

### AC-4.1: Mobile Experience

**Given** I am using the app on a mobile device
**When** I interact with any feature
**Then:**
- [ ] Touch targets are at least 44x44px
- [ ] Text is readable without zooming
- [ ] Constellation is zoomable and pannable
- [ ] Keyboard doesn't obscure input field
- [ ] App is usable in portrait orientation

### AC-4.2: Loading States

**Given** any operation takes more than 200ms
**When** the operation is in progress
**Then:**
- [ ] A loading indicator is visible
- [ ] User cannot trigger duplicate operations
- [ ] If operation fails, error is shown

### AC-4.3: Error States

**Given** any error occurs
**When** the error is displayed
**Then:**
- [ ] Error message is human-readable
- [ ] User has a clear action (retry, go back, contact support)
- [ ] Error is logged for debugging

---

## AC-5: Performance Benchmarks

### AC-5.1: Load Performance

| Test | Condition | Criteria |
|------|-----------|----------|
| Initial page load | Empty cache, 4G | LCP < 2.5s |
| Constellation load | 30 stars | Render < 500ms |
| Conversation load | 50 messages | Render < 1s |

### AC-5.2: Runtime Performance

| Test | Condition | Criteria |
|------|-----------|----------|
| Constellation animation | 30 stars, continuous | 60fps |
| Star addition | Live during conversation | <100ms to appear |
| Message send | User input to display | <100ms |

---

## AC-6: MVP Completion Criteria

The MVP is complete when:

1. ✅ All AC-1 (Authentication) criteria pass
2. ✅ All AC-2 (Conversation) criteria pass
3. ✅ All AC-3 (Constellation) criteria pass
4. ✅ All AC-4 (UX Quality) criteria pass
5. ✅ All AC-5 (Performance) criteria pass
6. ✅ 10 pilot users complete 7-day Mirror
7. ✅ Average "felt seen" score ≥ 3.5/5
8. ✅ Day-7 completion rate ≥ 25%

---

## Test Coverage Matrix

| Feature | Unit | Integration | E2E | Manual |
|---------|------|-------------|-----|--------|
| Auth | ✓ | ✓ | ✓ | ✓ |
| Conversation | ✓ | ✓ | ✓ | ✓ |
| Star extraction | ✓ | ✓ | — | ✓ |
| Constellation render | ✓ | — | ✓ | ✓ |
| Birth Chart reveal | — | — | ✓ | ✓ |
