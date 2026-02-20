import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from '@tanstack/react-router'

// Suggestion chips to help users who have writer's block
const SUGGESTIONS = [
  'A conversation I keep avoiding',
  'That project I keep putting off',
  'Why I feel stuck lately',
]

export function MagicInput({ onBack }: { onBack?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Auto-focus after physics settle
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!value.trim()) return

    setIsSubmitting(true)

    // Swallow animation time
    setTimeout(() => {
      navigate({
        to: '/discovery',
        search: { initialMessage: value }
      })
    }, 800)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion)
    // Auto-submit after a moment for immediate feedback
    setTimeout(() => {
      setIsSubmitting(true)
      setTimeout(() => {
        navigate({
          to: '/discovery',
          search: { initialMessage: suggestion }
        })
      }, 800)
    }, 300)
  }

  return (
    <AnimatePresence>
      {!isSubmitting && (
        <motion.div
           initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
           animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
           exit={{
             opacity: 0,
             scale: 0,
             filter: 'blur(20px)',
             transition: { duration: 0.6, ease: "backIn" }
           }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="relative z-50 w-full max-w-2xl px-4"
        >
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
            {/* Softer question */}
            <h2 className="font-display text-3xl md:text-4xl text-[var(--twilight-50)] text-center tracking-tight leading-tight">
              What's been weighing on you?
            </h2>

            <div className="relative w-full group">
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                maxLength={500}
                className="w-full bg-transparent border-b-2 border-[var(--twilight-700)] text-center text-xl md:text-2xl font-sans text-[var(--coral-400)] py-4 focus:outline-none focus:border-[var(--coral-500)] transition-colors caret-[var(--coral-500)] placeholder:text-[var(--twilight-600)] placeholder:not-italic"
                placeholder="Type here, or tap an example below..."
                autoComplete="off"
              />

              {/* Glow effect on focus */}
              <div className="absolute inset-0 bg-[var(--coral-500)] blur-[40px] opacity-0 transition-opacity duration-500 pointer-events-none group-focus-within:opacity-15" />
            </div>

            {/* Suggestion Chips */}
            <motion.div
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 text-sm text-[var(--twilight-300)] bg-[var(--twilight-800)]/60 border border-[var(--glass-border)] rounded-full hover:bg-[var(--twilight-700)] hover:text-[var(--twilight-100)] hover:border-[var(--twilight-600)] transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>

            {/* Submit hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: value ? 1 : 0.5 }}
              className="text-[var(--twilight-500)] text-sm"
            >
              {value ? 'Press Enter to explore →' : 'Or type your own...'}
            </motion.p>

            {/* Back button */}
            {onBack && (
              <motion.button
                type="button"
                onClick={onBack}
                className="text-[var(--twilight-600)] text-sm hover:text-[var(--twilight-400)] transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                ← Not ready yet
              </motion.button>
            )}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
