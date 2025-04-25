import type { Route } from './+types/index'
import { nanoid } from 'nanoid'
import { Suspense } from 'react'
import { BaseChat } from '~/features/chat/components/base-chat'
import { webEnv } from '~/lib/env.server'

export function loader() {
  return {
    chatId: nanoid(),
    endpoint: `${webEnv.VITE_API_URL}/api/chat/default`,
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
