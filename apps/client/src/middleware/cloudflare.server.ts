import type { DatabaseType } from '@gingga/db'
import { unstable_createContext } from 'react-router'
import { getContext } from '~/middleware/context-storage.server'

interface CloudflareContextType {
  env: Env
  ctx: ExecutionContext
}

export const CloudflareContext = unstable_createContext<CloudflareContextType>()
export const DBContext = unstable_createContext<DatabaseType>()

export function getCFContext() {
  return getContext().get(CloudflareContext)
}

export function getBindings() {
  return getCFContext().env
}
