/**
 * Constellation Data Structure (S2-T01)
 *
 * Models for positioning signals in 2D space as a star constellation.
 * Supports clustering by domain, confidence-based sizing, and connections.
 */
import type { Signal, SignalDomain } from '../ai/tools/types'

export interface ConstellationNode {
  id: string
  signal: Signal
  position: { x: number; y: number }
  connections: string[] // IDs of connected nodes
  size: 'small' | 'medium' | 'large'
  brightness: number // 0-1 based on confidence
}

export interface Constellation {
  nodes: ConstellationNode[]
  center: { x: number; y: number }
  bounds: { width: number; height: number }
}

/**
 * Domain position angles for radial layout (in radians)
 * Arranged like a compass with related domains adjacent
 */
const DOMAIN_ANGLES: Record<SignalDomain, number> = {
  VALUE: 0,              // Top (12 o'clock)
  NEED: Math.PI / 3,     // 2 o'clock
  MOTIVE: (2 * Math.PI) / 3, // 4 o'clock
  DEFENSE: Math.PI,      // Bottom (6 o'clock)
  ATTACHMENT: (4 * Math.PI) / 3, // 8 o'clock
  DEVELOPMENT: (5 * Math.PI) / 3, // 10 o'clock
  PATTERN: Math.PI / 2,  // Center-right
}

/**
 * Convert confidence to node size
 */
function getNodeSize(confidence: number): 'small' | 'medium' | 'large' {
  if (confidence >= 0.8) return 'large'
  if (confidence >= 0.5) return 'medium'
  return 'small'
}

/**
 * Generate unique node ID from signal
 */
function generateNodeId(signal: Signal, index: number): string {
  return `${signal.domain}-${signal.type}-${index}`
}

/**
 * Calculate position for a signal node
 * Uses radial layout with domain-based clustering
 */
function calculateNodePosition(
  signal: Signal,
  domainIndex: number,
  totalInDomain: number,
  centerX: number,
  centerY: number,
  baseRadius: number
): { x: number; y: number } {
  const angle = DOMAIN_ANGLES[signal.domain]

  // Spread nodes within domain cluster
  const spreadAngle = Math.PI / 6 // 30 degrees spread
  const spreadOffset = totalInDomain > 1
    ? (domainIndex - (totalInDomain - 1) / 2) * (spreadAngle / totalInDomain)
    : 0

  // Vary radius slightly based on confidence (more confident = closer to center)
  const radiusVariation = 0.8 + (1 - signal.confidence) * 0.4
  const radius = baseRadius * radiusVariation

  const finalAngle = angle + spreadOffset

  return {
    x: centerX + Math.cos(finalAngle) * radius,
    y: centerY + Math.sin(finalAngle) * radius,
  }
}

/**
 * Find connections between nodes
 * Connects nodes in same domain or with related signals
 */
function findConnections(nodes: ConstellationNode[]): void {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!
    for (let j = i + 1; j < nodes.length; j++) {
      const other = nodes[j]!

      // Connect nodes in same domain
      if (node.signal.domain === other.signal.domain) {
        node.connections.push(other.id)
        other.connections.push(node.id)
      }

      // Connect high-confidence patterns to everything
      if (node.signal.domain === 'PATTERN' && node.signal.confidence >= 0.7) {
        node.connections.push(other.id)
      }
      if (other.signal.domain === 'PATTERN' && other.signal.confidence >= 0.7) {
        other.connections.push(node.id)
      }
    }
  }
}

/**
 * Build a constellation from an array of signals
 */
export function buildConstellation(
  signals: Signal[],
  width = 400,
  height = 400
): Constellation {
  if (signals.length === 0) {
    return {
      nodes: [],
      center: { x: width / 2, y: height / 2 },
      bounds: { width, height },
    }
  }

  const centerX = width / 2
  const centerY = height / 2
  const baseRadius = Math.min(width, height) * 0.35

  // Group signals by domain
  const byDomain = new Map<SignalDomain, Signal[]>()
  for (const signal of signals) {
    const group = byDomain.get(signal.domain) || []
    group.push(signal)
    byDomain.set(signal.domain, group)
  }

  // Create nodes
  const nodes: ConstellationNode[] = []
  let globalIndex = 0

  for (const [_domain, domainSignals] of byDomain) {
    domainSignals.forEach((signal, domainIndex) => {
      const position = calculateNodePosition(
        signal,
        domainIndex,
        domainSignals.length,
        centerX,
        centerY,
        baseRadius
      )

      nodes.push({
        id: generateNodeId(signal, globalIndex),
        signal,
        position,
        connections: [],
        size: getNodeSize(signal.confidence),
        brightness: signal.confidence,
      })

      globalIndex++
    })
  }

  // Find connections between nodes
  findConnections(nodes)

  return {
    nodes,
    center: { x: centerX, y: centerY },
    bounds: { width, height },
  }
}

/**
 * Get nodes grouped by domain for rendering
 */
export function getNodesByDomain(
  constellation: Constellation
): Map<SignalDomain, ConstellationNode[]> {
  const result = new Map<SignalDomain, ConstellationNode[]>()

  for (const node of constellation.nodes) {
    const group = result.get(node.signal.domain) || []
    group.push(node)
    result.set(node.signal.domain, group)
  }

  return result
}

/**
 * Calculate bounding box that contains all nodes
 */
export function getNodeBounds(nodes: ConstellationNode[]): {
  minX: number
  minY: number
  maxX: number
  maxY: number
} {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const node of nodes) {
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x)
    maxY = Math.max(maxY, node.position.y)
  }

  return { minX, minY, maxX, maxY }
}
