import type { ChatMessage } from '@gingga/db/types'
import type { Attachment, UIMessage } from 'ai'

export function convertToUIMessages(messages: Array<ChatMessage>): Array<UIMessage> {
  return messages.map(message => ({
    id: message.id,
    parts: message.parts as UIMessage['parts'],
    role: message.role,
    createdAt: message.createdAt,
    content: '',
    experimental_attachments: (message.attachments as Array<Attachment>) ?? [],
  }))
}
