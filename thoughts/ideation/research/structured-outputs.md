# AI Structured Outputs for Psychometric Assessment

**Research Report**
Generated: 2026-01-13
Oracle Agent | Life OS Research

---

## Executive Summary

This document provides technical design patterns for using Claude's structured outputs to extract psychometric signals from natural conversation. Unlike traditional one-time assessments, this system enables continuous micro-assessment (like Duolingo for personal development) where each interaction updates a living user profile with Bayesian confidence scores.

Key findings:
1. **Claude structured outputs** now guarantee JSON schema compliance, enabling reliable psychometric extraction
2. **Bayesian Knowledge Tracing** (from educational technology) provides the mathematical foundation for belief updates
3. **Multi-dimensional signals** (personality, motivation, defenses, beliefs) can be extracted with calibrated confidence
4. **Agent orchestration patterns** enable clean separation between extraction, profile updating, and decision-making

---

## 1. Claude Structured Outputs

### 1.1 How They Work

Claude's structured outputs (public beta, November 2025) guarantee that API responses match specified JSON schemas. Two modes are available:

**JSON Outputs Mode** (`output_format` parameter):
- For data extraction tasks
- Response in `response.content[0].text` as guaranteed-valid JSON
- Best for psychometric signal extraction from conversation

**Strict Tool Use** (`strict: true` on tool definitions):
- For function calling with guaranteed parameter shapes
- Best for agent-to-agent contracts

### 1.2 Implementation

```python
from anthropic import Anthropic
from pydantic import BaseModel
from typing import Optional
from enum import Enum

client = Anthropic()

# SDK automatically transforms Pydantic models to JSON schema
response = client.beta.messages.parse(
    model="claude-sonnet-4-5-20250514",
    max_tokens=4096,
    messages=[...],
    response_format=PsychometricSignals,  # Pydantic model
    betas=["structured-outputs-2025-11-13"]
)

# Access parsed output directly
signals = response.parsed_output
```

### 1.3 Limitations to Design Around

| Limitation | Workaround |
|------------|------------|
| No recursive schemas | Flatten hierarchies; limit nesting depth |
| No numerical constraints (min/max) | Post-response validation |
| Incompatible with citations | Disable citations for extraction calls |
| No message prefilling | Use system prompts for context |
| 50-200 token overhead | Budget in token limits |

### 1.4 Best Practices

1. **Descriptive field names** - Claude interprets them semantically
2. **Use `additionalProperties: false`** - Strict validation
3. **Generous `max_tokens`** - Prevent truncation
4. **Monitor `stop_reason`** - Catch refusals early
5. **Pydantic/Zod integration** - Type-safe in code

---

## 2. Psychometric Signal Extraction Schemas

### 2.1 Master Signal Schema

```python
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime

class ConfidenceLevel(str, Enum):
    HIGH = "high"        # Multiple strong indicators
    MEDIUM = "medium"    # Some indicators, needs confirmation
    LOW = "low"          # Single weak indicator, hypothesis only
    UNCERTAIN = "uncertain"  # Contradictory signals

class SignalEvidence(BaseModel):
    """Evidence supporting a signal extraction"""
    quote: str = Field(description="Exact quote from user response")
    indicator_type: str = Field(description="What linguistic/semantic pattern was detected")
    weight: float = Field(ge=0.0, le=1.0, description="Strength of this evidence piece")

class PsychometricSignal(BaseModel):
    """Base class for all extracted signals"""
    signal_type: str
    confidence: ConfidenceLevel
    evidence: List[SignalEvidence]
    extraction_timestamp: str
    session_context: Optional[str] = Field(
        description="What was happening when this signal emerged"
    )
```

### 2.2 Big Five Personality Signals

```python
class Big5Dimension(str, Enum):
    OPENNESS = "openness"
    CONSCIENTIOUSNESS = "conscientiousness"
    EXTRAVERSION = "extraversion"
    AGREEABLENESS = "agreeableness"
    NEUROTICISM = "neuroticism"

class Big5Facet(str, Enum):
    # Openness facets
    OPENNESS_IMAGINATION = "imagination"
    OPENNESS_ARTISTIC = "artistic_interests"
    OPENNESS_EMOTIONALITY = "emotionality"
    OPENNESS_ADVENTUROUSNESS = "adventurousness"
    OPENNESS_INTELLECT = "intellect"
    OPENNESS_LIBERALISM = "liberalism"
    # Conscientiousness facets
    CONSC_SELF_EFFICACY = "self_efficacy"
    CONSC_ORDERLINESS = "orderliness"
    CONSC_DUTIFULNESS = "dutifulness"
    CONSC_ACHIEVEMENT = "achievement_striving"
    CONSC_SELF_DISCIPLINE = "self_discipline"
    CONSC_CAUTIOUSNESS = "cautiousness"
    # ... (other facets)

class PersonalitySignal(PsychometricSignal):
    """Signal about a Big Five personality dimension"""
    signal_type: str = "personality"
    dimension: Big5Dimension
    facet: Optional[Big5Facet]
    direction: str = Field(description="high, low, or context-dependent")
    magnitude: float = Field(
        ge=0.0, le=1.0, 
        description="How strongly this response indicates the dimension"
    )
    
    # Linguistic markers that triggered detection
    markers_detected: List[str] = Field(
        description="e.g., 'hedging language', 'future-oriented thinking'"
    )
```

### 2.3 Ego Development Stage Signals

Based on Loevinger/Cook-Greuter STAGES framework:

```python
class EgoStage(str, Enum):
    """Cook-Greuter Ego Development Stages"""
    IMPULSIVE = "impulsive"           # E2
    SELF_PROTECTIVE = "self_protective"  # E3
    CONFORMIST = "conformist"         # E4
    SELF_AWARE = "self_aware"         # E5
    CONSCIENTIOUS = "conscientious"   # E6
    INDIVIDUALIST = "individualist"   # E7
    AUTONOMOUS = "autonomous"         # E8
    CONSTRUCT_AWARE = "construct_aware"  # E9

class EgoDimension(str, Enum):
    """Three dimensions from STAGES scoring"""
    INDIVIDUAL_COLLECTIVE = "individual_collective"  # Polar dimension 1
    PASSIVE_ACTIVE = "passive_active"                # Polar dimension 2
    OBJECT_SOPHISTICATION = "object_sophistication"  # Concrete→Subtle→Metaware

class EgoSignal(PsychometricSignal):
    """Signal about ego development stage"""
    signal_type: str = "ego_development"
    
    # Stage indicators
    stage_hypothesis: EgoStage
    stage_confidence: ConfidenceLevel
    
    # Dimensional scores (more granular than stage)
    dimension_scores: dict[EgoDimension, float] = Field(
        description="Scores on each STAGES dimension"
    )
    
    # Specific markers
    perspective_taking: str = Field(
        description="1st person, 3rd person, systemic, meta-systemic"
    )
    meaning_making_complexity: str = Field(
        description="simple, differentiated, integrated, transcendent"
    )
    
    # Key linguistic markers for ego level
    markers: List[str] = Field(
        description="e.g., 'uses abstract concepts', 'acknowledges paradox'"
    )
```

### 2.4 Self-Determination Theory Signals

```python
class SDTNeed(str, Enum):
    AUTONOMY = "autonomy"
    COMPETENCE = "competence"
    RELATEDNESS = "relatedness"

class MotivationType(str, Enum):
    """SDT motivation continuum"""
    AMOTIVATION = "amotivation"
    EXTERNAL = "external_regulation"
    INTROJECTED = "introjected_regulation"  # Guilt/shame driven
    IDENTIFIED = "identified_regulation"     # Value-aligned
    INTEGRATED = "integrated_regulation"     # Fully internalized
    INTRINSIC = "intrinsic_motivation"

class MotivationSignal(PsychometricSignal):
    """Signal about motivation and psychological needs"""
    signal_type: str = "motivation"
    
    # Need satisfaction/frustration
    need: SDTNeed
    satisfaction_level: float = Field(
        ge=-1.0, le=1.0,
        description="-1 = frustrated, 0 = neutral, 1 = satisfied"
    )
    
    # Motivation quality for discussed activity/goal
    motivation_type: Optional[MotivationType]
    activity_context: Optional[str] = Field(
        description="What activity/goal this motivation relates to"
    )
    
    # Regulatory style markers
    autonomy_markers: List[str] = Field(
        description="e.g., 'expresses choice', 'uses want vs should'"
    )
    competence_markers: List[str] = Field(
        description="e.g., 'growth language', 'mastery orientation'"
    )
    relatedness_markers: List[str] = Field(
        description="e.g., 'mentions connections', 'belonging language'"
    )
```

### 2.5 Defense Mechanisms and Cognitive Distortions

```python
class DefenseMechanism(str, Enum):
    """Common defense mechanisms"""
    DENIAL = "denial"
    RATIONALIZATION = "rationalization"
    PROJECTION = "projection"
    DISPLACEMENT = "displacement"
    INTELLECTUALIZATION = "intellectualization"
    REACTION_FORMATION = "reaction_formation"
    REGRESSION = "regression"
    SUBLIMATION = "sublimation"
    REPRESSION = "repression"

class CognitiveDistortion(str, Enum):
    """Beck's cognitive distortions"""
    ALL_OR_NOTHING = "all_or_nothing_thinking"
    OVERGENERALIZATION = "overgeneralization"
    MENTAL_FILTER = "mental_filtering"
    DISCOUNTING_POSITIVE = "discounting_positive"
    JUMPING_TO_CONCLUSIONS = "jumping_to_conclusions"
    MAGNIFICATION = "magnification"
    EMOTIONAL_REASONING = "emotional_reasoning"
    SHOULD_STATEMENTS = "should_statements"
    LABELING = "labeling"
    PERSONALIZATION = "personalization"
    CATASTROPHIZING = "catastrophizing"

class DefenseSignal(PsychometricSignal):
    """Signal about defense mechanisms or cognitive distortions"""
    signal_type: str = "defense"
    
    # What was detected
    mechanism: Optional[DefenseMechanism]
    distortion: Optional[CognitiveDistortion]
    
    # Context
    trigger_topic: str = Field(
        description="What topic/question seemed to trigger this"
    )
    intensity: float = Field(
        ge=0.0, le=1.0,
        description="How pronounced the defense appeared"
    )
    
    # Pattern vs one-off
    recurring: bool = Field(
        description="Has this pattern appeared before?"
    )
    
    # Linguistic markers
    markers: List[str] = Field(
        description="e.g., 'topic avoidance', 'blame externalization'"
    )
```

### 2.6 Limiting Beliefs

```python
class BeliefDomain(str, Enum):
    """Domains where limiting beliefs manifest"""
    SELF_WORTH = "self_worth"
    CAPABILITY = "capability"
    DESERVINGNESS = "deservingness"
    SAFETY = "safety"
    BELONGING = "belonging"
    CONTROL = "control"
    IDENTITY = "identity"

class LimitingBeliefSignal(PsychometricSignal):
    """Signal about a potential limiting belief"""
    signal_type: str = "limiting_belief"
    
    # The belief
    belief_statement: str = Field(
        description="The limiting belief expressed or implied (normalized form)"
    )
    domain: BeliefDomain
    
    # How it manifested
    expression_type: str = Field(
        description="explicit, implicit, behavioral, or avoidant"
    )
    
    # Self-sabotage connection
    blocks_goal: Optional[str] = Field(
        description="What goal/aspiration this belief might block"
    )
    
    # Intervention readiness
    awareness_level: str = Field(
        description="unaware, vaguely_aware, aware_but_stuck, ready_to_challenge"
    )
    
    # NLP Meta-Model violations detected
    meta_model_violations: List[str] = Field(
        description="e.g., 'universal quantifier', 'modal operator of necessity'"
    )
```

### 2.7 Skill and Capability Signals

```python
class SkillCategory(str, Enum):
    COGNITIVE = "cognitive"
    EMOTIONAL = "emotional"
    SOCIAL = "social"
    PRACTICAL = "practical"
    CREATIVE = "creative"
    PHYSICAL = "physical"

class SkillSignal(PsychometricSignal):
    """Signal about a skill or capability"""
    signal_type: str = "skill"
    
    skill_name: str
    category: SkillCategory
    
    # Skill level indicators
    demonstrated_level: float = Field(
        ge=0.0, le=1.0,
        description="Inferred skill level from response"
    )
    self_reported_level: Optional[float] = Field(
        ge=0.0, le=1.0,
        description="What user claims about their skill"
    )
    
    # Duolingo-style tracking
    strength_decay_rate: Optional[float] = Field(
        description="How quickly this skill seems to decay (for practice scheduling)"
    )
    
    # Blockers
    blockers: List[str] = Field(
        description="What seems to prevent skill improvement"
    )
    
    # Growth signals
    growth_mindset_indicators: List[str]
    fixed_mindset_indicators: List[str]
```

### 2.8 Emotional State Signal

```python
class EmotionCategory(str, Enum):
    JOY = "joy"
    SADNESS = "sadness"
    ANGER = "anger"
    FEAR = "fear"
    SURPRISE = "surprise"
    DISGUST = "disgust"
    TRUST = "trust"
    ANTICIPATION = "anticipation"

class EmotionalSignal(PsychometricSignal):
    """Signal about current emotional state"""
    signal_type: str = "emotional_state"
    
    primary_emotion: EmotionCategory
    secondary_emotions: List[EmotionCategory]
    
    valence: float = Field(ge=-1.0, le=1.0, description="negative to positive")
    arousal: float = Field(ge=0.0, le=1.0, description="calm to activated")
    
    # Emotional regulation
    regulation_strategy_detected: Optional[str]
    emotional_awareness: str = Field(
        description="low, moderate, high - ability to identify own emotions"
    )
    
    # Context
    apparent_trigger: Optional[str]
```

### 2.9 Composite Extraction Response

```python
class ExtractionResponse(BaseModel):
    """Complete extraction from a single user response"""
    
    # Metadata
    response_id: str
    session_id: str
    timestamp: str
    user_message_length: int
    
    # All extracted signals
    personality_signals: List[PersonalitySignal] = []
    ego_signals: List[EgoSignal] = []
    motivation_signals: List[MotivationSignal] = []
    defense_signals: List[DefenseSignal] = []
    belief_signals: List[LimitingBeliefSignal] = []
    skill_signals: List[SkillSignal] = []
    emotional_signals: List[EmotionalSignal] = []
    
    # Meta-signals
    response_authenticity: float = Field(
        ge=0.0, le=1.0,
        description="How genuine vs performative the response seems"
    )
    engagement_level: float = Field(
        ge=0.0, le=1.0,
        description="How engaged/invested the user seems"
    )
    
    # Extraction quality
    extraction_confidence: ConfidenceLevel
    signals_count: int
    ambiguous_signals: List[str] = Field(
        description="Signals that couldn't be confidently classified"
    )
```

---

## 3. Confidence and Uncertainty Modeling

### 3.1 Bayesian Belief Update Framework

Inspired by Bayesian Knowledge Tracing, each profile dimension maintains:

```python
class BeliefState(BaseModel):
    """Bayesian belief about a profile dimension"""
    
    # Core belief
    dimension_id: str
    current_estimate: float = Field(ge=0.0, le=1.0)
    
    # Uncertainty (Beta distribution parameters)
    alpha: float = Field(ge=0.0, description="Positive evidence count")
    beta: float = Field(ge=0.0, description="Negative evidence count")
    
    # Computed properties
    @property
    def confidence(self) -> float:
        """Higher alpha+beta = more confident"""
        return (self.alpha + self.beta) / (self.alpha + self.beta + 10)  # Normalized
    
    @property
    def variance(self) -> float:
        """Uncertainty in the estimate"""
        a, b = self.alpha, self.beta
        return (a * b) / ((a + b) ** 2 * (a + b + 1))
    
    # History
    last_updated: str
    update_count: int
    evidence_history: List[str] = Field(
        description="IDs of signals that contributed to this belief"
    )
```

### 3.2 Update Algorithm (Pseudocode)

```python
def update_belief(
    current: BeliefState,
    signal: PsychometricSignal,
    signal_weight: float = 1.0
) -> BeliefState:
    """
    Bayesian update of belief state given new signal.
    
    Uses Beta-Binomial conjugate prior for binary/continuous dimensions.
    """
    
    # Map signal to evidence strength
    evidence_strength = calculate_evidence_strength(signal)
    
    # Apply confidence weighting
    # High confidence signals move belief more
    confidence_multiplier = {
        "high": 1.0,
        "medium": 0.6,
        "low": 0.3,
        "uncertain": 0.1
    }[signal.confidence]
    
    effective_evidence = evidence_strength * signal_weight * confidence_multiplier
    
    # Bayesian update
    if signal_indicates_positive(signal):
        new_alpha = current.alpha + effective_evidence
        new_beta = current.beta
    else:
        new_alpha = current.alpha
        new_beta = current.beta + effective_evidence
    
    # Time decay (optional - beliefs fade without reinforcement)
    decay_factor = calculate_decay(current.last_updated)
    new_alpha = new_alpha * decay_factor + (1 - decay_factor) * PRIOR_ALPHA
    new_beta = new_beta * decay_factor + (1 - decay_factor) * PRIOR_BETA
    
    return BeliefState(
        dimension_id=current.dimension_id,
        current_estimate=new_alpha / (new_alpha + new_beta),
        alpha=new_alpha,
        beta=new_beta,
        last_updated=now(),
        update_count=current.update_count + 1,
        evidence_history=current.evidence_history + [signal.id]
    )


def handle_contradictory_signals(
    belief: BeliefState,
    signals: List[PsychometricSignal]
) -> BeliefState:
    """
    When signals contradict each other, increase uncertainty.
    """
    
    # Check for contradiction
    positive_signals = [s for s in signals if signal_indicates_positive(s)]
    negative_signals = [s for s in signals if not signal_indicates_positive(s)]
    
    if positive_signals and negative_signals:
        # Contradiction detected - increase variance, decrease confidence
        # Add to both alpha and beta (increases uncertainty)
        uncertainty_penalty = min(len(positive_signals), len(negative_signals))
        
        # Flag for human review or deeper inquiry
        belief.flags.append("contradictory_evidence")
    
    # Process all signals (order matters less with Bayesian)
    for signal in signals:
        belief = update_belief(belief, signal)
    
    return belief
```

### 3.3 Hypothesis to Belief Transition

```python
class HypothesisStatus(str, Enum):
    HYPOTHESIS = "hypothesis"      # < 3 confirming signals
    EMERGING = "emerging"          # 3-5 confirming signals
    PROVISIONAL = "provisional"    # 6-10 confirming signals, no contradictions
    ESTABLISHED = "established"    # 10+ signals, high confidence
    CONTESTED = "contested"        # Has contradictory evidence

def evaluate_hypothesis_status(belief: BeliefState) -> HypothesisStatus:
    """Determine when a hypothesis becomes a belief"""
    
    total_evidence = belief.alpha + belief.beta - 2  # Subtract priors
    confidence = belief.confidence
    contradictions = "contradictory_evidence" in belief.flags
    
    if total_evidence < 3:
        return HypothesisStatus.HYPOTHESIS
    elif total_evidence < 6:
        return HypothesisStatus.EMERGING
    elif contradictions:
        return HypothesisStatus.CONTESTED
    elif total_evidence < 10:
        return HypothesisStatus.PROVISIONAL
    elif confidence > 0.7:
        return HypothesisStatus.ESTABLISHED
    else:
        return HypothesisStatus.PROVISIONAL
```

### 3.4 Profile Drift Detection

```python
def detect_profile_drift(
    belief_history: List[BeliefState],
    window_size: int = 10
) -> Optional[DriftSignal]:
    """
    Detect when profile is changing significantly over time.
    
    This could indicate:
    - Actual personal growth/change
    - Initial miscalibration being corrected
    - Context-dependent trait expression
    - Assessment gaming
    """
    
    if len(belief_history) < window_size:
        return None
    
    recent = belief_history[-window_size:]
    earlier = belief_history[:-window_size][-window_size:] if len(belief_history) > window_size * 2 else None
    
    if earlier is None:
        return None
    
    recent_mean = mean([b.current_estimate for b in recent])
    earlier_mean = mean([b.current_estimate for b in earlier])
    
    drift_magnitude = abs(recent_mean - earlier_mean)
    
    if drift_magnitude > DRIFT_THRESHOLD:
        return DriftSignal(
            dimension_id=belief_history[0].dimension_id,
            drift_direction="increasing" if recent_mean > earlier_mean else "decreasing",
            drift_magnitude=drift_magnitude,
            possible_causes=[
                "genuine_change",
                "initial_miscalibration",
                "context_variation",
                "assessment_gaming"
            ]
        )
    
    return None
```

---

## 4. Multi-Turn Context Accumulation

### 4.1 Session State Schema

```python
class SessionState(BaseModel):
    """State accumulated within a single conversation session"""
    
    session_id: str
    started_at: str
    
    # All extractions this session
    extractions: List[ExtractionResponse] = []
    
    # Aggregated session signals (deduplicated, merged)
    session_signals: dict[str, List[PsychometricSignal]] = {}
    
    # Conversation context
    topics_discussed: List[str] = []
    emotional_arc: List[EmotionalSignal] = []  # Emotion trajectory
    
    # Session-level observations
    engagement_trend: str = Field(description="increasing, stable, decreasing")
    authenticity_trend: str
    
    # Hypotheses formed this session
    new_hypotheses: List[str] = []
    hypotheses_strengthened: List[str] = []
    hypotheses_challenged: List[str] = []

class LongTermProfile(BaseModel):
    """Accumulated profile across all sessions"""
    
    user_id: str
    created_at: str
    last_updated: str
    total_sessions: int
    total_interactions: int
    
    # Core profile dimensions (Bayesian beliefs)
    personality: dict[Big5Dimension, BeliefState]
    personality_facets: dict[Big5Facet, BeliefState]
    ego_development: BeliefState
    
    # Need satisfaction (rolling average)
    need_satisfaction: dict[SDTNeed, BeliefState]
    
    # Detected patterns (with confidence)
    defense_patterns: List[DefensePattern]
    limiting_beliefs: List[BeliefPattern]
    
    # Skill tree
    skills: dict[str, SkillNode]
    
    # Meta-profile
    assessment_reliability: float  # How consistent are their responses?
    engagement_baseline: float
    authenticity_baseline: float
```

### 4.2 Signal Accumulation Logic

```python
def accumulate_session_to_profile(
    session: SessionState,
    profile: LongTermProfile
) -> LongTermProfile:
    """
    At session end, integrate session signals into long-term profile.
    """
    
    # 1. Aggregate session signals by type
    for extraction in session.extractions:
        for signal_type, signals in [
            ("personality", extraction.personality_signals),
            ("ego", extraction.ego_signals),
            ("motivation", extraction.motivation_signals),
            # ... etc
        ]:
            # Weight by recency within session
            for i, signal in enumerate(signals):
                recency_weight = 0.8 + 0.2 * (i / len(signals))  # Recent = higher
                
                # Update corresponding belief
                profile = update_profile_belief(profile, signal, recency_weight)
    
    # 2. Check for pattern emergence
    profile = detect_new_patterns(profile, session)
    
    # 3. Update skill tree
    profile = update_skill_tree(profile, session.skill_signals)
    
    # 4. Detect drift
    for dimension, belief in profile.personality.items():
        drift = detect_profile_drift(belief.history)
        if drift:
            profile.drift_alerts.append(drift)
    
    # 5. Update meta-profile
    profile.assessment_reliability = calculate_reliability(
        profile.assessment_reliability,
        session.consistency_score
    )
    
    return profile
```

---

## 5. Agent Orchestration Contracts

### 5.1 System Architecture

```
User Message
     │
     ▼
┌─────────────────┐
│  Excavation     │  Extract signals from response
│  Agent          │
└────────┬────────┘
         │ ExtractionResponse (structured output)
         ▼
┌─────────────────┐
│  Profile        │  Update Bayesian beliefs
│  Agent          │
└────────┬────────┘
         │ ProfileUpdate (what changed)
         ▼
┌─────────────────┐
│  Skill Tree     │  Update skill graph
│  Agent          │
└────────┬────────┘
         │ SkillTreeUpdate
         ▼
┌─────────────────┐
│  Inquiry        │  Decide what to ask next
│  Agent          │
└─────────────────┘
```

### 5.2 Agent Contracts

#### Excavation Agent

**Input:**
```python
class ExcavationInput(BaseModel):
    user_message: str
    session_context: SessionState
    profile_summary: ProfileSummary  # High-level profile for context
    question_asked: str  # What prompted this response
```

**Output:**
```python
class ExcavationOutput(BaseModel):
    extraction: ExtractionResponse  # Full structured extraction
    
    # Excavation-specific observations
    follow_up_opportunities: List[str] = Field(
        description="Promising threads to pull on"
    )
    resistance_detected: bool
    topic_to_avoid: Optional[str]
    
    # Quality indicators
    extraction_completeness: float
    needs_clarification: List[str]
```

**Strict Tool Definition:**
```python
excavation_tool = {
    "name": "extract_psychometric_signals",
    "description": "Extract psychometric signals from user response",
    "strict": True,  # Guarantees output matches schema
    "input_schema": ExcavationInput.model_json_schema(),
    "output_schema": ExcavationOutput.model_json_schema()
}
```

#### Profile Agent

**Input:**
```python
class ProfileUpdateInput(BaseModel):
    extraction: ExtractionOutput
    current_profile: LongTermProfile
    session_history: List[ExtractionResponse]
```

**Output:**
```python
class ProfileUpdateOutput(BaseModel):
    # What changed
    beliefs_updated: List[BeliefUpdate]
    hypotheses_status_changes: List[HypothesisStatusChange]
    patterns_detected: List[PatternDetection]
    drift_alerts: List[DriftSignal]
    
    # Profile state
    profile_snapshot: ProfileSummary  # Lightweight for passing downstream
    
    # Recommendations
    dimensions_needing_clarity: List[str] = Field(
        description="Dimensions with high uncertainty"
    )
    contradictions_to_resolve: List[str]
```

#### Skill Tree Agent

**Input:**
```python
class SkillTreeInput(BaseModel):
    skill_signals: List[SkillSignal]
    current_tree: SkillTree
    user_goals: List[Goal]  # What they're trying to achieve
```

**Output:**
```python
class SkillTreeOutput(BaseModel):
    # Tree updates
    nodes_updated: List[SkillNodeUpdate]
    edges_added: List[SkillEdge]  # New skill relationships discovered
    blockers_identified: List[SkillBlocker]
    
    # Duolingo-style scheduling
    skills_due_for_practice: List[SkillPracticeRecommendation]
    skill_decay_predictions: List[SkillDecayPrediction]
    
    # Growth path
    recommended_focus: List[str]
    prerequisite_gaps: List[str]
```

#### Inquiry Agent

**Input:**
```python
class InquiryInput(BaseModel):
    profile_summary: ProfileSummary
    profile_update: ProfileUpdateOutput
    skill_tree_update: SkillTreeOutput
    session_state: SessionState
    
    # Constraints
    time_remaining: int  # Estimated interactions left
    user_energy: float  # From emotional signals
    topics_exhausted: List[str]
```

**Output:**
```python
class InquiryDecision(BaseModel):
    # What to ask
    next_question: str
    question_purpose: str = Field(
        description="clarify_dimension, explore_hypothesis, test_skill, etc."
    )
    target_dimension: Optional[str]
    
    # Why this question
    expected_signal_types: List[str]
    information_gain_estimate: float
    
    # Alternatives considered
    alternative_questions: List[str]
    
    # Conversation management
    should_transition_topic: bool
    suggested_transition: Optional[str]
```

### 5.3 Orchestration Pattern

Using sequential pipeline with state passing:

```python
async def process_user_message(
    message: str,
    session: SessionState,
    profile: LongTermProfile
) -> InquiryDecision:
    """
    Full pipeline: Extract → Update Profile → Update Skills → Decide Next
    """
    
    # 1. Extraction (structured output)
    excavation_response = await client.beta.messages.parse(
        model="claude-sonnet-4-5-20250514",
        system=EXCAVATION_SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": format_excavation_input(
                message, session, profile.summary()
            )}
        ],
        response_format=ExcavationOutput,
        betas=["structured-outputs-2025-11-13"]
    )
    extraction = excavation_response.parsed_output
    
    # 2. Profile update
    profile_response = await client.beta.messages.parse(
        model="claude-sonnet-4-5-20250514",
        system=PROFILE_UPDATE_SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": format_profile_input(
                extraction, profile, session.extractions
            )}
        ],
        response_format=ProfileUpdateOutput,
        betas=["structured-outputs-2025-11-13"]
    )
    profile_update = profile_response.parsed_output
    
    # 3. Skill tree update (can run in parallel with step 4 if needed)
    skill_response = await client.beta.messages.parse(
        model="claude-sonnet-4-5-20250514",
        system=SKILL_TREE_SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": format_skill_input(
                extraction.skill_signals, profile.skills, profile.goals
            )}
        ],
        response_format=SkillTreeOutput,
        betas=["structured-outputs-2025-11-13"]
    )
    skill_update = skill_response.parsed_output
    
    # 4. Inquiry decision
    inquiry_response = await client.beta.messages.parse(
        model="claude-sonnet-4-5-20250514",
        system=INQUIRY_SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": format_inquiry_input(
                profile_update.profile_snapshot,
                profile_update,
                skill_update,
                session
            )}
        ],
        response_format=InquiryDecision,
        betas=["structured-outputs-2025-11-13"]
    )
    
    return inquiry_response.parsed_output
```

---

## 6. Example Extraction

### Sample User Response

**Question asked:** "What's been on your mind lately?"

**User response:** 
> "Honestly, I've been stressed about this presentation at work. I know I should be better prepared by now, but I keep putting it off. Part of me thinks it won't matter anyway - my manager never really listens to my ideas. I've tried speaking up before and it just... didn't go anywhere. My partner says I'm too hard on myself but I don't know. Maybe I'm just not cut out for this kind of thing."

### Extracted Signals

```json
{
  "response_id": "resp_20260113_001",
  "session_id": "sess_abc123",
  "timestamp": "2026-01-13T14:32:00Z",
  "user_message_length": 342,
  
  "personality_signals": [
    {
      "signal_type": "personality",
      "dimension": "neuroticism",
      "facet": null,
      "direction": "high",
      "magnitude": 0.7,
      "confidence": "medium",
      "markers_detected": [
        "stress language",
        "self-criticism",
        "rumination indicators"
      ],
      "evidence": [
        {
          "quote": "I've been stressed about this presentation",
          "indicator_type": "explicit_emotion_statement",
          "weight": 0.8
        },
        {
          "quote": "too hard on myself",
          "indicator_type": "self_criticism_acknowledgment",
          "weight": 0.6
        }
      ]
    },
    {
      "signal_type": "personality",
      "dimension": "conscientiousness",
      "facet": "self_discipline",
      "direction": "low",
      "magnitude": 0.5,
      "confidence": "low",
      "markers_detected": ["procrastination admission"],
      "evidence": [
        {
          "quote": "I keep putting it off",
          "indicator_type": "procrastination_behavior",
          "weight": 0.7
        }
      ]
    }
  ],
  
  "motivation_signals": [
    {
      "signal_type": "motivation",
      "need": "competence",
      "satisfaction_level": -0.6,
      "motivation_type": "introjected_regulation",
      "activity_context": "work presentation",
      "confidence": "high",
      "competence_markers": ["self-doubt language", "capability questioning"],
      "evidence": [
        {
          "quote": "Maybe I'm just not cut out for this kind of thing",
          "indicator_type": "competence_self_doubt",
          "weight": 0.9
        },
        {
          "quote": "I know I should be better prepared",
          "indicator_type": "should_statement_introjection",
          "weight": 0.7
        }
      ]
    },
    {
      "signal_type": "motivation",
      "need": "autonomy",
      "satisfaction_level": -0.4,
      "activity_context": "workplace voice",
      "confidence": "medium",
      "autonomy_markers": ["perceived lack of influence"],
      "evidence": [
        {
          "quote": "my manager never really listens to my ideas",
          "indicator_type": "autonomy_frustration",
          "weight": 0.8
        }
      ]
    }
  ],
  
  "defense_signals": [
    {
      "signal_type": "defense",
      "mechanism": null,
      "distortion": "jumping_to_conclusions",
      "trigger_topic": "manager feedback",
      "intensity": 0.6,
      "recurring": null,
      "confidence": "medium",
      "markers": ["overgeneralization from past experience"],
      "evidence": [
        {
          "quote": "it won't matter anyway - my manager never really listens",
          "indicator_type": "mind_reading_fortune_telling",
          "weight": 0.8
        }
      ]
    },
    {
      "signal_type": "defense",
      "mechanism": null,
      "distortion": "labeling",
      "trigger_topic": "self-assessment",
      "intensity": 0.5,
      "confidence": "medium",
      "markers": ["identity-level negative self-labeling"],
      "evidence": [
        {
          "quote": "not cut out for this kind of thing",
          "indicator_type": "negative_self_labeling",
          "weight": 0.7
        }
      ]
    }
  ],
  
  "belief_signals": [
    {
      "signal_type": "limiting_belief",
      "belief_statement": "My contributions don't matter because people in authority don't value my input",
      "domain": "self_worth",
      "expression_type": "implicit",
      "blocks_goal": "career advancement, speaking up at work",
      "awareness_level": "vaguely_aware",
      "confidence": "medium",
      "meta_model_violations": [
        "universal_quantifier (never)",
        "mind_reading (won't matter)"
      ],
      "evidence": [
        {
          "quote": "my manager never really listens to my ideas",
          "indicator_type": "authority_dismissal_belief",
          "weight": 0.8
        },
        {
          "quote": "it won't matter anyway",
          "indicator_type": "futility_belief",
          "weight": 0.7
        }
      ]
    },
    {
      "signal_type": "limiting_belief",
      "belief_statement": "I lack the inherent capability for professional success",
      "domain": "capability",
      "expression_type": "explicit",
      "blocks_goal": "presentation success, career growth",
      "awareness_level": "aware_but_stuck",
      "confidence": "high",
      "meta_model_violations": [
        "lost_performative (not cut out)",
        "nominalization (this kind of thing)"
      ],
      "evidence": [
        {
          "quote": "Maybe I'm just not cut out for this kind of thing",
          "indicator_type": "fixed_capability_belief",
          "weight": 0.9
        }
      ]
    }
  ],
  
  "skill_signals": [
    {
      "signal_type": "skill",
      "skill_name": "public_speaking",
      "category": "social",
      "demonstrated_level": null,
      "self_reported_level": 0.3,
      "blockers": ["anxiety", "perceived lack of impact"],
      "growth_mindset_indicators": [],
      "fixed_mindset_indicators": ["not cut out for this"],
      "confidence": "low",
      "evidence": [
        {
          "quote": "not cut out for this kind of thing",
          "indicator_type": "skill_avoidance_fixed_mindset",
          "weight": 0.6
        }
      ]
    }
  ],
  
  "emotional_signals": [
    {
      "signal_type": "emotional_state",
      "primary_emotion": "fear",
      "secondary_emotions": ["sadness"],
      "valence": -0.5,
      "arousal": 0.6,
      "regulation_strategy_detected": "seeking_validation_from_partner",
      "emotional_awareness": "moderate",
      "apparent_trigger": "upcoming presentation",
      "confidence": "high",
      "evidence": [
        {
          "quote": "I've been stressed",
          "indicator_type": "explicit_negative_emotion",
          "weight": 0.9
        }
      ]
    }
  ],
  
  "response_authenticity": 0.85,
  "engagement_level": 0.75,
  "extraction_confidence": "high",
  "signals_count": 9,
  "ambiguous_signals": []
}
```

---

## 7. Open Questions and Risks

### 7.1 Open Questions

| Question | Notes |
|----------|-------|
| **Signal validity** | How do we validate that extracted signals correspond to real psychological constructs? Need periodic calibration against validated instruments. |
| **Cultural bias** | Linguistic markers may be culturally specific. "High neuroticism" markers in one culture may be normal expression in another. |
| **State vs. trait** | A single response captures state (current), not trait (stable). How many observations confirm a trait? |
| **Gaming detection** | Users may learn what signals "good" responses. How to detect and handle assessment gaming? |
| **Ethical boundaries** | When does helpful profiling become intrusive surveillance? Need clear consent and transparency. |
| **Profile portability** | Should profiles be exportable? In what format? Who owns this data? |
| **Therapeutic scope** | System detects patterns but is not therapy. Where is the handoff to professionals? |

### 7.2 Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **False confidence** | Acting on wrong beliefs | Never present hypotheses as facts; show uncertainty |
| **Self-fulfilling prophecy** | Profile shapes questions that confirm profile | Periodically ask disconfirming questions |
| **Over-pathologizing** | Normal variation labeled as dysfunction | Calibrate baselines; avoid clinical terminology |
| **Privacy breach** | Sensitive psychological data exposed | Encrypt at rest, minimize retention, user control |
| **Manipulation potential** | Profile used to influence rather than help | Ethical review of all downstream uses |
| **Model hallucination** | AI invents signals not in text | Require evidence quotes; validate extraction |

### 7.3 Recommended Safeguards

1. **Transparency**: Show users what's being extracted, with confidence levels
2. **User control**: Allow users to contest/correct profile beliefs
3. **Audit trail**: Log all signals and updates for review
4. **Rate limiting**: Cap profile changes per session to prevent over-fitting
5. **Human review**: Flag high-confidence clinical signals for human review
6. **Decay mechanism**: Old signals naturally fade unless reinforced

---

## Sources

### Claude Structured Outputs
- [Structured outputs - Claude Docs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Structured outputs on the Claude Developer Platform | Claude](https://claude.com/blog/structured-outputs-on-the-claude-developer-platform)
- [A Hands-On Guide to Anthropic's New Structured Output Capabilities | Towards Data Science](https://towardsdatascience.com/hands-on-with-anthropics-new-structured-output-capabilities/)
- [Zero-Error JSON with Claude: How Anthropic's Structured Outputs Actually Work in Real Code | Medium](https://medium.com/@meshuggah22/zero-error-json-with-claude-how-anthropics-structured-outputs-actually-work-in-real-code-789cde7aff13)

### Psychometric AI Assessment
- [A psychometric framework for evaluating and shaping personality traits in large language models | Nature Machine Intelligence](https://www.nature.com/articles/s42256-025-01115-6)
- [AI Psychometrics: Assessing the Psychological Profiles of Large Language Models | SAGE Journals](https://journals.sagepub.com/doi/10.1177/17456916231214460)
- [How well can an AI chatbot measure your personality? | Auburn University](https://cla.auburn.edu/news/articles/tydkydk-that-ai-knows-about-you/)
- [Artificial intelligence powered personality assessment: A multidimensional psychometric natural language processing perspective | APA](https://www.apadivisions.org/division-5/publications/score/2022/10/language-processing)

### Ego Development
- [Leveraging on large language model to classify sentences: STAGES scoring methodology | Frontiers in Psychology](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1488102/full)
- [The validation of a new scoring method for assessing ego development based on three dimensions of language | PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7090352/)
- [Sentence completion assessments for ego development, meaning-making, and wisdom maturity | Integral Leadership Review](https://integralleadershipreview.com/15642-sentence-completion-assessments-for-ego-development-meaning-making-and-wisdom-maturity-including-stages-overview-and-summary-this-article-began-as-a-series-of-short-white-papers-providing-various/)

### Self-Determination Theory
- [Theory | selfdeterminationtheory.org](https://selfdeterminationtheory.org/theory/)
- [Analyzing the network structure of students' motivation to learn AI: a self-determination theory perspective | npj Science of Learning](https://www.nature.com/articles/s41539-025-00339-w)
- [Competence, autonomy, and relatedness in the classroom | ScienceDirect](https://www.sciencedirect.com/science/article/pii/S240584401935604X)

### Cognitive Distortions Detection
- [AI Detects Cognitive Distortions in Text Messages | Psychology Today](https://www.psychologytoday.com/us/blog/the-future-brain/202210/ai-detects-cognitive-distortions-in-text-messages)
- [Automatic Detection and Classification of Cognitive Distortions in Mental Health Text | arXiv](https://arxiv.org/abs/1909.07502)
- [Cognitive Distortion Detection through Diagnosis of Thought | ACL Anthology](https://aclanthology.org/2023.findings-emnlp.284.pdf)

### Bayesian Knowledge Tracing
- [Bayesian knowledge tracing | Wikipedia](https://en.wikipedia.org/wiki/Bayesian_knowledge_tracing)
- [Individualized Bayesian Knowledge Tracing Models | CMU](https://www.cs.cmu.edu/~ggordon/yudelson-koedinger-gordon-individualized-bayesian-knowledge-tracing.pdf)
- [Time-dependant Bayesian knowledge tracing | Frontiers in Robotics and AI](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2023.1249241/full)
- [pyBKT: Python implementation of Bayesian Knowledge Tracing | GitHub](https://github.com/CAHLR/pyBKT)

### Duolingo Learning Algorithm
- [How we learn how you learn | Duolingo Blog](https://blog.duolingo.com/how-we-learn-how-you-learn/)
- [How Duolingo's AI Learns What You Need to Learn | IEEE Spectrum](https://spectrum.ieee.org/duolingo)
- [A Trainable Spaced Repetition Model for Language Learning | Duolingo Research](https://research.duolingo.com/papers/settles.acl16.pdf)
- [halflife-regression | GitHub](https://github.com/duolingo/halflife-regression)

### User Modeling
- [User Modeling and User Profiling: A Comprehensive Survey | arXiv](https://arxiv.org/html/2402.09660v1)
- [Bayesian modeling of human-AI complementarity | PNAS](https://www.pnas.org/doi/10.1073/pnas.2111547119)
- [From Millions of Tweets to Actionable Insights: Leveraging LLMs for User Profiling | arXiv](https://arxiv.org/html/2505.06184v1)

### Multi-Agent Orchestration
- [AI Agent Orchestration Patterns | Microsoft Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
- [Developer's guide to multi-agent patterns in ADK | Google Developers Blog](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/)
- [Orchestrating multiple agents | OpenAI Agents SDK](https://openai.github.io/openai-agents-python/multi_agent/)
- [Agent system design patterns | Databricks](https://docs.databricks.com/aws/en/generative-ai/guide/agent-system-design-patterns)

---

*Research compiled by Oracle Agent for Life OS psychometric assessment design.*
