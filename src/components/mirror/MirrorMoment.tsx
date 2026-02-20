/**
 * MirrorMoment (S4-T01)
 *
 * The climactic reveal: a full-screen, theatrical 4-beat sequence
 * that shows the user their core pattern.
 *
 * Beat 1: Darkness (constellation fades, screen goes dark)
 * Beat 2: The Pattern (words emerge one by one)
 * Beat 3: The Statement (the mirror speaks)
 * Beat 4: Transition (fade to contract)
 */
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { ConstellationCanvas } from '../signals/ConstellationCanvas'
import { buildConstellation } from '@/lib/signals/constellation'
import { useSignalStore } from '@/lib/stores/signals'
import { hapticMirrorMoment } from '@/lib/haptics'
import { springTransition } from '@/lib/springs'

export interface MirrorMomentProps {
  /** The synthesized mirror statement */
  mirrorStatement: string
  /** Primary pattern name */
  patternName?: string
  /** Called when the moment completes */
  onComplete: () => void
  isVisible: boolean
}

type Beat = 'DARKNESS' | 'PATTERN' | 'STATEMENT' | 'TRANSITION'

const BEAT_TIMINGS = {
  DARKNESS: 1500,
  PATTERN: 3000,
  STATEMENT: 4000,
  TRANSITION: 1500,
}

export function MirrorMoment({
  mirrorStatement,
  patternName = 'Your Pattern',
  onComplete,
  isVisible,
}: MirrorMomentProps) {
  const [currentBeat, setCurrentBeat] = useState<Beat>('DARKNESS')
  const [showConstellation, setShowConstellation] = useState(true)
  const signals = useSignalStore(state => state.signals)
  const constellation = buildConstellation(signals, 280, 280)

  // Progress through beats
  useEffect(() => {
    if (!isVisible) {
      setCurrentBeat('DARKNESS')
      setShowConstellation(true)
      return
    }

    hapticMirrorMoment()

    const timers: ReturnType<typeof setTimeout>[] = []

    // Beat 1: Darkness - fade constellation
    timers.push(setTimeout(() => {
      setShowConstellation(false)
    }, 500))

    // Beat 2: Pattern
    timers.push(setTimeout(() => {
      setCurrentBeat('PATTERN')
    }, BEAT_TIMINGS.DARKNESS))

    // Beat 3: Statement
    timers.push(setTimeout(() => {
      setCurrentBeat('STATEMENT')
    }, BEAT_TIMINGS.DARKNESS + BEAT_TIMINGS.PATTERN))

    // Beat 4: Transition
    timers.push(setTimeout(() => {
      setCurrentBeat('TRANSITION')
    }, BEAT_TIMINGS.DARKNESS + BEAT_TIMINGS.PATTERN + BEAT_TIMINGS.STATEMENT))

    // Complete
    timers.push(setTimeout(() => {
      onComplete()
    }, BEAT_TIMINGS.DARKNESS + BEAT_TIMINGS.PATTERN + BEAT_TIMINGS.STATEMENT + BEAT_TIMINGS.TRANSITION))

    return () => timers.forEach(clearTimeout)
  }, [isVisible, onComplete])

  // Split statement into words for dramatic reveal
  const statementWords = mirrorStatement.split(' ')

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Constellation (fades during darkness beat) */}
          <motion.div
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{
              opacity: showConstellation ? 0.3 : 0,
              scale: showConstellation ? 1 : 0.8,
            }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <ConstellationCanvas
              constellation={constellation}
              animated={false}
            />
          </motion.div>

          {/* Content based on current beat */}
          <div className="relative z-10 flex flex-col items-center justify-center px-8 max-w-lg text-center">

            {/* Beat 1: Darkness - subtle breathing text */}
            {currentBeat === 'DARKNESS' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[var(--twilight-600)] text-lg"
              >
                Looking into the mirror...
              </motion.p>
            )}

            {/* Beat 2: Pattern - name reveals dramatically */}
            {currentBeat === 'PATTERN' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[var(--twilight-500)] text-sm uppercase tracking-[0.3em]"
                >
                  I see
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, ...springTransition('reveal') }}
                  className="text-3xl md:text-4xl font-serif text-white"
                  style={{
                    textShadow: '0 0 40px rgba(224, 122, 95, 0.5)',
                  }}
                >
                  {patternName}
                </motion.h1>
              </motion.div>
            )}

            {/* Beat 3: Statement - words appear one by one */}
            {currentBeat === 'STATEMENT' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 2 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl mb-4"
                >
                  🪞
                </motion.div>

                <p className="text-xl md:text-2xl text-white leading-relaxed">
                  {statementWords.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12 }}
                      className="inline-block mr-2"
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: statementWords.length * 0.12 + 0.5 }}
                  className="text-sm text-[var(--twilight-500)] mt-4"
                >
                  — The Mirror
                </motion.p>
              </motion.div>
            )}

            {/* Beat 4: Transition - everything fades up */}
            {currentBeat === 'TRANSITION' && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0, y: -20 }}
                transition={{ duration: 1.5 }}
                className="flex flex-col items-center"
              >
                <p className="text-lg text-[var(--coral-400)]">
                  Now, let's make it real.
                </p>
              </motion.div>
            )}
          </div>

          {/* Radial gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 30%, black 70%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
