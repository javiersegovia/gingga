# AgentSkills & Composio Tools Integration: Implementation Plan

## Overview

This plan details the architecture and step-by-step process for integrating AgentSkills with Composio tools, enabling users (admins) to configure, store, and utilize custom skills for their agents. The plan is designed for scalability, maintainability, and a seamless user experience.

---

## 1. Static List of Predefined Skills

- **File:** @skill.options.ts
- **Type:** Move the `SkillOption` type definition to @skill.types.ts.
- **Content:** Store a static array of `SkillOption` objects, each representing a predefined skill template (see GoogleSheetsSkillOption as a reference).
- **Fields:**
  - `id`, `name`, `description`, `image`
  - `integration` (if required): `{ required, integrationAppName, integrationId, availableComposioToolNames }`
  - Optionally, `availableToolNames` for non-integration skills.
- **Extensibility:** Consider a utility for easier updates in the future.

---

## 2. Skill Creation Modal (UI/UX)

- **File:** @skill-modal.tsx
- **UI Library:** ShadcnUI (see @design.mdc, @instructions.mdc)
- **Instructions:**
  - For now, only add detailed natural language instructions as comments in this file. Do not generate any code yet.
  - The modal should have three tabs:
    1. **Tools Tab:** List and select available Composio tools for the chosen integration.
    2. **Variables Tab:** Add/remove key-value pairs for custom configuration (stored in `variables`).
    3. **Instructions Tab:** Free-form textarea for user instructions, supporting variable interpolation with `{{variableName}}`.
  - Integration logic:
    - On modal open, check if the user has a valid connection for the required integration (using the integrationId from the selected SkillOption).
    - If not connected, prompt the user to start the OAuth flow (see Composio Auth docs).
    - After authentication, fetch and display `availableComposioToolNames` for selection.
    - Allow multi-select; store selected tool names in `composioToolNames`.
    - Variables: Allow adding/removing key-value pairs.
    - Instructions: Simple textarea, with support for `{{variableName}}` interpolation.

---

## 3. Backend: CRUD and API Layer

- **Files:**
  - @skill.api.ts: TanStack server function for CRUD operations on AgentSkills.
  - @skill.service.ts: Service functions for AgentSkills CRUD logic.
  - @skill.query.ts: Client-side hooks/queries to connect to the API.
- **Database:**
  - Add a `version` field to the AgentSkills table.
  - Ensure fields: `id`, `agentId`, `skillId`, `instructions`, `tools`, `variables`, `isEnabled`, `composioIntegrationAppName`, `composioToolNames`, `version`.
- **Logic:**
  - On modal save, persist all relevant data to the AgentSkills table via the server function.
  - Only admins can create/edit skills.

---

## 4. Composio Integration Utilities

- **File:** @composio.service.ts
- **Purpose:**
  - Functions for interacting with Composio (fetching integrations, checking connections, initiating OAuth, fetching tool schemas, etc).
  - Use this file for all Composio-related logic unless it is directly tied to AgentSkills CRUD (then use @skill.service.ts).

---

## 5. Fetching & Using Agent Skills

- **Function:** `getAgentSkillData(agentSkillId: string)`
  - Fetches the AgentSkills row by ID.
  - Returns all relevant fields, including `composioIntegrationAppName` and `composioToolNames`.
- **Function:** `getComposioToolsFromAgentSkill`
  - Accepts `appName`, `composioToolNames`, and a Composio toolset instance.
  - Fetches tool definitions using the Composio SDK.
  - Returns tool schemas for use by the agent/LLM.
- **Connection Check:**
  - When retrieving AgentSkills for an agent, compare their `integrationAppNames` with the user's current connections.
  - If a required connection is missing, warn the user in the UI and omit the integration tools in backend logic.
  - The tool itself may also notify the user to reconnect if invoked without a valid connection.

---

## 6. File Organization

- @skill.options.ts: Static skill definitions.
- @skill.types.ts: Type definitions, including `SkillOption`.
- @skill-modal.tsx: Modal UI (currently only comments/instructions).
- @skill.api.ts: TanStack server functions for AgentSkills CRUD.
- @skill.service.ts: Service functions for AgentSkills CRUD.
- @skill.query.ts: Client-side hooks/queries.
- @composio.service.ts: Composio integration utilities (fetching integrations, connections, tool schemas, etc).

---

## 7. Open Questions & Decisions (Documented)

1. **Skill Versioning:** Add `version` to AgentSkills. **(Yes)**
2. **Instructions Templating:** Support variable interpolation with `{{variableName}}`. **(Yes)**
3. **Tool Schema Caching:** Not needed for now. **(No)**
4. **Multi-App Skills:** Each skill focuses on one integration only. **(No)**
5. **Error Handling:**
   - If a required connection is missing, warn the user in the UI and omit the integration tools in backend logic.
   - The tool may also notify the user to reconnect if invoked without a valid connection.
6. **Role-Based Access:** Only admins can create/edit skills. **(Yes)**
7. **Skill Sharing:** Each skill is created for only one agent. **(No)**
8. **Audit Logging:** Not required for now. **(No)**

---

## 8. Data Flow (Recap)

1. **User (admin) selects a skill template** from the static list (@skill.options.ts).
2. **Modal opens** (@skill-modal.tsx); checks for integration connection.
3. **User authenticates** (if needed) via OAuth (handled via @composio.service.ts).
4. **User selects tools, sets variables, writes instructions** (modal UI).
5. **Skill is saved** to AgentSkills table via TanStack server function (@skill.api.ts, @skill.service.ts).
6. **Agent is invoked** (in a separate screen); backend fetches skill and tools, passes to LLM. This step is not automatic and only happens when the user chats with the agent.

---

## 9. References

- [Composio: Fetching Tools](https://docs.composio.dev/tool-calling/fetching-tools)
- [Composio: Executing Tools](https://docs.composio.dev/tool-calling/executing-tools)
- [Composio: Auth Introduction](https://docs.composio.dev/auth/introduction)
- [Composio: Set Up Integrations](https://docs.composio.dev/auth/set-up-integrations)

---

**Next Steps:**

- Implement the type move and static skill list.
- Add detailed UI/UX instructions as comments in @skill-modal.tsx.
- Set up TanStack server function and service for AgentSkills CRUD.
- Build Composio integration utilities.
- Implement connection checks and error handling as described.

**Do not generate any code yet.** Follow this plan for the next implementation phase.
