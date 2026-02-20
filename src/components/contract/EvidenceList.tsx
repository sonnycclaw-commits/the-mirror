/**
 * EvidenceList - S5-T03
 *
 * Displays the evidence quotes that ground the contract.
 * Shows the user's own words that led to this contract.
 */
import { motion } from 'motion/react'

export interface EvidenceItem {
  quote: string
  scenarioName?: string
  signalType?: string
}

export interface EvidenceListProps {
  evidence: EvidenceItem[]
  delay?: number
}

const signalTypeLabels: Record<string, { label: string; emoji: string }> = {
  VALUE: { label: 'Value', emoji: '💎' },
  FEAR: { label: 'Fear', emoji: '😰' },
  CONSTRAINT: { label: 'Constraint', emoji: '🔗' },
  PATTERN: { label: 'Pattern', emoji: '🔄' },
  GOAL: { label: 'Goal', emoji: '🎯' },
  DEFENSE_MECHANISM: { label: 'Defense', emoji: '🛡️' },
  CONTRADICTION: { label: 'Contradiction', emoji: '⚡' },
  NEED: { label: 'Need', emoji: '💫' },
}

export function EvidenceList({ evidence, delay = 0 }: EvidenceListProps) {
  if (!evidence || evidence.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="mt-8 space-y-4"
    >
      <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400">
        Grounded in your words
      </h3>

      <div className="space-y-3">
        {evidence.map((item, index) => {
          const signalInfo = item.signalType
            ? signalTypeLabels[item.signalType]
            : null

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                delay: delay + index * 0.1,
              }}
              className="
                relative pl-4 py-2
                border-l-2 border-slate-700
                hover:border-slate-500 transition-colors
              "
            >
              {/* Quote */}
              <p className="text-slate-300 italic">"{item.quote}"</p>

              {/* Metadata */}
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                {item.scenarioName && (
                  <span className="flex items-center gap-1">
                    <span>📍</span>
                    <span>{item.scenarioName}</span>
                  </span>
                )}
                {signalInfo && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800">
                    <span>{signalInfo.emoji}</span>
                    <span>{signalInfo.label}</span>
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
