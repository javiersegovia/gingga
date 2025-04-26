import type { Context } from 'hono'
import { unstable_createContext } from 'react-router'
import { getContext } from '~/middleware/context-storage.server'

type HonoContextType = Context
export const HonoContext = unstable_createContext<HonoContextType>()

export function getBindings() {
  return getContext().get(HonoContext)
}
