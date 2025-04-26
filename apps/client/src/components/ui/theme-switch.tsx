import type { loader as rootLoader } from '~/root'
import type { action as themeAction } from '~/routes/_actions/update-theme'
import { Button } from '@gingga/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@gingga/ui/components/dropdown-menu'
import { Switch } from '@gingga/ui/components/switch'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useCallback } from 'react'
import { href, useFetcher, useRouteLoaderData } from 'react-router'

const THEME_INPUT_NAME = 'color-scheme'
type ThemeMode = 'light' | 'dark' | 'system'

export function ThemeSwitch() {
  const loaderData = useRouteLoaderData<typeof rootLoader>('root')
  const isDark = loaderData?.theme === 'dark'
  const fetcher = useFetcher<typeof themeAction>()

  const handleThemeChange = useCallback(
    (isChecked: boolean) => {
      const formData = new FormData()
      formData.append(THEME_INPUT_NAME, isChecked ? 'dark' : 'light')
      fetcher.submit(formData, {
        method: 'post',
        action: href('/actions/update-theme'),
      })
    },
    [fetcher.submit],
  )

  return (
    <div className="flex items-center justify-center">
      <Switch
        variant="theme"
        checked={isDark}
        onCheckedChange={handleThemeChange}
        thumbIcon="theme"
      />
    </div>
  )
}

export function ThemeMenu(): React.JSX.Element {
  const fetcher = useFetcher<typeof themeAction>()

  const handleThemeChange = useCallback(
    (theme: ThemeMode) => {
      const formData = new FormData()
      formData.append(THEME_INPUT_NAME, theme)

      fetcher.submit(formData, {
        method: 'post',
        action: href('/actions/update-theme'),
      })
    },
    [fetcher.submit],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            aria-hidden="true"
          />
          <MoonIcon
            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            aria-hidden="true"
          />
          <span className="sr-only">Toggle Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => handleThemeChange('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => handleThemeChange('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => handleThemeChange('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
