import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.ENV.VITE_API_URL : '',
  fetchOptions: {
    credentials: 'include',
    // onResponse: async () => {
    //   if (typeof window !== 'undefined') {
    //     await window.getRouter().invalidate()
    //     // await window.getQueryClient().invalidateQueries(authQueryOptions())
    //   }
    // },
  },
  // plugins: [usernameClient(), adminClient()],
})
