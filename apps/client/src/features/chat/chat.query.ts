import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useRevalidator } from 'react-router'
import { useTRPC } from '~/lib/trpc/react'

export function useGetChatByIdQuery(chatId: string | undefined) {
  const trpc = useTRPC()
  return useQuery(trpc.chat.getChatById.queryOptions({ id: chatId! }, { enabled: !!chatId }))
}

export function useRenameChatMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(trpc.chat.renameChat.mutationOptions({
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [
          trpc.chat.getUserChats.queryKey(),
          trpc.chat.getChatById.queryKey({ id: variables.id }),
        ],
      })
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

      queryClient.removeQueries({ queryKey: trpc.chat.getChatById.queryKey({ id: variables.id }) })
      await queryClient.invalidateQueries({ queryKey: trpc.chat.getUserChats.queryKey() })
      await revalidate()
    },
  }),
  )
}

export function useUpdateChatVisibilityMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(trpc.chat.updateChatVisibility.mutationOptions({
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [
          trpc.chat.getUserChats.queryKey(),
          trpc.chat.getChatById.queryKey({ id: variables.id }),
        ],
      })
    },
  }),
  )
}

export function useDeleteTrailingMessagesMutation() {
  const trpc = useTRPC()
  const { revalidate } = useRevalidator()
  return useMutation(trpc.chat.deleteTrailingMessages.mutationOptions({
    onSuccess: async () => {
      await revalidate()
    },
  }))
}

export function useGetChatMessagesByChatIdQuery(chatId: string | undefined) {
  const trpc = useTRPC()
  return useQuery(trpc.chat.getChatMessagesByChatId.queryOptions({ id: chatId! }, { enabled: !!chatId }))
}
