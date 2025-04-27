import { SidebarProvider } from '@gingga/ui/components/sidebar'
// import { dehydrate } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { ChatSidebar } from '~/features/chat/components/sidebar/chat-sidebar'
import { SidebarFloatingActions } from '~/features/chat/components/sidebar/sidebar-floating-actions'
// import { getTRPC } from '~/lib/trpc/trpc.server'
// import { getQueryClient } from '~/middleware/context-hono.server'
// import { getAuthSession } from '~/middleware/context-storage.server'

export async function loader() {
  // const queryClient = getQueryClient()
  // const authSession = await getAuthSession()
  // const trpc = await getTRPC()
  // queryClient.setQueryData(trpc.auth.getSession.queryKey(), _ => authSession)

  // return { dehydratedState: dehydrate(queryClient) }
  return null
}

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
