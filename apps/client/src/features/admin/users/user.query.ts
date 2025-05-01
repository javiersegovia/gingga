import type {
  UserDetails,
} from './user.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '~/lib/trpc/react'

export function useGetUserDetailsQuery(userId: string | undefined) {
  const trpc = useTRPC()
  return useQuery(
    trpc.user.getUserDetails.queryOptions({ userId: userId! }, { enabled: !!userId }),
  )
}

// Mutations using tRPC
export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(
    trpc.user.updateUser.mutationOptions({
      onSuccess: async (updatedUser: UserDetails) => {
        await queryClient.invalidateQueries({
          queryKey: [trpc.user.getUsers.queryKey(), trpc.user.getUserDetails.queryKey({ userId: updatedUser.id })],
        })
      },
    }),
  )
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(
    trpc.user.deleteUser.mutationOptions({
      onSuccess: async (data, variables) => {
        if (!data.success)
          return

        queryClient.removeQueries({
          queryKey: trpc.user.getUserDetails.queryKey({ userId: variables.userId }),
        })
        await queryClient.invalidateQueries({
          queryKey: trpc.user.getUsers.queryKey(),
        })
      },
    }),
  )
}

export function useBanUserMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(
    trpc.user.banUser.mutationOptions({
      onSuccess: async (data, variables) => {
        if (!data.success)
          return
        await queryClient.invalidateQueries({
          queryKey: [trpc.user.getUsers.queryKey(), trpc.user.getUserDetails.queryKey({ userId: variables.userId })],
        })
      },
    }),
  )
}

export function useUnbanUserMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(
    trpc.user.unbanUser.mutationOptions({
      onSuccess: async (data, variables) => {
        if (!data.success)
          return
        await queryClient.invalidateQueries({
          queryKey: [trpc.user.getUsers.queryKey(), trpc.user.getUserDetails.queryKey({ userId: variables.userId })],
        })
      },
    }),
  )
}

export function useImpersonateUserMutation() {
  const trpc = useTRPC()
  return useMutation(
    trpc.user.impersonateUser.mutationOptions({
      onSuccess: (data) => {
        if (!data.success)
          return
        window.location.reload()
      },
      onError: (error) => {
        console.error('Failed to impersonate user:', error)
      },
    }),
  )
}
