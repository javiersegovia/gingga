import type { Attachment, UIMessage } from 'ai'
import type { VisibilityType } from './visibility-selector'
import type { ToolName } from '~/features/tools/tool.types'
import { useChat } from '@ai-sdk/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { href } from 'react-router'
import { toast } from 'sonner'
import { toolsRequiringConfirmation } from '~/features/tools/tool.info'
import { useAuthQuery } from '~/lib/auth/auth.query'
import { useTRPC } from '~/lib/trpc/react'
import { ChatHeader } from './chat-header'
import { ChatInputProvider } from './chat-input-context'
import { Messages } from './messages/messages'
import { MultimodalInput } from './multimodal-input'
import { useScrollToBottom } from './use-scroll-to-bottom'

export function BaseChat({
  id,
  endpoint = '/api/chat/default',
  agentId,
  initialMessages,
  selectedVisibilityType,
  isReadonly,
  isNewChat = false,
}: {
  id: string
  endpoint?: string
  agentId?: string
  initialMessages: Array<UIMessage>
  selectedChatModel?: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
  isNewChat?: boolean
}) {
  const trpc = useTRPC()

  const { data: authData } = useAuthQuery()
  const queryClient = useQueryClient()
  const { data: agent } = useQuery(trpc.agent.getAgentById.queryOptions({ id: agentId ?? '' }, { enabled: !!agentId }))

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
    addToolResult,
  } = useChat({
    id,
    api: endpoint,
    body: { id, agentId },
    sendExtraMessageFields: true,
    credentials: 'include',
    generateId: nanoid,
    initialMessages,
    onResponse: async (response) => {
      if (isNewChat && response.ok) {
        if (authData?.isAuthenticated) {
          void queryClient.invalidateQueries({ queryKey: trpc.chat.getUserChats.queryKey() })
          void queryClient.invalidateQueries({ queryKey: trpc.agent.getRecentChatsWithAgents.queryKey() })
          void queryClient.invalidateQueries({ queryKey: trpc.chat.getChatsByAgentId.queryKey({ agentId }) })
        }

        window.history.replaceState({}, '', href('/agent/:agentId/chat/:chatId', { agentId: agentId ?? '', chatId: id }))
      }
    },
    onError: (error) => {
      console.error('useChat onError:', error)
      toast.error('An error occurred, please try again!', {
        description: error?.message || 'Could not complete the request.',
      })
    },
  })

  const [attachments, setAttachments] = useState<Array<Attachment>>([])
  // const isArtifactVisible = useArtifactSelector((state) => state.isVisible)

  const [messagesContainerRef, messagesEndRef, scrollUtils]
    = useScrollToBottom<HTMLDivElement>()

  // // todo: move to custom hook
  const pendingToolCallConfirmation = messages.some(m =>
    m.parts?.some(
      part =>
        part.type === 'tool-invocation'
        && part.toolInvocation.state === 'call'
        && toolsRequiringConfirmation.includes(part.toolInvocation.toolName as ToolName),
    ),
  )

  return (
    <ChatInputProvider>
      <div className="bg-background relative flex h-full max-h-dvh min-w-0 flex-col">
        <ChatHeader
          chatId={id}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
          hasMessages={messages.length > 0}
        />

        <Messages
          chatId={id}
          agentId={agentId}
          agentImage={agent?.image}
          status={status}
          // votes={votes}
          messages={messages}
          setMessages={setMessages}
          append={append}
          setInput={setInput}
          addToolResult={addToolResult}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={false}
          messagesEndRef={messagesEndRef}
          messagesContainerRef={messagesContainerRef}
          scrollUtils={scrollUtils}
        />

        <form className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 mx-auto flex w-full flex-col justify-center gap-2">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
              hasPendingToolCallConfirmation={pendingToolCallConfirmation}
            />
          )}
        </form>
      </div>

      {/* <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      /> */}
    </ChatInputProvider>
  )
}
