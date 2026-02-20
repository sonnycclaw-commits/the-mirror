# Emergent Skill Trees: AI-First Skill Discovery

**Research Date:** 2026-01-13
**Goal:** Design a skill tree system where skills EMERGE from AI conversation rather than being predefined.

---

## Executive Summary

This document proposes an emergent skill discovery system for Life OS where the AI identifies, structures, and tracks user competencies through natural conversation. Unlike traditional predefined skill trees (Duolingo, games), this system dynamically constructs a personalized skill graph based on behavioral signals, self-reported experiences, and conversational patterns.

Key insight: The system should behave like an attentive coach who notices patterns the user themselves might not recognize, rather than a checklist the user fills out.

---

## 1. Skill Tree Data Models in Games

### 1.1 Path of Exile's Web Model

Path of Exile uses the most sophisticated skill tree in gaming - a massive interconnected web of 1325+ nodes.

**Data Structure (from [official JSON export](https://github.com/grindinggear/skilltree-export)):**
```json
{
  "nodes": {
    "12345": {
      "id": 12345,
      "name": "Iron Reflexes",
      "icon": "path/to/icon.png",
      "stats": ["Converts Evasion to Armour"],
      "isKeystone": true,
      "isNotable": false,
      "group": 42,
      "orbit": 2,
      "orbitIndex": 3
    }
  },
  "groups": {
    "42": {
      "x": 1234.5,
      "y": -567.8,
      "nodes": [12345, 12346, 12347]
    }
  },
  "edges": [[12345, 12346], [12346, 12347]]
}
```

**Key concepts:**
- **Groups** cluster related nodes spatially
- **Orbits** determine position around group center
- **Keystones** fundamentally change gameplay rules
- **Notables** are mid-tier impactful nodes
- Classes share the SAME tree but start at different positions

### 1.2 Skyrim's Constellation Model

Skyrim uses a simpler hierarchical tree per skill category (Archery, Smithing, etc.). Each tree is a linear-ish progression with branching paths.

**Structure:**
- 18 skill trees (one per skill)
- Each tree has a trunk with branching perks
- Perks unlock based on skill level thresholds
- Skills level up through USE, not point allocation

**Relevance:** The "skills level through use" mechanic is directly applicable to emergent skill discovery - detect skill use from conversation.

### 1.3 Civilization's Technology Web

Civilization games use a prerequisite-based tech tree where multiple techs can unlock a single advanced tech.

**Relevance:** Multiple skills combining to unlock meta-skills (e.g., "Public Speaking" + "Domain Knowledge" unlocks "Thought Leadership")

---

## 2. Existing Skill Taxonomies

### 2.1 O*NET (US Department of Labor)

[O*NET](https://www.onetonline.org/) is the most comprehensive occupational skills database, covering 900+ occupations and 55,000+ jobs.

**Content Model Structure:**
```
WORKER-ORIENTED
├── Worker Characteristics
│   ├── Abilities (52 abilities, e.g., Oral Comprehension)
│   ├── Interests (6 Holland types)
│   └── Work Values (6 values)
├── Worker Requirements
│   ├── Basic Skills (10 skills)
│   ├── Cross-Functional Skills (35 skills)
│   ├── Knowledge (33 areas)
│   └── Education
└── Experience Requirements
    └── Training, Licensing, Experience

JOB-ORIENTED
├── Occupational Requirements
│   ├── Work Activities (41 generalized → 325 intermediate → 2000+ detailed)
│   └── Work Context
└── Occupation-Specific Information
    └── Tasks (19,000+ task statements)
```

**Key insight:** O*NET uses a hierarchical taxonomy with multiple levels of granularity - from 41 generalized work activities down to 19,000+ specific tasks.

### 2.2 ESCO (European Framework)

[ESCO](https://esco.ec.europa.eu/) provides 13,939 skills mapped to 3,039 occupations in 28 languages.

**Three Pillars:**
1. **Occupations** - What jobs exist
2. **Skills & Competences** - What capabilities matter
3. **Qualifications** - Formal certifications

**Skill Structure:**
```json
{
  "uri": "http://data.europa.eu/esco/skill/abc123",
  "preferredLabel": "project management",
  "altLabels": ["PM", "managing projects"],
  "description": "Planning, organizing, monitoring...",
  "skillType": "skill/competence",  // vs "knowledge"
  "reusabilityLevel": "cross-sector",  // vs "sector-specific"
  "relationships": [
    {"type": "isPartOf", "target": "management-skills"},
    {"type": "isEssentialFor", "target": "project-manager"}
  ]
}
```

### 2.3 LinkedIn Skills Graph

[LinkedIn's Skills Graph](https://engineering.linkedin.com/blog/2023/Building-maintaining-the-skills-taxonomy-that-powers-LinkedIns-Skills-Graph) has 39,000+ skills with 374,000 aliases.

**Structure:**
```
Skill Node
├── skill_id (unique identifier)
├── name ("Project Management")
├── aliases (["PM", "managing projects", ...])
├── type (tool | methodology | concept | soft-skill)
└── knowledge_lineages (relationships to other skills)

Relationship Types:
- is-part-of (Project Management → Management)
- requires (Data Science → Statistics)  
- tool-for (Excel → Data Analysis)
- specialization-of (Machine Learning → AI)
```

**Key insight:** LinkedIn uses "knowledge lineages" - rich relationship types between skills, not just hierarchical parent/child.

---

## 3. AI-Driven Skill Discovery

### 3.1 Skill Extraction from Conversation

**Research approaches from [Skill-LLM](https://arxiv.org/html/2410.12052v1) and [SkillNER](https://github.com/AnasAito/SkillNER):**

1. **Named Entity Recognition (NER)** - Train models to tag skill mentions
2. **LLM Extraction** - Use GPT-4/Claude with structured output schemas
3. **Hybrid** - NER for common skills + LLM for novel/implicit skills

**Signal Types for Emergent Discovery:**

| Signal | What It Reveals | Example |
|--------|-----------------|---------|
| **Direct claims** | "I'm good at X" | "I'm a strong writer" |
| **Experience reports** | Past activities | "I led a team of 5" |
| **Problem-solving** | Skills in action | How they debug issues |
| **Hesitation patterns** | Blockers/gaps | "I'm not sure how to..." |
| **Emotional valence** | Engagement level | Enthusiasm vs. dread |
| **Avoidance patterns** | Hidden blockers | Changing subject from X |
| **Comparative language** | Relative strength | "I'm better at X than Y" |

### 3.2 Clustering Behaviors into Capabilities

From [TaBIIC](https://arxiv.org/html/2312.05866) and [ontology clustering research](https://www.frontiersin.org/journals/big-data/articles/10.3389/fdata.2024.1463543/full):

**Two-Phase Approach:**
1. **Online Clustering** - Group similar skill mentions in real-time
2. **Hierarchical Integration** - Periodically restructure into taxonomy

**Embedding-Based Grouping:**
```python
# Pseudocode
skill_mentions = extract_skills_from_conversation(transcript)
embeddings = embed(skill_mentions)  # e.g., BGE, OpenAI embeddings
clusters = agglomerative_clustering(embeddings, threshold=0.8)

for cluster in clusters:
    if matches_existing_skill(cluster):
        update_evidence(existing_skill, cluster)
    else:
        create_emergent_skill(cluster)
```

### 3.3 Inferring Blockers

**Blocker Detection Patterns:**

| Pattern | Blocker Type | Example |
|---------|--------------|---------|
| "I can't because..." | Explicit external | "I can't exercise because of my knee" |
| "I should but..." | Motivational | "I should network but I hate small talk" |
| Repeated avoidance | Fear/anxiety | Never discussing public speaking |
| Excuse diversity | Hidden resistance | Different excuses each time |
| "Someday I'll..." | Procrastination | Aspirational but no action |
| Emotional language | Trauma/past failure | Frustration, shame around topic |

---

## 4. Duolingo Analysis

### 4.1 Original Tree Structure

[Duolingo's skill tree](https://duolingo.fandom.com/wiki/Language_tree) was predefined, hierarchical, and linear:

```
Basics 1 → Basics 2 → Phrases → Animals → Food → ...
          ↘ Common Phrases ↗
```

**Key mechanics:**
- **Unlocking** - Complete row N to unlock row N+1
- **Crown Levels** - 5 levels per skill (mastery depth)
- **Skill Decay** - Words' strength decays based on time and performance
- **Spaced Repetition** - Better-known words decay slower

### 4.2 Skill Decay Model

From [Duolingo's blog](https://blog.duolingo.com/how-we-learn-how-you-learn/):

```
word_strength = function(
  times_practiced,
  accuracy_history,
  time_since_last_practice
)

decay_rate = inverse(times_correct, recency)
```

**Borrowable concepts:**
- Decay rate varies by demonstrated proficiency
- Spaced repetition prompts ("Time to practice X")
- Strength visualization (color-coded bars)

### 4.3 New Path System (2022+)

Duolingo abandoned the tree for a **linear path** with forced spaced repetition.

**Why relevant:** Linear path = less user autonomy but better learning outcomes. For Life OS, we want the OPPOSITE - maximum emergence and user agency.

---

## 5. Proposed Schema for Emergent Skills

### 5.1 Core Skill Node

```typescript
interface SkillNode {
  // Identity
  id: string;                    // UUID
  name: string;                  // Human-readable, may be AI-generated
  aliases: string[];             // Alternative names discovered
  description: string;           // AI-generated description
  
  // Emergence metadata
  discoveredAt: Date;
  discoveredFrom: DiscoverySource;
  emergenceType: 'explicit' | 'inferred' | 'clustered';
  
  // Assessment
  level: number;                 // 0-100 proficiency estimate
  confidence: number;            // 0-1 AI confidence in assessment
  lastAssessed: Date;
  decayRate: number;             // How fast this skill fades without practice
  
  // Evidence
  evidence: Evidence[];          // Conversation excerpts
  demonstrationCount: number;    // Times skill was demonstrated
  
  // Relationships
  category: string | null;       // Discovered or assigned category
  parent: string | null;         // Broader skill this is part of
  children: string[];            // More specific sub-skills
  prerequisites: string[];       // Skills needed before this unlocks
  unlocks: string[];             // Skills this enables
  relatedSkills: Relationship[]; // Lateral connections
  
  // Blockers
  blockers: Blocker[];           // What's preventing growth
  
  // History
  history: HistoryEntry[];       // How has this evolved
}

interface Evidence {
  conversationId: string;
  timestamp: Date;
  excerpt: string;               // Relevant quote
  signalType: 'direct_claim' | 'demonstration' | 'reflection' | 'implicit';
  confidenceImpact: number;      // How much this changed our confidence
}

interface Blocker {
  id: string;
  type: 'external' | 'internal' | 'prerequisite' | 'resource' | 'unknown';
  description: string;
  discoveredFrom: string;        // Evidence
  status: 'active' | 'addressed' | 'dismissed';
  addressedBy: string | null;    // What action resolved this
}

interface Relationship {
  targetSkillId: string;
  type: 'requires' | 'enables' | 'synergizes' | 'conflicts' | 'tool-for';
  strength: number;              // 0-1 how strong the relationship
  bidirectional: boolean;
}

interface HistoryEntry {
  timestamp: Date;
  event: 'discovered' | 'level_changed' | 'merged' | 'split' | 'reclassified';
  previousValue: any;
  newValue: any;
  reason: string;
}

type DiscoverySource = 
  | { type: 'conversation'; conversationId: string }
  | { type: 'reflection'; promptId: string }
  | { type: 'clustering'; sourceSkills: string[] }
  | { type: 'import'; source: 'linkedin' | 'resume' | 'manual' };
```

### 5.2 Skill Graph Container

```typescript
interface SkillGraph {
  userId: string;
  version: number;
  
  // The nodes
  skills: Map<string, SkillNode>;
  
  // Categories (also emergent)
  categories: Category[];
  
  // Visualization hints
  layout: LayoutHint[];
  
  // Meta-stats
  totalSkillsDiscovered: number;
  activeSkills: number;          // Non-decayed
  growthAreas: string[];         // AI-identified focus areas
  blockedAreas: string[];        // Areas with unaddressed blockers
}

interface Category {
  id: string;
  name: string;
  description: string;
  emergent: boolean;             // Was this discovered or predefined?
  parentCategory: string | null;
  color: string;                 // For visualization
}
```

---

## 6. Emergence Algorithm

### 6.1 High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    CONVERSATION STREAM                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   SIGNAL EXTRACTION                          │
│  • Skill mentions (NER + LLM)                               │
│  • Experience reports                                        │
│  • Emotional valence                                         │
│  • Blocker patterns                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   SKILL MATCHING                             │
│  Does this match an existing skill?                          │
│  • Embedding similarity                                      │
│  • Alias matching                                            │
│  • Context comparison                                        │
└─────────────────────────────────────────────────────────────┘
                     │                    │
          [MATCH FOUND]            [NO MATCH]
                     │                    │
                     ▼                    ▼
┌────────────────────────────┐  ┌────────────────────────────┐
│     UPDATE EXISTING        │  │    CREATE PROVISIONAL      │
│  • Add evidence            │  │  • Low confidence          │
│  • Adjust level estimate   │  │  • Single evidence         │
│  • Update relationships    │  │  • Pending clustering      │
└────────────────────────────┘  └────────────────────────────┘
                                          │
                                          ▼
                              ┌─────────────────────────────────────────────────────────────┐
                              │               PERIODIC CLUSTERING                            │
                              │  • Group similar provisional skills                          │
                              │  • Merge near-duplicates                                     │
                              │  • Discover parent categories                                │
                              │  • Infer relationships                                       │
                              └─────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
                              ┌─────────────────────────────────────────────────────────────┐
                              │               GRAPH UPDATE                                   │
                              │  • Promote provisional → confirmed                          │
                              │  • Update category structure                                 │
                              │  • Recalculate unlock conditions                            │
                              │  • Identify growth edges                                    │
                              └─────────────────────────────────────────────────────────────┘
```

### 6.2 Signal Extraction Prompts

**Skill Extraction Prompt:**
```
Analyze this conversation excerpt for skill signals:

<excerpt>{conversation}</excerpt>

Extract:
1. Explicitly mentioned skills ("I'm good at X")
2. Demonstrated skills (actions/knowledge shown)
3. Aspirational skills ("I want to learn X")
4. Blocked skills (mentioned with frustration/avoidance)

For each skill, provide:
- name: short skill name
- type: explicit | demonstrated | aspirational | blocked
- confidence: 0-1 how certain you are
- evidence_quote: supporting text
- emotional_valence: positive | neutral | negative
- context: brief note on circumstances

Return as JSON array.
```

**Blocker Detection Prompt:**
```
Analyze this conversation for blockers to skill development:

<excerpt>{conversation}</excerpt>
<skill_context>{relevant_skills}</skill_context>

Identify blockers:
- External: physical limitations, lack of access, life circumstances
- Internal: fear, perfectionism, past trauma, limiting beliefs
- Prerequisite: missing foundational skill
- Resource: time, money, equipment
- Unknown: vague resistance without clear cause

For each blocker:
- skill_affected: which skill is blocked
- blocker_type: category from above
- description: what's the barrier
- evidence_quote: supporting text
- addressability: easy | medium | hard | unknown
- suggested_approach: brief note on how to address (if obvious)
```

### 6.3 Clustering Logic

```python
def cluster_provisional_skills(provisional_skills, existing_graph):
    """
    Periodically run to consolidate provisional skills.
    """
    # Embed all provisional skills
    embeddings = []
    for skill in provisional_skills:
        # Combine name + description + evidence for rich embedding
        text = f"{skill.name}: {skill.description}. Evidence: {skill.evidence}"
        embeddings.append(embed(text))
    
    # Cluster
    clusters = agglomerative_clustering(
        embeddings, 
        distance_threshold=0.3,
        linkage='average'
    )
    
    for cluster in clusters:
        if len(cluster) == 1:
            # Single provisional skill - check against existing graph
            skill = cluster[0]
            match = find_similar_in_graph(skill, existing_graph)
            if match:
                merge_into_existing(skill, match)
            else:
                promote_to_confirmed(skill)
        else:
            # Multiple skills clustered together
            merged = merge_skills(cluster)
            
            # Check if merged skill matches existing
            match = find_similar_in_graph(merged, existing_graph)
            if match:
                merge_into_existing(merged, match)
            else:
                promote_to_confirmed(merged)
    
    # After clustering, infer category structure
    infer_categories(existing_graph)
    infer_relationships(existing_graph)

def infer_categories(graph):
    """
    Use LLM to suggest categories for uncategorized skills.
    """
    uncategorized = [s for s in graph.skills if not s.category]
    if not uncategorized:
        return
    
    prompt = f"""
    Given these skills without categories:
    {[s.name for s in uncategorized]}
    
    And these existing categories:
    {[c.name for c in graph.categories]}
    
    Suggest category assignments. You may also propose new categories.
    Return as JSON: [{{"skill": "...", "category": "...", "new_category": bool}}]
    """
    
    assignments = llm_call(prompt)
    apply_category_assignments(assignments, graph)
```

### 6.4 Level Estimation

```python
def estimate_skill_level(skill):
    """
    Estimate proficiency level (0-100) from evidence.
    """
    factors = {
        'demonstration_count': skill.demonstrationCount,
        'recency': days_since(skill.lastAssessed),
        'consistency': evidence_consistency(skill.evidence),
        'depth': evidence_depth(skill.evidence),
        'breadth': evidence_breadth(skill.evidence),
        'self_assessment': extract_self_assessments(skill.evidence),
        'blocker_severity': sum_blocker_severity(skill.blockers)
    }
    
    # Weighted combination with decay
    base_level = (
        factors['demonstration_count'] * 0.2 +
        factors['consistency'] * 0.15 +
        factors['depth'] * 0.25 +
        factors['breadth'] * 0.15 +
        factors['self_assessment'] * 0.25
    )
    
    # Apply decay
    decay_factor = calculate_decay(
        skill.decayRate, 
        factors['recency']
    )
    
    # Apply blocker penalty
    blocker_penalty = factors['blocker_severity'] * 0.1
    
    return max(0, min(100, base_level * decay_factor - blocker_penalty))

def calculate_decay(decay_rate, days_since):
    """
    Ebbinghaus-inspired decay curve.
    """
    # Retention = e^(-t/S) where S is stability
    stability = 1 / decay_rate  # Higher decay_rate = faster decay
    return math.exp(-days_since / stability)
```

---

## 7. Blocker Detection Patterns

### 7.1 Blocker Types

| Type | Signals | Example | Addressability |
|------|---------|---------|----------------|
| **External** | "can't because", physical limits | "My injury prevents exercise" | Varies |
| **Resource** | "no time", "too expensive" | "I'd learn guitar if I had one" | Medium |
| **Prerequisite** | Struggling with advanced topics | Can't do calculus without algebra | Clear path |
| **Fear/Anxiety** | Avoidance, emotional language | "Networking terrifies me" | Coaching needed |
| **Perfectionism** | "Not ready yet", over-preparation | Never shipping projects | Mindset work |
| **Past Failure** | Shame, "I tried once" | "I failed at public speaking" | Processing needed |
| **Identity** | "I'm not a X person" | "I'm not creative" | Deep work |
| **Unknown** | Vague resistance | "I don't know why I don't" | Exploration needed |

### 7.2 Detection Heuristics

```python
BLOCKER_PATTERNS = {
    'external': [
        r"can't .* because",
        r"would .* but .* prevents",
        r"physically (can't|unable)",
    ],
    'resource': [
        r"no time (for|to)",
        r"can't afford",
        r"don't have (the|a)",
        r"if only I had",
    ],
    'fear': [
        r"(scared|terrified|anxious) (of|about)",
        r"what if .* fails?",
        r"people will (judge|think|laugh)",
    ],
    'perfectionism': [
        r"not (good|ready) enough",
        r"need to .* more before",
        r"once I (finish|perfect|complete)",
    ],
    'past_failure': [
        r"I (tried|failed) (at|with)",
        r"last time .* (disaster|terrible)",
        r"embarrassed by",
    ],
    'identity': [
        r"I'm not (a|the type of)",
        r"that's not (me|who I am)",
        r"people like me don't",
    ]
}

def detect_blockers(text, skills_context):
    blockers = []
    for blocker_type, patterns in BLOCKER_PATTERNS.items():
        for pattern in patterns:
            if match := re.search(pattern, text, re.I):
                blockers.append({
                    'type': blocker_type,
                    'evidence': match.group(0),
                    'context': extract_context(text, match)
                })
    
    # Also use LLM for nuanced detection
    llm_blockers = llm_detect_blockers(text, skills_context)
    
    return merge_blockers(blockers, llm_blockers)
```

### 7.3 "Ready to Unlock" Detection

Identify skills at the "growth edge" - where prerequisites are met but skill is underdeveloped:

```python
def find_growth_edges(graph):
    """
    Find skills that are ready for development.
    """
    growth_edges = []
    
    for skill in graph.skills:
        # Skip if already high level
        if skill.level > 70:
            continue
            
        # Check prerequisites are met
        prereqs_met = all(
            graph.skills[prereq].level > 50 
            for prereq in skill.prerequisites
        )
        if not prereqs_met:
            continue
        
        # Check for active blockers
        has_active_blockers = any(
            b.status == 'active' 
            for b in skill.blockers
        )
        
        # Calculate growth potential
        growth_potential = calculate_growth_potential(skill, graph)
        
        growth_edges.append({
            'skill': skill,
            'blocked': has_active_blockers,
            'blockers': [b for b in skill.blockers if b.status == 'active'],
            'potential': growth_potential,
            'unlocks': get_downstream_skills(skill, graph)
        })
    
    return sorted(growth_edges, key=lambda x: x['potential'], reverse=True)
```

---

## 8. Visualization Recommendations

### 8.1 For Emergent (Not Predefined) Trees

**Challenge:** Traditional skill trees assume fixed structure. Emergent systems need flexible visualization.

**Approaches:**

1. **Force-Directed Graph** (like D3.js force layout)
   - Skills as nodes, relationships as edges
   - Categories form natural clusters
   - New skills animate into position
   - Uncertainty shown via node opacity

2. **Radial Layout**
   - User at center
   - Skill distance from center = proficiency level
   - Angle = category
   - Similar to how Duolingo visualized skills

3. **Treemap**
   - Categories as nested rectangles
   - Size = proficiency or importance
   - Color = growth potential or health
   - Good for showing overall landscape

4. **Adaptive Hierarchy**
   - Default shows only major skills/categories
   - Click to expand into sub-skills
   - "Discovery mode" shows recent additions

### 8.2 Representing Uncertainty

```
Level vs Confidence Matrix:

                HIGH CONFIDENCE
                     │
        ┌────────────┼────────────┐
        │  VERIFIED  │  VERIFIED  │
        │  LOW SKILL │ HIGH SKILL │
        │   (work    │  (strong   │
        │   needed)  │   area)    │
LOW  ───┼────────────┼────────────┼─── HIGH
LEVEL   │ UNCERTAIN │ UNCERTAIN  │   LEVEL
        │ LOW SKILL │ HIGH SKILL │
        │  (explore │  (test &   │
        │   more)   │  validate) │
        └────────────┼────────────┘
                     │
                LOW CONFIDENCE

Visual encoding:
- Level → position/size
- Confidence → opacity/border style
- Solid border = high confidence
- Dashed border = uncertain
- Pulsing = recently discovered
```

### 8.3 Showing Growth Over Time

- **Timeline view:** Show skill level over time
- **Achievement markers:** Key milestones (first demo, breakthrough, etc.)
- **Growth rate indicators:** Arrows showing trajectory
- **Decay warnings:** Skills at risk of fading

### 8.4 Blockers and Unlocks

```
Blocked Skill Visualization:

   ┌─────────────────┐
   │ Public Speaking │ 
   │ ████░░░░ 45%   │
   │                 │
   │ 🔒 BLOCKED BY:  │
   │ • Fear of judgment
   │ • Past failure  │
   │                 │
   │ WOULD UNLOCK:   │
   │ → Leadership    │
   │ → Sales         │
   └─────────────────┘

Lock icon = active blocker
Greyed edges = blocked unlocks
Tooltip = blocker details and suggested actions
```

---

## 9. Example: Hypothetical User "Alex"

### 9.1 Discovered Skill Graph

After 10 conversations, Life OS has discovered:

```
ALEX'S EMERGENT SKILL GRAPH
═══════════════════════════

TECHNICAL (emerged category)
├── Python Programming [85%] ████████░░ HIGH CONFIDENCE
│   ├── Data Analysis [72%] ███████░░░
│   ├── Automation Scripts [68%] ██████░░░░
│   └── [unlocks] Machine Learning [15%] █░░░░░░░░░ (prerequisite met!)
│
├── SQL [60%] ██████░░░░
│   └── [blocked by] "Never got around to learning joins properly"
│
└── Git/Version Control [45%] ████░░░░░░ LOW CONFIDENCE
    └── Evidence: mentioned once, never demonstrated

COMMUNICATION (emerged category)
├── Technical Writing [78%] ███████░░░
│   └── Documentation, code comments - demonstrated repeatedly
│
├── Explaining Complex Topics [65%] ██████░░░░
│   └── [synergizes with] Teaching
│
└── Public Speaking [20%] ██░░░░░░░░ 🔒 BLOCKED
    └── Blockers:
        • Fear: "I freeze up in front of groups" (internal)
        • Past: "Bombed a presentation in 2019" (past_failure)
    └── Would unlock: Leadership, Thought Leadership

SELF-MANAGEMENT (emerged category)
├── Deep Work [55%] █████░░░░░
│   └── [blocked by] "Kids interrupt constantly" (external)
│
└── Task Prioritization [40%] ████░░░░░░ LOW CONFIDENCE
    └── Mixed signals - sometimes good, sometimes chaotic

GROWTH EDGES (Ready to develop)
1. Machine Learning - prerequisites met, high unlock value
2. SQL Joins - small blocker, easy address
3. Public Speaking - significant but addressable blockers
```

### 9.2 How This Was Discovered

| Conversation | Signals Detected | Skills Updated |
|--------------|------------------|----------------|
| #1: "Tell me about yourself" | "I've been coding Python for 5 years" | Python [initial] |
| #2: Work project discussion | Demonstrated data analysis | Data Analysis [created], Python [+evidence] |
| #3: Frustration venting | "I should learn ML but haven't started" | Machine Learning [aspirational] |
| #4: Communication check-in | "I write good docs, people say" | Technical Writing [created] |
| #5: Fear exploration | "Presentations terrify me since 2019" | Public Speaking [blocked], Blocker detected |
| #6: Productivity chat | "Hard to focus with kids home" | Deep Work [blocked], External blocker |
| #7-10: Various | Clustering merged similar skills | Categories emerged |

---

## 10. Predefined vs Emergent: Comparison

| Aspect | Predefined (Duolingo) | Emergent (Proposed) |
|--------|----------------------|---------------------|
| **Structure source** | Experts design tree | AI discovers from conversation |
| **Coverage** | Fixed skill set | Unlimited, personalized |
| **Cold start** | User picks goals | AI detects from dialogue |
| **Accuracy** | Assessments test knowledge | Inferred from behavior + claims |
| **Motivation** | Clear progress path | Discovery is motivating |
| **Personalization** | Same tree for all | Unique graph per user |
| **Maintenance** | Static (periodic updates) | Continuous refinement |
| **Blocker handling** | N/A | First-class concept |
| **Uncertainty** | Hidden | Explicit confidence |
| **Relationships** | Linear prerequisites | Rich relationship types |

### Hybrid Approach for Life OS

**Recommended:** Start emergent, optionally anchor to frameworks

1. **Pure emergence** for first N conversations
2. **Optional framework alignment** - "Would you like to map your skills to O*NET for career planning?"
3. **Category suggestions** from frameworks, not mandatory structure
4. **Blocker patterns** from psychology literature, skill inference is free-form

---

## 11. Recommendations for Life OS

### 11.1 Start Simple

**Phase 1: Basic Extraction**
- Extract skill mentions from every conversation
- Store as flat list with confidence scores
- Manual categorization by user if desired

**Phase 2: Add Structure**
- Periodic clustering to find categories
- Relationship inference (requires/enables)
- Blocker detection

**Phase 3: Full Graph**
- Growth edge detection
- Decay modeling
- Visualization

### 11.2 Key Design Decisions

1. **Confidence thresholds**
   - Show skills at 0.3+ confidence
   - Highlight at 0.7+ confidence
   - Ask user to confirm at 0.5 ("I noticed you might be skilled at X - is that right?")

2. **Evidence minimum**
   - Require 2+ mentions to create confirmed skill
   - Single mention = provisional

3. **Decay model**
   - Skills without evidence in 90 days start decaying
   - Decay rate inversely proportional to peak level
   - Never delete, just dim

4. **Blocker resolution**
   - Track blocker-addressing attempts
   - Prompt re-evaluation after life changes
   - Celebrate unblocked skills

### 11.3 Conversation Design

Weave skill discovery naturally:

```
DON'T: "What skills do you have?"
DO: "What projects are you working on?" → extract skills

DON'T: "What's blocking your growth?"  
DO: "What would you do if you had unlimited time?" → infer blocked areas

DON'T: "Rate your Python skills 1-10"
DO: Observe how they describe their code work → infer level
```

### 11.4 Schema Implementation

Start with this minimal schema:

```typescript
// MVP Schema
interface Skill {
  id: string;
  name: string;
  level: number;         // 0-100
  confidence: number;    // 0-1
  evidence: string[];    // conversation excerpts
  blockers: string[];    // simple strings initially
  category?: string;     // optional
  lastSeen: Date;
}

interface SkillStore {
  skills: Skill[];
  categories: string[];  // simple list initially
}
```

Evolve to full schema as patterns emerge.

---

## 12. Sources

### Game Design & Skill Trees
- [Path of Exile Passive Skill Tree](https://www.pathofexile.com/passive-skill-tree)
- [Path of Exile Skill Tree JSON Export](https://github.com/grindinggear/skilltree-export)
- [Game Design Skill Trees Guide](https://gamedesigning.org/learn/skill-trees/)
- [Keys to Meaningful Skill Trees](https://gdkeys.com/keys-to-meaningful-skill-trees/)

### Skills Taxonomies
- [O*NET OnLine](https://www.onetonline.org/)
- [O*NET Content Model](https://www.onetcenter.org/database.html)
- [ESCO Classification](https://esco.ec.europa.eu/en/classification)
- [LinkedIn Skills Graph Engineering Blog](https://engineering.linkedin.com/blog/2023/Building-maintaining-the-skills-taxonomy-that-powers-LinkedIns-Skills-Graph)

### AI Skill Extraction
- [Skill-LLM: LLMs for Skill Extraction](https://arxiv.org/html/2410.12052v1)
- [SkillNER GitHub](https://github.com/AnasAito/SkillNER)
- [SkillSense AI](https://github.com/Gift-Okoye/skillsense-ai)

### Dynamic Ontology Learning
- [TaBIIC: Taxonomy Building through Iterative Clustering](https://arxiv.org/html/2312.05866)
- [Ontology Extension with LLM Agents](https://www.frontiersin.org/journals/big-data/articles/10.3389/fdata.2024.1463543/full)
- [Clustering-Based Ontology Learning Using LLMs](https://www.tib-op.org/ojs/index.php/ocp/article/download/2900/2924/52941)

### Duolingo & Gamification
- [Duolingo Skill Wiki](https://duolingo.fandom.com/wiki/Skill)
- [Duolingo Language Tree](https://duolingo.fandom.com/wiki/Language_tree)
- [Duolingo Blog: How We Learn How You Learn](https://blog.duolingo.com/how-we-learn-how-you-learn/)
- [SkillTree Platform](https://skilltreeplatform.dev/)

### AI Coaching & Blockers
- [AI Coach Research](https://arxiv.org/html/2502.02880)
- [AI in Coaching: Breaking Down Barriers](https://corryrobertson.com/ai-in-coaching-breaking-down-barriers-or-building-walls/)
- [Culture Amp AI Coach Science](https://support.cultureamp.com/en/articles/11718591-the-science-behind-ai-coach)

---

*Document generated by Oracle agent for Life OS skill emergence research.*
