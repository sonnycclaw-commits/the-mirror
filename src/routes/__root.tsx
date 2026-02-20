import { HeadContent, Scripts, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ClerkProvider, useAuth } from '@clerk/tanstack-react-start'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

import Header from '../components/Header'
import appCss from '../styles.css?url'

// Initialize Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

// Check if Clerk is properly configured
const hasClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.startsWith('pk_')
  && !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.includes('YOUR_KEY')

// Security: Fail hard in production if Clerk not configured
// This prevents deploying with the auth bypass that allows account impersonation
if (import.meta.env.PROD && !hasClerkKey) {
  throw new Error(
    'SECURITY ERROR: VITE_CLERK_PUBLISHABLE_KEY is required for production. ' +
    'Without it, authentication is disabled and any user can impersonate any other user. ' +
    'Set this environment variable before deploying.'
  )
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'The Mirror',
      },
      {
        name: 'theme-color',
        content: '#0f172a',
      },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      // Fonts are now imported in styles.css to support variable axes
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
})

// Wrapper that conditionally uses Clerk or plain Convex
function Providers({ children }: { children: React.ReactNode }) {
  if (hasClerkKey) {
    return (
      <ClerkProvider>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    )
  }

  // Dev mode without Clerk - show warning banner
  return (
    <ConvexProvider client={convex}>
      <div className="bg-amber-500/20 border-b border-amber-500/50 px-4 py-2 text-center text-amber-200 text-sm">
        ⚠️ Clerk not configured. Auth disabled for development.
        Set <code className="font-mono bg-slate-800 px-1 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> in <code className="font-mono bg-slate-800 px-1 rounded">.env.local</code>
      </div>
      {children}
    </ConvexProvider>
  )
}

function RootComponent() {
  return (
    <Providers>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </Providers>
  )
}

import { TheVoid } from '../components/effects/TheVoid'

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <HeadContent />
      </head>
      {/*
        Body styles are handled in src/styles.css
        (Background: --twilight-900, Text: --twilight-50)
      */}
      <body className="min-h-screen antialiased selection:bg-[var(--coral-soft)] selection:text-[var(--coral-500)]">
        {/* The Neural Mirror - Living Background */}
        <TheVoid />

        <Header />
        {children}
        {process.env.NODE_ENV === 'development' && (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
