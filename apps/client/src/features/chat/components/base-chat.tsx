import type { ToolName } from '@gingga/api/features/skills/skill.types'
import type { Attachment, UIMessage } from 'ai'
import type { VisibilityType } from './visibility-selector'
import { useChat } from '@ai-sdk/react'
import { toolsRequiringConfirmation } from '@gingga/api/features/skills/skill.info'
import { useQueryClient } from '@tanstack/react-query'
// import { useLinkProps } from '@tanstack/react-router'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { href } from 'react-router'
import { toast } from 'sonner'
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
  // selectedChatModel,
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
  isAgent?: boolean
}) {
  const newChatHref = href('/chat/:chatId', { chatId: id })
  const newAgentChatHref = href('/chat/agent/:agentId/chat/:chatId', { agentId: agentId ?? '', chatId: id })
  const trpc = useTRPC()

  const { data: authData } = useAuthQuery()
  const queryClient = useQueryClient()
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
    streamProtocol: 'data',
    api: endpoint,
    body: { id, agentId, modelId: undefined },
    sendExtraMessageFields: true,
    credentials: 'include',
    // experimental_throttle: 200,
    generateId: nanoid,
    initialMessages,
    onResponse: (response) => {
      if (isNewChat && response.ok) {
        if (authData?.session) {
          queryClient.invalidateQueries({ queryKey: trpc.chat.getUserChats.queryKey() })
          queryClient.invalidateQueries({
            queryKey: trpc.agent.getRecentChatsWithAgents.queryKey(),
          })
        }

        const targetHref = agentId ? newAgentChatHref : newChatHref
        window.history.replaceState({}, '', targetHref)
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
          // selectedModelId={selectedChatModel}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
          hasMessages={messages.length > 0}
        />

        <Messages
          chatId={id}
          agentId={agentId}
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
