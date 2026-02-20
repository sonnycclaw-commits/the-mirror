# Life OS: Pathway Visualization System

**Version:** 1.0
**Date:** 2026-01-13
**Purpose:** Design the visual "GPS" for personal development
**Inspiration:** ReactFlow, XYFlow, node-based editors

---

## The Vision

> A visual map showing where you are, where you're going, and the paths available - that updates as you grow.

**Key Differentiator:** Unlike static roadmaps, this is ALIVE:
- Nodes unlock based on your progress
- Paths appear/disappear based on your choices
- Your position moves as the AI detects growth
- The whole map can restructure based on profile evolution

---

## Reference Libraries & Patterns

### Web (React)
| Library | Features | Notes |
|---------|----------|-------|
| **ReactFlow** | Nodes, edges, handles, mini-map, controls | Most popular, great DX |
| **XYFlow** | ReactFlow rebrand + SvelteFlow | Same team |
| **React Diagrams** | Canvas-based, customizable | More low-level |
| **Reaflow** | ReactFlow alternative | Simpler API |
| **Beautiful React Diagrams** | Lightweight | Less features |

### React Native Options
| Library | Status | Notes |
|---------|--------|-------|
| **react-native-graph** | Active | Shopify, performance-focused |
| **react-native-svg + custom** | Manual | Full control, more work |
| **react-native-skia** | Active | High-performance canvas |
| **WebView + ReactFlow** | Hybrid | Use web lib in native shell |
| **Custom with Reanimated** | Manual | Gestures + animations |

### Recommendation for MVP
```
APPROACH: Hybrid or Simplified

Option A: WebView + ReactFlow
├── Pros: Full ReactFlow features, faster dev
├── Cons: Performance, native feel
└── Best for: Complex interactions, web parity

Option B: react-native-svg + custom nodes
├── Pros: Native performance, full control
├── Cons: More development time
└── Best for: Simple maps, custom design

Option C: Simplified list/tree (MVP)
├── Pros: Ship fast, prove value
├── Cons: Less "wow" factor
└── Best for: MVP, upgrade later

RECOMMENDATION: Option C for MVP, Option A or B for v1.2+
```

---

## Data Model for Pathway System

### Core Entities

```typescript
// ═══════════════════════════════════════════════════════════════════
// PATHWAY TEMPLATE (Defined by us)
// ═══════════════════════════════════════════════════════════════════

interface PathwayTemplate {
  id: string;
  name: string;                    // "Unfuck Your Life"
  description: string;

  // Target audience
  forProfiles: {
    sdtNeeds?: Partial<SDTProfile>;
    patterns?: string[];
    blockers?: string[];
  };

  // The node structure
  nodes: PathwayNode[];
  edges: PathwayEdge[];

  // Entry/exit
  entryNodeId: string;
  goalNodeIds: string[];           // Multiple possible end states

  // Metadata
  estimatedDuration: string;       // "4-8 weeks"
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface PathwayNode {
  id: string;
  type: NodeType;

  // Display
  label: string;
  description: string;
  icon?: string;

  // Position (for layout)
  position: { x: number; y: number };

  // Requirements
  prerequisites: string[];         // Node IDs that must be complete
  unlockConditions?: UnlockCondition[];

  // Content
  content: NodeContent;

  // Completion
  completionCriteria: CompletionCriteria;
  estimatedTime: string;
}

type NodeType =
  | 'milestone'      // Major achievement
  | 'skill'          // Skill to develop
  | 'checkpoint'     // Reflection/assessment point
  | 'decision'       // Branch point (user chooses path)
  | 'challenge'      // "Boss fight" - intensive work
  | 'integration'    // Rest/consolidation period
  | 'goal';          // End state

interface PathwayEdge {
  id: string;
  source: string;                  // Node ID
  target: string;                  // Node ID

  // Conditional edges
  condition?: EdgeCondition;       // When this path appears

  // Display
  label?: string;
  style?: 'default' | 'optional' | 'recommended' | 'locked';
}

interface EdgeCondition {
  type: 'profile' | 'choice' | 'skill' | 'time';
  requirement: any;                // Depends on type
}
```

### User's Pathway Instance

```typescript
// ═══════════════════════════════════════════════════════════════════
// USER PATHWAY (Personalized instance)
// ═══════════════════════════════════════════════════════════════════

interface UserPathway {
  id: string;
  userId: string;
  templateId: string;              // Which pathway template

  // Current state
  currentNodeId: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';

  // Progress tracking
  nodeProgress: Map<string, NodeProgress>;

  // Personalization
  personalizedNodes: PathwayNode[]; // AI-modified nodes
  personalizedEdges: PathwayEdge[]; // AI-added/removed paths

  // History
  pathTaken: string[];             // Ordered list of completed nodes
  decisionsLog: Decision[];        // User choices at branch points

  // Timing
  startedAt: number;
  lastActivityAt: number;
  estimatedCompletionAt?: number;
}

interface NodeProgress {
  nodeId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'skipped';

  // Completion tracking
  startedAt?: number;
  completedAt?: number;

  // Evidence
  completionEvidence?: string[];   // What they did/said
  skillsUnlocked?: string[];
  insightsGained?: string[];

  // Quality
  engagementScore?: number;        // How deeply they engaged
  confidenceGained?: number;       // Profile confidence change
}

interface Decision {
  nodeId: string;
  timestamp: number;
  chosenPath: string;              // Edge ID
  alternativePaths: string[];      // What else was available
  rationale?: string;              // Why they chose (if captured)
}
```

### AI Pathway Generation

```typescript
// ═══════════════════════════════════════════════════════════════════
// AI PATHWAY GENERATION
// ═══════════════════════════════════════════════════════════════════

interface PathwayGenerationInput {
  // User's current state
  profile: PsychometricProfile;
  currentSkills: Skill[];
  blockers: Blocker[];

  // User's goal
  goalState: GoalDefinition;

  // Constraints
  timeAvailable: 'minimal' | 'moderate' | 'intensive';
  preferences: UserPreferences;

  // Template to personalize
  templateId?: string;             // If modifying existing
}

interface PathwayGenerationOutput {
  // The personalized pathway
  pathway: UserPathway;

  // Explanation
  rationale: {
    whyThisPath: string;
    keyMilestones: string[];
    expectedChallenges: string[];
    alternativePathsConsidered: string[];
  };

  // Predictions
  predictions: {
    estimatedDuration: string;
    difficultyAssessment: string;
    likelyBlockers: string[];
    successProbability: number;
  };
}

// How the AI personalizes a pathway
interface PathwayPersonalization {
  // Add nodes based on detected blockers
  addedNodes: {
    node: PathwayNode;
    reason: string;               // "Based on your pattern of X"
  }[];

  // Skip nodes user doesn't need
  skippedNodes: {
    nodeId: string;
    reason: string;               // "You've already demonstrated X"
  }[];

  // Modify existing nodes
  modifiedNodes: {
    nodeId: string;
    modifications: {
      field: string;
      original: any;
      personalized: any;
      reason: string;
    }[];
  }[];

  // Adjust edge weights/recommendations
  edgeAdjustments: {
    edgeId: string;
    originalWeight: number;
    newWeight: number;
    reason: string;
  }[];
}
```

---

## Visual Design Concepts

### Node Types & Styling

```
NODE TYPE VISUAL LANGUAGE
═════════════════════════

MILESTONE (Major Achievement)
┌─────────────────────────┐
│  ⭐                      │
│  SELF-AWARENESS         │
│  UNLOCKED               │
│  ─────────────────────  │
│  "You can now recognize │
│   your patterns as      │
│   they happen"          │
└─────────────────────────┘
Style: Large, prominent, celebration color

SKILL (Capability Building)
┌───────────────────┐
│  🎯 REFRAME       │
│  Level 2/5        │
│  ████████░░ 80%   │
└───────────────────┘
Style: Medium, progress indicator

CHECKPOINT (Reflection Point)
┌───────────────────┐
│  📍 WEEK 2        │
│  CHECK-IN         │
│  [Start Review]   │
└───────────────────┘
Style: Neutral, action-oriented

DECISION (Branch Point)
        ┌─────────────────┐
        │  🔀 CHOOSE PATH  │
        │                 │
        │  Where do you   │
        │  want to focus? │
        └────────┬────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
[Career]   [Relationships]  [Health]

Style: Diamond shape, branching visual

CHALLENGE ("Boss Fight")
╔═════════════════════════╗
║  🔥 BOSS FIGHT          ║
║  ═══════════════════    ║
║  THE ANTI-VISION        ║
║  CONFRONTATION          ║
║                         ║
║  Estimated: 3 sessions  ║
║  Difficulty: ████░      ║
╚═════════════════════════╝
Style: Emphasized, "epic" feeling

INTEGRATION (Rest/Consolidate)
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  🌱 INTEGRATION
     WEEK
  Let insights
│ settle            │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
Style: Soft, dashed border, calming

GOAL (End State)
        ╭─────────────────╮
       ╱                   ╲
      │   🏆 GOAL STATE    │
      │                    │
      │   "Living aligned  │
      │    with my values" │
       ╲                   ╱
        ╰─────────────────╯
Style: Glowing, aspirational
```

### Map Layout Options

```
OPTION 1: VERTICAL JOURNEY (Mobile-Friendly)
════════════════════════════════════════════

         [GOAL]
            ▲
            │
    ┌───────┴───────┐
    │               │
  [Node]         [Node]
    │               │
    └───────┬───────┘
            │
         [Node]
            │
    ┌───────┴───────┐
    │               │
  [Node]         [Node]
    │               │
    └───────┬───────┘
            │
         [YOU]

Pros: Natural scroll, mobile-native
Cons: Limited horizontal branching


OPTION 2: RADIAL/ORBITAL
════════════════════════

              [GOAL]
             /      \
          [M3]    [M4]
          /          \
       [M2]──[YOU]──[M5]
          \          /
          [M1]    [M6]
             \      /
             [START]

Pros: Shows all options, visually interesting
Cons: Complex on mobile, orientation unclear


OPTION 3: SKILL TREE (Game-Inspired)
════════════════════════════════════

     [MASTERY]
        │
   ┌────┼────┐
   │    │    │
  [A3] [B3] [C3]    ← Advanced
   │    │    │
   ├────┼────┤
   │    │    │
  [A2] [B2] [C2]    ← Intermediate
   │    │    │
   ├────┼────┤
   │    │    │
  [A1] [B1] [C1]    ← Foundational
   │    │    │
   └────┼────┘
        │
     [START]

Pros: Familiar, shows progression levels
Cons: Less flexible for branching journeys


OPTION 4: FREE-FORM GRAPH (ReactFlow-style)
═══════════════════════════════════════════

   [Node]───────[Node]
      │            │
      │    [Node]──┤
      │       │    │
   [YOU]──────┼────┤
      │       │    │
      │    [Node]──┤
      │            │
   [Node]───────[Node]
                   │
                [GOAL]

Pros: Maximum flexibility, shows real complexity
Cons: Can be overwhelming, harder on mobile


RECOMMENDATION FOR MVP:
Option 1 (Vertical) for mobile
Option 4 (Free-form) for future web/tablet
```

### Current Position Indicator

```
"YOU ARE HERE" VISUALIZATION
════════════════════════════

Option A: Pulsing Node
┌─────────────────────────┐
│  ◉ ← Pulsing animation  │
│  YOU ARE HERE           │
│                         │
│  "Working on:           │
│   Pattern Recognition"  │
└─────────────────────────┘

Option B: Avatar/Character
┌─────────────────────────┐
│  🧑 ← User avatar       │
│  Current Quest:         │
│  "Identify 3 triggers"  │
└─────────────────────────┘

Option C: Progress Trail
    [Completed] ✓
         │
         │ (solid line = done)
         │
    [Current] ◉ ← YOU
         │
         ┊ (dashed line = ahead)
         ┊
    [Next] ○

Option D: Highlighted Path
    ░░░░░░░░░░░░░░░░░
    ░ [Done] → [Done] → [YOU] → [Next] → ??? ░
    ░░░░░░░░░░░░░░░░░

Style: Glowing current position, dimmed future
```

### Locked vs Unlocked States

```
NODE STATES
═══════════

COMPLETED:
┌─────────────────┐
│ ✓ SKILL NAME    │  ← Checkmark, muted colors
│   Level 3       │
│   Completed 2d  │
└─────────────────┘

CURRENT (In Progress):
╔═════════════════╗
║ ◉ SKILL NAME    ║  ← Highlighted, pulsing
║   Progress: 60% ║
║   [Continue]    ║
╚═════════════════╝

AVAILABLE (Can Start):
┌─────────────────┐
│ ○ SKILL NAME    │  ← Full color, clickable
│   Ready to start│
│   [Begin]       │
└─────────────────┘

LOCKED (Prerequisites):
┌ ─ ─ ─ ─ ─ ─ ─ ─┐
│ 🔒 SKILL NAME   │  ← Grayed out, lock icon
│   Requires:     │
│   • Skill X     │
│   • Skill Y     │
└ ─ ─ ─ ─ ─ ─ ─ ─┘

HIDDEN (Not Yet Revealed):
    ???
    ┊
    ┊  ← Mysterious, creates curiosity
    ┊
```

---

## Interaction Patterns

### Core Interactions

```
USER INTERACTIONS
═════════════════

1. PAN/SCROLL
   - Drag to explore the map
   - Pinch to zoom (mobile)
   - Scroll wheel (web)

2. TAP NODE
   - Show node details modal
   - For current: Continue/Start button
   - For locked: Show requirements
   - For completed: Show achievements

3. TAP EDGE
   - Show path description
   - "This path focuses on..."
   - If decision point: Show comparison

4. DECISION POINT
   - Present options clearly
   - AI recommendation highlighted
   - "Based on your profile, I recommend..."
   - Allow override

5. PROGRESS ANIMATION
   - When completing a node:
   - Node transforms (color, icon)
   - Edge animates (progress line)
   - Next node(s) unlock (reveal animation)
   - Celebration moment
```

### AI-Driven Updates

```
DYNAMIC MAP UPDATES
═══════════════════

1. PROFILE CHANGE → MAP RESTRUCTURE

   Trigger: Significant profile update
   Action: AI re-evaluates pathway
   Visual: Smooth transition animation

   Example:
   - User develops new skill unexpectedly
   - AI: "You've already mastered X, skipping node"
   - Map: Node grays out, path redirects

2. BLOCKER DETECTED → NEW NODE APPEARS

   Trigger: AI detects blocker in conversation
   Action: Insert remediation node
   Visual: Node fades in with explanation

   Example:
   - User shows perfectionism blocker
   - AI: "I'm adding a module on this"
   - Map: New node appears on path

3. PROGRESS STALL → PATH SUGGESTION

   Trigger: No progress in X days
   Action: AI suggests alternative path
   Visual: New edge highlights, notification

   Example:
   - User stuck on challenge for 2 weeks
   - AI: "Consider this alternative approach"
   - Map: New path illuminates

4. GOAL REFINEMENT → END STATE CHANGES

   Trigger: User clarifies/changes goal
   Action: Goal node updates, paths recalculate
   Visual: Map reorganizes with animation

   Example:
   - User: "Actually, I want to focus on career"
   - AI: Restructures pathway toward career goal
   - Map: Smoothly transforms
```

---

## MVP vs Future Implementation

### MVP (v1.0): Simplified List View

```
MVP IMPLEMENTATION
══════════════════

Don't build full graph visualization yet.
Prove the value with simpler UX:

┌─────────────────────────────────────┐
│  YOUR JOURNEY                       │
│  Unfuck Your Life                   │
├─────────────────────────────────────┤
│                                     │
│  ✓ Week 1: Excavation      [Done]  │
│    └─ Anti-Vision Work             │
│    └─ Vision Clarity               │
│                                     │
│  ◉ Week 2: Calibration   [Current] │
│    └─ Pattern Tracking    [Active] │
│    └─ First Habit         [Next]   │
│                                     │
│  ○ Week 3: Integration    [Locked] │
│    └─ Requires: Week 2             │
│                                     │
│  ○ Week 4: Evolution      [Locked] │
│                                     │
│  🎯 Goal: Living Aligned           │
│                                     │
└─────────────────────────────────────┘

SKILLS EMERGING
├─ Pattern Recognition    Level 2
├─ Emotional Awareness    Level 1
└─ + 2 more unlocking...

This proves:
- Journey progression concept
- Skill emergence
- Locked/unlocked states
- Current position

Without:
- Complex graph rendering
- Pan/zoom interactions
- ReactFlow integration
```

### v1.2: Visual Graph (Mobile)

```
v1.2 IMPLEMENTATION
═══════════════════

Add visual graph with react-native-svg:

┌─────────────────────────────────────┐
│                                     │
│            [🎯 GOAL]                │
│               │                     │
│         ┌─────┴─────┐               │
│         │           │               │
│      [Week 4]   [Week 4b]           │
│         │           │               │
│         └─────┬─────┘               │
│               │                     │
│           [Week 3]                  │
│               │                     │
│           ◉ YOU                     │
│          [Week 2]                   │
│               │                     │
│         ✓ [Week 1]                  │
│                                     │
│  [Zoom] [Center] [Details]          │
└─────────────────────────────────────┘

Features:
- Simple vertical layout
- Tap nodes for details
- Basic pan/zoom
- Progress animation
```

### v2.0: Full ReactFlow (Web + Tablet)

```
v2.0 IMPLEMENTATION
═══════════════════

Full graph editor capabilities:

┌──────────────────────────────────────────────────────────────┐
│ ┌──────┐                                                     │
│ │MiniMap│    [Career Path]──────[Leadership]                 │
│ └──────┘           │                  │                      │
│                    │            [Management]                 │
│  [Controls]    [Current]──┬──────────┘                       │
│  [+][-][⌖]        │       │                                  │
│                   │   [Relationship]────[Communication]      │
│               [Start]          │                             │
│                    └───────────┴────[Personal Growth]        │
│                                                              │
│ ───────────────────────────────────────────────────────────  │
│ Node: Current Position          Skills: 12 unlocked          │
│ Status: Working on Pattern Recognition                       │
│ Next recommended: Emotional Awareness                        │
└──────────────────────────────────────────────────────────────┘

Features:
- Full ReactFlow
- Multiple pathway view
- Cross-pathway connections
- Zoom to any level
- Custom node renderers
- Real-time updates
```

---

## Technical Considerations

### Performance

```
PERFORMANCE OPTIMIZATION
════════════════════════

CONCERN: Complex graphs can be slow on mobile

MITIGATIONS:
├── Virtualization: Only render visible nodes
├── Level of Detail: Simplify distant nodes
├── Lazy Loading: Load node details on tap
├── Caching: Cache rendered nodes
├── Debouncing: Throttle pan/zoom updates
└── Web Workers: Offload layout calculations

TARGETS:
├── < 100 nodes: No optimization needed
├── 100-500 nodes: Basic virtualization
├── 500+ nodes: Full optimization suite

MVP EXPECTATION:
├── ~20-50 nodes per pathway
├── No optimization needed
└── Focus on clean implementation
```

### Data Sync

```
REAL-TIME UPDATES
═════════════════

CONVEX SUBSCRIPTIONS:

// Subscribe to user's pathway
const pathway = useQuery(api.pathways.getUserPathway, { userId });

// Subscribe to node progress
const progress = useQuery(api.pathways.getNodeProgress, {
  pathwayId: pathway.id
});

// When AI updates pathway (e.g., adds blocker node)
// UI automatically re-renders with new node

OPTIMISTIC UPDATES:
├── User completes node → immediate visual update
├── Backend confirms → animation/celebration
├── Backend rejects → rollback with explanation
```

---

## Open Questions

| Question | Impact | How to Resolve |
|----------|--------|----------------|
| Vertical vs free-form for mobile? | Core UX decision | User testing |
| How much should AI auto-restructure? | User control vs guidance | A/B test |
| Show full map or progressive reveal? | Overwhelm vs motivation | User research |
| How to handle very long pathways? | Scrolling, zooming UX | Design iteration |
| ReactFlow license for commercial use? | Legal | Review MIT license (should be fine) |

---

## Next Steps

1. **MVP**: Build simplified list view (v1.0)
2. **Validate**: Does progression visualization increase engagement?
3. **Design**: Create detailed Figma mockups for visual graph
4. **Prototype**: Build interactive prototype with react-native-svg
5. **Full Build**: Implement ReactFlow for web/tablet (v2.0)

---

*The map is not the territory - but a good map helps you navigate.*
*Last updated: 2026-01-13*
