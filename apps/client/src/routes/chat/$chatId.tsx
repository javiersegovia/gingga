import type { ChatMessage } from '@gingga/db/types'
import type { Attachment, UIMessage } from 'ai'
import type { Route } from './+types/$chatId'

import { getChatById } from '@gingga/api/features/chat/chat.service'
import { href, redirect } from 'react-router'
import { BaseChat } from '~/features/chat/components/base-chat'

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

// export const Route = createFileRoute('/_demo/chat/$chatId')({
//   component: ChatIdRoute,
//   loader: async ({ params }) => {
//     const chat = await $getChatById({ data: { id: params.chatId } })

//     if (!chat) {
//       throw redirect({ to: '/chat' })
//     }

//     return { chat }
//   },
//   staleTime: 10_000,
//   preloadStaleTime: 10_000,
//   preload: true,
// })

export async function loader({ params }: Route.LoaderArgs) {
  const chat = await getChatById({ id: params.chatId })

  if (!chat) {
    return redirect(href('/chat'))
  }

  return { chat }
}

export default function ChatIdRoute({ loaderData }: Route.ComponentProps) {
  const { chat } = loaderData

  return (
    <>
      <BaseChat
        key={chat.id}
        id={chat.id}
        initialMessages={convertToUIMessages(chat.messages)}
        // todo: get from chat
        selectedChatModel="gpt-4o"
        selectedVisibilityType={chat.visibility}
        isReadonly={false}
      />
    </>
  )
}
