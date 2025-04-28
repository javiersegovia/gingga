import { eq } from '@gingga/db'
import { Users } from '@gingga/db/schema'
import { getDB } from '~/server/context'

export async function getUserById(id: string) {
  const db = getDB()
  return await db.query.Users.findFirst({
    where: eq(Users.id, id),
    with: {
      membership: true,
    },
  })
}
