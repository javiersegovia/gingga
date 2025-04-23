import type { PropsWithChildren } from 'react'
import { useDidUpdate } from '@mantine/hooks'
import { ScriptOnce } from '@tanstack/react-router'
import { outdent } from 'outdent'
import { startTransition, useEffect, useState } from 'react'
import { createContextFactory } from '~/lib/utils'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = Exclude<Theme, 'system'>

const DEFAULT_THEME = 'light' as const

interface ThemeContext {
  value: Theme
  resolved: ResolvedTheme
  set: (theme: Theme) => void
  toggle: () => void
}

const [ThemeContextProvider, useTheme] = createContextFactory<ThemeContext>({
  errorMessage: 'useTheme must be used within a ThemeProvider',
})

function ThemeProvider({ children }: PropsWithChildren) {
  // This must change to system later on, when we enable light mode completely.
  const [theme, _setTheme] = useState<Theme>(DEFAULT_THEME)
  const [resolvedTheme, _setResolvedTheme] = useState<ResolvedTheme>(
    () => getResolvedTheme(theme),
  )

  const setTheme = (theme: Theme) => {
    _setTheme(theme)
    _setResolvedTheme(getResolvedTheme(theme))
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    const storageListener = () => {
      startTransition(() => setTheme(getLocalTheme()))
    }

    storageListener()

    window.addEventListener('storage', storageListener)
    return () => window.removeEventListener('storage', storageListener)
  }, [])

  useDidUpdate(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  useDidUpdate(() => {
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  const context: ThemeContext = {
    value: theme,
    resolved: resolvedTheme,
    set: setTheme,
    toggle: toggleTheme,
  }

  return (
    <ThemeContextProvider value={context}>
      <ScriptOnce>
        {outdent/* js */`
          function initTheme() {
            if (typeof localStorage === 'undefined') return

            const localTheme = localStorage.getItem('theme')
            const preferTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            const resolvedTheme = localTheme === null || localTheme === 'system' ? preferTheme : localTheme

            if (localTheme === null) {
              localStorage.setItem('theme', 'system')
            }

            document.documentElement.dataset.theme = resolvedTheme
            document.documentElement.style.colorScheme = resolvedTheme
          }

          initTheme()
        `}
      </ScriptOnce>
      {children}
    </ThemeContextProvider>
  )
}

function getLocalTheme(): Theme {
  if (typeof localStorage === 'undefined') {
    return 'system'
  }

  const localTheme = localStorage.getItem('theme')
  if (localTheme === null) {
    throw new Error(
      'Can\'t find theme in localStorage. Make sure you wrap the app with ThemeProvider.',
    )
  }

  return localTheme as Theme
}

function getPreferTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getResolvedTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getPreferTheme() : theme
}

export { ThemeProvider, useTheme }
export type { ResolvedTheme, Theme }
