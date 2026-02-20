# Discovery Interview Visual Specification

**The excavation UI — AI-driven, context-dependent**

---

## Core Principle

This is **NOT** a quiz with branching logic. TARS runs the interview, generates context-dependent questions and chip options based on the user's profile, and outputs structured data to feed the graph.

---

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                         TARS (AI)                             │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ • Reads current profile state                         │     │
│  │ • Generates next question                             │     │
│  │ • Generates context-dependent chip options            │     │
│  │ • Processes response → structured output             │     │
│  │ • Updates graph                                       │     │
│  └──────────────────────────────────────────────────────┘     │
│                              ↓                                │
│                    Structured Response                        │
│         { question, chips[], allowFreeform, phase }           │
│                              ↓                                │
│                      ┌─────────────┐                          │
│                      │     UI      │                          │
│                      └─────────────┘                          │
└───────────────────────────────────────────────────────────────┘
```

---

## UI Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │ TARS: [AI-generated question based on profile]       │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                             │
│   ┌──────────────────┐ ┌──────────────────┐                │
│   │ [AI-generated    │ │ [AI-generated    │                │
│   │  option A]       │ │  option B]       │                │
│   └──────────────────┘ └──────────────────┘                │
│   ┌──────────────────┐ ┌──────────────────┐                │
│   │ [AI-generated    │ │ Something else   │                │
│   │  option C]       │ │                  │                │
│   └──────────────────┘ └──────────────────┘                │
│                                                             │
│   ┌──────────────────────────────────────────┐ ┌─────────┐ │
│   │  Or speak...                             │ │   🎙️   │ │
│   └──────────────────────────────────────────┘ └─────────┘ │
│                                                             │
│                    ○ ○ ◉ ○ ○ ○ ○                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## State & Navigation

| Behavior | Specification |
|----------|---------------|
| **Current question visible** | Only the active question shown |
| **Sticky scroll** | Locked to current question by default |
| **History accessible** | Swipe up / pull down with friction to view past |
| **Can't edit past** | Read-only, but can see what you said |

---

## Chip Generation

Chips are **NOT** pre-defined. TARS generates them based on:
- User's existing star map
- Prior answers in this interview
- Domain context
- Common patterns for this question type

```typescript
interface TarsResponse {
  question: string;
  chips: ChipOption[];      // AI-generated, context-dependent
  allowFreeform: boolean;   // Can user type/speak freely?
  phase: string;            // "excavation" | "patterns" | "shadows" | etc
  followUp?: string;        // If probing deeper
}

interface ChipOption {
  label: string;            // Display text
  value: string;            // Semantic meaning
  probes?: boolean;         // Does this trigger deeper conversation?
}
```

---

## Probing Deeper

When user selects "Something else" or TARS needs to explore:

1. Chips fade out
2. Text/voice input becomes prominent
3. Full conversational mode
4. TARS can return to chips when ready

---

## Structured Output

Every response feeds the graph:

```typescript
interface InterviewOutput {
  stars: StarDelta[];       // New or modified stars
  connections: ConnectionDelta[];
  phase: PhaseUpdate;
  context: ContextUpdate;   // For next question
}
```

---

## Visual Elements

| Element | Specification |
|---------|---------------|
| **TARS Message** | Fraunces italic, left-aligned |
| **Chips** | Glass pills, context-dependent content |
| **Voice** | 🎙️ icon, listening state animation |
| **Progress** | Phase dots (not step numbers) |
| **Background** | Dim star field, very subtle |

---

*"TARS drives the conversation. The UI renders structured output."*

