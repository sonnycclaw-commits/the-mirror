import { Link } from '@tanstack/react-router'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/tanstack-react-start'

/**
 * Minimal Header - The Mirror
 *
 * Clean navigation with glassmorphism backdrop.
 * Shows logo + auth controls only.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[var(--twilight-900)]/80 backdrop-blur-xl transition-all duration-300">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display italic font-bold text-xl tracking-tight text-[var(--twilight-50)] hover:text-[var(--coral-500)] transition-colors"
        >
          The Mirror
        </Link>

        {/* Auth controls */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8 ring-2 ring-[var(--glass-border)]',
                }
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-[var(--twilight-50)] hover:text-[var(--coral-500)] transition-colors hover:bg-white/5 rounded-lg">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  )
}
