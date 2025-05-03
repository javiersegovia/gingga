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
import { cn } from '@gingga/ui/lib/utils'
import { ArrowLeftIcon, LayoutDashboardIcon, UsersIcon } from 'lucide-react'
import { href, Link, NavLink } from 'react-router'
import { ThemeSwitch } from '~/components/ui/theme-switch'
import { useClientEnv } from '~/hooks/use-client-env'

export function AdminSidebar() {
  const env = useClientEnv()
  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="p-4">
          <Link to="/admin" className="flex justify-center gap-2">
            <img
              src={`${env.VITE_ASSETS_URL}/logo/logo-dark-v2.png`}
              alt="Logo"
              className="hidden w-32 dark:block"
            />
            <img
              src={`${env.VITE_ASSETS_URL}/logo/logo-light-v2.png`}
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
                <NavLink
                  to={href('/admin')}
                  className="flex w-full items-center gap-2 truncate px-4 py-2 hover:underline"
                >
                  <LayoutDashboardIcon className="h-4 w-4" />
                  <span>Overview</span>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem
                className={cn(
                  'group/item -mt-[2px] flex items-center justify-between rounded-none border border-r-0 border-l-0 border-transparent',
                  'hover:border-border hover:bg-sidebar-accent focus:bg-sidebar-accent',
                  'has-[[data-status=active]]:border-border has-[[data-status=active]]:bg-sidebar-accent has-[[data-status=active]]:text-sidebar-accent-foreground',
                  'dark:has-[[data-status=active]]:text-primary dark:hover:text-primary',
                )}
              >
                <NavLink
                  to={href('/admin/users')}
                  className="flex w-full items-center gap-2 truncate px-4 py-2 hover:underline"
                >
                  <UsersIcon className="h-4 w-4" />
                  <span>Users</span>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem
                className={cn(
                  'group/item -mt-[2px] flex items-center justify-between rounded-none border border-r-0 border-l-0 border-transparent',
                  'hover:border-border hover:bg-sidebar-accent focus:bg-sidebar-accent',
                  'has-[[data-status=active]]:border-border has-[[data-status=active]]:bg-sidebar-accent has-[[data-status=active]]:text-sidebar-accent-foreground',
                  'dark:has-[[data-status=active]]:text-primary dark:hover:text-primary',
                )}
              >
                <NavLink
                  to={href('/admin/n8n-workflows')}
                  className="flex w-full items-center gap-2 truncate px-4 py-2 hover:underline"
                >
                  <span>N8N Workflows</span>
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="flex items-center gap-4 justify-between">
          <SidebarMenuItem>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to={href('/agents')}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Agents
              </Link>
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ThemeSwitch />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
