import type { loader as rootLoader } from '~/root'
import type { action as themeAction } from '~/routes/_actions/update-theme'
import { useCallback, useState } from 'react'
import { href, useFetcher, useRouteLoaderData } from 'react-router'

export const THEME_INPUT_NAME = 'color-scheme'
export type ThemeMode = 'light' | 'dark' | 'system'

export function useColorScheme(): [ThemeMode, (value: ThemeMode) => void] {
  const loaderData = useRouteLoaderData<typeof rootLoader>('root')
  const fetcher = useFetcher<typeof themeAction>()
  const [color, setColor] = useState<ThemeMode>(loaderData?.theme ?? 'system')

  const setColorScheme = useCallback(
    (value: ThemeMode) => {
      setColor(value)

      document.documentElement.classList.remove('dark', 'light', 'system')
      document.documentElement.classList.add(value)

      const formData = new FormData()
      formData.append(THEME_INPUT_NAME, value)
      fetcher.submit(formData, {
        method: 'post',
        action: href('/actions/update-theme'),
      })
    },
    [fetcher.submit],
  )

  return [color, setColorScheme]
}
