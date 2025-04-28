import type { Route } from './+types/test'
import { Card } from '@gingga/ui/components/card'
import { getCloudflare, getDB } from '~/server/context'
import { Welcome } from '../welcome/welcome'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export async function loader({ }: Route.LoaderArgs) {
  const users = await getDB().query.Users.findMany()
  return {
    message: getCloudflare().env.VALUE_FROM_CLOUDFLARE,
    usersCount: users.length,
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="max-w-md mx-auto">
      <Welcome message={loaderData.message} />
      <Card>
        <p>
          Users count:
          {loaderData.usersCount}
        </p>
      </Card>
    </div>
  )
}
