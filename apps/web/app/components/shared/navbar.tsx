import { Link } from '@tanstack/react-router'
import { Button } from '@gingga/ui/components/button'
import { Menu, X, Settings, LogOut, ArrowRightIcon, BotIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@gingga/ui/lib/utils'
import { Separator } from '@gingga/ui/components/separator'
import { ThemeSwitch } from '~/components/ui/theme-switch'
import { useAuthQuery, useSignOutMutation } from '~/features/auth/auth.query'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@gingga/ui/components/navigation-menu'

// Define types for navigation items
export type NavItem = {
  name: string
  href: string
  description?: string
}

export type NavItemWithDropdown = {
  name: string
  href?: string
  items: NavItem[]
}

export type NavigationItem = NavItem | NavItemWithDropdown
export type NavigationItems = NavigationItem[]

// Helper type guard to check if an item has dropdown items
function hasDropdownItems(item: NavigationItem): item is NavItemWithDropdown {
  return 'items' in item && Array.isArray((item as NavItemWithDropdown).items)
}

interface NavbarProps {
  navigation?: NavigationItems
  variant?: 'default' | 'transparent' | 'dark'
}

export function Navbar({ navigation, variant = 'default' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data } = useAuthQuery()
  const { mutateAsync: signOut, isPending: isSigningOut } = useSignOutMutation()

  return (
    <>
      <div className="h-16" />

      {/* Mobile menu overlay - positioned outside the navbar */}
      {isOpen && (
        <div
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 bg-black/80"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={cn(
          'fixed top-0 left-0 z-50 w-full border-b-2',
          variant === 'default'
            ? 'border-border dark:bg-background/80 bg-white dark:backdrop-blur-xl'
            : variant === 'transparent'
              ? 'border-transparent bg-transparent'
              : 'border-border dark:bg-background/80 bg-white dark:backdrop-blur-xl',
        )}
      >
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={`${import.meta.env.VITE_ASSETS_URL || ''}/logo/logo-dark-v2.png`}
                  alt="Logo"
                  className="hidden w-40 dark:block"
                />
                <img
                  src={`${import.meta.env.VITE_ASSETS_URL || ''}/logo/logo-light-v2.png`}
                  alt="Logo"
                  className="w-40 dark:hidden"
                />
              </Link>
            </div>
            {/* Centered Desktop Navigation */}
            {navigation && navigation.length > 0 && (
              <div className="hidden flex-1 justify-center md:flex">
                <NavigationMenu>
                  <NavigationMenuList className="gap-2">
                    {navigation.map((item) => {
                      // Check if item has items (dropdown)
                      if (hasDropdownItems(item)) {
                        return (
                          <NavigationMenuItem key={item.name}>
                            <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground dark:hover:text-foreground text-sm font-medium">
                              {item.name}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {item.href && (
                                  <li className="col-span-2">
                                    <NavigationMenuLink asChild>
                                      <Link
                                        to={item.href}
                                        className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none font-medium no-underline transition-colors outline-none select-none"
                                      >
                                        View All {item.name}
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                )}
                                {item.items.map((subItem) => (
                                  <li key={subItem.name}>
                                    <NavigationMenuLink asChild>
                                      <Link
                                        to={subItem.href}
                                        className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                                      >
                                        <div className="text-sm leading-none font-medium">
                                          {subItem.name}
                                        </div>
                                        {subItem.description && (
                                          <p className="text-muted-foreground line-clamp-2 pt-1 text-sm leading-snug">
                                            {subItem.description}
                                          </p>
                                        )}
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            </NavigationMenuContent>
                          </NavigationMenuItem>
                        )
                      }
                      // Regular navigation item using Button with custom hover styles
                      return (
                        <NavigationMenuItem key={item.name}>
                          <Button
                            variant="ghost"
                            hover="reverse"
                            className="hover:bg-brand-blue hover:text-brand-blue-foreground dark:hover:bg-brand-blue dark:shadow-reverse dark:hover:text-text-brand-blue-foreground"
                            asChild
                          >
                            <Link to={item.href} className="flex gap-2">
                              <span>{item.name}</span>
                            </Link>
                          </Button>
                        </NavigationMenuItem>
                      )
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            )}
            {/* Desktop Buttons */}
            <div className="hidden items-center gap-4 md:flex">
              {!data?.isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    hover="reverse"
                    // className="hover:bg-brand-green hover:text-brand-green-foreground"
                    asChild
                  >
                    <Link to="/identify">Sign in</Link>
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Button
                    // variant="outline"
                    variant="secondary"
                    hover="reverse"
                    // className="hover:bg-secondary hover:text-secondary-foreground dark:hover:text-secondary"
                    asChild
                  >
                    <Link to="/chat">
                      Open Chat
                      <BotIcon size={16} />
                    </Link>
                  </Button>
                </div>
              )}
              <Button variant="primary" className="flex items-center gap-2" asChild>
                <Link to="/contact">
                  Book a call
                  <ArrowRightIcon size={16} />
                </Link>
              </Button>
              <ThemeSwitch />
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn('relative z-50 container md:hidden', isOpen ? 'block' : 'hidden')}
        >
          <Separator className="bg-neutral-800" />
          <div className="space-y-4 pt-4">
            {/* Mobile navigation links */}
            {navigation &&
              navigation.length > 0 &&
              navigation.map((item) => {
                if (hasDropdownItems(item)) {
                  return (
                    <div key={item.name} className="space-y-2">
                      <p className="text-muted-foreground text-center text-base font-medium">
                        {item.name}
                      </p>
                      <div className="flex flex-col gap-2 pl-4">
                        {item.href && (
                          <Link
                            to={item.href}
                            className="text-muted-foreground hover:text-foreground block text-center text-sm transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            View All {item.name}
                          </Link>
                        )}
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="text-muted-foreground hover:text-foreground block text-center text-sm transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                }
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-muted-foreground hover:text-foreground block text-center text-base transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              })}
            <div className="flex flex-col gap-2 pt-2 pb-4">
              <Separator className="my-4 bg-neutral-800" />
              {!data?.isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full py-6 text-lg font-medium"
                    size="lg"
                  >
                    <Link to="/identify">Sign in</Link>
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="pt-2" />
                  <Separator className="bg-neutral-800" />
                  <Link to="/" className="flex items-center justify-start">
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground w-full justify-start text-left"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground w-full justify-start"
                    onClick={async () => await signOut()}
                    disabled={isSigningOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </Button>
                  {/* Added theme switch to mobile menu */}
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-muted-foreground text-sm">Theme</span>
                    <ThemeSwitch />
                  </div>
                </div>
              )}
              <Button
                asChild
                variant="primary"
                className="mt-4 w-full py-6 text-lg"
                size="lg"
              >
                <Link to="/contact">Book a call</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
