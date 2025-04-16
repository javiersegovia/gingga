/**
 * Skill Creation Modal UI/UX Instructions
 *
 * This modal is used for creating or editing an AgentSkill.
 *
 * Skill Selection:
 * - The modal is for configuring a single skill that was already selected from the skill list.
 * - Do NOT display all skills in this modal. Only show the details and available tools for the chosen skill.
 * - The modal should receive the selected skill as a prop.
 * - Only show the configuration options (tools, variables, instructions) relevant to the selected skill.
 *
 * Structure:
 * - The modal should have three tabs:
 *   1. Tools Tab: List and allow selection of available Composio tools for the chosen integration.
 *   2. Variables Tab: Allow the user to add/remove key-value pairs (these are stored in the AgentSkills.variables field).
 *   3. Instructions Tab: Free-form textarea for user instructions. Support variable interpolation using {{variableName}}.
 *
 * Saving Data:
 * - Each tab (Tools, Variables, Instructions) should have its own independent "Save" button.
 * - The information of each tab can be saved separately to AgentSkills; saves are independent and do not require completing all tabs at once.
 * - Provide clear feedback for each save action (success, error, loading).
 *
 * Data Fetching:
 * - Fetch the list of available skill options via the API (do not import directly from the file). The API should use getSkillOptions() server-side.
 * - Use the selected skill's ID to fetch its details and available tools.
 *
 * Integration Connection Logic:
 * - When a skill option with an integration is selected, check if the user has an active connection for the required integrationId.
 * - If not connected, prompt the user to start the OAuth flow (see Composio Auth docs).
 * - After successful authentication, refresh the modal state to allow tool selection.
 *
 * Tools Tab:
 * - After authentication, display the availableComposioToolNames for the integration.
 * - Allow the user to select one or more tools (multi-select).
 * - Store the selected tool names in composioToolNames.
 * - Include a Save button for this tab.
 *
 * Variables Tab:
 * - Allow the user to add, edit, and remove key-value pairs.
 * - These variables will be referenced in the instructions tab using {{variableName}} syntax.
 * - Include a Save button for this tab.
 *
 * Instructions Tab:
 * - Provide a textarea for the user to write instructions.
 * - Support variable interpolation (show a hint or helper for using {{variableName}}).
 * - Include a Save button for this tab.
 *
 * Save Logic:
 * - On save (per tab), send the relevant data (selected tools, variables, or instructions) to the backend via the appropriate API endpoint.
 * - Only allow admins to create or edit skills.
 *
 * Error Handling:
 * - If a required integration connection is missing, show a warning and disable tool selection until the connection is established.
 * - If the connection is lost after creation, warn the user and omit the integration tools in the backend logic.
 *
 * Accessibility & UX:
 * - Ensure the modal is accessible and follows best practices for forms and navigation.
 * - Provide clear feedback for loading, errors, and successful saves.
 *
 * Extensibility:
 * - Design the modal to support additional integrations and skill types in the future.
 */

/**
 * SkillModal component for creating or editing an AgentSkill.
 * Uses ShadcnUI Dialog and Tabs. Each tab renders its own form.
 * Modal only closes when user explicitly closes it.
 */
import type { SkillOption } from '../skill.types'
import type { AgentSkill } from '@/db/types'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@gingga/ui/components/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@gingga/ui/components/tabs'
import { Button } from '@gingga/ui/components/button'

// TODO: Replace 'unknown' with the correct props type when implementing the forms
const SkillToolsForm: React.FC<SkillModalProps> = (_props) => <div />
const SkillVariablesForm: React.FC<SkillModalProps> = (_props) => <div />
const SkillInstructionsForm: React.FC<SkillModalProps> = (_props) => <div />

interface SkillModalProps {
  mode: 'create' | 'edit'
  agentId: string
  skillOption?: SkillOption // required for create
  agentSkill?: AgentSkill
  onClose: () => void
}

export default function SkillModal({
  mode,
  agentId,
  skillOption,
  agentSkill,
  onClose,
}: SkillModalProps) {
  const [tab, setTab] = useState<'tools' | 'variables' | 'instructions'>('tools')

  // Optionally, add loading/error state here if needed

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Skill' : 'Edit Skill'}</DialogTitle>
        </DialogHeader>
        <Tabs
          value={tab}
          onValueChange={(value) =>
            setTab(value as 'tools' | 'variables' | 'instructions')
          }
          className="mt-4"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="tools">
            <SkillToolsForm
              mode={mode}
              agentId={agentId}
              skillOption={skillOption}
              agentSkill={agentSkill}
              onClose={onClose}
            />
          </TabsContent>
          <TabsContent value="variables">
            <SkillVariablesForm
              mode={mode}
              agentId={agentId}
              skillOption={skillOption}
              agentSkill={agentSkill}
              onClose={onClose}
            />
          </TabsContent>
          <TabsContent value="instructions">
            <SkillInstructionsForm
              mode={mode}
              agentId={agentId}
              skillOption={skillOption}
              agentSkill={agentSkill}
              onClose={onClose}
            />
          </TabsContent>
        </Tabs>
        <div className="mt-6 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
