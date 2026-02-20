/**
 * SignalList (S2-T03 helper)
 *
 * Displays a list of signals with domain grouping.
 */
import type { Signal, SignalDomain } from '@/lib/ai/tools/types'
import { SIGNAL_VISUALS, humanizeSignalType, getStateLabel } from '@/lib/signals/visual-map'

interface SignalListProps {
  signals: Signal[]
}

export function SignalList({ signals }: SignalListProps) {
  if (signals.length === 0) {
    return (
      <p className="text-sm text-[var(--twilight-500)] italic text-center py-8">
        No signals detected yet. Keep exploring.
      </p>
    )
  }

  // Group by domain
  const byDomain = new Map<SignalDomain, Signal[]>()
  for (const signal of signals) {
    const group = byDomain.get(signal.domain) || []
    group.push(signal)
    byDomain.set(signal.domain, group)
  }

  return (
    <div className="space-y-4">
      {Array.from(byDomain.entries()).map(([domain, domainSignals]) => {
        const visual = SIGNAL_VISUALS[domain]

        return (
          <div key={domain}>
            {/* Domain header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{visual.emoji}</span>
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: `var(--${visual.color}-400)` }}
              >
                {visual.label}
              </span>
              <span className="text-xs text-[var(--twilight-600)]">
                ({domainSignals.length})
              </span>
            </div>

            {/* Signal items */}
            <div className="space-y-2 pl-7">
              {domainSignals.map((signal, i) => {
                const stateLabel = getStateLabel(signal.state)

                return (
                  <div
                    key={`${signal.type}-${i}`}
                    className="p-2 rounded-lg bg-[var(--twilight-800)]/50 border border-[var(--glass-border)]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="font-medium text-sm"
                        style={{ color: `var(--${visual.color}-300)` }}
                      >
                        {humanizeSignalType(signal.type)}
                      </span>
                      {stateLabel && (
                        <span className="text-xs text-[var(--twilight-500)]">
                          ({stateLabel})
                        </span>
                      )}
                      <span className="ml-auto text-xs text-[var(--twilight-600)]">
                        {Math.round(signal.confidence * 100)}%
                      </span>
                    </div>
                    {signal.source && (
                      <p className="text-xs text-[var(--twilight-400)] mt-1 italic line-clamp-2">
                        "{signal.source}"
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
