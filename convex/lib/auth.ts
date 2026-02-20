/**
 * Authentication Utilities
 *
 * Provides secure user identity verification using Clerk JWT tokens.
 * This replaces client-passed userId parameters to prevent spoofing.
 *
 * Security: Always use getAuthenticatedUserId() instead of accepting
 * userId from function arguments.
 */
import type { QueryCtx, MutationCtx, ActionCtx } from '../_generated/server'

/**
 * Get the authenticated user's ID from their JWT token.
 *
 * In production, this verifies the Clerk JWT and extracts the user ID.
 * In development (when Clerk is not configured), returns 'dev-user' fallback.
 *
 * @throws Error if authentication is required but not present (production)
 *
 * @example
 * // In a mutation
 * export const create = mutation({
 *   args: {},  // No userId needed!
 *   handler: async (ctx) => {
 *     const userId = await getAuthenticatedUserId(ctx)
 *     // userId is now verified from JWT, not spoofable
 *   }
 * })
 */
export async function getAuthenticatedUserId(
  ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity()

  if (identity) {
    // subject is the Clerk user ID (e.g., "user_xxx")
    return identity.subject
  }

  // Development bypass: Allow unauthenticated access ONLY when Clerk is not configured
  // CLERK_JWT_ISSUER_DOMAIN is set in production - if missing, we're in dev mode
  // This is more reliable than NODE_ENV which may not be set in Convex
  const isClerkConfigured = !!process.env.CLERK_JWT_ISSUER_DOMAIN

  if (!isClerkConfigured) {
    console.warn('[Auth] Clerk not configured, using dev-user fallback')
    return 'dev-user'
  }

  // In production with Clerk configured, require real authentication
  throw new Error('Authentication required')
}

/**
 * Check if a user is authenticated without throwing.
 *
 * Useful for optional authentication scenarios.
 *
 * @returns The userId if authenticated, null otherwise
 */
export async function getOptionalUserId(
  ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity()

  if (identity) {
    return identity.subject
  }

  // In development (Clerk not configured), return dev-user
  const isClerkConfigured = !!process.env.CLERK_JWT_ISSUER_DOMAIN
  if (!isClerkConfigured) {
    return 'dev-user'
  }

  return null
}

/**
 * Verify that the current user matches the expected userId.
 *
 * Useful for checking ownership of resources.
 *
 * @throws Error if authentication fails or user doesn't match
 */
export async function verifyUserId(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  expectedUserId: string
): Promise<void> {
  const actualUserId = await getAuthenticatedUserId(ctx)

  if (actualUserId !== expectedUserId) {
    throw new Error('Access denied: user mismatch')
  }
}
