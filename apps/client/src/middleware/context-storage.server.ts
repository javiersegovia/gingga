import type { BetterAuth } from '@gingga/api/lib/auth/auth.service'
import type { DatabaseType } from '@gingga/db'
import type { Session, User } from 'better-auth'
import type { unstable_MiddlewareFunction, unstable_RouterContextProvider } from 'react-router'
import { AsyncLocalStorage } from 'node:async_hooks'
import { createServerAuth } from '@gingga/api/lib/auth/auth.service'
import { createDatabaseClient } from '@gingga/db'
import { webEnv } from '~/lib/env.server'

export type AuthSession = {
  isAuthenticated: boolean
  session: Session
  user: User
} | {
  isAuthenticated: false
}

const storage = new AsyncLocalStorage<{
  request: Request
  context: unstable_RouterContextProvider
  db?: DatabaseType
  betterAuth?: BetterAuth
  authSession?: AuthSession
}>()

export const contextStorageMiddleware: unstable_MiddlewareFunction = ({ request, context }, next) => {
  return storage.run({ request, context }, next)
}

function getStore() {
  const store = storage.getStore()
  if (!store) {
    throw new Error('Store not found. Remember to setup the contextStorageMiddleware.')
  }
  return store
}

export function getRequest() {
  return getStore().request
}

export function getContext() {
  return getStore().context
}

export function getDB() {
  const store = getStore()
  if (!store.db) {
    store.db = createDatabaseClient()
  }
  return store.db
}

export function getBetterAuth() {
  const store = getStore()
  if (!store.betterAuth) {
    store.betterAuth = createServerAuth(getDB(), webEnv)
  }
  return store.betterAuth
}

export async function getAuthSession(): Promise<AuthSession> {
  const store = getStore()

  if (!store.authSession) {
    const auth = getBetterAuth()
    const request = getRequest()
    const data = await auth.api.getSession({
      headers: request.headers,
    })

    store.authSession = data ? { isAuthenticated: true, session: data.session, user: data.user } : { isAuthenticated: false }
  }

  return store.authSession
}
