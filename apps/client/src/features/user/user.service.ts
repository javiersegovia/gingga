import { eq } from '@gingga/db'
import { Users } from '@gingga/db/schema'
import { getDB } from '~/server/context.server'

export async function getUserById(id: string) {
  const db = getDB()
  return await db.query.Users.findFirst({
    where: eq(Users.id, id),
    with: {
      membership: true,
    },
  })
}

export async function getUserByEmail(email: string) {
  const db = getDB()
  return await db.query.Users.findFirst({
    where: eq(Users.email, email),
    with: {
      membership: true,
    },
  })
}
