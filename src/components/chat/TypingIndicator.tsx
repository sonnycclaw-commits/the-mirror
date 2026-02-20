import { motion } from 'motion/react'

export function TypingIndicator() {
  return (
    <div
      data-testid="loading-indicator"
      className="flex items-center gap-1 px-4 py-2"
      role="status"
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="size-2 bg-slate-500 rounded-full motion-reduce:animate-none"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
