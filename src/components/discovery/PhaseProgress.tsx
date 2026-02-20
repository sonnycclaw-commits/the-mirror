

const PHASES = [
  { id: 'SCENARIO', label: 'Scenario' },
  { id: 'EXCAVATION', label: 'Excavation' },
  { id: 'SYNTHESIS', label: 'Synthesis' },
  { id: 'CONTRACT', label: 'Contract' },
] as const

export type Phase = (typeof PHASES)[number]['id']

export interface PhaseProgressProps {
  currentPhase: Phase
}

export function PhaseProgress({ currentPhase }: PhaseProgressProps) {
  const currentIndex = PHASES.findIndex((p) => p.id === currentPhase)
  const progressPercent = ((currentIndex + 1) / PHASES.length) * 100

  return (
    <nav
      aria-label="Discovery Progress"
      data-testid="phase-progress"
      className="w-full px-4 py-3"
    >
      {/* Simple progress line */}
      <div className="max-w-md mx-auto">
        {/* Track */}
        <div className="relative h-1 bg-[var(--twilight-700)] rounded-full overflow-hidden">
          {/* Fill */}
          <div
            className="absolute inset-y-0 left-0 bg-[var(--coral-500)] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Current phase label (subtle) */}
        <p className="text-center text-xs text-[var(--twilight-500)] mt-2">
          {PHASES[currentIndex]?.label}
        </p>
      </div>

      {/* Screen reader */}
      <span className="sr-only">
        Step {currentIndex + 1} of {PHASES.length}: {PHASES[currentIndex]?.label}
      </span>
    </nav>
  )
}

