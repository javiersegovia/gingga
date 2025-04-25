import { useMutation, useQuery } from '@tanstack/react-query'
import { href, useNavigate } from 'react-router'
import { authClient } from '~/lib/auth/auth-client'
import { useTRPC } from '~/lib/trpc/react'

export function useAuthQuery() {
  const trpc = useTRPC()
  return useQuery(trpc.auth.getSession.queryOptions())
}

export function useSignOutMutation() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authClient.signOut(),
    onSettled() {
      navigate(href('/'))
    },
  })
}
