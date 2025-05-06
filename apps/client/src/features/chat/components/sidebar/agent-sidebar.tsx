import { Avatar, AvatarFallback, AvatarImage } from '@gingga/ui/components/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@gingga/ui/components/sidebar'

import { getInitials } from '@gingga/ui/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { InfoIcon, TelescopeIcon } from 'lucide-react'
import * as React from 'react'
import { Suspense } from 'react'
import { href, Link, NavLink, useMatch, useParams } from 'react-router'
import { AgentDetails, AgentDetailsLoading } from '~/features/chat/components/sidebar/agent-details'
import { useClientEnv } from '~/hooks/use-client-env'
import { useAuthQuery } from '~/lib/auth/auth.query'
import { useTRPC } from '~/lib/trpc/react'
import { DASHBOARD_INDEX_PATH } from '~/routes'
import { NavUser } from './nav-user'

const MAX_RECENT_AGENTS_TO_SHOW = 5 as const
const NAVIGATION_SIDEBAR_WIDTH = 'w-[3rem]' as const

function RecentAgentsListLoading() {
  return (
    <SidebarMenu className="gap-0">
      {Array.from({ length: MAX_RECENT_AGENTS_TO_SHOW }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <SidebarMenuItem key={i} className="p-1.5">
          <div className="bg-muted flex h-10 w-10 animate-pulse items-center justify-center rounded-full"></div>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export function RecentAgentsList() {
  const trpc = useTRPC()
  const { data: recentChatsWithAgentsData } = useSuspenseQuery(
    trpc.agent.getRecentChatsWithAgents.queryOptions(),
  )
  const allAgents = recentChatsWithAgentsData?.agents ?? []
  const agentsToShow = allAgents.slice(0, MAX_RECENT_AGENTS_TO_SHOW)

  return (
    <SidebarMenu className="gap-1">
      {agentsToShow.map(agent => (
        <SidebarMenuItem key={agent.id}>
          <SidebarMenuButton
            asChild
            tooltip={{
              children: agent.title ? `${agent.name} — ${agent.title}` : agent.name,
              hidden: false,
            }}
            className="w-full"
            size="icon"
          >
            <NavLink
              to={href('/agent/:agentId', { agentId: agent.id })}
              className="flex items-center justify-center"
            >
              <Avatar className="border-transparent rounded-xs">
                {agent.image ? (
                  <AvatarImage src={agent.image} alt={agent.name} />
                ) : (
                  <AvatarFallback className="rounded-xs">
                    {getInitials(agent.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="sr-only">{agent.name}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

function DefaultNestedContent() {
  return (
    <>
      <SidebarHeader className="border-b p-4">
        <div className="text-base font-medium text-foreground">Welcome</div>
      </SidebarHeader>
      <SidebarContent>
        <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-4 text-center">
          <InfoIcon className="mb-2 h-6 w-6" />
          <p>Select an agent from the left to view its details and chats.</p>
        </div>
      </SidebarContent>
    </>
  )
}

export function AgentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: authData } = useAuthQuery()
  const env = useClientEnv()

  // Check if we are on an agent-specific route
  const params = useParams<{ agentId?: string }>()
  const agentMatch = useMatch('/agent/:agentId/*')
  const agentId = agentMatch ? params.agentId : undefined
  const isAdmin = authData?.isAuthenticated && authData.user?.role === 'admin'

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* NavigationSidebar */}
      <Sidebar
        collapsible="none"
        className={`${NAVIGATION_SIDEBAR_WIDTH} border-r flex-shrink-0`}
      >
        <SidebarHeader className="p-2">
          <Link to={DASHBOARD_INDEX_PATH}>
            <img
              src={`${env.VITE_ASSETS_URL}/logo/logo-iso-dark.svg`}
              alt="Logo"
              className="w-8 h-8 hidden dark:block"
            />
            <img
              src={`${env.VITE_ASSETS_URL}/logo/logo-iso-light.svg`}
              alt="Logo"
              className="w-8 h-8 block dark:hidden"
            />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu className="px-1">
                {/* Explore Agents Link */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{
                      children: 'Explore Agents',
                      hidden: false,
                    }}
                    className="w-full"
                    size="icon"
                    asChild
                  >
                    <NavLink to={href('/agents')} className="flex items-center justify-center">
                      <TelescopeIcon className="h-6 w-6" />
                      <span className="sr-only">Explore Agents</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Recent Agents List */}
                {authData?.isAuthenticated && (
                  <Suspense fallback={<RecentAgentsListLoading />}>
                    <RecentAgentsList />
                  </Suspense>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={authData?.isAuthenticated ? authData.user : null} />
        </SidebarFooter>
      </Sidebar>

      {/* NestedSidebar */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        {agentId ? (
          <Suspense fallback={<AgentDetailsLoading />}>
            <AgentDetails agentId={agentId} isAdmin={!!isAdmin} userId={authData?.user?.id} />
          </Suspense>
        ) : (
          <DefaultNestedContent />
        )}
      </Sidebar>
    </Sidebar>
  )
}
