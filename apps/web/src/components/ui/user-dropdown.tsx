import type { ReactNode } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@gingga/ui/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@gingga/ui/components/dropdown-menu'
import { SidebarMenuButton } from '@gingga/ui/components/sidebar'
import { cn, getInitials } from '@gingga/ui/lib/utils'
import { ChevronsUpDown, LogOut, PaletteIcon } from 'lucide-react'
import { useAuthedQuery, useSignOutMutation } from '~/features/auth/auth.query'
import { ThemeSwitch } from './theme-switch'

// Common dropdown content component
function UserDropdownContent({
  user,
  showHeader = true,
  side,
  align = 'end',
  sideOffset,
  className,
}: {
  user: {
    email: string
    name?: string | null
    image?: string | null
  }
  showHeader?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  className?: string
}) {
  const { mutate: signOut } = useSignOutMutation()

  return (
    <DropdownMenuContent
      className={cn('min-w-56', className)}
      side={side}
      align={align}
      sideOffset={sideOffset}
      forceMount
    >
      {showHeader && (
        <>
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-md">
                {user.image && (
                  <AvatarImage src={user.image} alt={user.name || user.email} />
                )}
                <AvatarFallback className="rounded-none">
                  {getInitials(user.name || user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
        </>
      )}

      <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-default hover:bg-transparent focus:bg-transparent">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <PaletteIcon className="h-4 w-4" />
              <span>Theme</span>
            </div>
            <ThemeSwitch />
          </div>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full cursor-pointer items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}

// Base component that accepts a trigger
function UserDropdownBase({
  children,
  contentProps,
}: {
  children: ReactNode
  contentProps: Parameters<typeof UserDropdownContent>[0]
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="focus:outline-none focus-visible:outline-none"
      >
        <div className="focus:outline-none focus-visible:outline-none" tabIndex={-1}>
          {children}
        </div>
      </DropdownMenuTrigger>
      <UserDropdownContent {...contentProps} />
    </DropdownMenu>
  )
}

// Avatar variant
export function UserDropdownAvatar() {
  const { data } = useAuthedQuery()
  if (!data?.session)
    return null
  const { user } = data

  return (
    <UserDropdownBase
      contentProps={{
        user,
        className: 'w-56',
      }}
    >
      <Avatar className="cursor-pointer focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none">
        {user.image && <AvatarImage src={user.image} alt={user.name || user.email} />}
        <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
      </Avatar>
    </UserDropdownBase>
  )
}

// Sidebar variant
export function UserDropdownSidebar({ isMobile }: { isMobile?: boolean }) {
  const { data } = useAuthedQuery()
  if (!data?.session)
    return null
  const { user } = data

  return (
    <UserDropdownBase
      contentProps={{
        user,
        side: isMobile ? 'bottom' : 'right',
        align: 'end',
        sideOffset: 4,
        className: 'w-[--radix-dropdown-menu-trigger-width]',
      }}
    >
      <SidebarMenuButton
        size="lg"
        className="hover:border-border hover:text-foreground data-[state=open]:border-y-border data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-transparent focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none data-[state=open]:border-x-transparent"
      >
        <Avatar className="h-8 w-8 rounded-md">
          {user.image && <AvatarImage src={user.image} alt={user.name || user.email} />}
          <AvatarFallback className="rounded-none">
            {getInitials(user.name || user.email)}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{user.name}</span>
          <span className="truncate text-xs">{user.email}</span>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </SidebarMenuButton>
    </UserDropdownBase>
  )
}
