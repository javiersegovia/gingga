// import type { AuthSession, Context } from '@gingga/api/context'
// import type { BetterAuth } from '@gingga/api/lib/auth/auth.service'
// import type { DatabaseType } from '@gingga/db'
// import type { unstable_MiddlewareFunction, unstable_RouterContextProvider } from 'react-router'
// import { AsyncLocalStorage } from 'node:async_hooks'
// import { createContext as createAPIContext } from '@gingga/api/context'
// import { createServerAuth } from '@gingga/api/lib/auth/auth.service'
// import { createDatabaseClient } from '@gingga/db'
// import { getContext as getHonoContext } from 'hono/context-storage'
// import { webEnv } from '~/lib/env.server'

// const storage = new AsyncLocalStorage<{
//   request: Request
//   context: unstable_RouterContextProvider
//   db?: DatabaseType
//   betterAuth?: BetterAuth
//   apiContext?: Context
//   authSession?: AuthSession
// }>()

// // export const contextStorageMiddleware: unstable_MiddlewareFunction = ({ request, context }, next) => {
// //   return storage.run({ request, context }, next)
// // }

// // function getStore() {
// //   const store = storage.getStore()
// //   if (!store) {
// //     throw new Error('Store not found. Remember to setup the contextStorageMiddleware.')
// //   }
// //   return store
// // }

// // export function getRequest() {
// //   return getStore().request
// // }

// // export function getContext() {
// //   return getStore().context
// // }

// // export function getDB() {
// //   const store = getStore()
// //   if (!store.db) {
// //     store.db = createDatabaseClient()
// //   }
// //   return store.db
// // }

// // export function getBetterAuth() {
// //   const store = getStore()
// //   if (!store.betterAuth) {
// //     store.betterAuth = createServerAuth(getDB(), webEnv)
// //   }
// //   return store.betterAuth
// // }

// // export async function getAPIContext() {
// //   const c = getHonoContext()
// //   const store = getStore()
// //   if (!store.apiContext) {
// //     store.apiContext = await createAPIContext(c)
// //   }
// //   return store.apiContext
// // }

// // export async function getTRPC() {
// //   const queryClient = getQueryClient()

// //   return createTRPCOptionsProxy({
// //     ctx: await getAPIContext(),
// //     queryClient,
// //     router: appRouter,

// //   })
// // }

// // export async function getAuthSession(): Promise<AuthSession> {
// //   const store = getStore()

// //   if (!store.authSession) {
// //     const apiContext = await getAPIContext()
// //     store.authSession = apiContext?.authSession
// //   }

// //   return store.authSession
// // }
