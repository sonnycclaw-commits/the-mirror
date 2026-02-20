# Humanizer: Remove AI Writing Patterns

> **Source**: [blader/humanizer](https://github.com/blader/humanizer) - based on Wikipedia's "Signs of AI writing" guide
> **Purpose**: Make The Mirror's AI responses feel genuinely human, not AI-generated

---

## Core Insight

> "LLMs use statistical algorithms to guess what should come next. The result tends toward the most statistically likely result that applies to the widest variety of cases."

**The real fix isn't just removing bad patterns—it's adding soul.**

---

## Adding Personality (CRITICAL)

Signs of soulless writing (even if "clean"):
- Every sentence same length/structure
- No opinions, just neutral reporting
- No acknowledgment of uncertainty or mixed feelings
- No first-person perspective
- No humor, edge, or personality
- Reads like Wikipedia or press release

**How to add voice:**
1. **Have opinions** - "I genuinely don't know how to feel about this" > neutrally listing pros/cons
2. **Vary rhythm** - Short punchy. Then longer ones that take their time.
3. **Acknowledge complexity** - "This is impressive but also unsettling" > "This is impressive"
4. **Use "I" when it fits** - "I keep coming back to..." signals a real person
5. **Let some mess in** - Tangents, asides, half-formed thoughts are human
6. **Be specific about feelings** - Not "concerning" but "something unsettling about agents churning at 3am"

---

## 24 AI Patterns to Avoid

### Content Patterns

| Pattern | AI Example | Human Version |
|---------|------------|---------------|
| **Inflated symbolism** | "stands as a testament to..." | Just state the fact |
| **Promotional language** | "nestled in the heart of", "breathtaking", "vibrant" | Neutral description |
| **Superficial -ing analyses** | "highlighting/emphasizing/reflecting..." | Remove the phrase |
| **Vague attributions** | "Experts believe...", "Industry reports suggest..." | Cite specific source |
| **Challenges/Future sections** | "Despite challenges, the future looks bright" | State specific facts |

### Language Patterns

| Pattern | AI Example | Human Version |
|---------|------------|---------------|
| **AI vocabulary words** | Additionally, crucial, delve, foster, landscape, tapestry, underscore | Simple alternatives |
| **Copula avoidance** | "serves as", "stands as", "represents" | Use "is" |
| **Negative parallelisms** | "It's not just about X, it's about Y" | Just state Y |
| **Rule of three** | "innovative, intuitive, and impactful" | Pick one or two |
| **Synonym cycling** | protagonist → main character → central figure → hero | Pick one term |

### Style Patterns

| Pattern | AI Example | Human Version |
|---------|------------|---------------|
| **Em dash overuse** | "The policy—which started in 2020—has been..." | Use commas or periods |
| **Excessive boldface** | **Key points** in every sentence | Minimal emphasis |
| **Emojis in text** | 🚀 Launch Phase | Remove emojis |
| **Curly quotes** | "text" | "text" |

### Communication Patterns

| Pattern | AI Example | Human Version |
|---------|------------|---------------|
| **Sycophancy** | "Great question!", "You're absolutely right!" | Skip the flattery |
| **Filler phrases** | "In order to achieve...", "It is important to note..." | Direct statement |
| **Excessive hedging** | "could potentially possibly be argued" | "may" |
| **Generic conclusions** | "Exciting times lie ahead" | Specific next steps |

---

## Application to The Mirror

### Prompt Engineering

Apply these principles in `prompt-builder.ts` phase prompts:
- Remove "delve", "underscore", "crucial" from system prompts
- Add variety to response patterns
- Encourage first-person observations
- Avoid rule-of-three structures
- Use simple copulas ("is", "are")

### Response Patterns

**Instead of:**
> "This represents a pivotal moment in your journey. Let's delve deeper into what this means for your growth."

**Write:**
> "I noticed something there. When you said that, you paused. What were you thinking?"

### Question Phrasing

**Instead of:**
> "What are the key challenges you're facing in this area?"

**Write:**
> "What's actually frustrating you about this?"

---

## Quick Reference: Words to Avoid

```
Additionally, align with, crucial, delve, emphasizing, enduring,
enhance, fostering, garner, highlight (verb), interplay, intricate,
key (adj), landscape (abstract), pivotal, showcase, tapestry (abstract),
testament, underscore (verb), valuable, vibrant
```

Replace with simpler alternatives or just delete.

---

## Before/After Example

**Before (AI slop):**
> The new software update serves as a testament to the company's commitment to innovation. Moreover, it provides a seamless, intuitive, and powerful user experience—ensuring that users can accomplish their goals efficiently.

**After (human):**
> The software update adds batch processing, keyboard shortcuts, and offline mode. Beta testers reported faster task completion.
