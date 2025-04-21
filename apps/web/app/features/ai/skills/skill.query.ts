import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import {
  $createSkill,
  $deleteSkillById,
  $getSkillById,
  $getSkillOptions,
  $getSkillsByAgentId,
  $updateSkillById,
  $upsertSkill,
} from './skill.api'

// --- Query Key Factory ---
export const skillQueryKeys = {
  all: ['skills'] as const,
  options: () => [...skillQueryKeys.all, 'options'] as const,
  byId: (id: string) => [...skillQueryKeys.all, 'byId', id] as const,
  byAgentId: (agentId: string) => [...skillQueryKeys.all, 'byAgentId', agentId] as const,
}

// --- Query Options ---

/**
 * Query options for fetching all skill options (static templates).
 */
export const skillOptionsQueryOptions = queryOptions({
  queryKey: skillQueryKeys.options(),
  queryFn: $getSkillOptions,
})

/**
 * Query options for fetching a single AgentSkill by id.
 */
export function skillByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: skillQueryKeys.byId(id),
    queryFn: () => $getSkillById({ data: { id } }),
    enabled: !!id,
  })
}

/**
 * Query options for fetching all AgentSkills for a given agentId.
 */
export function skillsByAgentIdQueryOptions(agentId: string) {
  return queryOptions({
    queryKey: skillQueryKeys.byAgentId(agentId),
    queryFn: () => $getSkillsByAgentId({ data: { agentId } }),
    enabled: !!agentId,
  })
}

/**
 * Hook to create a new AgentSkill.
 * @deprecated Prefer useUpsertSkillMutation
 */
export function useCreateSkillMutation(options?: Parameters<typeof useMutation>[0]) {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    ...options,
    mutationFn: $createSkill,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: skillQueryKeys.all })
      router.invalidate()
      options?.onSuccess?.(...args)
    },
  })
}

/**
 * Hook to update an AgentSkill by id.
 * @deprecated Prefer useUpsertSkillMutation
 */
export function useUpdateSkillById(options?: Parameters<typeof useMutation>[0]) {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    ...options,
    mutationFn: $updateSkillById,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: skillQueryKeys.all })
      router.invalidate()
      options?.onSuccess?.(...args)
    },
  })
}

/**
 * Hook to upsert (create or update) an AgentSkill.
 */
export function useUpsertSkillMutation(options?: Parameters<typeof useMutation>[0]) {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    ...options,
    mutationFn: $upsertSkill,
    onSuccess: (...args) => {
      // Invalidate all queries related to agent skills
      queryClient.refetchQueries({ queryKey: skillQueryKeys.all })
      // Invalidate the router to potentially refetch loader data
      router.invalidate()
      options?.onSuccess?.(...args)
    },
  })
}

/**
 * Hook to delete an AgentSkill by id.
 */
export function useDeleteSkillById(options?: Parameters<typeof useMutation>[0]) {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    ...options,
    mutationFn: $deleteSkillById,
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: skillQueryKeys.all })
      router.invalidate()
      options?.onSuccess?.(...args)
    },
  })
}
