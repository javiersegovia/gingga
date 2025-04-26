import type { Route } from './+types/update-theme'
import { data } from 'react-router'
import { setTheme, ThemeSchema } from '~/lib/theme.server'

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const colorScheme = ThemeSchema.parse(formData.get('color-scheme'))
  return data(null, {
    headers: { 'Set-Cookie': await setTheme(colorScheme) },
  })
}
