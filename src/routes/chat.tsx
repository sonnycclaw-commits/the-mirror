import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/chat')({
  beforeLoad: async ({ context }) => {
    // DEV BYPASS: Skip auth check in development
    if (import.meta.env.DEV) {
      console.log('[DEV] Auth bypass enabled for /chat')
      return
    }

    // @ts-expect-error - context.auth typed by Clerk
    const userId = context?.auth?.userId
    if (!userId) {
      throw redirect({
        to: '/',
        search: {
          redirect: '/chat',
        },
      })
    }
  },
  component: ChatLayout,
})

function ChatLayout() {
  return <Outlet />
}
