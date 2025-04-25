import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
  useUpdateChatVisibilityMutation,
} from '~/features/chat/chat.query'
import { useTRPC } from '~/lib/trpc/react'

export type VisibilityType = 'private' | 'public'

interface Chat {
  id: string
  visibility: VisibilityType
  userId: string | null
  title: string | null
  createdAt: Date
  updatedAt: Date | null
}

export function useChatVisibility({
  chatId,
  initialVisibility,
}: {
  chatId: string
  initialVisibility: VisibilityType
}) {
  const [localVisibility, setLocalVisibility]
    = useState<VisibilityType>(initialVisibility)

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const history = queryClient.getQueryData(trpc.chat.getUserChats.queryKey())
  // setLocalVisibility(queryClient.setQueryData([`${chatId}-visibility`], initialVisibility))

  const visibilityType = useMemo(() => {
    if (!history)
      return localVisibility
    const chat = history.find((chat: Chat) => chat.id === chatId)
    if (!chat)
      return 'private'
    return chat.visibility
  }, [history, chatId, localVisibility])

  // Create the mutation function for updating visibility
  const { mutateAsync, isPending } = useUpdateChatVisibilityMutation()

  // Define our optimistic update function
  const setVisibilityType = async (updatedVisibilityType: VisibilityType) => {
    const previousChatsData = queryClient.getQueryData(trpc.chat.getUserChats.queryKey())
    setLocalVisibility(updatedVisibilityType)

    if (previousChatsData) {
      queryClient.setQueryData(
        trpc.chat.getUserChats.queryKey(),
        previousChatsData.map(chat =>
          chat.id === chatId ? { ...chat, visibility: updatedVisibilityType } : chat,
        ),
      )
    }

    try {
      // Run the actual mutation
      await mutateAsync({
        id: chatId,
        visibility: updatedVisibilityType,
      })
    }
    catch (error) {
      // If the mutation fails, roll back to the previous values
      setLocalVisibility(visibility =>
        visibility === 'private' ? 'public' : 'private',
      )

      if (previousChatsData) {
        queryClient.setQueryData(trpc.chat.getUserChats.queryKey(), previousChatsData)
      }

      // Rethrow the error for further handling
      throw error
    }
    finally {
      queryClient.invalidateQueries({
        queryKey: trpc.chat.getUserChats.queryKey(),
      })
    }
  }

  return {
    visibilityType,
    setVisibilityType,
    isUpdatingVisibility: isPending,
  }
}
