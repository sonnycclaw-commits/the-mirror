# THE MIRROR v2 — Sprint Plan (PROC-007)
## Execution Brief for GLM-5

**Project:** The Mirror — Cosmic Naval Text Adventure
**Executor:** GLM-5 (tachikoma-builder or main session)
**Oversight:** Sonny (claude-sonnet-4.6)
**Repo:** ~/projects/the-mirror
**Mission Control:** ~/projects/mission-control (Convex project ID: jd77kc0vapx98qbb4rjt03xy3981hjq4)
**Spec:** ~/projects/the-mirror/thoughts/concept/BUILD-SPEC-V2.md

---

## Pre-Execution Checklist

Before starting ANY task:
```bash
# Verify environment
printenv OPENROUTER_API_KEY  # Must return sk-or-v1-...
cd ~/projects/the-mirror
ls convex/  # Should show schema.ts, extraction.ts, etc.
ls src/routes/  # Should show __root.tsx, discovery.tsx, etc.
```

If OPENROUTER_API_KEY is empty, check:
```bash
cat ~/.openclaw/agents/main/agent/auth-profiles.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['profiles']['openrouter:default']['key'])"
```
Export it: `export OPENROUTER_API_KEY=<key>`

---

## Sprint 1: Convex Backend (AI Actions)

### TASK 1.1 — Create convex/game/ directory and onboard.ts

**File:** `~/projects/the-mirror/convex/game/onboard.ts`

**Purpose:** Handle the 4-question onboarding interview. Each call processes one question-answer pair and returns extracted signals + next question. After Q4, returns base stats.

**Exact implementation:**

```typescript
import { action } from "../_generated/server";
import { v } from "convex/values";

const QUESTIONS = [
  {
    index: 0,
    text: "Before you take command, the ship needs to know its Captain.\n\nYou find a star no one has named. It's been waiting. What do you do?",
    options: [
      "Name it after yourself",
      "Name it after someone you lost",
      "Leave it unnamed — some things shouldn't be claimed",
      "Look for who should be the one to name it"
    ]
  },
  {
    index: 1,
    text: "Something you built long ago is still being used. You can see it from here. How does that feel?",
    options: null  // free text only
  },
  {
    index: 2,
    text: "You are given a map to a place you've already been. The map is wrong. Do you:",
    options: [
      "Correct it",
      "Follow it anyway — maps have authority",
      "Ignore it and navigate by memory",
      "Find who made it and ask why"
    ]
  },
  {
    index: 3,
    text: "A signal has been travelling toward you your whole life. It arrives tonight. You can ignore it. Do you?",
    options: null  // free text only
  }
];

const BASE_STATS_PROMPT = (answers: string[]) => `
You are a psychological profiling system for a text adventure game.
Based on these 4 answers from a player, generate starting stats (each 8-14) for their character.

Answers:
1. ${answers[0]}
2. ${answers[1]}
3. ${answers[2]}
4. ${answers[3]}

Return ONLY valid JSON, no other text:
{
  "resolve": <8-14>,
  "honesty": <8-14>,
  "connection": <8-14>,
  "clarity": <8-14>,
  "autonomy": <8-14>,
  "depth": <8-14>
}

Higher values for stats that the answers suggest strength in. Lower for areas where answers suggest avoidance or weakness.`;

const EXTRACT_PROMPT = (question: string, answer: string) => `
Extract 1-2 psychological signals from this answer to an onboarding question.

Question: "${question}"
Answer: "${answer}"

Return ONLY valid JSON array, no other text:
[{"domain":"VALUE|NEED|DEFENSE|ATTACHMENT|DEVELOPMENT|PATTERN","type":"specific type","content":"insight in plain language","source":"exact words from answer","confidence":0.7}]

Domains:
- VALUE types: POWER, ACHIEVEMENT, SELF_DIRECTION, SECURITY, BENEVOLENCE, CONFORMITY
- NEED types: AUTONOMY, COMPETENCE, RELATEDNESS (add state: SATISFIED or FRUSTRATED)
- DEFENSE types: DENIAL, RATIONALIZATION, INTELLECTUALIZATION, AVOIDANCE, DISPLACEMENT
- ATTACHMENT types: SECURE, ANXIOUS, AVOIDANT
- DEVELOPMENT types: SOCIALIZED, SELF_AUTHORING, SELF_TRANSFORMING
- PATTERN types: free text describing the behavioral pattern`;

async function callOpenRouter(prompt: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");
  
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "z-ai/glm-5",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    })
  });
  
  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export const processAnswer = action({
  args: {
    questionIndex: v.number(),
    answer: v.string(),
    allAnswers: v.array(v.string()),  // all answers so far
  },
  handler: async (ctx, { questionIndex, answer, allAnswers }) => {
    const question = QUESTIONS[questionIndex];
    const isLast = questionIndex === 3;
    
    // Extract signals from this answer
    let signals = [];
    try {
      const raw = await callOpenRouter(EXTRACT_PROMPT(question.text, answer));
      signals = JSON.parse(raw);
    } catch (e) {
      signals = [];
    }
    
    // If last question, also generate base stats
    let baseStats = null;
    if (isLast) {
      try {
        const raw = await callOpenRouter(BASE_STATS_PROMPT(allAnswers));
        baseStats = JSON.parse(raw);
      } catch (e) {
        baseStats = { resolve: 10, honesty: 10, connection: 10, clarity: 10, autonomy: 10, depth: 10 };
      }
    }
    
    // Next question
    const nextQuestion = isLast ? null : QUESTIONS[questionIndex + 1];
    
    return {
      signals,
      nextQuestion,
      onboardingComplete: isLast,
      baseStats,
    };
  }
});
```

**Verify:** `npx convex run game/onboard:processAnswer '{"questionIndex":0,"answer":"Name it after myself","allAnswers":["Name it after myself"]}' 2>&1`
Expected: JSON with signals array and nextQuestion object.

---

### TASK 1.2 — Create convex/game/play.ts

**File:** `~/projects/the-mirror/convex/game/play.ts`

**Purpose:** Handle each game turn. Three AI calls: extract → judge → scene.

```typescript
import { action } from "../_generated/server";
import { v } from "convex/values";

async function callOpenRouter(prompt: string, maxTokens = 400): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");
  
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "z-ai/glm-5",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens
    })
  });
  
  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

const PLANETS: Record<string, { name: string; domain: string; opening: string }> = {
  "cartographer": {
    name: "AETHON-7 — The Cartographer",
    domain: "SELF_DIRECTION vs CONFORMITY",
    opening: `You land on a planet that is entirely a map of itself.\n\nThe surface is covered in lines — routes, territories, names. But in the northwest quadrant, there's a blank space.\n\nNo one has been there. Or if they have, they didn't map it. Your crew is watching to see what you do.\n\nSuggestions:\nA) Map it yourself\nB) Send a crew member first\nC) Leave it blank — some spaces should stay unknown\nD) Check if anyone mapped it before\n\nOr type your own action.`
  }
};

const EXTRACT_PROMPT = (input: string, planetId: string, history: string) => `
Extract 1-2 psychological signals from this player action in a space adventure game.

Planet: ${PLANETS[planetId]?.name || planetId}
Player action: "${input}"
Recent signal history: ${history || "none yet"}

Return ONLY valid JSON array:
[{"domain":"VALUE|NEED|DEFENSE|ATTACHMENT|DEVELOPMENT|PATTERN","type":"specific","content":"insight","source":"exact words","confidence":0.7}]`;

const JUDGE_PROMPT = (input: string, signals: any[], history: any[], turnCount: number) => {
  const patternCount = history.filter(s => signals.some(ns => ns.type === s.type)).length;
  return `You are the Ship's Log. Record this action with dry precision. Naval tone. No emotion. Just facts.

Captain did: "${input}"
Signals: ${signals.map(s => `${s.domain}/${s.type}: ${s.content}`).join(", ")}
${patternCount >= 2 ? `This pattern has appeared ${patternCount + 1} times.` : ""}
Turn: ${turnCount + 1}

Write a Ship's Log entry. Format: "SHIP LOG — [dry observation, 1-2 sentences max]"
If pattern repeating: name it without judgment. "Pattern confirmed: [name]. [count] instances."
Never moralise. Just record.`;
};

const SCENE_PROMPT = (input: string, planetId: string, signals: any[], history: any[], turnCount: number, shipState: any) => `
You are the Scene Generator for a cosmic naval text adventure.

Planet: ${PLANETS[planetId]?.name || planetId}
Captain did: "${input}"
Extracted: ${signals.map(s => `${s.domain}/${s.type}`).join(", ")}
Turn: ${turnCount + 1}
Hull: ${shipState?.hull || 100}% | Morale: ${shipState?.morale || 100}%

Rules:
- 2-4 sentences
- Cosmic, naval, atmospheric — not domestic
- End with pressure or implicit question
- Do NOT resolve. Scene tightens.
- If DEFENSE detected: pressure that defense
- If AVOIDANCE: the avoided thing follows

Generate next scene moment:`;

function rollD20(statValue: number): { roll: number; modified: number; outcome: string } {
  const roll = Math.floor(Math.random() * 20) + 1;
  const modifier = Math.floor((statValue - 10) / 2);
  const modified = roll + modifier;
  return {
    roll,
    modified,
    outcome: roll === 20 ? "critical" : roll === 1 ? "fumble" : modified >= 15 ? "success" : modified >= 10 ? "partial" : "failure"
  };
}

function getStatForScene(signals: any[], stats: any): { stat: string; value: number } {
  if (signals.some(s => s.domain === "DEFENSE")) return { stat: "honesty", value: stats?.honesty || 10 };
  if (signals.some(s => s.domain === "ATTACHMENT")) return { stat: "connection", value: stats?.connection || 10 };
  if (signals.some(s => s.type === "AUTONOMY")) return { stat: "autonomy", value: stats?.autonomy || 10 };
  return { stat: "resolve", value: stats?.resolve || 10 };
}

export const takeTurn = action({
  args: {
    planetId: v.string(),
    playerInput: v.string(),
    signalHistory: v.array(v.any()),
    turnCount: v.number(),
    shipState: v.any(),
    playerStats: v.optional(v.any()),
  },
  handler: async (ctx, { planetId, playerInput, signalHistory, turnCount, shipState, playerStats }) => {
    const historyStr = signalHistory.slice(-5).map((s: any) => `${s.domain}/${s.type}`).join(", ");
    
    // 1. Extract
    let signals = [];
    try {
      const raw = await callOpenRouter(EXTRACT_PROMPT(playerInput, planetId, historyStr));
      signals = JSON.parse(raw);
    } catch (e) {
      signals = [];
    }
    
    // 2. Judge
    let judgment = "";
    try {
      judgment = await callOpenRouter(JUDGE_PROMPT(playerInput, signals, signalHistory, turnCount));
    } catch (e) {
      judgment = `SHIP LOG — Turn ${turnCount + 1}. Captain acted. Course continues.`;
    }
    
    // 3. Scene
    let nextScene = "";
    try {
      nextScene = await callOpenRouter(SCENE_PROMPT(playerInput, planetId, signals, signalHistory, turnCount, shipState));
    } catch (e) {
      nextScene = "The planet holds its silence. Your crew waits.";
    }
    
    // 4. Roll
    const { stat, value } = getStatForScene(signals, playerStats);
    const rollResult = rollD20(value);
    
    // 5. Ship state update
    const patternCount = signalHistory.filter((s: any) => signals.some(ns => ns.type === s.type)).length;
    const hullDelta = signals.some(s => s.domain === "DEFENSE") ? -3 : rollResult.outcome === "success" ? 2 : 0;
    const moraleDelta = signals.some(s => s.domain === "ATTACHMENT" && s.type === "AVOIDANT") ? -4 : 0;
    
    // 6. Clear condition
    const cleared = patternCount >= 3 || turnCount >= 7;
    const clearReason = patternCount >= 3 
      ? `Pattern Confirmed: ${signals[0]?.type || "unknown"}`
      : turnCount >= 7 ? "Voyage Complete" : null;
    
    return {
      signals,
      judgment,
      nextScene: cleared ? null : nextScene,
      rollResult: { stat, ...rollResult },
      shipStateUpdate: { hullDelta, moraleDelta },
      cleared,
      clearReason,
      clearMessage: cleared ? `The planet releases you. Pattern logged in the ship's record.` : null,
      clearProgress: Math.min(1, (signalHistory.length + signals.length) / 8),
    };
  }
});
```

**Verify:** 
```bash
npx convex run game/play:takeTurn '{"planetId":"cartographer","playerInput":"I map it myself","signalHistory":[],"turnCount":0,"shipState":{"hull":100,"morale":100}}' 2>&1
```
Expected: JSON with signals, judgment (starts with "SHIP LOG —"), nextScene, rollResult, cleared: false.

---

### TASK 1.3 — Update convex/schema.ts

Add to the existing schema (find the `export default defineSchema({` line and add tables):

```typescript
gameSessions: defineTable({
  sessionId: v.string(),
  userId: v.optional(v.string()),
  currentPlanet: v.string(),
  shipState: v.object({
    hull: v.number(),
    morale: v.number(),
  }),
  playerStats: v.object({
    resolve: v.number(),
    honesty: v.number(),
    connection: v.number(),
    clarity: v.number(),
    autonomy: v.number(),
    depth: v.number(),
  }),
  signalHistory: v.array(v.any()),
  onboardingComplete: v.boolean(),
  onboardingAnswers: v.array(v.string()),
  unlockedNodes: v.array(v.string()),
  turnCount: v.number(),
}).index("by_sessionId", ["sessionId"]),

gameSignals: defineTable({
  sessionId: v.string(),
  domain: v.string(),
  type: v.string(),
  content: v.string(),
  source: v.string(),
  confidence: v.number(),
  planetId: v.string(),
  turnCount: v.number(),
}).index("by_sessionId", ["sessionId"]),
```

**Verify:** `cd ~/projects/the-mirror && npx convex dev --once 2>&1 | tail -5`
Expected: No errors, schema push successful.

---

## Sprint 2: Frontend Game Route

### TASK 2.1 — Create src/routes/game.tsx

**File:** `~/projects/the-mirror/src/routes/game.tsx`

This is the main game interface. Two panels. Chat left, ship status right.

Write the complete file. Key requirements:

1. **State management (useState):**
   - `phase`: "onboarding" | "playing" | "cleared"
   - `questionIndex`: 0-3
   - `allAnswers`: string[]
   - `messages`: { id, role: "scene"|"player"|"log"|"system", content }[]
   - `signalHistory`: Signal[]
   - `shipState`: { hull: 100, morale: 100 }
   - `playerStats`: { resolve, honesty, connection, clarity, autonomy, depth }
   - `unlockedNodes`: string[]
   - `currentPlanet`: "cartographer"
   - `input`: string
   - `isLoading`: boolean
   - `sessionId`: string (generate with crypto.randomUUID() on mount)
   - `selectedOption`: string | null (for MCQ)

2. **Onboarding screen:**
   - Shows question text
   - If question has options: 4 buttons, each sets selectedOption
   - Free text input always visible ("Or in your own words...")
   - Submit button (disabled if nothing selected/typed)
   - Progress indicator "Q{n}/4"
   - On submit: calls `useAction(api.game.onboard.processAnswer)`
   - After Q4: transitions to "playing" phase, sets playerStats

3. **Playing screen — left panel (messages):**
   - Map over messages array
   - `scene` role: white text, prose
   - `player` role: `text-blue-400`, prefixed with "> "
   - `log` role: amber, monospace font, preserves "SHIP LOG —" prefix
   - `system` role: green bordered box
   - Input form at bottom
   - On submit: calls `useAction(api.game.play.takeTurn)`

4. **Playing screen — right panel:**
   - **Ship Status:**
     - Planet name
     - Hull: progress bar (green → red as degrades)
     - Morale: progress bar
     - Stats list: resolve/honesty/connection/clarity/autonomy/depth with values
   - **Constellation Map:**
     - SVG element, 300x300
     - 6 static star positions (one per stat domain)
     - Each star: dim (opacity-20) until unlocked, bright gold when unlocked
     - Unlocked = when that stat's pattern has been confirmed
     - Label shows pattern name when unlocked

5. **Styling:**
   - Background: `bg-[#0a0f1e]`
   - Text: `text-slate-100`
   - Gold accent: `text-[#d4a843]` or `border-[#d4a843]`
   - Ship log: `font-mono text-amber-400`
   - Star field: CSS background with radial-gradient dots or use `bg-slate-900`

6. **Route definition:**
```typescript
export const Route = createFileRoute('/game')({
  component: GamePage,
})
```

Use `useAction` from `convex/react` to call Convex actions.
Import api from `../../convex/_generated/api`.

**Verify:** Route renders without crashing. Onboarding screen shows.

---

### TASK 2.2 — Add /game link to navigation

**File:** `~/projects/the-mirror/src/components/Header.tsx` (or wherever nav is)

Add a link to `/game` next to existing nav items.

```typescript
<Link to="/game" className="...">Play</Link>
```

---

## Sprint 3: Integration & Testing

### TASK 3.1 — Deploy Convex backend

```bash
cd ~/projects/the-mirror
npx convex dev --once 2>&1
```

If errors: read them carefully. Most common issues:
- Import paths wrong: check `from "../_generated/server"` is correct
- Schema syntax: match existing table definitions exactly
- Action vs mutation: use `action` for AI calls (requires `"use node"` at top of file)

**IMPORTANT:** Add `"use node";` as the FIRST LINE of both game/onboard.ts and game/play.ts.
Convex actions that use fetch() MUST have `"use node";` at the top.

**Verify:** `npx convex run game/onboard:processAnswer '{"questionIndex":0,"answer":"test","allAnswers":["test"]}' 2>&1`

### TASK 3.2 — Start dev server and test

```bash
cd ~/projects/the-mirror
# Check if .env.local exists with VITE_CONVEX_URL
cat .env.local 2>/dev/null || echo "No .env.local"

# If no .env.local, create it:
# Get the Convex URL from npx convex dev output
npx convex dev 2>&1 | head -20
```

Create `.env.local` if missing:
```
VITE_CONVEX_URL=https://[your-deployment].convex.cloud
```

Then:
```bash
npm run dev &
sleep 5
curl -s http://localhost:3000/game | head -10
```

### TASK 3.3 — Smoke test full flow

1. Open http://localhost:3000/game
2. Complete onboarding (all 4 questions)
3. Verify stats generated
4. Submit one action in Planet 001
5. Verify: judgment starts with "SHIP LOG —"
6. Verify: ship state updates
7. Verify: signal extracted

---

## Sprint 4: Mission Control Sync

### TASK 4.1 — Update task statuses

```bash
cd ~/projects/mission-control

# Get all task IDs for The Mirror project
npx convex run tasks:list '{"projectId":"jd77kc0vapx98qbb4rjt03xy3981hjq4"}' 2>&1 > /tmp/tasks.json
cat /tmp/tasks.json

# Mark each task done — replace TASK_ID with actual IDs from above
# Tasks to mark done: all 6 existing tasks
```

For each task ID returned, run:
```bash
npx convex run tasks:update '{"id":"TASK_ID_HERE","status":"done"}' 2>&1
```

Then create v2 task:
```bash
npx convex run tasks:create '{"title":"v2: Cosmic naval theme, Convex AI, constellation panel","projectId":"jd77kc0vapx98qbb4rjt03xy3981hjq4","priority":"p0","description":"Build per BUILD-SPEC-V2.md. Convex actions for AI. Ship status + constellation panel. Onboarding interview."}' 2>&1
```

---

## Completion Criteria

**Sprint 1 done when:**
- [ ] `convex/game/onboard.ts` exists and returns signals + nextQuestion
- [ ] `convex/game/play.ts` exists and returns judgment starting with "SHIP LOG —"
- [ ] Schema updated with gameSessions + gameSignals tables
- [ ] `npx convex dev --once` completes with no errors

**Sprint 2 done when:**
- [ ] `/game` route renders onboarding screen
- [ ] MCQ options clickable, free text input works
- [ ] After Q4: transitions to planet view
- [ ] Message types styled correctly (white/blue/amber/green)
- [ ] Ship status panel shows hull/morale/stats
- [ ] Constellation panel renders (even if no nodes lit yet)

**Sprint 3 done when:**
- [ ] Full onboarding flow works end-to-end
- [ ] One full game turn works: input → extraction → judgment → scene
- [ ] Ship state updates after each turn
- [ ] No console errors

**Sprint 4 done when:**
- [ ] All 6 old tasks marked done in Mission Control
- [ ] New v2 task created

---

## Known Issues & Mitigations

| Issue | Mitigation |
|-------|-----------|
| Convex action needs `"use node"` for fetch() | First line of any action file using fetch |
| OPENROUTER_API_KEY not in Convex env | Add via Convex dashboard or `npx convex env set OPENROUTER_API_KEY sk-or-...` |
| VITE_CONVEX_URL missing | Run `npx convex dev` once, it outputs the URL |
| GLM-5 returns non-JSON | Wrap all JSON.parse in try/catch with sensible fallbacks |
| TanStack router not picking up /game | Ensure file is at `src/routes/game.tsx` exactly |

---

## Report Format (when complete)

```
SPRINT REPORT
─────────────
Sprint 1 (Backend): DONE / PARTIAL / BLOCKED
Sprint 2 (Frontend): DONE / PARTIAL / BLOCKED  
Sprint 3 (Integration): DONE / PARTIAL / BLOCKED
Sprint 4 (MC Sync): DONE / PARTIAL / BLOCKED

Working URL: http://localhost:3000/game [or blocked reason]
Judgment voice sample: [paste one judgment line]
Blockers: [list any]
```
