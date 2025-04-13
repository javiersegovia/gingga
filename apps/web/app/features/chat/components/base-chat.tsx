import type { Attachment, UIMessage } from 'ai'
import { useChat } from '@ai-sdk/react'
import { useState } from 'react'
import { MultimodalInput } from './multimodal-input'
import { Messages } from './messages/messages'
import { VisibilityType } from './visibility-selector'
import { nanoid } from 'nanoid'
import { useQueryClient } from '@tanstack/react-query'
import { userChatsQueryOptions } from '../chat.query'
import { useLinkProps } from '@tanstack/react-router'
import { useScrollToBottom } from './use-scroll-to-bottom'
import { ChatInputProvider } from './chat-input-context'
import { ChatHeader } from './chat-header'
import { useAuthQuery } from '@/features/auth/auth.query'
import { recentChatsWithAgentsQueryOptions } from '@/features/agent/agent.query'
import { toast } from 'sonner'
import { ToolName } from '../../ai/skills/skill.types'
import { toolsRequiringConfirmation } from '../../ai/skills/info'

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
  const newChatHref = useLinkProps({
    to: '/chat/$chatId',
    params: { chatId: id },
  }).href

  const newAgentChatHref = useLinkProps({
    to: '/chat/agent/$agentId/chat/$chatId',
    params: { agentId: agentId ?? '', chatId: id },
  }).href

  // const router = useRouter()

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
    // experimental_throttle: 200,
    generateId: nanoid,
    initialMessages,
    onResponse: (response) => {
      if (authData?.isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: userChatsQueryOptions().queryKey })
        queryClient.invalidateQueries({
          queryKey: recentChatsWithAgentsQueryOptions().queryKey,
        })
      }

      if (isNewChat && response.ok) {
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

  const [messagesContainerRef, messagesEndRef, scrollUtils] =
    useScrollToBottom<HTMLDivElement>()

  // // todo: move to custom hook
  const pendingToolCallConfirmation = messages.some((m) =>
    m.parts?.some(
      (part) =>
        part.type === 'tool-invocation' &&
        part.toolInvocation.state === 'call' &&
        toolsRequiringConfirmation.includes(part.toolInvocation.toolName as ToolName),
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
          {/* </section> */}
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
