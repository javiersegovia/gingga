import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { getEvent } from '@tanstack/react-start/server'
import * as schema from './schema'
import { getServerEnv } from '@/server/env'

export function createDatabaseClient() {
  const env = getServerEnv()
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  })
  return drizzle(client, { schema })
}

export function getDatabase() {
  const event = getEvent()
  return event.context.db
}
