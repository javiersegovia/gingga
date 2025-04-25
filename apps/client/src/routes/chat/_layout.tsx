import { SidebarProvider } from '@gingga/ui/components/sidebar'
import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { ChatSidebar } from '~/features/chat/components/sidebar/chat-sidebar'
import { SidebarFloatingActions } from '~/features/chat/components/sidebar/sidebar-floating-actions'

// export const Route = createFileRoute('/_demo/chat')({
//   component: ChatLayout,

//   loader: async ({ context }) => {
//     if (context?.auth?.session) {
//       context.queryClient.prefetchQuery(recentChatsWithAgentsQueryOptions())
//       context.queryClient.prefetchQuery(userChatsQueryOptions())
//     }

//     return { isSidebarOpened: await $isSidebarOpened() }
//   },
//   staleTime: 10_000,
//   preloadStaleTime: 10_000,
// })

// TODO TRPC: Preload data in loader

export default function ChatLayout() {
  // const { isSidebarOpened } = Route.useLoaderData()
  const isSidebarOpened = true

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
