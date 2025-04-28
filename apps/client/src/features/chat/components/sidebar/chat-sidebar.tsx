import type { Chat, User } from '@gingga/db/types'
import { Avatar, AvatarFallback, AvatarImage } from '@gingga/ui/components/avatar'
import { Button } from '@gingga/ui/components/button'
import { Card, CardContent } from '@gingga/ui/components/card'
import { Dialog, DialogContent, DialogTrigger } from '@gingga/ui/components/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gingga/ui/components/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@gingga/ui/components/sidebar'
import { cn, getInitials } from '@gingga/ui/lib/utils'
import {
  Loader2Icon,
  LogInIcon,
  MessageSquarePlusIcon,
  MoreVertical,
  PencilIcon,
  Share,
  TelescopeIcon,
  Trash2,
} from 'lucide-react'
import { Fragment, Suspense, useState } from 'react'
import { href, Link } from 'react-router'
import { ThemeSwitch } from '~/components/ui/theme-switch'
import { useGetRecentAgentsQuery } from '~/features/agent/agent.query'
import { useGetUserChatsQuery } from '~/features/chat/chat.query'
import { useClientEnv } from '~/hooks/use-client-env'
import { useAuthQuery } from '~/lib/auth/auth.query'
import { DeleteChatDialog } from './delete-dialog'
import { RenameChatDialog } from './rename-dialog'
import { ShareChatDialog } from './share-dialog'

// --- Constants ---
const MAX_RECENT_AGENTS_TO_SHOW = 3 as const

export function ChatSidebar() {
  const { data: authData } = useAuthQuery()
  const env = useClientEnv()

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="p-4">
          <Link to="/chat" className="flex justify-center gap-2">
            <img
              src={`${env.VITE_ASSETS_URL}/logo/logo-dark-v2.png`}
              alt="Logo"
              className="w-32 hidden dark:block"
            />
            <img
              src={`${env.VITE_ASSETS_URL}/logo/logo-light-v2.png`}
              alt="Logo"
              className="w-32 block dark:hidden"
            />
          </Link>
        </div>

        <Button variant="primary" size="md" hover="reverse" className="w-full" asChild>
          <Link to="/chat">
            <span>New Chat</span>
            <MessageSquarePlusIcon className="ml-auto h-4 w-4" />
          </Link>
        </Button>

        <Button variant="outline" size="md" className="w-full" asChild>
          <Link to="/chat/agents">
            <span>Explore Agents</span>
            <TelescopeIcon className="ml-auto h-4 w-4" />
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <RecentAgentsSection />
        <SidebarChats user={authData?.isAuthenticated && authData.user ? authData.user : null} />
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2">
          <NavUser user={authData?.isAuthenticated && authData.user ? authData.user : null} />
          <ThemeSwitch />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

type DialogType = 'share' | 'rename' | 'delete'
interface DialogState {
  type: DialogType
  chat: Pick<Chat, 'id' | 'title' | 'visibility'>
}

function AuthenticatedHistoryListLoading() {
  return (
    <SidebarMenu className="gap-0">
      {Array.from({ length: 5 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <SidebarMenuItem key={i} className="p-2">
          <div className="bg-muted h-5 w-full animate-pulse rounded" />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

function AuthenticatedHistoryList() {
  const { data: chats } = useGetUserChatsQuery()
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <SidebarMenu className="gap-0">
      {chats?.length === 0 && (
        <SidebarMenuItem>
          <p className="text-muted-foreground p-2 text-sm">No chat history yet...</p>
        </SidebarMenuItem>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {chats?.map((chat) => {
          const url = chat.agentId
            ? href('/chat/agent/:agentId/chat/:chatId', { agentId: chat.agentId, chatId: chat.id })
            : href('/chat/:chatId', { chatId: chat.id })

          return (
            <Fragment key={chat.id}>
              <DropdownMenu>
                <SidebarMenuItem
                  className={cn(
                    'group/item -mt-[2px] flex items-center justify-between rounded-none border border-r-0 border-l-0 border-transparent',
                    'hover:border-border',
                    'hover:bg-sidebar-accent',
                    'focus:bg-sidebar-accent',
                    'has-[[data-state=open]]:border-border',
                    'has-[[data-state=open]]:bg-sidebar-accent',
                    'has-[[data-state=open]]:text-sidebar-accent-foreground',
                    'has-[[data-status=active]]:border-border',
                    'has-[[data-status=active]]:bg-sidebar-accent',
                    'has-[[data-status=active]]:text-sidebar-accent-foreground',
                    'dark:has-data-[state=open]:text-primary',
                    'dark:has-data-[status=active]:text-primary',
                    'dark:hover:text-primary',
                  )}
                >
                  <Link
                    to={url}
                    className="flex-1 truncate p-2 pr-5 hover:underline"
                  >
                    {chat.title}
                  </Link>

                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction className="absolute right-2 p-2 opacity-30 transition-opacity group-hover/item:opacity-100 hover:bg-neutral-500/20 focus:ring-0 focus-visible:ring-0 data-[state=open]:bg-neutral-500/20 data-[state=open]:opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="-mt-2 w-48">
                    <DialogTrigger
                      asChild
                      onClick={() => setDialog({ type: 'share', chat })}
                    >
                      <DropdownMenuItem>
                        <Share className="h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogTrigger
                      asChild
                      onClick={() => setDialog({ type: 'rename', chat })}
                    >
                      <DropdownMenuItem>
                        <PencilIcon className="h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogTrigger
                      asChild
                      onClick={() => setDialog({ type: 'delete', chat })}
                    >
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                </SidebarMenuItem>
              </DropdownMenu>
            </Fragment>
          )
        })}

        <DialogContent className="sm:max-w-[425px]">
          {dialog?.type === 'share' && <ShareChatDialog chat={dialog.chat} />}
          {dialog?.type === 'rename' && (
            <RenameChatDialog
              chat={dialog.chat}
              closeDialog={() => setIsDialogOpen(false)}
            />
          )}
          {dialog?.type === 'delete' && (
            <DeleteChatDialog
              chat={dialog.chat}
              closeDialog={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  )
}

interface SidebarChatsProps {
  user: User | null
}

function SidebarChats({ user }: SidebarChatsProps) {
  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel className="text-foreground font-bold">History</SidebarGroupLabel>
      <SidebarGroupContent>
        {user
          ? (
              <Suspense fallback={<AuthenticatedHistoryListLoading />}>
                <AuthenticatedHistoryList />
              </Suspense>
            )
          : (
              <SidebarMenu className="gap-0 p-2">
                <Card
                  design="grid"
                  hover="noShadow"
                  className="border-border bg-muted/50 text-center"
                >
                  <CardContent className="text-muted-foreground p-3 text-sm">
                    <Link
                      to="/identify"
                      className="text-brand-blue dark:text-primary font-medium hover:underline"
                    >
                      Log in
                    </Link>
                    {' '}
                    to save your chat history.
                  </CardContent>
                </Card>
              </SidebarMenu>
            )}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

interface NavUserProps {
  user: User | null
}

function NavUser({ user }: NavUserProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {user
          ? (
              <Link to="/settings/account" className="w-full">
                <SidebarMenuButton
                  size="lg"
                  className="hover:border-border hover:text-foreground data-[state=open]:border-y-border data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer border border-transparent focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none data-[state=open]:border-x-transparent"
                >
                  <Avatar className="h-8 w-8 rounded-md">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name || user.email} />
                    )}
                    <AvatarFallback className="rounded-none">
                      {getInitials(user.name || user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name ?? user.email}</span>
                    <span className="truncate text-xs">Free</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            )
          : (
              <Button variant="outline" className="w-full" asChild>
                <Link to="/identify">
                  <LogInIcon className="mr-2 h-4 w-4" />
                  Log in
                </Link>
              </Button>
            )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function RecentAgentsListLoading() {
  return (
    <SidebarMenu className="gap-0">
      <div className="bg-muted flex h-8 w-full animate-pulse items-center gap-2 rounded px-3">
        <div className="bg-muted-foreground/30 h-4 w-24 rounded"></div>
        <Loader2Icon className="text-muted-foreground/50 ml-auto h-4 w-4 animate-spin" />
      </div>
    </SidebarMenu>
  )
}

function RecentAgentsSection() {
  const { data: authData } = useAuthQuery()

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel className="text-foreground font-bold">Agents</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0">
          {authData?.isAuthenticated && (
            <Suspense fallback={<RecentAgentsListLoading />}>
              <RecentAgentsList />
            </Suspense>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function RecentAgentsList() {
  const { data: recentChatsWithAgentsData } = useGetRecentAgentsQuery()
  const allAgents = recentChatsWithAgentsData?.agents ?? []
  const agentsToShow = allAgents.slice(0, MAX_RECENT_AGENTS_TO_SHOW)

  return (
    <SidebarMenu className="gap-0">
      {agentsToShow.map(agent => (
        <SidebarMenuItem key={agent.id}>
          <Link
            to={href('/chat/agent/:agentId', { agentId: agent.id })}
            className="flex items-center gap-3 p-2 hover:underline"
          >
            <Avatar className="h-8 w-8">
              {agent.image
                ? (
                    <AvatarImage src={agent.image} alt={agent.name} />
                  )
                : (
                    <div className="bg-muted h-8 w-8 rounded-full" />
                  )}
            </Avatar>
            <span>{agent.name}</span>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
