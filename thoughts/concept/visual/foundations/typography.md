# Typography System

**Font stack, type scale, and usage guidelines for S.T.A.R.S.**

> *Source: Extracted from [Visual Design Architecture](../../../ideation/_deep_research/visual_design_architecture.md)*

---

## Design Intent

Typography in S.T.A.R.S. encodes **wisdom level**:
- **Serif** → Soul, wisdom, TARS's voice (*"This is ancient knowledge"*)
- **Sans** → Body text, conversation, explanations (*"This is clear communication"*)
- **Mono** → Labels, data, timestamps (*"This is precise measurement"*)

---

## Font Stack

### Primary: Inter

**Purpose:** Primary UI font for all interface elements.

**Why:**
- Highly legible at small sizes
- Humanist warmth
- Extensive language support
- Variable font capabilities
- Free & open source

**Weights Used:**
| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, descriptions |
| Medium | 500 | Emphasis, labels, navigation |
| SemiBold | 600 | Subheadings, buttons |
| Bold | 700 | Headings, titles |

**Source:** [rsms.me/inter](https://rsms.me/inter/)
**License:** SIL Open Font License 1.1

---

### Secondary: Fraunces

**Purpose:** Display font for emotional moments, insights, celebrations.

**Why:**
- Soft, organic serifs add warmth
- Variable "wonk" and "softness" axes allow playful expression
- Creates contrast with Inter

**Usage:**
- Insight reveal headlines
- Achievement celebration text
- Onboarding welcome messages
- Pull quotes from user's own words

**Weights Used:**
| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body quotes |
| SemiBold | 600 | Emphasis |
| Bold | 700 | Headlines |

**Source:** [github.com/undercasetype/Fraunces](https://github.com/undercasetype/Fraunces)
**License:** SIL Open Font License 1.1

---

### Monospace: JetBrains Mono

**Purpose:** Data displays, progress numbers, timestamps.

**Why:**
- Clear number distinction
- Excellent legibility

**Usage:**
- Percentage displays (e.g., "67%")
- Day counters (e.g., "Day 7")
- Time stamps
- Numeric data in charts
- Star map coordinates

**Source:** [jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/)
**License:** SIL Open Font License 1.1

---

## Type Scale

**Base:** 16px | **Scale:** 1.25 (Major Third)

### Display

| Token | Size | Line-Height | Weight | Tracking | Usage |
|-------|------|-------------|--------|----------|-------|
| `display-xl` | 48px | 1.1 | 700 | -0.02em | Hero |
| `display-lg` | 40px | 1.15 | 700 | -0.02em | Page title |
| `display-md` | 32px | 1.2 | 700 | -0.01em | Section |

### Heading

| Token | Size | Line-Height | Weight | Tracking | Usage |
|-------|------|-------------|--------|----------|-------|
| `heading-xl` | 28px | 1.25 | 600 | -0.01em | Card title |
| `heading-lg` | 24px | 1.3 | 600 | 0 | Subsection |
| `heading-md` | 20px | 1.35 | 600 | 0 | Component |
| `heading-sm` | 18px | 1.4 | 600 | 0 | Label |

### Body

| Token | Size | Line-Height | Weight | Tracking | Usage |
|-------|------|-------------|--------|----------|-------|
| `body-lg` | 18px | 1.6 | 400 | 0 | Lead text |
| `body-md` | 16px | 1.6 | 400 | 0 | Body |
| `body-sm` | 14px | 1.5 | 400 | 0.01em | Secondary |

### Caption

| Token | Size | Line-Height | Weight | Tracking | Usage |
|-------|------|-------------|--------|----------|-------|
| `caption-lg` | 13px | 1.4 | 500 | 0.02em | Labels |
| `caption-md` | 12px | 1.4 | 500 | 0.02em | Metadata |
| `caption-sm` | 11px | 1.3 | 500 | 0.03em | Footnotes |

### Button

| Token | Size | Line-Height | Weight | Tracking | Usage |
|-------|------|-------------|--------|----------|-------|
| `button-lg` | 16px | 1 | 600 | 0.02em | Primary |
| `button-md` | 14px | 1 | 600 | 0.02em | Secondary |
| `button-sm` | 12px | 1 | 600 | 0.03em | Tertiary |

---

## Usage by Context

### Chat Interface

| Element | Specification |
|---------|--------------|
| AI Messages | `body-md` (16px), Inter Regular |
| User Messages | `body-md` (16px), Inter Regular |
| System Messages | `caption-md` (12px), Inter Medium, `twilight-300` |
| Timestamps | `caption-sm` (11px), JetBrains Mono, `twilight-200` |

### Insight Reveals

| Element | Specification |
|---------|--------------|
| Insight Headline | `heading-lg` (24px), Fraunces Bold |
| Insight Body | `body-lg` (18px), Inter Regular |
| User Quote | `body-lg` (18px), Fraunces Regular, Italic |

### Prompts & Questions

| Element | Specification |
|---------|--------------|
| Main Prompt | `body-lg` (18px), Inter Medium |
| Supporting Text | `body-md` (16px), Inter Regular, `twilight-400` |
| Options/Choices | `body-md` (16px), Inter Medium |

### Progress & Data

| Element | Specification |
|---------|--------------|
| Percentage Large | `display-md` (32px), JetBrains Mono Bold |
| Percentage Small | `heading-md` (20px), JetBrains Mono Medium |
| Progress Labels | `caption-lg` (13px), Inter Medium |

### Star Map

| Element | Specification |
|---------|--------------|
| Node Title | `caption-lg` (13px), Inter SemiBold |
| Node Description | `caption-md` (12px), Inter Regular |
| Domain Labels | `caption-md` (12px), Inter Medium, Uppercase, 60% opacity |
| Category Label | `caption-sm` (11px), Inter Medium, Uppercase |

---

## Readability Specifications

### Line Length

| Context | Characters |
|---------|------------|
| Optimal | 50-75 per line |
| Mobile | 35-50 per line |
| Chat bubbles | Max 280px width (≈45 characters) |

### Paragraph Spacing

| Spacing | Value |
|---------|-------|
| Between paragraphs | 1.5× line height (24px for `body-md`) |
| After headings | 1× line height (16px for `body-md`) |
| Before headings | 2× line height (32px for `body-md`) |

### Dynamic Type Support

- Support iOS Dynamic Type and Android font scaling
- Test at 100%, 150%, and 200% scaling
- Layouts must not break at 200% scaling
- Minimum touch target: 44×44px regardless of text size

### Cognitive Load Reduction

- Maximum **2 typefaces** per screen
- Maximum **3 type sizes** per screen
- Consistent alignment (left-aligned for LTR languages)
- Avoid justified text (uneven word spacing)
- Use sentence case, not ALL CAPS (except labels)

---

*"Never use mono for emotional content. Never use serif for data labels. The typeface immediately signals the register of the communication."*
