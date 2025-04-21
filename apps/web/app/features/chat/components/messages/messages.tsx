import type { UIMessage } from 'ai'
import { PreviewMessage, ThinkingMessage } from './message'
import type { useScrollToBottom } from '../use-scroll-to-bottom'
import { EmptyOverview } from '../empty-overview'
import { memo, useEffect, useRef } from 'react'
// import { Vote } from '~/lib/db/schema'
import equal from 'fast-deep-equal'
import type { UseChatHelpers } from '@ai-sdk/react'
import { useChatInput } from '../chat-input-context'
import { cn } from '@gingga/ui/lib/utils'
import type { ToolResponse } from '~/features/ai/skills/skill.types'

interface MessagesProps {
  chatId: string
  agentId?: string
  status: UseChatHelpers['status']
  // votes: Array<Vote> | undefined
  messages: Array<UIMessage>

  setMessages: UseChatHelpers['setMessages']
  setInput: UseChatHelpers['setInput']
  append: UseChatHelpers['append']
  reload: UseChatHelpers['reload']

  addToolResult: ({
    toolCallId,
    result,
  }: {
    toolCallId: string
    result: ToolResponse
  }) => void

  isReadonly: boolean
  isArtifactVisible: boolean

  messagesEndRef: React.RefObject<HTMLDivElement | null>
  messagesContainerRef: React.RefObject<HTMLDivElement | null>
  scrollUtils: ReturnType<typeof useScrollToBottom<HTMLDivElement>>[2]
}

function PureMessages({
  chatId,
  agentId,
  status,
  // votes,
  messages,
  setMessages,
  reload,
  addToolResult,
  setInput,
  isReadonly,
  // append,
  // isArtifactVisible,

  messagesEndRef,
  messagesContainerRef,
  scrollUtils,
}: MessagesProps) {
  const prevMessagesLengthRef = useRef(0)
  const prevMessageContentRef = useRef<Array<UIMessage>>([])
  const { inputHeight } = useChatInput()

  // Detect if new messages are added
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      scrollUtils.setNewMessageAdded(true)
    } else if (!equal(messages, prevMessageContentRef.current)) {
      // Content changed without new message
      if (scrollUtils.autoScrollEnabled) {
        scrollUtils.scrollToBottom('smooth')
      }
    }

    prevMessagesLengthRef.current = messages.length
    prevMessageContentRef.current = [...messages]
  }, [
    messages,
    scrollUtils.setNewMessageAdded,
    scrollUtils.autoScrollEnabled,
    scrollUtils.scrollToBottom,
    scrollUtils,
  ])

  // Handle auto-scroll for new messages
  useEffect(() => {
    let scrollRequestId: number | null = null

    if (scrollUtils.newMessageAdded) {
      scrollRequestId = requestAnimationFrame(() => {
        scrollUtils.scrollToBottom('smooth')
        scrollUtils.setNewMessageAdded(false)
      })
    }

    return () => {
      if (scrollRequestId) cancelAnimationFrame(scrollRequestId)
    }
  }, [
    scrollUtils.newMessageAdded,
    scrollUtils.scrollToBottom,
    scrollUtils.setNewMessageAdded,
    scrollUtils,
  ])

  // Initial scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      scrollUtils.scrollToBottom('auto')
    }
  }, [messagesContainerRef, scrollUtils.scrollToBottom, scrollUtils])

  return (
    <>
      <div
        ref={messagesContainerRef}
        className={cn(
          'text-foreground relative flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-4',
          messages.length === 0 && 'items-center justify-center',
        )}
      >
        {messages.length === 0 && (
          <EmptyOverview setInput={setInput} chatId={chatId} agentId={agentId} />
        )}

        {messages.map((message, index) => (
          <PreviewMessage
            key={message.id}
            chatId={chatId}
            message={message}
            status={status}
            isLoading={status === 'streaming' && messages.length - 1 === index}
            // vote={votes ? votes.find((vote) => vote.messageId === message.id) : undefined}
            setMessages={setMessages}
            reload={reload}
            addToolResult={addToolResult}
            isReadonly={isReadonly}
          />
        ))}

        {status === 'submitted' &&
          messages.length > 0 &&
          messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

        <div ref={messagesEndRef} className="min-h-[24px] min-w-[24px] shrink-0" />

        {/* Padding Spacer - Should match the height of the Input Section */}
        <div style={{ paddingTop: inputHeight }} />

        {/* Gradient blur overlay */}
        <div
          className="from-background/95 pointer-events-none fixed right-4 left-4 h-20 bg-gradient-to-t to-transparent"
          style={{ bottom: inputHeight - 4 }}
        />
      </div>
    </>
  )
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true

  if (prevProps.status !== nextProps.status) return false
  if (prevProps.status && nextProps.status) return false
  if (prevProps.messages.length !== nextProps.messages.length) return false
  if (!equal(prevProps.messages, nextProps.messages)) return false
  // if (!equal(prevProps.votes, nextProps.votes)) return false

  return true
})
