import type { UseChatHelpers } from '@ai-sdk/react'
import { Button } from '@gingga/ui/components/button'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { agentQueryOptions } from '~/features/agent/agent.query'
import { useAuthQuery } from '~/features/auth/auth.query'

interface EmptyOverviewProps {
  setInput: UseChatHelpers['setInput']
  chatId: string
  agentId?: string
}

export function EmptyOverview({ setInput, agentId }: EmptyOverviewProps) {
  const { data: authData } = useAuthQuery()
  const user = authData ? authData.user : null
  const userName = user?.name?.split(' ')[0] || 'there'

  const { data: agentInfo } = useQuery({
    ...agentQueryOptions(agentId),
    enabled: !!agentId,
  })

  const starters = agentInfo?.starters || []
  const chatIntroduction = agentInfo?.introduction || 'How can I help you?'

  return (
    <motion.div
      key="overview"
      className="mx-auto max-w-3xl md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex max-w-2xl flex-col gap-8 rounded-xl p-6 text-center leading-relaxed">
        {agentInfo?.image && (
          <img
            src={agentInfo.image}
            alt={agentInfo.name}
            className="rounded-base mx-auto size-40 object-contain"
          />
        )}

        <h1 className="text-xl font-bold sm:text-2xl">
          Hello,
          {' '}
          {userName}
          !
          {' '}
          <br />
          {' '}
        </h1>
        <h3 className="text-primary line-stroke text-2xl whitespace-pre-line sm:text-3xl">
          {chatIntroduction}
        </h3>

        <div className="pointer-events-auto mb-6">
          <div
            data-testid="suggested-actions"
            className="grid w-full gap-2 sm:grid-cols-2"
          >
            {starters.map((starter: string, index: number) => (

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.05 * index }}
                key={starter}
                className={index > 3 ? 'hidden sm:block' : 'block'}
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    setInput(starter)
                  }}
                  className="hover:bg-blank border-border h-full w-full flex-1 items-start justify-start gap-1 rounded-sm border-2 px-4 py-3.5 text-left text-sm whitespace-pre-line sm:text-base"
                >
                  <span className="font-medium">{starter}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
