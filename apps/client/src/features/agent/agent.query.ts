import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRevalidator } from 'react-router'
import { useTRPC } from '~/lib/trpc/react'

// Query Hook for fetching a single agent
export function useGetAgentByIdQuery(agentId: string | undefined) {
  const trpc = useTRPC()
  return useQuery(trpc.agent.getAgentById.queryOptions({ id: agentId! }, { enabled: !!agentId }))
}

// Query Hook for listing all agents
export function useListAgentsQuery() {
  const trpc = useTRPC()
  return useQuery(trpc.agent.getAgents.queryOptions())
}

// Mutation Hook for creating an agent
export function useCreateAgentMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(trpc.agent.createAgent.mutationOptions({
    onSuccess: async () => {
      void queryClient.invalidateQueries({ queryKey: trpc.agent.getAgents.queryKey() })
      void queryClient.invalidateQueries({ queryKey: trpc.agent.getRecentChatsWithAgents.queryKey() })
    },
  }))
}

// Mutation Hook for updating an agent
export function useUpdateAgentMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const { revalidate } = useRevalidator()
  return useMutation(trpc.agent.updateAgentById.mutationOptions({
    onSuccess: async (updatedAgent) => {
      void queryClient.invalidateQueries({ queryKey: trpc.agent.getAgents.queryKey() })
      void queryClient.invalidateQueries({ queryKey: trpc.agent.getRecentChatsWithAgents.queryKey() })
      void queryClient.invalidateQueries({ queryKey: trpc.agent.getAgentById.queryKey({ id: updatedAgent.id }) })
      await revalidate()
    },
  }))
}

// Mutation Hook for deleting an agent
export function useDeleteAgentMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const { revalidate } = useRevalidator()
  return useMutation(trpc.agent.deleteAgentById.mutationOptions({
    onSuccess: async (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: trpc.agent.getAgents.queryKey() })
      void queryClient.invalidateQueries({ queryKey: trpc.agent.getRecentChatsWithAgents.queryKey() })
      void queryClient.invalidateQueries({ queryKey: trpc.agent.getAgentById.queryKey({ id: variables.id }) })
      await revalidate()
    },
  }))
}
