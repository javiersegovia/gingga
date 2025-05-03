import type { AgentType } from '@gingga/db/types'
import { saveLeadTool } from '~/features/tools/save-lead.tool'
import { videoGeneratorTool } from '~/features/tools/video-generator.tool'
import { modelProvider } from '~/lib/ai/providers'
import { chatSystemPrompt } from '~/server/agents/chat-agent.prompt'
import { leadCaptureSystemPrompt } from '~/server/agents/lead-capture-agent.prompt'
import { videoGeneratorSystemPrompt } from '~/server/agents/video-generator.prompt'

export function getAgentData({ agentType, agentId }: { agentType: AgentType, agentId: string }) {
  switch (agentType) {
    case 'lead_capture':
      return {
        systemPrompt: leadCaptureSystemPrompt,
        model: modelProvider.languageModel('chat-agent-tools'),
        tools: {
          saveLeadTool: saveLeadTool({ agentId }),
        },
      }

    case 'video_generator':
      return {
        systemPrompt: videoGeneratorSystemPrompt,
        model: modelProvider.languageModel('video-generator-agent'),
        tools: {
          videoGeneratorTool: videoGeneratorTool({ agentId }),
        },
      }

    case 'chat':
      return {
        systemPrompt: chatSystemPrompt,
        model: modelProvider.languageModel('chat-agent'),
      }

    default:
      console.warn(`Agent type "${agentType}" not found. Defaulting to chat agent.`)
      return {
        model: modelProvider.languageModel('chat-agent'),
      }
  }
}
