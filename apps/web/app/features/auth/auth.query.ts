import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { $signOut } from './auth.api'
import { useRouter } from '@tanstack/react-router'
import { useTRPC } from '~/lib/trpc'

export const useAuthQuery = () => {
  const trpc = useTRPC()
  return useSuspenseQuery(trpc.auth.getSession.queryOptions())
}

export const useAuthedQuery = () => {
  const authQuery = useAuthQuery()
  const router = useRouter()

  if (!authQuery.data.isAuthenticated) {
    throw router.navigate({ to: '/identify' })
  }

  return authQuery
}

export const useSignOutMutation = () => {
  const trpc = useTRPC()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => $signOut(),
    onSuccess: async () => {
      await router.invalidate()
      await queryClient.invalidateQueries({ queryKey: trpc.auth.getSession.queryKey() })
      await router.navigate({ to: '/' })
    },
  })
}
