import type { Tool } from 'ai'
import type { ToolResponse } from './tool.types' // Import shared type
import { tool } from 'ai'
import { z } from 'zod'

// Removed unused ToolTiming, ToolSuccessResponse, ToolErrorResponse, ToolExecuteResponse interfaces
// The ToolResponse type from tool.types.ts covers these now.

interface VideoGeneratorToolProps {
  agentId: string
}

const videoGeneratorInputSchema = z.object({
  topic: z.string().describe('The main topic or message of the video.'),
  style: z.string().describe('Desired style (e.g., informative, promotional, cartoon, realistic).'),
  audience: z.string().describe('The target audience for the video.'),
  scriptIdea: z.string().describe('Key points or a brief script outline for the video.'),
  length: z.string().describe('Approximate desired length (e.g., \'15 seconds\', \'1 minute\').'),
  visuals: z.string().optional().describe('Optional: Specific visual elements, colors, or branding instructions.'),
})

type VideoGeneratorInput = z.infer<typeof videoGeneratorInputSchema>

// Removed unused videoGeneratorOutputSchema constant

// Output type definition remains the same
interface VideoGeneratorOutput {
  success: boolean
  message: string
  videoId?: string
}

export function videoGeneratorTool({ agentId }: VideoGeneratorToolProps): Tool {
  return tool({
    description: 'Generates a short video based on user-provided details like topic, style, script idea, and length. Returns a confirmation message or an error.',
    parameters: videoGeneratorInputSchema,
    // Update return type to use ToolResponse
    async execute(input: VideoGeneratorInput): Promise<ToolResponse<VideoGeneratorOutput>> {
      const startTime = new Date().toISOString()
      let endTime: string

      console.log(`[Agent ${agentId}] Executing videoGeneratorTool with input:`, input)

      try {
        // Simulate video generation
        await new Promise(resolve => setTimeout(resolve, 3000))
        const fakeVideoId = `vid_${Date.now()}`
        console.log(`[Agent ${agentId}] Video generation successful (simulated). Video ID: ${fakeVideoId}`)

        endTime = new Date().toISOString()
        const output: VideoGeneratorOutput = {
          success: true,
          message: `Video generation started successfully! Your video ID is ${fakeVideoId}. It might take a few moments to process.`,
          videoId: fakeVideoId,
        }
        // Wrap return in ToolSuccessResponse structure
        return {
          success: true,
          output,
          timing: {
            startTime,
            endTime,
            duration: new Date(endTime).getTime() - new Date(startTime).getTime(),
          },
        }
      }
      catch (error: unknown) {
        console.error(`[Agent ${agentId}] Error during video generation (simulated):`, error)
        endTime = new Date().toISOString()
        const errorMessage = error instanceof Error ? error.message : 'Unknown error generating video'
        // Wrap return in ToolErrorResponse structure
        const output: VideoGeneratorOutput = {
          success: false,
          message: `Sorry, there was an error generating the video: ${errorMessage}`,
          // videoId is optional, so it's omitted on error
        }
        return {
          success: false,
          output, // Return the structured error output
          error: errorMessage,
          timing: {
            startTime,
            endTime,
            duration: new Date(endTime).getTime() - new Date(startTime).getTime(),
          },
        }
      }
    },
  })
}
