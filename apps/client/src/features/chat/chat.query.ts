import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useRevalidator } from 'react-router'
import { useTRPC } from '~/lib/trpc/react'

export function useGetChatByIdQuery(chatId: string | undefined) {
  const trpc = useTRPC()
  // Use the getChatById procedure
  return useQuery(trpc.chat.getChatById.queryOptions({ id: chatId! }, { enabled: !!chatId }))
}

// Query Hook for user chats (replaces userChatsQueryOptions + useUserChatsQuery)
export function useGetUserChatsQuery() {
  const trpc = useTRPC()
  // Use the getUserChats procedure. Auth state is handled by protectedProcedure.
  return useQuery(trpc.chat.getUserChats.queryOptions())
}

// Mutation Hook for renaming a chat (replaces useRenameChatMutation)
export function useRenameChatMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(trpc.chat.renameChat.mutationOptions({
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: trpc.chat.getUserChats.queryKey() })
      queryClient.invalidateQueries({ queryKey: trpc.chat.getChatById.queryKey({ id: variables.id }) })
    },
  }),
  )
}

export function useDeleteChatMutation() {
  const queryClient = useQueryClient()
  const { revalidate } = useRevalidator()
  const trpc = useTRPC()
  return useMutation(trpc.chat.deleteChat.mutationOptions({
    onSuccess: async (data, variables) => {
      if (!data.success)
        return
      queryClient.invalidateQueries({ queryKey: trpc.chat.getUserChats.queryKey() })
      queryClient.removeQueries({ queryKey: trpc.chat.getChatById.queryKey({ id: variables.id }) })
      revalidate()
    },
  }),
  )
}

export function useUpdateChatVisibilityMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(trpc.chat.updateChatVisibility.mutationOptions({
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: trpc.chat.getUserChats.queryKey() })
      queryClient.invalidateQueries({ queryKey: trpc.chat.getChatById.queryKey({ id: variables.id }) })
    },
  }),
  )
}

// Add hook for deleteTrailingMessages if needed
export function useDeleteTrailingMessagesMutation() {
  const trpc = useTRPC()
  const { revalidate } = useRevalidator()
  return useMutation(trpc.chat.deleteTrailingMessages.mutationOptions({
    onSuccess: () => {
      revalidate()
    },
  }))
}

// Add hook for getChatMessagesByChatId if needed
export function useGetChatMessagesByChatIdQuery(chatId: string | undefined) {
  const trpc = useTRPC()
  return useQuery(trpc.chat.getChatMessagesByChatId.queryOptions({ id: chatId! }, { enabled: !!chatId }))
}
