import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useAuthQuery } from '~/features/auth/auth.query'
import {
  $deleteChat,
  $getChatById,
  $getChatModelId,
  $getUserChats,
  $renameChat,
  $updateChatVisibility,
} from './chat.api'

export function chatModelQueryOptions() {
  return queryOptions({
    queryKey: ['chatModel'],
    queryFn: () => $getChatModelId(),
  })
}

export function chatQueryOptions(chatId: string) {
  return queryOptions({
    queryKey: ['chat', chatId],
    queryFn: () => $getChatById({ data: { id: chatId } }),
  })
}

export function useChatQuery(chatId: string) {
  return useQuery({
    ...chatQueryOptions(chatId),
  })
}

export function userChatsQueryOptions() {
  return queryOptions({
    queryKey: ['userChats'],
    queryFn: $getUserChats,
  })
}

export function useUserChatsQuery() {
  const { data: authData } = useAuthQuery()

  return useQuery({
    ...userChatsQueryOptions(),
    enabled: authData?.isAuthenticated,
  })
}

export function useUserChatsSuspenseQuery() {
  return useSuspenseQuery(userChatsQueryOptions())
}

// Chat mutations
export function useRenameChatMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: $renameChat,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userChatsQueryOptions().queryKey })
    },
  })
}

export function useDeleteChatMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: $deleteChat,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userChatsQueryOptions().queryKey })
      await router.invalidate()
    },
  })
}

export function useUpdateChatVisibilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: $updateChatVisibility,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userChatsQueryOptions().queryKey })
    },
  })
}
