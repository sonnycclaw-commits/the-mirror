import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// Phase enum for the 4-phase discovery flow
const phaseEnum = v.union(
  v.literal('SCENARIO'),
  v.literal('EXCAVATION'),
  v.literal('SYNTHESIS'),
  v.literal('CONTRACT')
)

// =============================================================================
// DECISION-001: Validated Signal Extraction Schema
// =============================================================================

// Signal domain enum - the 7 validated psychological domains
const signalDomainEnum = v.union(
  v.literal('VALUE'),       // Schwartz Basic Human Values
  v.literal('NEED'),        // Self-Determination Theory
  v.literal('MOTIVE'),      // McClelland's Acquired Needs
  v.literal('DEFENSE'),     // Vaillant's Defense Mechanisms
  v.literal('ATTACHMENT'),  // Bowlby's Attachment Theory
  v.literal('DEVELOPMENT'), // Kegan's Adult Development
  v.literal('PATTERN')      // Behavioral observation (free-form)
)

// Signal type is a string - constrained by domain in application logic
// VALUE: POWER, ACHIEVEMENT, HEDONISM, STIMULATION, SELF_DIRECTION, UNIVERSALISM, BENEVOLENCE, TRADITION, CONFORMITY, SECURITY
// NEED: AUTONOMY, COMPETENCE, RELATEDNESS
// MOTIVE: ACHIEVEMENT, POWER, AFFILIATION
// DEFENSE: DENIAL, PROJECTION, DISPLACEMENT, RATIONALIZATION, INTELLECTUALIZATION, SUBLIMATION, HUMOR, ANTICIPATION
// ATTACHMENT: SECURE, ANXIOUS, AVOIDANT, DISORGANIZED
// DEVELOPMENT: SOCIALIZED, SELF_AUTHORING, SELF_TRANSFORMING
// PATTERN: free-form descriptive string
const signalTypeString = v.string()

// State for NEED (SATISFIED/FRUSTRATED) or DEVELOPMENT (STABLE/TRANSITIONING)
const signalStateEnum = v.optional(
  v.union(
    v.literal('SATISFIED'),
    v.literal('FRUSTRATED'),
    v.literal('STABLE'),
    v.literal('TRANSITIONING')
  )
)

// Legacy signal type enum (kept for backward compatibility during migration)
const legacySignalTypeEnum = v.optional(
  v.union(
    v.literal('VALUE'),
    v.literal('FEAR'),
    v.literal('CONSTRAINT'),
    v.literal('PATTERN'),
    v.literal('GOAL'),
    v.literal('DEFENSE_MECHANISM'),
    v.literal('CONTRADICTION'),
    v.literal('NEED')
  )
)

// Emotional context when signal was extracted
const emotionalContextEnum = v.optional(
  v.union(
    v.literal('neutral'),
    v.literal('defensive'),
    v.literal('vulnerable'),
    v.literal('resistant'),
    v.literal('open'),
    v.literal('conflicted')
  )
)

// Life domain the signal applies to (renamed from domainEnum to avoid confusion with signalDomainEnum)
const lifeDomainEnum = v.optional(
  v.union(
    v.literal('WORK'),
    v.literal('RELATIONSHIPS'),
    v.literal('HEALTH'),
    v.literal('PERSONAL_GROWTH'),
    v.literal('FINANCE'),
    v.literal('GENERAL')
  )
)

export default defineSchema({
  // User discovery sessions
  sessions: defineTable({
    userId: v.string(),
    currentPhase: phaseEnum,
    streamId: v.optional(v.string()),
    // S3 additions: Phase machine tracking
    turnsInPhase: v.optional(v.number()),
    totalTurns: v.optional(v.number()),
    scenariosExplored: v.optional(v.number()),
    lastSignalTurn: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_updated', ['userId', 'updatedAt']),

  // Chat messages within a session
  messages: defineTable({
    sessionId: v.id('sessions'),
    role: v.union(v.literal('user'), v.literal('assistant'), v.literal('system')),
    content: v.string(),
    toolCalls: v.optional(v.any()),
    toolResults: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index('by_session', ['sessionId'])
    .index('by_session_time', ['sessionId', 'createdAt']),

  // Extracted psychological signals (DECISION-001: Validated taxonomy)
  signals: defineTable({
    sessionId: v.id('sessions'),
    // NEW: Domain-based structure (DECISION-001)
    domain: signalDomainEnum,         // Which psychological domain (VALUE, NEED, MOTIVE, etc.)
    type: signalTypeString,           // Specific construct within domain (e.g., AUTONOMY, ACHIEVEMENT)
    state: signalStateEnum,           // For NEED (SATISFIED/FRUSTRATED) or DEVELOPMENT (STABLE/TRANSITIONING)
    // Core fields
    content: v.string(),              // The insight in plain language
    source: v.string(),               // The exact user quote that evidenced this
    confidence: v.number(),           // 0.0 - 1.0
    emotionalContext: emotionalContextEnum,
    scenarioId: v.optional(v.string()),
    lifeDomain: lifeDomainEnum,       // Life area (WORK, RELATIONSHIPS, etc.)
    relatedSignals: v.optional(v.array(v.id('signals'))),
    // Legacy field for migration compatibility
    legacyType: legacySignalTypeEnum, // Old type enum (VALUE, FEAR, etc.)
    createdAt: v.number(),
  })
    .index('by_session', ['sessionId'])
    .index('by_session_domain', ['sessionId', 'domain'])
    .index('by_session_type', ['sessionId', 'type'])
    .index('by_session_life_domain', ['sessionId', 'lifeDomain']),

  // User decisions logged as ADRs
  decisions: defineTable({
    sessionId: v.id('sessions'),
    phase: phaseEnum,
    question: v.string(),
    context: v.string(),
    options: v.array(
      v.object({
        label: v.string(),
        description: v.string(),
        wasSelected: v.boolean(),
      })
    ),
    selectedOption: v.string(),
    reasoning: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_session', ['sessionId']),

  // Final momentum contracts (S5-T01: Enhanced with evidence and limits)
  contracts: defineTable({
    sessionId: v.id('sessions'),
    userId: v.string(),
    status: v.union(v.literal('DRAFT'), v.literal('SIGNED')),
    refusal: v.string(), // "I refuse to..." (max 140 chars)
    becoming: v.string(), // "I am the person who..." (max 140 chars)
    proof: v.string(), // 1 Year Goal (max 120 chars)
    test: v.string(), // 1 Month Goal (max 100 chars)
    vote: v.string(), // Today's Action (max 80 chars)
    rule: v.string(), // Non-negotiable (max 100 chars)
    // S5-T01: Evidence grounding (DECISION-001 updated)
    evidence: v.optional(
      v.array(
        v.object({
          quote: v.string(),
          scenarioName: v.optional(v.string()),
          // New validated domain structure
          signalDomain: v.optional(signalDomainEnum),
          signalType: v.optional(v.string()), // Specific construct within domain
          // Legacy field for backwards compatibility
          legacySignalType: v.optional(
            v.union(
              v.literal('VALUE'),
              v.literal('FEAR'),
              v.literal('CONSTRAINT'),
              v.literal('PATTERN'),
              v.literal('GOAL'),
              v.literal('DEFENSE_MECHANISM'),
              v.literal('CONTRADICTION'),
              v.literal('NEED')
            )
          ),
        })
      )
    ),
    mirrorMoment: v.optional(v.string()),
    primaryContradiction: v.optional(
      v.object({
        stated: v.string(),
        actual: v.string(),
      })
    ),
    signedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_session', ['sessionId'])
    .index('by_user', ['userId']),

  // S4-T02: Background extraction jobs for parallel signal extraction
  extractionJobs: defineTable({
    sessionId: v.id('sessions'),
    messageContent: v.string(),
    messageId: v.optional(v.id('messages')),
    status: v.union(
      v.literal('PENDING'),
      v.literal('PROCESSING'),
      v.literal('COMPLETED'),
      v.literal('FAILED')
    ),
    signalsExtracted: v.number(),
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_session', ['sessionId'])
    .index('by_session_status', ['sessionId', 'status']),

  // S4-T03: Scenarios for grouping signals
  scenarios: defineTable({
    sessionId: v.id('sessions'),
    name: v.string(), // e.g., "The Procrastination Trap"
    description: v.string(),
    phase: phaseEnum,
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_session', ['sessionId'])
    .index('by_session_active', ['sessionId', 'isActive']),

  // S4-T03: Contradictions - explicit links between conflicting signals
  contradictions: defineTable({
    sessionId: v.id('sessions'),
    signalA: v.id('signals'), // The earlier signal
    signalB: v.id('signals'), // The contradicting signal
    contradictionType: v.union(
      v.literal('SAY_DO_GAP'), // Says X, does Y
      v.literal('VALUE_BEHAVIOR'), // Values X, chooses ~X
      v.literal('TEMPORAL'), // Said X before, now says ~X
      v.literal('IMPLICIT') // Hidden contradiction in reasoning
    ),
    description: v.string(), // Human-readable explanation
    confidence: v.number(), // How certain is this contradiction
    resolvedAt: v.optional(v.number()), // If user acknowledged/resolved
    createdAt: v.number(),
  })
    .index('by_session', ['sessionId'])
    .index('by_signal_a', ['signalA'])
    .index('by_signal_b', ['signalB']),

  // S4-T03: Evidence links - connect signals to source messages
  evidenceLinks: defineTable({
    sessionId: v.id('sessions'),
    signalId: v.id('signals'),
    messageId: v.id('messages'),
    scenarioId: v.optional(v.id('scenarios')),
    quote: v.string(), // The exact text that evidenced this
    turnNumber: v.number(), // Which turn this was extracted from
    createdAt: v.number(),
  })
    .index('by_session', ['sessionId'])
    .index('by_signal', ['signalId'])
    .index('by_scenario', ['scenarioId']),

  // S4-T04: Synthesized profiles (The Mirror) - DECISION-001 Enhanced
  profiles: defineTable({
    sessionId: v.id('sessions'),

    // Schwartz Values (validated construct)
    values: v.object({
      primary: v.array(v.string()), // Top 3 Schwartz values
      secondary: v.optional(v.array(v.string())),
    }),

    // SDT Needs Assessment (Self-Determination Theory)
    needs: v.object({
      autonomy: v.object({
        state: v.union(v.literal('SATISFIED'), v.literal('FRUSTRATED')),
        intensity: v.number(), // 0.0 - 1.0
        evidence: v.optional(v.string()),
      }),
      competence: v.object({
        state: v.union(v.literal('SATISFIED'), v.literal('FRUSTRATED')),
        intensity: v.number(),
        evidence: v.optional(v.string()),
      }),
      relatedness: v.object({
        state: v.union(v.literal('SATISFIED'), v.literal('FRUSTRATED')),
        intensity: v.number(),
        evidence: v.optional(v.string()),
      }),
    }),

    // Dominant Motive (McClelland's Theory)
    dominantMotive: v.object({
      type: v.union(
        v.literal('ACHIEVEMENT'),
        v.literal('POWER'),
        v.literal('AFFILIATION')
      ),
      evidence: v.array(v.string()),
    }),

    // Defense Profile (Vaillant's Hierarchy)
    defenses: v.object({
      primary: v.array(v.string()), // Defense mechanism names
      maturityLevel: v.union(
        v.literal('IMMATURE'),
        v.literal('NEUROTIC'),
        v.literal('MATURE')
      ),
    }),

    // Attachment Markers (Attachment Theory)
    attachmentMarkers: v.object({
      style: v.union(
        v.literal('SECURE'),
        v.literal('ANXIOUS'),
        v.literal('AVOIDANT'),
        v.literal('DISORGANIZED')
      ),
      confidence: v.number(), // 0.0 - 1.0
      evidence: v.array(v.string()),
    }),

    // Developmental Stage (Kegan's Stages)
    development: v.object({
      stage: v.union(
        v.literal('SOCIALIZED'),
        v.literal('SELF_AUTHORING'),
        v.literal('SELF_TRANSFORMING')
      ),
      state: v.union(v.literal('STABLE'), v.literal('TRANSITIONING')),
      evidence: v.array(v.string()),
    }),

    // Core patterns stored as JSON for flexibility
    corePatterns: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        evidence: v.array(v.string()),
        frequency: v.union(
          v.literal('CORE'),
          v.literal('FREQUENT'),
          v.literal('OCCASIONAL')
        ),
        domain: v.optional(
          v.union(
            v.literal('WORK'),
            v.literal('RELATIONSHIPS'),
            v.literal('HEALTH'),
            v.literal('PERSONAL_GROWTH'),
            v.literal('GENERAL')
          )
        ),
      })
    ),
    antiPatterns: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        evidence: v.array(v.string()),
        frequency: v.union(
          v.literal('CORE'),
          v.literal('FREQUENT'),
          v.literal('OCCASIONAL')
        ),
        domain: v.optional(
          v.union(
            v.literal('WORK'),
            v.literal('RELATIONSHIPS'),
            v.literal('HEALTH'),
            v.literal('PERSONAL_GROWTH'),
            v.literal('GENERAL')
          )
        ),
      })
    ),
    contradictions: v.array(
      v.object({
        stated: v.string(),
        actual: v.string(),
        impact: v.string(),
        rootCause: v.optional(v.string()),
      })
    ),
    // Legacy fields kept for backward compatibility
    primaryFears: v.optional(v.array(v.string())),
    coreValues: v.optional(v.array(v.string())),
    // Legacy needsAssessment - superseded by 'needs' but kept for migration
    needsAssessment: v.optional(
      v.object({
        autonomy: v.object({
          frustrated: v.boolean(),
          evidence: v.optional(v.string()),
          recommendation: v.optional(v.string()),
        }),
        competence: v.object({
          frustrated: v.boolean(),
          evidence: v.optional(v.string()),
          recommendation: v.optional(v.string()),
        }),
        relatedness: v.object({
          frustrated: v.boolean(),
          evidence: v.optional(v.string()),
          recommendation: v.optional(v.string()),
        }),
      })
    ),
    mirrorStatement: v.string(), // The key insight
    contractFocus: v.object({
      suggestedRefusal: v.string(),
      suggestedBecoming: v.string(),
      rationale: v.string(),
    }),
    createdAt: v.number(),
  }).index('by_session', ['sessionId']),
})
