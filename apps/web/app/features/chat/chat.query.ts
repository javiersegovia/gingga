import {
  useMutation,
  useQuery,
  useSuspenseQuery,
  queryOptions,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthQuery } from '@/features/auth/auth.query'
import {
  $getUserChats,
  $renameChat,
  $deleteChat,
  $updateChatVisibility,
  $getChatById,
  $getChatModelId,
} from './chat.api'
import { useRouter } from '@tanstack/react-router'

export const chatModelQueryOptions = () => {
  return queryOptions({
    queryKey: ['chatModel'],
    queryFn: () => $getChatModelId(),
  })
}

export const chatQueryOptions = (chatId: string) => {
  return queryOptions({
    queryKey: ['chat', chatId],
    queryFn: () => $getChatById({ data: { id: chatId } }),
  })
}

export const useChatQuery = (chatId: string) => {
  return useQuery({
    ...chatQueryOptions(chatId),
  })
}

export const userChatsQueryOptions = () => {
  return queryOptions({
    queryKey: ['userChats'],
    queryFn: $getUserChats,
  })
}

export const useUserChatsQuery = () => {
  const { data: authData } = useAuthQuery()

  return useQuery({
    ...userChatsQueryOptions(),
    enabled: authData?.isAuthenticated,
  })
}

export const useUserChatsSuspenseQuery = () => {
  return useSuspenseQuery(userChatsQueryOptions())
}

// Chat mutations
export const useRenameChatMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: $renameChat,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userChatsQueryOptions().queryKey })
    },
  })
}

export const useDeleteChatMutation = () => {
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

export const useUpdateChatVisibilityMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: $updateChatVisibility,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userChatsQueryOptions().queryKey })
    },
  })
}
