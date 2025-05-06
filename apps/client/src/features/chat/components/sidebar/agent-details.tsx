import type { Chat } from '@gingga/db/types'
import { Avatar, AvatarFallback, AvatarImage } from '@gingga/ui/components/avatar'
import { Button } from '@gingga/ui/components/button'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@gingga/ui/components/sidebar'
import { Skeleton } from '@gingga/ui/components/skeleton'
import { useSuspenseQuery } from '@tanstack/react-query'
import { BotIcon, CircleFadingPlusIcon, PlaySquareIcon, Settings2Icon, UsersIcon, WorkflowIcon } from 'lucide-react'
import { Suspense } from 'react'
import { href, Link, NavLink } from 'react-router'
import { useTRPC } from '~/lib/trpc/react'

// Limit the number of history items shown initially
const CHAT_HISTORY_LIMIT = 20 as const

function ChatHistoryLoading() {
  return (
    <SidebarGroup className="px-0">
      <SidebarGroupLabel className="text-foreground px-2 font-bold">
        History
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0">
          {Array.from({ length: CHAT_HISTORY_LIMIT }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <SidebarMenuItem key={i} className="p-2">
              <Skeleton className="h-5 w-full rounded" />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function ChatHistoryList({ agentId }: { agentId: string }) {
  const trpc = useTRPC()
  const { data: chats } = useSuspenseQuery(
    trpc.chat.getChatsByAgentId.queryOptions({ agentId, limit: CHAT_HISTORY_LIMIT }),
  )

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupLabel className="text-foreground px-2 font-bold">
        History
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {chats?.length === 0 && (
            <SidebarMenuItem>
              <p className="text-muted-foreground p-2 text-sm">No chat history yet.</p>
            </SidebarMenuItem>
          )}
          {chats?.map((chat: Chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                asChild
                className="w-full justify-start truncate text-sm"
              >
                <NavLink
                  to={href('/agent/:agentId/chat/:chatId', {
                    agentId,
                    chatId: chat.id,
                  })}
                  title={chat.title ?? 'Untitled Chat'}
                >
                  {chat.title ?? 'Untitled Chat'}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {/* TODO: Add 'View all' link if chats exceed limit */}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AgentDetailsLoading() {
  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="bg-muted h-6 w-3/4 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-9 w-full animate-pulse rounded" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent className="space-y-1 p-2">
            {/* Placeholder for content loading state */}
            {Array.from({ length: 8 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i} className="bg-muted h-10 w-full animate-pulse rounded" />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  )
}

export function AgentDetails({ agentId, isAdmin, userId }: { agentId: string, isAdmin: boolean, userId?: string }) {
  const trpc = useTRPC()
  const { data: agent } = useSuspenseQuery(
    trpc.agent.getAgentById.queryOptions({ id: agentId }),
  )

  const isOwner = userId === agent.ownerId

  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-2">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">
            <h6 className="leading-5 font-title">{agent.name}</h6>
            <p className="leading-5 text-xs text-muted-foreground">{agent.title}</p>
          </div>
          {isAdmin && (
            <Button asChild variant="outline" size="icon">
              <NavLink to={href('/agent/:agentId/edit/instructions', { agentId })}>
                <Settings2Icon className="size-4" />
              </NavLink>
            </Button>
          )}
        </div>
        {/* <SidebarInput placeholder={`Search in ${agent.name}...`} /> */}
      </SidebarHeader>
      <SidebarContent className="px-2">
        {/* Agent Image */}
        <div className="p-4 flex justify-center">
          <Avatar className="h-36 w-36 rounded-sm border">
            {agent.image ? (
              <AvatarImage src={agent.image} alt={agent.name} className="object-contain" />
            ) : (
              <AvatarFallback className="">
                <BotIcon className="h-10 w-10 text-muted-foreground" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* New Chat Button */}
        <div className="px-4 pb-4">
          <Button asChild className="w-full" size="lg" variant="secondary">
            <Link to={href('/agent/:agentId', { agentId })}>
              <CircleFadingPlusIcon className="h-4 w-4" />
              New Chat
            </Link>
          </Button>
        </div>

        {/* Management Section (Admin Only) */}
        {(isAdmin || isOwner) && (
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-foreground px-2 font-bold">
              Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="w-full justify-start text-sm"
                  >
                    <NavLink to={href('/agent/:agentId/automations', { agentId })}>
                      <WorkflowIcon className="h-4 w-4" />
                      Automations
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {agent.agentType === 'lead_capture' && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="w-full justify-start text-sm"
                      >
                        <NavLink to={href('/agent/:agentId/sessions', { agentId })}>
                          <PlaySquareIcon className="h-4 w-4" />
                          Sessions
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="w-full justify-start text-sm"
                      >
                        <NavLink to={href('/agent/:agentId/leads', { agentId })}>
                          <UsersIcon className="h-4 w-4" />
                          Leads
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}

              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Chat History */}
        <Suspense fallback={<ChatHistoryLoading />}>
          <ChatHistoryList agentId={agentId} />
        </Suspense>

      </SidebarContent>
    </>
  )
}
