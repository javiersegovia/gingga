import type { Attachment, UIMessage } from 'ai'
import type { VisibilityType } from './visibility-selector'
import type { AgentType } from '~/features/agent/agent.types'
import type { ToolName } from '~/features/skills/skill.types'
import { useAgentChat } from 'agents/ai-react'
import { useAgent } from 'agents/react'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { toast } from 'sonner'
import { toolsRequiringConfirmation } from '~/features/skills/skill.info'
import { Messages } from './messages/messages-agent'
import { MultimodalInput } from './multimodal-input-agent'
import { useScrollToBottom } from './use-scroll-to-bottom'

export function BaseChat({ // Removed isNewChat, endpoint
  chatId,
  agentId,
  agentType,
  initialMessages, // Directly use initialMessages passed down
  isReadonly,
}: {
  chatId: string
  agentId: string
  agentType: AgentType
  initialMessages: Array<UIMessage>
  selectedChatModel?: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
  isAgent?: boolean
}) {
  const agent = useAgent({
    agent: agentType,
    prefix: 'agents',
    name: chatId,
  })

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
  } = useAgentChat({
    agent,
    id: chatId,
    sendExtraMessageFields: true,
    credentials: 'include',
    generateId: nanoid,
    initialMessages,
    onError: (error) => {
      console.error('useAgentChat onError:', error)
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
    <>
      <Messages
        chatId={chatId}
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

      <form
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 mx-auto flex w-full flex-col justify-center gap-2"
        // onSubmit might not be needed if MultimodalInput handles it internally via its own form/button
        onSubmit={(e) => {
          e.preventDefault()
          // handleSubmit provided by useAgentChat handles the form submission
          // eslint-disable-next-line no-alert
          alert('onSubmit')
          handleSubmit(e)
        }}
      >
        {!isReadonly && (
          <MultimodalInput
            chatId={chatId}
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
    </>
  )
}

//  <Artifact
//         chatId={id}
//         input={input}
//         setInput={setInput}
//         handleSubmit={handleSubmit}
//         status={status}
//         stop={stop}
//         attachments={attachments}
//         setAttachments={setAttachments}
//         append={append}
//         messages={messages}
//         setMessages={setMessages}
//         reload={reload}
//         votes={votes}
//         isReadonly={isReadonly}
//       />
