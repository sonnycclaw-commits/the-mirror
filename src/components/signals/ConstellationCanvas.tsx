/**
 * ConstellationCanvas (S2-T02)
 *
 * SVG rendering of the signal constellation.
 * Nodes appear as glowing stars, connections as subtle lines.
 */
import { motion } from 'motion/react'
import type { Constellation, ConstellationNode } from '@/lib/signals/constellation'
import type { SignalDomain } from '@/lib/ai/tools/types'
import { SIGNAL_VISUALS, humanizeSignalType } from '@/lib/signals/visual-map'
import { springTransition } from '@/lib/springs'

export interface ConstellationCanvasProps {
  constellation: Constellation
  highlightDomain?: SignalDomain
  onNodeClick?: (node: ConstellationNode) => void
  animated?: boolean
  className?: string
}

// Node sizes in pixels
const NODE_SIZES = {
  small: 6,
  medium: 10,
  large: 14,
}

export function ConstellationCanvas({
  constellation,
  highlightDomain,
  onNodeClick,
  animated = true,
  className = '',
}: ConstellationCanvasProps) {
  const { nodes, center, bounds } = constellation

  // Empty state
  if (nodes.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: bounds.width, height: bounds.height }}>
        <p className="text-sm text-[var(--twilight-500)] italic">
          Keep talking, I'm listening...
        </p>
      </div>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${bounds.width} ${bounds.height}`}
      className={`${className}`}
      style={{ width: bounds.width, height: bounds.height }}
    >
      {/* Definitions for glow effects */}
      <defs>
        {Object.entries(SIGNAL_VISUALS).map(([domain, visual]) => (
          <filter key={domain} id={`glow-${domain}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>

      {/* Connection lines */}
      <g className="connections">
        {nodes.flatMap(node =>
          node.connections
            .filter(connId => {
              // Only render each connection once (from lower to higher index)
              const otherIndex = nodes.findIndex(n => n.id === connId)
              const thisIndex = nodes.findIndex(n => n.id === node.id)
              return otherIndex > thisIndex
            })
            .map(connId => {
              const other = nodes.find(n => n.id === connId)
              if (!other) return null

              const isHighlighted =
                highlightDomain === node.signal.domain ||
                highlightDomain === other.signal.domain

              return (
                <motion.line
                  key={`${node.id}-${connId}`}
                  x1={node.position.x}
                  y1={node.position.y}
                  x2={other.position.x}
                  y2={other.position.y}
                  stroke={isHighlighted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isHighlighted ? 1.5 : 1}
                  initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              )
            })
        )}
      </g>

      {/* Star nodes */}
      <g className="nodes">
        {nodes.map((node, index) => {
          const visual = SIGNAL_VISUALS[node.signal.domain]
          const size = NODE_SIZES[node.size]
          const isHighlighted = highlightDomain === node.signal.domain
          const opacity = isHighlighted ? 1 : highlightDomain ? 0.4 : node.brightness

          return (
            <motion.g
              key={node.id}
              initial={animated ? { scale: 0, opacity: 0 } : undefined}
              animate={{ scale: 1, opacity: 1 }}
              transition={springTransition('reveal')}
              style={{ originX: node.position.x, originY: node.position.y }}
            >
              {/* Glow circle */}
              <circle
                cx={node.position.x}
                cy={node.position.y}
                r={size * 1.5}
                fill={visual.glowColor}
                opacity={opacity * 0.5}
                filter={`url(#glow-${node.signal.domain})`}
              />

              {/* Core star */}
              <circle
                cx={node.position.x}
                cy={node.position.y}
                r={size}
                fill={visual.glowColor.replace('0.4', '0.9')}
                stroke="white"
                strokeWidth={isHighlighted ? 2 : 1}
                opacity={opacity}
                style={{ cursor: onNodeClick ? 'pointer' : 'default' }}
                onClick={() => onNodeClick?.(node)}
              />

              {/* Label for large nodes */}
              {node.size === 'large' && (
                <text
                  x={node.position.x}
                  y={node.position.y + size + 12}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.7)"
                  fontSize="10"
                  fontFamily="system-ui"
                >
                  {humanizeSignalType(node.signal.type)}
                </text>
              )}
            </motion.g>
          )
        })}
      </g>

      {/* Center indicator */}
      <circle
        cx={center.x}
        cy={center.y}
        r={3}
        fill="rgba(255,255,255,0.2)"
      />
    </svg>
  )
}
