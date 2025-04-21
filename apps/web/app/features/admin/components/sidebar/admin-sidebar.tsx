import { Link } from '@tanstack/react-router'
import { LayoutDashboardIcon, UsersIcon, ArrowLeftIcon } from 'lucide-react'
import { Button } from '@gingga/ui/components/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@gingga/ui/components/sidebar'
import { ThemeSwitch } from '~/components/ui/theme-switch'
import { cn } from '@gingga/ui/lib/utils'

export function AdminSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="p-4">
          <Link to="/admin" className="flex justify-center gap-2">
            <img
              src={`${import.meta.env.VITE_ASSETS_URL}/logo/logo-dark-v2.png`}
              alt="Logo"
              className="hidden w-32 dark:block"
            />
            <img
              src={`${import.meta.env.VITE_ASSETS_URL}/logo/logo-light-v2.png`}
              alt="Logo"
              className="w-32 dark:hidden"
            />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              <SidebarMenuItem
                className={cn(
                  'group/item -mt-[2px] flex items-center justify-between rounded-none border border-r-0 border-l-0 border-transparent',
                  'hover:border-border hover:bg-sidebar-accent focus:bg-sidebar-accent',
                  'has-[[data-status=active]]:border-border has-[[data-status=active]]:bg-sidebar-accent has-[[data-status=active]]:text-sidebar-accent-foreground',
                  'dark:has-[[data-status=active]]:text-primary dark:hover:text-primary',
                )}
              >
                <Link
                  to="/admin"
                  activeOptions={{ exact: true }}
                  className="flex w-full items-center gap-2 truncate px-4 py-2 hover:underline"
                >
                  <LayoutDashboardIcon className="h-4 w-4" />
                  <span>Overview</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem
                className={cn(
                  'group/item -mt-[2px] flex items-center justify-between rounded-none border border-r-0 border-l-0 border-transparent',
                  'hover:border-border hover:bg-sidebar-accent focus:bg-sidebar-accent',
                  'has-[[data-status=active]]:border-border has-[[data-status=active]]:bg-sidebar-accent has-[[data-status=active]]:text-sidebar-accent-foreground',
                  'dark:has-[[data-status=active]]:text-primary dark:hover:text-primary',
                )}
              >
                <Link
                  to="/admin/users"
                  activeOptions={{ exact: true }}
                  className="flex w-full items-center gap-2 truncate px-4 py-2 hover:underline"
                >
                  <UsersIcon className="h-4 w-4" />
                  <span>Users</span>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/chat">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Chat
              </Link>
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex justify-center">
            <ThemeSwitch />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
