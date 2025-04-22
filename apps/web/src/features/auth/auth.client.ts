import { createAuthClient } from 'better-auth/react'

// export const authClient = createAuthClient({
//   baseURL: import.meta.env.VITE_PUBLIC_API_URL,
//   basePath: '/auth',
//   plugins: [inferAdditionalFields<typeof auth>()],
// })

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SITE_URL,
  fetchOptions: {
    onResponse: async () => {
      if (typeof window !== 'undefined') {
        await window.getRouter().invalidate()
        // await window.getQueryClient().invalidateQueries(authQueryOptions())
      }
    },
  },
  // plugins: [usernameClient(), adminClient()],
})
