import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { springTransition } from '@/lib/springs'

interface RevealOverlayProps {
  isOpen: boolean
  title: string
  children: React.ReactNode
  onClose?: () => void
}

/**
 * The Insight Reveal Overlay
 *
 * Implements the 4-phase animation sequence from visual_design_architecture.md:
 * 1. Preparation (Dimming)
 * 2. Container Entry (Scale/Fade)
 * 3. Content Reveal (Slide Up)
 * 4. Glow Pulse
 */
export function RevealOverlay({ isOpen, title, children, onClose }: RevealOverlayProps) {
  // Phase tracking
  const [phase, setPhase] = useState<'idle' | 'preparing' | 'entering' | 'revealing' | 'pulsing'>('idle')

  useEffect(() => {
    if (isOpen) {
      setPhase('preparing')
      // Sequence triggers
      const t1 = setTimeout(() => setPhase('entering'), 300)
      const t2 = setTimeout(() => setPhase('revealing'), 600)
      const t3 = setTimeout(() => setPhase('pulsing'), 1000)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    } else {
      setPhase('idle')
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Phase 1: Backdrop Dimming */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0D1117]/90 backdrop-blur-sm"
          />

          {/* Card Container */}
          <div className="relative z-10 w-full max-w-lg">
             {/* Phase 2: Container Entry */}
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{
                 opacity: phase === 'preparing' ? 0 : 1,
                 scale: phase === 'preparing' ? 0.95 : 1
               }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={springTransition('reveal')}
               className={`
                 relative overflow-hidden rounded-2xl
                 bg-[#161B22] border border-white/10
                 p-8 text-center
                 shadow-2xl
                 ${phase === 'pulsing' ? 'shadow-[0_0_40px_-10px_rgba(224,122,95,0.3)] border-[rgba(224,122,95,0.3)]' : ''}
                 transition-shadow duration-1000
               `}
             >
               {/* Spark/Icon */}
               <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: phase === 'preparing' ? 0 : 1,
                    scale: phase === 'preparing' ? 0 : 1
                  }}
                  transition={{ delay: 0.3, ...springTransition('elastic') }}
                  className="mx-auto mb-6 w-12 h-12 flex items-center justify-center rounded-full bg-[var(--coral-soft)] text-[var(--coral-500)]"
               >
                 <span className="text-2xl">✦</span>
               </motion.div>

               {/* Phase 3: Content Reveal */}
               <div className="space-y-6">
                 <motion.h2
                   initial={{ opacity: 0, y: 15 }}
                   animate={{
                     opacity: ['revealing', 'pulsing'].includes(phase) ? 1 : 0,
                     y: ['revealing', 'pulsing'].includes(phase) ? 0 : 15
                   }}
                   transition={{ duration: 0.5, ease: 'easeOut' }}
                   className="font-display text-3xl font-bold text-[var(--twilight-50)]"
                 >
                   {title}
                 </motion.h2>

                 <motion.div
                   initial={{ opacity: 0, y: 15 }}
                   animate={{
                     opacity: ['revealing', 'pulsing'].includes(phase) ? 1 : 0,
                     y: ['revealing', 'pulsing'].includes(phase) ? 0 : 15
                   }}
                   transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                   className="text-lg text-[var(--twilight-300)] leading-relaxed"
                 >
                   {children}
                 </motion.div>

                 <motion.button
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: ['revealing', 'pulsing'].includes(phase) ? 1 : 0,
                    }}
                    transition={{ delay: 0.5 }}
                    onClick={onClose}
                    className="mt-8 px-8 py-3 bg-[var(--twilight-700)] hover:bg-[var(--twilight-600)] text-[var(--twilight-50)] rounded-full font-medium transition-colors"
                 >
                   Deepen
                 </motion.button>
               </div>
             </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
