import { createAuthClient } from 'better-auth/react'

// export const authClient = createAuthClient({
//   baseURL: import.meta.env.VITE_PUBLIC_API_URL,
//   basePath: '/auth',
//   plugins: [inferAdditionalFields<typeof auth>()],
// })

console.log('import.meta.env.VITE_API_URL')
console.log(import.meta.env.VITE_API_URL)

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
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
