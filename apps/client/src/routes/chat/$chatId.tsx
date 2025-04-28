import type { ChatMessage } from '@gingga/db/types'
import type { Attachment, UIMessage } from 'ai'
import type { Route } from './+types/$chatId'

import { href, redirect } from 'react-router'
import { getChatById } from '~/features/chat/chat.service'
import { BaseChat } from '~/features/chat/components/base-chat'
import { webEnv } from '~/lib/env.server'

function convertToUIMessages(messages: Array<ChatMessage>): Array<UIMessage> {
  return messages.map(message => ({
    id: message.id,
    parts: message.parts as unknown as UIMessage['parts'],
    role: message.role,
    createdAt: message.createdAt,
    content: '',
    experimental_attachments: (message.attachments as Array<Attachment>) ?? [],
  }))
}

export async function loader({ params }: Route.LoaderArgs) {
  const chat = await getChatById({ id: params.chatId })

  if (!chat) {
    return redirect(href('/chat'))
  }

  return { chat, endpoint: `${webEnv.VITE_SITE_URL}/api/chat/default` }
}

export default function ChatIdRoute({ loaderData }: Route.ComponentProps) {
  const { chat, endpoint } = loaderData

  return (
    <>
      <BaseChat
        key={chat.id}
        id={chat.id}
        initialMessages={convertToUIMessages(chat.messages)}
        selectedVisibilityType={chat.visibility}
        isReadonly={false}
        endpoint={endpoint}
      />
    </>
  )
}
