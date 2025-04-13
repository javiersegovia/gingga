import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  $getUsers,
  $getUserDetails,
  $updateUser,
  $deleteUser,
  $banUser,
  $unbanUser,
  $impersonateUser,
} from './user.api'
import type {
  UpdateUserInput,
  BanUserInput,
  UserIdInput,
  UserDetails,
} from './user.schema'

// Query Key Factory
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// Query Options
export const usersQueryOptions = queryOptions({
  queryKey: userKeys.lists(),
  queryFn: () => $getUsers(),
})

export const userDetailsQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: userKeys.detail(userId),
    queryFn: () => $getUserDetails({ data: { userId } }),
    enabled: !!userId, // Only run if userId is provided
  })

// Mutations
export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation<UserDetails, Error, UpdateUserInput>({
    mutationFn: async (userData) => {
      return $updateUser({ data: userData })
    },
    onSuccess: (data) => {
      // Invalidate user list and specific user detail queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation<{ success: boolean }, Error, UserIdInput>({
    mutationFn: async ({ userId }) => {
      return $deleteUser({ data: { userId } })
    },
    onSuccess: (data, variables) => {
      // Invalidate user list query
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      // Remove the specific user detail query from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(variables.userId) })
    },
  })
}

export function useBanUser() {
  const queryClient = useQueryClient()
  return useMutation<{ success: boolean }, Error, BanUserInput>({
    mutationFn: async (banData) => {
      return $banUser({ data: banData })
    },
    onSuccess: (data, variables) => {
      // Invalidate lists and details
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) })
    },
  })
}

export function useUnbanUser() {
  const queryClient = useQueryClient()
  return useMutation<{ success: boolean }, Error, UserIdInput>({
    mutationFn: async ({ userId }) => {
      return $unbanUser({ data: { userId } })
    },
    onSuccess: (data, variables) => {
      // Invalidate lists and details
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) })
    },
  })
}

export function useImpersonateUser() {
  return useMutation<void, Error, UserIdInput>({
    mutationFn: async ({ userId }) => {
      await $impersonateUser({ data: { userId } })
    },
    onSuccess: (data, variables) => {
      console.log(`Successfully initiated impersonation for ${variables.userId}`)
      // Potentially trigger a page reload or redirect here
      // window.location.reload();
    },
    onError: (error, variables) => {
      console.error(`Failed to impersonate user ${variables.userId}:`, error)
      // Display error notification to the user
    },
  })
}
