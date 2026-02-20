import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { springTransition, staggerChildren } from '@/lib/springs'

export interface QuestionOption {
  id: string
  label: string
  description?: string
}

export interface QuestionCardProps {
  question: string
  options: QuestionOption[]
  onSelect: (optionId: string) => void
  disabled?: boolean
  multiSelect?: boolean
}

export function QuestionCard({
  question,
  options,
  onSelect,
  disabled = false,
  multiSelect = false,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false) // Prevent double-click

  const handleSelect = useCallback(
    (optionId: string) => {
      if (disabled || submitted) return // Block if already submitted

      if (multiSelect) {
        setSelected((prev) =>
          prev.includes(optionId)
            ? prev.filter((id) => id !== optionId)
            : [...prev, optionId]
        )
      } else {
        setSelected([optionId])
        setSubmitted(true) // Lock immediately on single-select
        // Small delay for visual feedback before proceeding
        setTimeout(() => onSelect(optionId), 150)
      }
    },
    [disabled, multiSelect, onSelect, submitted]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, optionId: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleSelect(optionId)
      }
    },
    [handleSelect]
  )

  return (
    <motion.div
      data-testid="question-card"
      variants={staggerChildren(0.05)}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg mx-auto space-y-6"
    >
      {/* Question - "The Truth" Typography */}
      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
        <h2
          data-testid="question-text"
          className="text-2xl md:text-3xl font-display font-medium text-[var(--twilight-50)] text-center leading-tight tracking-tight"
        >
          {question}
        </h2>
      </motion.div>

      {/* Options */}
      <div
        role="group"
        aria-label="Answer options"
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {options.map((option) => {
            const isSelected = selected.includes(option.id)

            return (
              <motion.button
                key={option.id}
                layout
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: springTransition('snappy')
                  }
                }}
                onClick={() => handleSelect(option.id)}
                onKeyDown={(e) => handleKeyDown(e, option.id)}
                disabled={disabled}
                whileHover={disabled ? {} : { scale: 1.02, x: 5 }}
                whileTap={disabled ? {} : { scale: 0.98 }}
                className={cn(
                  // Base structural styles
                  'w-full relative overflow-hidden p-5 rounded-2xl text-left group',
                  'transition-all duration-200',

                  // Glassmorphism background
                  isSelected
                    ? 'bg-[var(--coral-500)] text-[var(--twilight-900)] shadow-[0_0_30px_-5px_var(--coral-glow)] ring-2 ring-[var(--coral-400)]'
                    : 'bg-[var(--twilight-800)]/60 hover:bg-[var(--twilight-800)] border border-[var(--glass-border)] hover:border-[var(--twilight-600)] text-[var(--twilight-200)] hover:text-[var(--twilight-50)]',

                  // Disabled state
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {/* Content */}
                <div className="relative z-10">
                  <span className={cn(
                    "block text-lg font-medium tracking-wide transition-colors",
                    isSelected ? "font-bold" : ""
                  )}>
                    {option.label}
                  </span>
                  {option.description && (
                    <span className={cn(
                      "block mt-1 text-sm font-light",
                      isSelected ? "text-[var(--twilight-900)]/80" : "text-[var(--twilight-400)] group-hover:text-[var(--twilight-300)]"
                    )}>
                      {option.description}
                    </span>
                  )}
                </div>

                {/* Subtle sheen effect on hover (unselected) */}
                {!isSelected && !disabled && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Multi-select confirm button */}
      {multiSelect && selected.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          type="button"
          onClick={() => onSelect(selected.join(','))}
          disabled={disabled}
          className="w-full py-4 bg-[var(--coral-500)] text-[var(--twilight-900)] font-semibold text-lg rounded-2xl hover:bg-[var(--coral-400)] hover:scale-[1.02] active:scale-0.98 transition-all duration-200 shadow-[0_4px_20px_-5px_rgba(224,122,95,0.4)]"
        >
          Continue
        </motion.button>
      )}

      {/* Screen reader feedback */}
      <div className="sr-only" aria-live="polite">
        {selected.length > 0
          ? `${selected.length} option${selected.length > 1 ? 's' : ''} selected`
          : 'No option selected'}
      </div>
    </motion.div>
  )
}
