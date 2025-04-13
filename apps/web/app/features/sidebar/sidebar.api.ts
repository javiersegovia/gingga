import { SIDEBAR_COOKIE_NAME } from '@gingga/ui/components/sidebar'
import { createServerFn } from '@tanstack/react-start'
import { getCookie, getEvent } from '@tanstack/react-start/server'

export const $isSidebarOpened = createServerFn({ method: 'GET' }).handler(async () => {
  return getCookie(getEvent(), SIDEBAR_COOKIE_NAME) === 'true'
})
