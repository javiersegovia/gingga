import { createCookie } from 'react-router'
import { createTypedCookie } from 'remix-utils/typed-cookie'
import { z } from 'zod'
import { getRequest } from '~/middleware/context-storage.server'

export const ThemeSchema = z
  .enum(['dark', 'light', 'system']) // Possible color schemes
  .default('system') // If there's no cookie, default to "system"
  .catch('system') // In case of an error, default to "system"

export const THEME_COOKIE_NAME = 'color-scheme' as const
export type Theme = z.infer<typeof ThemeSchema>
const cookie = createCookie(THEME_COOKIE_NAME, {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secrets: [process.env.COOKIE_SECRET ?? 'secret'],
})

const typedCookie = createTypedCookie({ cookie, schema: ThemeSchema })

export async function getTheme() {
  const currentTheme = getRequest().headers.get('Cookie')
  const colorScheme = await typedCookie.parse(currentTheme)
  return colorScheme ?? 'system' // Default to "system" if no cookie is found
}

export async function setTheme(themeColor: Theme) {
  return await typedCookie.serialize(themeColor)
}
