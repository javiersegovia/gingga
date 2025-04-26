import { unstable_createContext } from 'react-router'
import { getContext } from '~/middleware/context-storage.server'

interface CloudflareContextType {
  env: Env
  ctx: ExecutionContext
}

export const CloudflareContext = unstable_createContext<CloudflareContextType>()

export function getCFContext() {
  return getContext().get(CloudflareContext)
}

export function getBindings() {
  return getCFContext().env
}
