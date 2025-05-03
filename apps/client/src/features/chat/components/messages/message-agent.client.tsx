import type { UIMessage } from 'ai'
import type { UseAgentChatResult } from '~/features/agent/agent.types'
import type { ToolResponse } from '~/features/tools/tool.types'

// import type { Vote } from '~/lib/db/schema'
// import { DocumentToolCall, DocumentToolResult } from './document'
// import { MessageActions } from './message-actions'
// import { Weather } from './weather'
// import { DocumentPreview } from './document-preview'

import { Avatar, AvatarFallback } from '@gingga/ui/components/avatar'
import { Button } from '@gingga/ui/components/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gingga/ui/components/tooltip'
import { cn } from '@gingga/ui/lib/utils'
import equal from 'fast-deep-equal'
import { PencilIcon, SparklesIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { memo, useState } from 'react'
import { useClientEnv } from '~/hooks/use-client-env'
import { Markdown } from '../markdown'
import { MessageEditor } from './message-editor'
import { PreviewAttachment } from './message-preview-attachment'
import { MessageReasoning } from './message-reasoning'
// import {
//   toolsRequiringConfirmation,
//   APPROVAL /*skillsInfo*/,
// } from '../../../ai/skills/info'

interface MessageProps {
  chatId: string
  message: UIMessage
  // vote: Vote | undefined
  isLoading: boolean
  status: UseAgentChatResult['status']
  setMessages: UseAgentChatResult['setMessages']
  addToolResult: ({
    toolCallId,
    result,
  }: {
    toolCallId: string
    result: ToolResponse
  }) => void
  reload: UseAgentChatResult['reload']
  isReadonly: boolean
}

// function isToolResponse(result: unknown): result is ToolResponse {
//   return (
//     typeof result === 'object' &&
//     result !== null &&
//     'success' in result &&
//     'output' in result &&
//     'label' in result
//   )
// }

function PurePreviewMessage({
  // chatId,
  message,
  // status,
  isLoading,
  setMessages,
  reload,
  // addToolResult,
  isReadonly,
}: MessageProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  // const isChatLoading = status === 'streaming' || status === 'submitted'
  const env = useClientEnv()

  return (
    <TooltipProvider delayDuration={0}>
      <AnimatePresence>
        <motion.div
          data-testid={`message-${message.role}`}
          className="group/message mx-auto w-full max-w-3xl px-4"
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          data-role={message.role}
        >
          <div
            className={cn(
              'flex w-full gap-4 group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
              {
                'w-full': mode === 'edit',
                'group-data-[role=user]/message:w-fit': mode !== 'edit',
              },
            )}
          >
            {message.role === 'assistant' && (
              <Avatar className="border-border bg-blank flex h-8 w-8 items-center justify-center border">
                <AvatarFallback className="size-8 shrink-0 items-center justify-center rounded-sm bg-transparent ring-1">
                  <img
                    src={`${env.VITE_ASSETS_URL}/logo/logo-iso-light.svg`}
                    alt="logo"
                    className="h-6 w-6 dark:hidden"
                  />
                  <img
                    src={`${env.VITE_ASSETS_URL}/logo/logo-iso-dark.svg`}
                    alt="logo"
                    className="hidden h-6 w-6 dark:block"
                  />
                </AvatarFallback>
              </Avatar>
            )}

            <div className="flex w-full flex-col gap-4">
              {message.experimental_attachments
                && message.experimental_attachments.length > 0 && (
                <div
                  data-testid="message-attachments"
                  className="flex flex-row justify-end gap-2"
                >
                  {message.experimental_attachments.map(attachment => (
                    <PreviewAttachment key={attachment.url} attachment={attachment} />
                  ))}
                </div>
              )}

              {message.parts?.map((part, index) => {
                const { type } = part
                const key = `message-${message.id}-part-${index}`

                if (type === 'reasoning') {
                  return (
                    <MessageReasoning
                      key={key}
                      isLoading={isLoading}
                      reasoning={part.reasoning}
                    />
                  )
                }

                if (type === 'text') {
                  if (mode === 'view') {
                    return !part.text
                      ? null
                      : (
                          <div key={key} className="flex flex-row items-start gap-2">
                            {message.role === 'user' && !isReadonly && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    data-testid="message-edit-button"
                                    variant="ghost"
                                    hover="noShadow"
                                    className="text-muted-foreground h-fit rounded-full px-2 opacity-0 group-hover/message:opacity-100"
                                    onClick={() => {
                                      setMode('edit')
                                    }}
                                  >
                                    <PencilIcon />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit message</TooltipContent>
                              </Tooltip>
                            )}

                            <div
                              data-testid="message-content"
                              className={cn(
                                'text-foreground flex flex-col gap-4',

                                message.role === 'user'
                                && 'bg-accent text-accent-foreground border-border rounded-md border-2 px-3 py-2',
                              )}
                            >
                              <Markdown>{part.text}</Markdown>
                            </div>
                          </div>
                        )
                  }

                  if (mode === 'edit') {
                    return (
                      <div key={key} className="flex flex-row items-start gap-2">
                        <div className="size-8" />

                        <MessageEditor
                          key={message.id}
                          message={message}
                          setMode={setMode}
                          setMessages={setMessages}
                          reload={reload}
                        />
                      </div>
                    )
                  }
                }

                // if (type === 'tool-invocation') {
                //   const { toolInvocation } = part
                //   const { toolName, toolCallId, state } = toolInvocation
                //   const toolInfo = toolsInfo[toolName as ToolName]

                //   if (!toolInfo) {
                //     return null
                //   }

                //   if (
                //     toolsRequiringConfirmation.includes(toolName as ToolName) &&
                //     state === 'call'
                //   ) {
                //     return (
                //       <div key={toolCallId}>
                //         <p>{toolInfo.approval}</p>

                //         {/* <div className="text-muted-foreground mt-2 text-sm">
                //           Type <span className="font-semibold">yes</span> or{' '}
                //           <span className="font-semibold">no</span> in your next message,
                //           or click below:
                //         </div> */}

                //         <div className="flex gap-2 pt-2">
                //           <Button
                //             className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                //             isPending={isChatLoading}
                //             disabled={isChatLoading}
                //             onClick={() => {
                //               addToolResult({
                //                 toolCallId,
                //                 result: {
                //                   success: true,
                //                   output: APPROVAL.YES,
                //                 },
                //               })
                //               // reload()
                //             }}
                //           >
                //             Yes
                //           </Button>
                //           <Button
                //             className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                //             isPending={isChatLoading}
                //             disabled={isChatLoading}
                //             onClick={() => {
                //               addToolResult({
                //                 toolCallId,
                //                 result: {
                //                   success: false,
                //                   output: APPROVAL.NO,
                //                 },
                //               })
                //               // reload()
                //             }}
                //           >
                //             No
                //           </Button>
                //         </div>
                //       </div>
                //     )
                //   }

                //   if (state === 'call') {
                //     // const { args } = toolInvocation

                //     return (
                //       <div
                //         key={toolCallId}
                //         className={cn({
                //           skeleton: ['getWeather'].includes(toolName),
                //         })}
                //       >
                //         {/* {toolName === 'getWeather' ? (
                //         <Weather />
                //       ) : toolName === 'createDocument' ? (
                //         <DocumentPreview isReadonly={isReadonly} args={args} />
                //       ) : toolName === 'updateDocument' ? (
                //         <DocumentToolCall
                //           type="update"
                //           args={args}
                //           isReadonly={isReadonly}
                //         />
                //       ) : toolName === 'requestSuggestions' ? (
                //         <DocumentToolCall
                //           type="request-suggestions"
                //           args={args}
                //           isReadonly={isReadonly}
                //         />
                //       ) : null} */}
                //         {toolName === '' && <div></div>}
                //         {/* todo: add tool UI */}
                //         <div>
                //           <p>Tool call is loading...:</p>
                //           <span>{JSON.stringify(toolInvocation, null, 2)}</span>
                //         </div>
                //       </div>
                //     )
                //   }

                //   if (state === 'result') {
                //     const { result } = toolInvocation

                //     if (!isToolResponse(result)) {
                //       return <div key={toolCallId} />
                //     }

                //     return (
                //       <div key={toolCallId}>
                //         {/* {toolName === 'getWeather' ? (
                //         <Weather weatherAtLocation={result} />
                //       ) : toolName === 'createDocument' ? (
                //         <DocumentPreview isReadonly={isReadonly} result={result} />
                //       ) : toolName === 'updateDocument' ? (
                //         <DocumentToolResult
                //           type="update"
                //           result={result}
                //           isReadonly={isReadonly}
                //         />
                //       ) : toolName === 'requestSuggestions' ? (
                //         <DocumentToolResult
                //           type="request-suggestions"
                //           result={result}
                //           isReadonly={isReadonly}
                //         />
                //       ) : (
                //         <pre>{JSON.stringify(result, null, 2)}</pre>
                //       )} */}
                //         {/* todo: add tool UI */}
                //         <div
                //           className={cn(
                //             'bg-secondary/10 rounded-base inline-flex flex-col gap-2 border px-4 py-2',
                //             result.success ? 'bg-brand-green/20' : 'bg-brand-red/20',
                //           )}
                //         >
                //           <span>{result.label || toolInfo.success}</span>
                //         </div>
                //       </div>
                //     )
                //   }
                // }
                return null
              })}

              {/* {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
              />
            )} */}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </TooltipProvider>
  )
}

export const PreviewMessage = memo(PurePreviewMessage, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading)
    return false
  if (prevProps.status !== nextProps.status)
    return false
  if (prevProps.message.id !== nextProps.message.id)
    return false
  if (!equal(prevProps.message.parts, nextProps.message.parts))
    return false
  // if (!equal(prevProps.vote, nextProps.vote)) return false

  return true
})

export function ThinkingMessage() {
  const role = 'assistant'

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="group/message mx-auto w-full max-w-3xl px-4"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          'flex w-full gap-4 rounded-xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="ring-border flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
          <SparklesIcon size={14} />
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="text-muted-foreground flex flex-col gap-4">Thinking...</div>
        </div>
      </div>
    </motion.div>
  )
}
