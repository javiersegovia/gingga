import { createServerFn } from '@tanstack/react-start'
import { getCookie, getEvent } from '@tanstack/react-start/server'
import { SIDEBAR_COOKIE_NAME } from '~/components/ui/sidebar'

const SIDEBAR_DEFAULT_STATE = true
export const $isSidebarOpened = createServerFn({ method: 'GET' }).handler(async () => {
  const cookieValue = getCookie(getEvent(), SIDEBAR_COOKIE_NAME)
  if (cookieValue === undefined) {
    return SIDEBAR_DEFAULT_STATE
  }
  return cookieValue === 'true'
})
