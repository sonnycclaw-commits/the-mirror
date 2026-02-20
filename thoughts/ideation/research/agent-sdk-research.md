# Claude Agent SDK Research: Building an AI Life Coach

**Generated:** 2026-01-13
**Research Agent:** Oracle

## Summary

The Claude Agent SDK provides a robust foundation for building AI coaching agents with custom tools, session management, and multi-agent orchestration. For a gamified life transformation app, the recommended architecture is an orchestrator-subagent model with specialized coaches (Morning/Interrupt/Evening) that share context via structured handoffs. Memory persistence requires external storage (MCP servers or databases) since sessions don't persist automatically across conversations.

---

## Questions Answered

### Q1: What are the Claude Agent SDK basics and core patterns?
**Answer:** The SDK enables building conversational agents with custom tools via in-process MCP servers. Key features include session management, streaming responses, hooks for event handling, and multi-model support (Opus, Sonnet, Haiku).
**Source:** [Agent SDK Overview - Claude Docs](https://platform.claude.com/docs/en/agent-sdk/overview)
**Confidence:** High

### Q2: How do you build agents that coach vs just answer questions?
**Answer:** Coaching agents require Socratic questioning patterns - probing assumptions, guiding toward insights without giving answers directly. The key is instructing Claude to "ask questions to help explore a problem" and "target core motivations and unstated intentions."
**Source:** [Socratic Coach Pattern](https://thatryanp.medium.com/my-go-to-prompt-for-chatgpt-socratic-coach-7bf0dd2c01ec)
**Confidence:** High

### Q3: Can we have different coaches for different modes?
**Answer:** Yes, multi-agent architectures support specialized subagents. The orchestrator-subagent model is the dominant 2025 pattern - each coach can have clean context windows and focused prompts while sharing user state via structured handoffs.
**Source:** [Anthropic Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system)
**Confidence:** High

### Q4: How do agents hand off context?
**Answer:** Two patterns exist: (1) Agent-as-Tool (call with focused prompt, get result, no history shared) and (2) Agent Transfer/Handoff (full conversation/state handed to next agent). For coaching, Handoff pattern is preferred to maintain continuity.
**Source:** [Understanding Handoff in Multi-Agent AI Systems](https://www.jetlink.io/post/understanding-handoff-in-multi-agent-ai-systems)
**Confidence:** High

### Q5: How do you maintain user profile across sessions?
**Answer:** The SDK doesn't provide automatic cross-session persistence. You must implement external memory via MCP servers, databases, or file-based storage. Memory.md files and user profiles should be loaded at session start.
**Source:** [Session Management - Claude Docs](https://platform.claude.com/docs/en/agent-sdk/sessions)
**Confidence:** High

### Q6: How should mobile app integrate with AI coaching backend?
**Answer:** Use Pub/Sub architecture with message brokers (Redis for low-latency, RabbitMQ for reliability). Firebase Cloud Messaging for push notifications. AI can determine optimal notification timing based on user behavior patterns.
**Source:** [Building Real-Time Notifications](https://www.zetaton.com/blogs/building-real-time-notifications-for-web-and-mobile-apps)
**Confidence:** Medium

---

## Detailed Findings

### Finding 1: Claude Agent SDK Architecture

**Source:** [GitHub - anthropics/claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)

**Key Points:**
- Custom tools are Python functions exposed via in-process MCP servers
- No subprocess management needed - runs in same process
- Supports both streaming and synchronous response modes
- Can mix SDK MCP servers with external MCP servers

**Code Example - Custom Tool Definition:**
```python
from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions, ClaudeSDKClient

@tool("get_user_vision", "Retrieve user's vision statement", {"user_id": str})
async def get_user_vision(args):
    # Fetch from your database
    vision = await db.get_vision(args["user_id"])
    return {
        "content": [{"type": "text", "text": vision}]
    }

@tool("log_insight", "Record a breakthrough insight", {"user_id": str, "insight": str})
async def log_insight(args):
    await db.store_insight(args["user_id"], args["insight"])
    return {
        "content": [{"type": "text", "text": "Insight recorded."}]
    }

server = create_sdk_mcp_server(
    name="life-coach-tools",
    version="1.0.0",
    tools=[get_user_vision, log_insight]
)
```

---

### Finding 2: Multi-Agent Coaching Architecture

**Source:** [How Anthropic Built a Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system)

**Key Points:**
- Orchestrator-Worker pattern works best for coordinated tasks
- Each subagent needs: objective, output format, tool guidance, task boundaries
- Lead agent saves plan to memory to survive context limits
- Multi-agent uses ~15x more tokens than single chat

**Recommended Architecture for Life Coach:**

```
┌─────────────────────────────────────────────────────────┐
│                   ORCHESTRATOR AGENT                     │
│  - Routes to appropriate coach based on time/context    │
│  - Maintains user state across sessions                 │
│  - Handles crisis detection & escalation                │
└──────────────┬────────────────┬────────────────┬────────┘
               │                │                │
    ┌──────────▼───────┐ ┌──────▼───────┐ ┌─────▼──────────┐
    │  MORNING COACH   │ │INTERRUPT COACH│ │ EVENING COACH  │
    │  (Excavation)    │ │(Pattern Break)│ │  (Synthesis)   │
    │                  │ │               │ │                │
    │ - Deep inquiry   │ │ - Quick check │ │ - Day review   │
    │ - Vision work    │ │ - Redirection │ │ - Integration  │
    │ - Resistance     │ │ - Energy boost│ │ - Gratitude    │
    │   exploration    │ │ - Focus reset │ │ - Tomorrow     │
    └──────────────────┘ └───────────────┘ └────────────────┘
```

---

### Finding 3: Socratic Coaching Patterns

**Source:** [Princeton NLP - Socratic Method for Self-Discovery](https://princeton-nlp.github.io/SocraticAI/)

**Key Points:**
- Ask questions that surface unstated intentions
- Challenge assumptions without providing answers
- Guide toward insights, don't impose conclusions
- Multi-agent Socratic dialogue (LLMs cross-examining each other) shows promise

**Coaching Prompt Pattern:**
```python
MORNING_COACH_SYSTEM = """
You are an excavation coach specializing in psychological archaeology.
You use Socratic questioning to help users discover what's underneath their surface answers.

CORE APPROACH:
- Never give advice directly. Ask questions that reveal.
- Target the gap between stated goals and actual behavior
- Probe for the secondary gains of "problems"
- When user gives a quick answer, slow them down: "Sit with that. What else?"

TECHNIQUES:
1. "What would you lose if this problem disappeared?"
2. "Whose voice is that belief in?"
3. "What's the feeling underneath the feeling?"
4. "If you knew you couldn't fail, what would you attempt?"
5. "What are you protecting by staying stuck?"

When to push: User is deflecting, intellectualizing, or giving rehearsed answers
When to support: User is in genuine emotional territory, showing vulnerability
"""
```

---

### Finding 4: Memory & Context Management

**Source:** [Memory & Context Management Cookbook](https://platform.claude.com/cookbook/tool-use-memory-cookbook)

**Key Points:**
- File-based memory system released with Sonnet 4.5
- Agents can write/read from persistent notes
- Compaction is critical - aggressive trimming loses subtle context
- Just-in-time retrieval beats pre-loading everything

**User Profile Memory Schema:**
```python
USER_PROFILE_SCHEMA = {
    "user_id": str,
    "vision": {
        "statement": str,          # Their aspirational vision
        "anti_vision": str,        # What they're moving away from
        "core_values": list[str],  # Discovered values
        "updated_at": datetime
    },
    "goals": [
        {
            "id": str,
            "description": str,
            "why": str,              # Emotional driver
            "resistance": str,        # Known blockers
            "progress": float,
            "insights": list[str]
        }
    ],
    "ego_stage": {
        "current": str,           # e.g., "achiever", "individualist"
        "evidence": list[str],    # Behavioral indicators
        "growth_edges": list[str]
    },
    "patterns": {
        "triggers": list[str],
        "defenses": list[str],
        "breakthroughs": list[str]
    },
    "session_history": [
        {
            "date": datetime,
            "type": str,           # morning/interrupt/evening
            "key_insight": str,
            "homework": str
        }
    ]
}
```

**Memory Tool Implementation:**
```python
@tool("recall_user_context", "Get relevant user history for coaching", 
      {"user_id": str, "context_type": str})
async def recall_user_context(args):
    profile = await db.get_user_profile(args["user_id"])
    
    # Contextual retrieval based on coaching mode
    if args["context_type"] == "morning":
        return format_morning_context(profile)
    elif args["context_type"] == "interrupt":
        return format_interrupt_context(profile)  # Lighter, faster
    elif args["context_type"] == "evening":
        return format_evening_context(profile)  # Include day's data
```

---

### Finding 5: Handoff Patterns for Coaching Transitions

**Source:** [Best Practices for Multi-Agent Orchestration](https://skywork.ai/blog/ai-agent-orchestration-best-practices-handoffs/)

**Key Points:**
- Handoffs are the main failure point in multi-agent systems
- Use structured schemas, not free-form prose
- Treat inter-agent transfer like a public API
- Version your handoff formats

**Structured Handoff Schema:**
```python
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CoachingHandoff(BaseModel):
    """Structured handoff between coaching agents"""
    
    # Who's handing off
    from_coach: str  # "morning" | "interrupt" | "evening"
    to_coach: str
    timestamp: datetime
    
    # User state
    user_id: str
    current_emotional_state: str  # "grounded" | "activated" | "resistant" | "vulnerable"
    energy_level: int  # 1-10
    
    # Context
    session_summary: str  # Max 200 words
    key_insight: Optional[str]
    unfinished_thread: Optional[str]
    
    # Coaching guidance
    suggested_approach: str  # "push" | "support" | "explore" | "challenge"
    topics_to_avoid: List[str]
    topics_to_explore: List[str]
    
    # Safety
    crisis_indicators: bool
    escalation_needed: bool

# Usage in handoff
async def transition_to_evening_coach(user_id: str, morning_session: dict):
    handoff = CoachingHandoff(
        from_coach="morning",
        to_coach="evening",
        timestamp=datetime.now(),
        user_id=user_id,
        current_emotional_state=morning_session["final_state"],
        energy_level=morning_session["energy"],
        session_summary=morning_session["summary"],
        key_insight=morning_session.get("breakthrough"),
        unfinished_thread=morning_session.get("open_question"),
        suggested_approach="explore" if morning_session.get("breakthrough") else "support",
        topics_to_avoid=morning_session.get("tender_spots", []),
        topics_to_explore=morning_session.get("threads", []),
        crisis_indicators=False,
        escalation_needed=False
    )
    return handoff.model_dump_json()
```

---

### Finding 6: Mobile Integration Architecture

**Source:** [Firebase Cloud Messaging Architecture](https://firebase.google.com/docs/cloud-messaging/fcm-architecture)

**Key Points:**
- Pub/Sub model for scalable notifications
- Redis for low-latency (coaching prompts)
- FCM/APNs for mobile push delivery
- AI can optimize notification timing

**Recommended Architecture:**
```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Mobile App  │────▶│   API Gateway   │────▶│  Coaching Engine │
│  (Flutter/RN)│◀────│   (FastAPI)     │◀────│  (Agent SDK)     │
└──────────────┘     └─────────────────┘     └──────────────────┘
       │                      │                       │
       │                      │                       │
       ▼                      ▼                       ▼
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│    FCM/APNs  │     │  Redis Pub/Sub  │     │   PostgreSQL     │
│    (Push)    │     │  (Real-time)    │     │   (User State)   │
└──────────────┘     └─────────────────┘     └──────────────────┘
```

**Notification Trigger Logic:**
```python
class InterventionEngine:
    """Determines when to trigger coaching notifications"""
    
    async def should_intervene(self, user_id: str) -> Optional[str]:
        profile = await self.get_profile(user_id)
        context = await self.get_current_context(user_id)
        
        # Time-based triggers
        if self.is_morning_window(profile) and not context.morning_done:
            return "morning_excavation"
            
        # Behavior-based triggers  
        if context.app_opens_without_progress > 3:
            return "gentle_redirect"
            
        # Pattern-based triggers
        if self.detecting_avoidance_pattern(context):
            return "pattern_interrupt"
            
        # Energy-based (if integrated with wearable)
        if context.energy_dip_detected:
            return "energy_boost"
            
        return None
```

---

### Finding 7: Emotional Safety & Guardrails

**Source:** [Building Safeguards for Claude](https://www.anthropic.com/news/building-safeguards-for-claude)

**Key Points:**
- Claude has built-in crisis detection (98%+ accuracy)
- Crisis banner activates for self-harm mentions
- Avoid encouraging self-destructive behaviors
- Refer to professionals when appropriate
- Claude rarely resists in supportive contexts (<10%)

**Safety Layer Implementation:**
```python
SAFETY_SYSTEM_PROMPT = """
SAFETY BOUNDARIES:
1. You are a coach, not a therapist. Know your limits.
2. If user mentions self-harm, suicide, or abuse:
   - Acknowledge their pain
   - Provide crisis resources
   - Do not attempt to treat
3. Watch for:
   - Dissociation indicators
   - Extreme emotional dysregulation
   - Mentions of harming self or others
4. When in doubt, suggest professional support
5. Never diagnose mental health conditions

CRISIS RESPONSE TEMPLATE:
"I hear how much pain you're in. This sounds really hard. 
I want to make sure you have the support you need right now.
[Crisis Resource]
Would you like to talk about what's happening, or would you 
prefer we focus on something that might help you feel more grounded?"
"""

@tool("check_safety", "Evaluate if response needs safety escalation", 
      {"user_message": str})
async def check_safety(args):
    # Use Claude classifier for safety check
    safety_result = await safety_classifier.evaluate(args["user_message"])
    
    if safety_result.crisis_detected:
        return {
            "content": [{"type": "text", "text": json.dumps({
                "escalate": True,
                "type": safety_result.crisis_type,
                "resources": get_crisis_resources(safety_result.region)
            })}]
        }
    return {"content": [{"type": "text", "text": '{"escalate": false}'}]}
```

---

### Finding 8: Extended Thinking for Deep Coaching

**Source:** [Building with Extended Thinking - Claude Docs](https://docs.claude.com/en/docs/build-with-claude/extended-thinking)

**Key Points:**
- Extended thinking allows Claude to reason before responding
- Can set "thinking budget" for depth of reflection
- Useful for complex psychological territory
- Hidden chain-of-thought improves response quality

**When to Use Extended Thinking:**
- Morning excavation (deep inquiry)
- Processing breakthrough moments
- Integrating conflicting user statements
- Planning session approach

**NOT needed for:**
- Quick interrupt checks
- Simple affirmations
- Routine check-ins

---

## Comparison Matrix

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **Single Monolithic Agent** | Simple, lower latency | Context limits, no specialization | MVP/Prototype |
| **Multi-Agent Orchestrator** | Specialized coaches, clean contexts | Complex, higher token cost | Production |
| **Stateless Sessions** | Simple architecture | Poor continuity | One-off interactions |
| **MCP Memory Server** | Persistent, searchable memory | Additional infrastructure | Long-term coaching |
| **File-Based Memory** | Simple, portable | Less queryable | Small user base |
| **Database Memory** | Scalable, queryable | More complex | Production scale |

---

## Architecture Recommendation

### For Your Life Coach App:

```python
# Recommended Stack
ARCHITECTURE = {
    "sdk": "claude-agent-sdk (Python)",
    "backend": "FastAPI",
    "database": "PostgreSQL (user profiles) + Redis (sessions)",
    "mobile": "Flutter or React Native",
    "notifications": "Firebase Cloud Messaging",
    "memory": "Custom MCP server + PostgreSQL",
    "model_routing": {
        "morning_coach": "claude-opus-4",      # Deep work needs best model
        "interrupt_coach": "claude-sonnet-4",   # Quick, lower cost
        "evening_coach": "claude-sonnet-4",     # Balanced
        "safety_check": "claude-haiku-4"        # Fast classifier
    }
}
```

### Implementation Phases:

**Phase 1 - MVP (2-3 weeks):**
- Single coaching agent with mode switching (not multi-agent)
- File-based user profile persistence
- Basic morning/evening prompts
- No interrupts yet

**Phase 2 - Multi-Agent (2-3 weeks):**
- Split into specialized coach agents
- Structured handoff protocol
- PostgreSQL user profiles
- Interrupt notifications

**Phase 3 - Intelligence (2-3 weeks):**
- Pattern detection across sessions
- Adaptive intervention timing
- Ego development stage tracking
- Breakthrough moment detection

---

## Risks and Considerations

### Technical Risks:
1. **Token Costs**: Multi-agent is ~15x chat costs. Budget carefully.
2. **Latency**: Orchestrator overhead adds ~2-5s. Optimize for mobile.
3. **Context Loss**: Handoffs can drop nuance. Test extensively.

### Safety Risks:
1. **Scope Creep**: Coach becomes therapy substitute. Maintain boundaries.
2. **Dependency**: Users over-rely on AI. Build in human connection prompts.
3. **Crisis Handling**: Must have robust escalation path.

### Product Risks:
1. **Notification Fatigue**: Too many interrupts = uninstall
2. **Generic Coaching**: Without memory, feels impersonal
3. **Cold Start**: New users need onboarding before deep work

---

## Open Questions

1. **How to handle users in different timezones for morning/evening routing?**
2. **What's the optimal intervention frequency before it becomes annoying?**
3. **How to detect ego development stage from conversation patterns?**
4. **Should coaches have distinct "personalities" or unified voice?**

---

## Sources

1. [Agent SDK Overview - Claude Docs](https://platform.claude.com/docs/en/agent-sdk/overview)
2. [GitHub - anthropics/claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)
3. [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
4. [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
5. [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
6. [Memory & context management cookbook](https://platform.claude.com/cookbook/tool-use-memory-cookbook)
7. [Session Management - Claude Docs](https://platform.claude.com/docs/en/agent-sdk/sessions)
8. [MCP in the SDK - Claude Docs](https://platform.claude.com/docs/en/agent-sdk/mcp)
9. [Understanding Handoff in Multi-Agent AI Systems](https://www.jetlink.io/post/understanding-handoff-in-multi-agent-ai-systems)
10. [Best Practices for Multi-Agent Orchestration](https://skywork.ai/blog/ai-agent-orchestration-best-practices-handoffs/)
11. [Building safeguards for Claude](https://www.anthropic.com/news/building-safeguards-for-claude)
12. [The Socratic Method for Self-Discovery in LLMs](https://princeton-nlp.github.io/SocraticAI/)
13. [Building with extended thinking - Claude Docs](https://docs.claude.com/en/docs/build-with-claude/extended-thinking)
14. [Firebase Cloud Messaging Architecture](https://firebase.google.com/docs/cloud-messaging/fcm-architecture)
15. [Cognee - Claude SDK Memory Integration](https://www.cognee.ai/blog/integrations/claude-agent-sdk-persistent-memory-with-cognee-integration)
