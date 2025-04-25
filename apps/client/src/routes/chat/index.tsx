import type { Route } from './+types/index'
import { nanoid } from 'nanoid'
import { Suspense } from 'react'
import { BaseChat } from '~/features/chat/components/base-chat'

// export const Route = createFileRoute('/_demo/chat/')({
//   component: ChatLayout,
//   loader: async () => {
//     return {
//       chatId: nanoid(),
//     }
//   },
// })

export function loader() {
  return {
    chatId: nanoid(),
  }
}

export default function ChatLayout({ loaderData }: Route.ComponentProps) {
  // const { chatId } = Route.useLoaderData()
  // Default chat will use just the default starters
  return (
    <Suspense>
      <BaseChat
        key={loaderData.chatId}
        id={loaderData.chatId}
        initialMessages={[]}
        selectedVisibilityType="private"
        isReadonly={false}
        isNewChat
      />
    </Suspense>
  )
}
