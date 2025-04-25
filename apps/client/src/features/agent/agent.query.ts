import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

// Query Hook for fetching recent agents for the current user
export function useGetRecentAgentsQuery() {
  const trpc = useTRPC()
  return useQuery(trpc.agent.getRecentChatsWithAgents.queryOptions())
}

// Mutation Hook for creating an agent
export function useCreateAgentMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(trpc.agent.createAgent.mutationOptions({
    onSuccess: (createdAgent) => {
      queryClient.invalidateQueries({
        queryKey: trpc.agent.getAgents.queryKey(),
      })
      queryClient.setQueryData(
        trpc.agent.getAgentById.queryKey({ id: createdAgent.id }),
        createdAgent,
      )
      queryClient.invalidateQueries({
        queryKey: trpc.agent.getRecentChatsWithAgents.queryKey(),
      })
    },
  }))
}

// Mutation Hook for updating an agent
export function useUpdateAgentMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(trpc.agent.updateAgentById.mutationOptions({
    onSuccess: (updatedAgent) => {
      queryClient.invalidateQueries({
        queryKey: trpc.agent.getAgents.queryKey(),
      })
      queryClient.setQueryData(
        trpc.agent.getAgentById.queryKey({ id: updatedAgent.id }),
        updatedAgent,
      )
      queryClient.invalidateQueries({
        queryKey: trpc.agent.getRecentChatsWithAgents.queryKey(),
      })
    },
  }))
}

// Mutation Hook for deleting an agent
export function useDeleteAgentMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(trpc.agent.deleteAgentById.mutationOptions({
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: trpc.agent.getAgents.queryKey(),
      })
      queryClient.removeQueries({
        queryKey: trpc.agent.getAgentById.queryKey({ id: variables.id }),
      })
      queryClient.invalidateQueries({
        queryKey: trpc.agent.getRecentChatsWithAgents.queryKey(),
      })
    },
  }))
}
