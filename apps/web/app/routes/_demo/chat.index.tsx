import { createFileRoute } from '@tanstack/react-router'
import { createId } from '@paralleldrive/cuid2'
import { BaseChat } from '@/features/chat/components/base-chat'

export const Route = createFileRoute('/_demo/chat/')({
  component: ChatLayout,
  loader: async () => {
    return {
      chatId: createId(),
    }
  },
})

function ChatLayout() {
  const { chatId } = Route.useLoaderData()

  // Default chat will use just the default starters
  return (
    <BaseChat
      key={chatId}
      id={chatId}
      initialMessages={[]}
      selectedVisibilityType="private"
      isReadonly={false}
      isNewChat
    />
  )
}
