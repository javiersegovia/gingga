import { useMutation } from '@tanstack/react-query'
import { href, useNavigate } from 'react-router'
import { authClient } from '~/lib/auth/auth-client'

export function useSignOutMutation() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authClient.signOut(),
    onSettled() {
      navigate(href('/'))
    },
  })
}
