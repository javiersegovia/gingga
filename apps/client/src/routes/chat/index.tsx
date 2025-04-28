import type { Route } from './+types/index'
import { nanoid } from 'nanoid'
import { Suspense } from 'react'
import { BaseChat } from '~/features/chat/components/base-chat'

export function loader() {
  return {
    chatId: nanoid(),
    endpoint: `/api/chat/default`,
  }
}

export default function ChatLayout({ loaderData }: Route.ComponentProps) {
  return (
    <Suspense>
      <BaseChat
        key={loaderData.chatId}
        id={loaderData.chatId}
        initialMessages={[]}
        endpoint={loaderData.endpoint}
        selectedVisibilityType="private"
        isReadonly={false}
        isNewChat
      />
    </Suspense>
  )
}
