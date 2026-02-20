/**
 * JSON-Render Component Registry
 *
 * Simple component renderer for structured AI UI output.
 * Styling matches existing patterns: slate-900 bg, amber accents, motion animations.
 */
'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import {
  type TextMessageProps,
  type InsightCardProps,
  type MirrorStatementProps,
  type ProfileSectionProps,
  type ContradictionCardProps,
  type ContractStatementProps,
  type ActionButtonProps,
  type DividerProps,
  type UITree,
  type LeafComponent,
} from './catalog'

// =============================================================================
// Content Components
// =============================================================================

function TextMessage({ text, emphasis = 'normal' }: Omit<TextMessageProps, 'type'>) {
  const emphasisStyles = {
    normal: 'text-slate-200',
    strong: 'text-amber-100 font-medium',
    subtle: 'text-slate-400 text-sm',
    warning: 'text-amber-400',
  }

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('text-pretty', emphasisStyles[emphasis])}
    >
      {text}
    </motion.p>
  )
}

function InsightCard({ title, insight, evidence, domain, confidence }: Omit<InsightCardProps, 'type'>) {
  const domainColors: Record<string, string> = {
    VALUE: 'border-amber-500/30 bg-amber-500/5',
    NEED: 'border-blue-500/30 bg-blue-500/5',
    MOTIVE: 'border-purple-500/30 bg-purple-500/5',
    DEFENSE: 'border-red-500/30 bg-red-500/5',
    ATTACHMENT: 'border-pink-500/30 bg-pink-500/5',
    DEVELOPMENT: 'border-green-500/30 bg-green-500/5',
    PATTERN: 'border-slate-500/30 bg-slate-500/5',
  }

  const confidenceBadge = confidence && (
    <span
      className={cn(
        'text-xs px-2 py-0.5 rounded-full',
        confidence === 'high' && 'bg-green-500/20 text-green-300',
        confidence === 'medium' && 'bg-amber-500/20 text-amber-300',
        confidence === 'low' && 'bg-slate-500/20 text-slate-400'
      )}
    >
      {confidence}
    </span>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg border p-4 space-y-2',
        domain ? domainColors[domain] : 'border-slate-700 bg-slate-800/50'
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-amber-200">{title}</h3>
        {confidenceBadge}
      </div>
      <p className="text-slate-200">{insight}</p>
      {evidence && (
        <blockquote className="text-sm text-slate-400 italic border-l-2 border-slate-600 pl-3">
          "{evidence}"
        </blockquote>
      )}
      {domain && (
        <span className="inline-block text-xs text-slate-500 uppercase tracking-wide">
          {domain}
        </span>
      )}
    </motion.div>
  )
}

function MirrorStatement({ statement, evidence }: Omit<MirrorStatementProps, 'type'>) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-6"
    >
      <div className="absolute -top-3 left-4 px-2 bg-slate-900 text-amber-400 text-xs font-medium uppercase tracking-wider">
        Mirror Moment
      </div>
      <p className="text-lg text-slate-100 leading-relaxed">{statement}</p>
      {evidence && evidence.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Evidence</p>
          {evidence.map((quote, i) => (
            <blockquote
              key={i}
              className="text-sm text-slate-400 italic border-l-2 border-amber-500/30 pl-3"
            >
              "{quote}"
            </blockquote>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// =============================================================================
// Profile Components
// =============================================================================

function ProfileSection({ sectionType, title, items }: Omit<ProfileSectionProps, 'type'>) {
  const sectionIcons: Record<string, string> = {
    values: '💎',
    fears: '😰',
    needs: '🎯',
    patterns: '🔄',
    defenses: '🛡️',
    motives: '🚀',
  }

  const strengthColors: Record<string, string> = {
    high: 'bg-amber-500/20 text-amber-200',
    medium: 'bg-slate-600/50 text-slate-300',
    low: 'bg-slate-700/50 text-slate-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-slate-700 bg-slate-800/30 p-4"
    >
      <h3 className="flex items-center gap-2 text-sm font-medium text-slate-200 mb-3">
        <span>{sectionIcons[sectionType] || '📋'}</span>
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              'flex items-start justify-between gap-2 rounded-md px-3 py-2',
              item.strength ? strengthColors[item.strength] : 'bg-slate-700/30'
            )}
          >
            <div>
              <p className="font-medium">{item.label}</p>
              {item.description && (
                <p className="text-sm text-slate-400 mt-0.5">{item.description}</p>
              )}
            </div>
            {item.strength && (
              <span className="text-xs uppercase tracking-wide opacity-60">{item.strength}</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function ContradictionCard({ stated, actual, insight }: Omit<ContradictionCardProps, 'type'>) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 space-y-3"
    >
      <div className="text-xs text-red-400 uppercase tracking-wide font-medium">
        Contradiction Detected
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">What you said</p>
          <p className="text-slate-300">"{stated}"</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">What patterns show</p>
          <p className="text-slate-300">"{actual}"</p>
        </div>
      </div>
      {insight && (
        <p className="text-sm text-slate-400 border-t border-red-500/10 pt-3">{insight}</p>
      )}
    </motion.div>
  )
}

// =============================================================================
// Contract Components
// =============================================================================

function ContractStatement({ field, label, content }: Omit<ContractStatementProps, 'type'>) {
  const fieldColors: Record<string, string> = {
    refusal: 'border-red-500/30',
    becoming: 'border-green-500/30',
    proof: 'border-blue-500/30',
    test: 'border-purple-500/30',
    vote: 'border-amber-500/30',
    rule: 'border-slate-500/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('rounded-lg border-l-4 bg-slate-800/50 p-4', fieldColors[field])}
    >
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-slate-200">{content}</p>
    </motion.div>
  )
}

// =============================================================================
// Interactive Components
// =============================================================================

function ActionButton({ label, action, variant = 'primary', disabled }: Omit<ActionButtonProps, 'type'>) {
  const variantStyles = {
    primary: 'bg-amber-500 text-slate-900 hover:bg-amber-400',
    secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600',
    ghost: 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      data-action={action}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variantStyles[variant],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {label}
    </motion.button>
  )
}

// =============================================================================
// Layout Components
// =============================================================================

function Divider({ spacing = 'medium' }: Omit<DividerProps, 'type'>) {
  const spacingStyles = {
    small: 'my-2',
    medium: 'my-4',
    large: 'my-6',
  }

  return <hr className={cn('border-slate-700/50', spacingStyles[spacing])} />
}

// =============================================================================
// Component Registry & Renderer
// =============================================================================

/**
 * Component registry mapping types to React components
 */
const componentRegistry: Record<string, React.ComponentType<Record<string, unknown>>> = {
  TextMessage: TextMessage as React.ComponentType<Record<string, unknown>>,
  InsightCard: InsightCard as React.ComponentType<Record<string, unknown>>,
  MirrorStatement: MirrorStatement as React.ComponentType<Record<string, unknown>>,
  ProfileSection: ProfileSection as React.ComponentType<Record<string, unknown>>,
  ContradictionCard: ContradictionCard as React.ComponentType<Record<string, unknown>>,
  ContractStatement: ContractStatement as React.ComponentType<Record<string, unknown>>,
  ActionButton: ActionButton as React.ComponentType<Record<string, unknown>>,
  Divider: Divider as React.ComponentType<Record<string, unknown>>,
}

/**
 * Render a single component by type
 */
function renderComponent(component: LeafComponent, index: number) {
  const Component = componentRegistry[component.type]
  if (!Component) {
    console.warn(`Unknown component type: ${component.type}`)
    return null
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...props } = component
  return <Component key={index} {...props} />
}

/**
 * Props for the UITreeRenderer
 */
export interface UITreeRendererProps {
  tree: UITree
  onAction?: (action: string) => void
  className?: string
}

/**
 * Main renderer for UI trees
 * Renders an array of components with action handling
 */
export function UITreeRenderer({ tree, onAction, className }: UITreeRendererProps) {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const actionButton = target.closest('[data-action]')
    if (actionButton && onAction) {
      const action = actionButton.getAttribute('data-action')
      if (action) {
        onAction(action)
      }
    }
  }

  return (
    <div className={cn('space-y-4', className)} onClick={handleClick}>
      {tree.map((component, i) => renderComponent(component, i))}
    </div>
  )
}

/**
 * Re-export types for convenience
 */
export type { UITree }
