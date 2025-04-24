import { useMutation } from "@tanstack/react-query"
import { useRevalidator, useNavigate, href } from "react-router"
import { authClient } from "~/lib/auth/auth-client"

export function useSignOutMutation() {
  const r = useRevalidator()
  const navigate = useNavigate()
  // const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: async () => {
      r.revalidate()
      // queryClient.invalidateQueries({ queryKey: trpc.auth.getSession.queryKey() })
      navigate(href('/'))
    },
  })
}
