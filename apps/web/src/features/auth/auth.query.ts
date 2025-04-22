import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { useRouter } from '@tanstack/react-router'
import { authClient } from '~/features/auth/auth.client'
import { useTRPC } from '~/lib/trpc'

export function useAuthQuery() {
  const trpc = useTRPC()
  return useSuspenseQuery(trpc.auth.getSession.queryOptions())
}

export function useAuthedQuery() {
  const authQuery = useAuthQuery()
  const router = useRouter()

  if (!authQuery.data?.session) {
    throw router.navigate({ to: '/identify' })
  }

  return authQuery
}

export function useSignOutMutation() {
  const trpc = useTRPC()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: async () => {
      router.invalidate()
      queryClient.invalidateQueries({ queryKey: trpc.auth.getSession.queryKey() })
      router.navigate({ to: '/' })
    },
  })
}
