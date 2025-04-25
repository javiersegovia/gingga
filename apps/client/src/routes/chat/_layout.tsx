import { Outlet } from 'react-router'
import { useAuthQuery } from '~/lib/auth/auth.query'
import { authMiddleware } from '~/middleware/auth.middleware'

export const unstable_middleware = [authMiddleware]

export function loader() {
  return {
    // auth: useAuthQuery(),
  }
}

export default function ChatLayout() {
  const { data } = useAuthQuery()
  return (
    <div className="flex h-screen w-screen bg-blue-100">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Outlet />
    </div>
  )
}
