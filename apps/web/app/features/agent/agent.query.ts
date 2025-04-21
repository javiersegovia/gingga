import type { Agent } from '@gingga/db/types'
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import {
  $createAgent,
  $deleteAgentById,
  $getAgentById,
  $getAgents,
  $getRecentChatsWithAgents,
  $updateAgentById,
} from './agent.api'

// Query options for fetching agents list
export function agentsQueryOptions() {
  return queryOptions({
    queryKey: ['agents'],
    queryFn: () => $getAgents(),
  })
}

// Query options for fetching a single agent
export function agentQueryOptions(agentId?: string) {
  return queryOptions({
    queryKey: ['agent', agentId],
    queryFn: () => $getAgentById({ data: { id: agentId ?? '' } }),
    enabled: !!agentId,
  })
}

// Mutation hook for creating a new agent
export function useCreateAgentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: $createAgent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: agentsQueryOptions().queryKey })
    },
  })
}

// Mutation hook for updating an agent
export function useUpdateAgentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: $updateAgentById,
    onSuccess: async (agent: Agent) => {
      await queryClient.invalidateQueries({ queryKey: agentsQueryOptions().queryKey })
      await queryClient.invalidateQueries({
        queryKey: agentQueryOptions(agent.id).queryKey,
      })
    },
  })
}

// Mutation hook for deleting an agent
export function useDeleteAgentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: $deleteAgentById,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: agentsQueryOptions().queryKey })
    },
  })
}

/**
 * Query options factory function for fetching recent agents.
 */
export function recentChatsWithAgentsQueryOptions() {
  return queryOptions({
    queryKey: ['agents', 'recent'],
    queryFn: $getRecentChatsWithAgents,
  })
}

/**
 * Custom hook to fetch recent agents using TanStack Query with Suspense.
 */
export function useRecentChatsWithAgentsQuery() {
  return useSuspenseQuery({
    ...recentChatsWithAgentsQueryOptions(),
  })
}
