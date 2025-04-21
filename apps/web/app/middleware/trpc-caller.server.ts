import type { Context as APITrpcContext } from '@gingga/api/src/context'
import type { AppAuthSession } from '@gingga/api/src/lib/auth/auth.types'
import type { Session as BetterAuthSessionData } from 'better-auth'
import { createServerAuth } from '@gingga/api/src/lib/auth/auth.service'
import { createCallerFactory } from '@gingga/api/src/trpc'
import { appRouter } from '@gingga/api/src/trpc/routers'
import { createDatabaseClient, eq } from '@gingga/db'
import { UserMemberships, Users } from '@gingga/db/schema'
import { getEvent, getWebRequest } from '@tanstack/react-start/server'

// Context creation specifically for the web server caller
async function createWebTrpcContext(): Promise<Partial<APITrpcContext>> {
  const event = getEvent()
  const db = event.context.db || createDatabaseClient() // Reuse DB from event if available
  const auth = createServerAuth()

  const req = getWebRequest()

  if (!req) {
    throw new Error('No request found')
  }
  const headers = req.headers

  const betterAuthSession = await auth.api.getSession({
    headers,
  })

  const userId = betterAuthSession?.user?.id
  let authSession: AppAuthSession

  if (!userId) {
    authSession = { isAuthenticated: false }
  }
  else {
    const [user, membership] = await Promise.all([
      db.select().from(Users).where(eq(Users.id, userId)).get(),
      db
        .select()
        .from(UserMemberships)
        .where(eq(UserMemberships.userId, userId))
        .get(),
    ])

    if (user) {
      authSession = {
        isAuthenticated: true,
        session: betterAuthSession.session as BetterAuthSessionData,
        user,
        membership: membership ?? null,
      }
    }
    else {
      authSession = { isAuthenticated: false }
    }
  }

  // Return only the necessary parts for the caller context
  return {
    db,
    auth,
    authSession,
    headers, // Pass headers if needed by procedures
  }
}

// Create the caller instance
const createCaller = createCallerFactory(appRouter)

// Modify to return both caller and authSession
export async function getTrpcCallerAndSession() {
  const context = await createWebTrpcContext()
  const caller = createCaller(context as APITrpcContext)
  return { caller, authSession: context.authSession as AppAuthSession }
}
