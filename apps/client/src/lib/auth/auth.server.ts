import { href, redirect } from "react-router"
import { getAuthSession } from "~/middleware/context-storage.server"

export async function requireAuthSession() {
  const session = await getAuthSession()
  if (!session?.isAuthenticated) {
    throw redirect(href('/identify'), 302)
  }
  return session
}

export async function requireAnonymous() {
  const session = await getAuthSession()
  if (session.isAuthenticated) {
    throw redirect(href('/chat'), 302)
  }
  return session
}