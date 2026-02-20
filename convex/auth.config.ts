/**
 * Convex Auth Configuration
 *
 * Configures Clerk as the JWT authentication provider.
 * This enables ctx.auth.getUserIdentity() to verify Clerk tokens.
 *
 * Security: This is CRITICAL for production - without it, userId
 * would need to be passed from the client (trivially spoofable).
 */
export default {
  providers: [
    {
      // Clerk domain - set via environment variable in Convex dashboard
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      // Application ID for Convex (matches Clerk JWT template)
      applicationID: "convex",
    },
  ],
}
