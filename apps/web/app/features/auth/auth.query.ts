import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import type { UseSuspenseQueryResult } from '@tanstack/react-query'

import { $getAuthSession, $signOut } from './auth.api'
import { useRouter } from '@tanstack/react-router'
import { AppAuthSession } from './auth.types'

export const authQueryOptions = () =>
  queryOptions({
    queryKey: ['getAuthSession'],
    queryFn: $getAuthSession,
  })

export const useAuthQuery = () => {
  return useSuspenseQuery(authQueryOptions())
}

export const useAuthedQuery = () => {
  const authQuery = useAuthQuery()
  const router = useRouter()

  if (!authQuery.data.isAuthenticated) {
    throw router.navigate({ to: '/identify' })
  }

  return authQuery as UseSuspenseQueryResult<AppAuthSession>
}

// export const useSignOutMutation = (signOutServerFn: () => Promise<void>) => {
export const useSignOutMutation = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => $signOut(),
    onSuccess: async () => {
      await router.invalidate()
      await queryClient.invalidateQueries({ queryKey: authQueryOptions().queryKey })
      await router.navigate({ to: '/' })
    },
  })
}
