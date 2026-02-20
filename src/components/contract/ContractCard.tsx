/**
 * ContractCard - S5-T03
 *
 * Individual contract field card with glass morphism styling.
 * Designed for mobile-first display with spring animations.
 */
import { motion } from 'motion/react'

export interface ContractCardProps {
  label: string
  prefix: string
  content: string
  icon: string
  color: 'ruby' | 'emerald' | 'amber' | 'sapphire' | 'violet' | 'slate'
  delay?: number
}

const colorClasses = {
  ruby: {
    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]',
    border: 'border-red-500/30',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  emerald: {
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  amber: {
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  sapphire: {
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  violet: {
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  slate: {
    glow: 'shadow-[0_0_30px_rgba(148,163,184,0.2)]',
    border: 'border-slate-500/30',
    text: 'text-slate-400',
    bg: 'bg-slate-500/10',
  },
}

export function ContractCard({
  label,
  prefix,
  content,
  icon,
  color,
  delay = 0,
}: ContractCardProps) {
  const colors = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 25,
        delay,
      }}
      className={`
        relative overflow-hidden rounded-2xl p-6
        backdrop-blur-xl bg-black/40
        border ${colors.border}
        ${colors.glow}
      `}
    >
      {/* Icon and label */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-sm font-medium uppercase tracking-wider ${colors.text}`}>
          {label}
        </span>
      </div>

      {/* Prefix + Content */}
      <div className="space-y-1">
        <span className={`text-lg font-semibold ${colors.text}`}>{prefix}</span>
        <p className="text-xl font-medium text-white leading-relaxed">{content}</p>
      </div>

      {/* Decorative gradient */}
      <div
        className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full ${colors.bg} blur-3xl`}
      />
    </motion.div>
  )
}
