import type { Attachment, UIMessage } from 'ai'
import type { AgentType } from '~/features/agent/agent.types'
import type { VisibilityType } from '~/features/chat/components/visibility-selector'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { BaseChat } from './base-chat-agent'
import { ChatHeader } from './chat-header'
import { ChatInputProvider } from './chat-input-context'
import { MultimodalInput } from './multimodal-input-agent'

interface ChatContainerProps {
  agentId: string
  agentType: AgentType
  chatId: string | null
  chatVisibility?: VisibilityType
  isReadonly: boolean
}

export function ChatContainer({
  agentId,
  agentType,
  chatId: defaultChatId = null,
  chatVisibility = 'private',
  isReadonly = false,
}: ChatContainerProps) {
  const [chatId, setChatId] = useState<string | null>(defaultChatId)
  const [initialMessages, setInitialMessages] = useState<Array<UIMessage>>([])
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<Array<Attachment>>([])

  function handleFirstSubmit(e?: {
    preventDefault?: () => void
  }) {
    e?.preventDefault?.()

    if (!input.trim() && attachments.length === 0) {
      return
    }

    const newChatId = nanoid()
    const firstUserMessage: UIMessage = {
      id: nanoid(),
      role: 'user',
      content: input,
      parts: [{ type: 'text', text: input }],
      ...(attachments && attachments.length > 0 && {
        experimental_attachments: attachments,
      }),
    }

    setChatId(newChatId)
    setInitialMessages([firstUserMessage])
    setInput('')
    setAttachments([])
  }

  return (
    <ChatInputProvider>
      <div className="bg-background relative flex h-full max-h-dvh min-w-0 flex-col">
        <ChatHeader
          chatId={chatId}
          selectedVisibilityType={chatVisibility}
          isReadonly={isReadonly}
          hasMessages={initialMessages.length > 0}
        />

        {!chatId ? (
          <div className="flex flex-1 flex-col justify-end p-4">
            <form
              onSubmit={handleFirstSubmit}
              className="flex w-full flex-col justify-center gap-2"
            >
              <MultimodalInput
                chatId=""
                input={input}
                setInput={setInput}
                handleSubmit={handleFirstSubmit}
                status="ready"
                stop={() => {}}
                attachments={attachments}
                setAttachments={setAttachments}
                messages={[]}
                setMessages={() => {}}
                append={async () => null}
              />
            </form>
          </div>
        ) : (
          <BaseChat
            key={chatId}
            chatId={chatId}
            agentId={agentId}
            agentType={agentType}
            initialMessages={initialMessages}
            selectedVisibilityType={chatVisibility}
            isReadonly={isReadonly}
          />
        )}
      </div>
    </ChatInputProvider>
  )
}
