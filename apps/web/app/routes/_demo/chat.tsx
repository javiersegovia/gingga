import { SidebarProvider } from '@gingga/ui/components/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'
import { recentChatsWithAgentsQueryOptions } from '~/features/agent/agent.query'
import { userChatsQueryOptions } from '~/features/chat/chat.query'
import { ChatSidebar } from '~/features/chat/components/sidebar/chat-sidebar'
import { SidebarFloatingActions } from '~/features/chat/components/sidebar/sidebar-floating-actions'
import { $isSidebarOpened } from '~/features/sidebar/sidebar.api'

export const Route = createFileRoute('/_demo/chat')({
  component: ChatLayout,

  loader: async ({ context }) => {
    if (context?.auth?.isAuthenticated) {
      context.queryClient.prefetchQuery(recentChatsWithAgentsQueryOptions())
      context.queryClient.prefetchQuery(userChatsQueryOptions())
    }

    return { isSidebarOpened: await $isSidebarOpened() }
  },
  staleTime: 10_000,
  preloadStaleTime: 10_000,
})

function ChatLayout() {
  const { isSidebarOpened } = Route.useLoaderData()

  return (
    <SidebarProvider defaultOpen={isSidebarOpened}>
      <Suspense fallback={<div>Loading Sidebar...</div>}>
        <ChatSidebar />
      </Suspense>

      <section className="relative flex w-full flex-col">
        <div className="absolute top-0 left-0 flex items-center">
          <SidebarFloatingActions />
        </div>

        <div className="text-foreground relative flex flex-1 flex-col overflow-hidden bg-transparent">
          <Outlet />
        </div>
      </section>
    </SidebarProvider>
  )
}
