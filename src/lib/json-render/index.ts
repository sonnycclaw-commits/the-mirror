/**
 * JSON-Render Module
 *
 * Exports catalog schemas and React components for structured AI UI output.
 * This is a custom implementation - the @json-render packages are not used.
 */

// Catalog exports (schemas and types)
export {
  componentSchema,
  leafComponentSchema,
  uiTreeSchema,
  COMPONENT_TYPES,
  // Individual schemas
  textMessageSchema,
  insightCardSchema,
  mirrorStatementSchema,
  profileSectionSchema,
  contradictionCardSchema,
  contractStatementSchema,
  actionButtonSchema,
  dividerSchema,
  emphasisSchema,
  // Types
  type UIComponent,
  type LeafComponent,
  type UITree,
  type ComponentType,
  type Emphasis,
  type TextMessageProps,
  type InsightCardProps,
  type MirrorStatementProps,
  type ProfileSectionProps,
  type ContradictionCardProps,
  type ContractStatementProps,
  type ActionButtonProps,
  type DividerProps,
} from './catalog'

// Registry exports (React components)
export { UITreeRenderer, type UITreeRendererProps } from './registry'
