import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import { useSimulation } from '@/lib/stores/simulation'
import { MagicInput } from '@/components/landing/MagicInput'
import { OnboardingModal } from '@/components/landing/OnboardingModal'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

type SingularityState = 'IDLE' | 'HOLDING' | 'EXPLOSION' | 'CLARITY'

export default function LandingPage() {
  const [state, setState] = useState<SingularityState>('IDLE')
  const holdTimer = useRef<ReturnType<typeof setTimeout>>(null)

  // Simulation store setters
  const { setChaos, setSuction, reset } = useSimulation()

  const startHold = () => {
    if (state !== 'IDLE') return
    setState('HOLDING')

    // Ramp up physics
    setChaos(2.0)
    setSuction(1.0)

    // Start countdown to Singularity (3 seconds)
    holdTimer.current = setTimeout(() => {
      triggerSingularity()
    }, 3000)
  }

  const cancelHold = () => {
    if (state !== 'HOLDING') return

    // Cancel timer
    if (holdTimer.current) clearTimeout(holdTimer.current)

    setState('IDLE')
    reset() // Reset physics
  }

  const triggerSingularity = () => {
    setState('EXPLOSION')

    // Explosion Effect:
    // 1. Maximize suction for split second
    setSuction(5.0)
    setChaos(5.0)

    setTimeout(() => {
      // 2. CLEAR EVERYTHING (Silence)
      reset()
      setState('CLARITY')
    }, 500) // Short flash of intensity
  }

  // Keyboard accessibility - Space or Enter triggers hold
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      startHold()
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      cancelHold()
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current)
      reset()
    }
  }, [])

  return (
    <div
      className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden p-6 selection:bg-[var(--coral-soft)] selection:text-[var(--coral-500)] select-none safe-area-inset-all"
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
      role="button"
      aria-label="Hold Space or Enter for 3 seconds to begin"
    >

      {/*
        LAYER 1: The Void (Global in __root)
        The physics are controlled by useSimulation hook which FluidFog reads.
      */}



      {/* LAYER 3: The Prompt (Hold Instruction) */}
      <AnimatePresence>
        {state === 'IDLE' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="relative z-20 flex flex-col items-center gap-8 max-w-md text-center px-6"
          >
            {/* Brand */}
            <motion.h1
              className="font-display text-4xl md:text-5xl text-[var(--twilight-50)] tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              The Mirror
            </motion.h1>

            {/* Value Proposition */}
            <motion.p
              className="text-[var(--twilight-300)] text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              A 10-minute conversation that shows you the pattern you keep repeating.
            </motion.p>

            {/* Hold Target with Progress Ring */}
            <motion.div
              className="flex flex-col items-center gap-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
               {/* Pulsing Circle Hint */}
               <div className="w-20 h-20 rounded-full border-2 border-[var(--twilight-600)] flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-[var(--coral-500)]" />
               </div>
               <p className="font-sans text-[var(--twilight-400)] text-sm tracking-widest uppercase">
                 Hold anywhere · 3 seconds
               </p>
            </motion.div>

            {/* What's Next Preview */}
            <motion.p
              className="text-[var(--twilight-500)] text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              You'll answer some questions, then get a personal contract to keep.
            </motion.p>

            {/* Skip Option */}
            <motion.button
              className="text-[var(--twilight-500)] text-sm hover:text-[var(--coral-400)] transition-colors pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation()
                setState('CLARITY')
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Already know what to say? →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LAYER 4: Holding Feedback - Progress Ring */}
      <AnimatePresence>
        {state === 'HOLDING' && (
          <>
            {/* Vignette overlay */}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 z-30 pointer-events-none bg-radial-gradient from-transparent to-black opacity-60 mix-blend-multiply"
            />

            {/* Progress ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute z-40 pointer-events-none"
            >
              <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                {/* Background ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--twilight-700)"
                  strokeWidth="4"
                />
                {/* Progress ring - animates over 3 seconds to match hold duration */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--coral-500)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="314.159"
                  strokeDashoffset="314.159"
                  className="animate-[fillRing_3s_linear_forwards]"
                />
              </svg>
              {/* Center focal point */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-4 h-4 rounded-full bg-[var(--coral-500)]"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* LAYER 5: The Singularity (Flash) */}
      <AnimatePresence>
        {state === 'EXPLOSION' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[var(--coral-glow)] mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      {/* LAYER 6: Clarity (Magic Input) */}
      {state === 'CLARITY' && (
        <div className="relative z-40 w-full flex justify-center" onPointerDown={(e) => e.stopPropagation()}>
           <MagicInput onBack={() => setState('IDLE')} />
        </div>
      )}

      {/* First-time user onboarding */}
      <OnboardingModal onComplete={() => {}} />
    </div>
  )
}
