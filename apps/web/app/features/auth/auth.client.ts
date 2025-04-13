import { createAuthClient } from 'better-auth/react'
import { authQueryOptions } from './auth.query'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SITE_URL,
  fetchOptions: {
    // https://discord.com/channels/1288403910284935179/1288403910284935182/1311199374793244703
    onResponse: async () => {
      await window.getRouter().invalidate()
      await window.getQueryClient().invalidateQueries(authQueryOptions())
    },
  },
  // plugins: [usernameClient(), adminClient()],
})
