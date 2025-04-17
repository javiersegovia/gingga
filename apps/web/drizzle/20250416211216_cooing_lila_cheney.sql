ALTER TABLE `agent_skills` RENAME COLUMN "skill_identifier" TO "skill_id";--> statement-breakpoint
ALTER TABLE `agent_skills` RENAME COLUMN "configuration_data" TO "variables";--> statement-breakpoint
ALTER TABLE `agent_skills` ADD `instructions` text;--> statement-breakpoint
ALTER TABLE `agent_skills` ADD `tools` text;--> statement-breakpoint
ALTER TABLE `agent_skills` ADD `composio_integration_app_name` text;--> statement-breakpoint
ALTER TABLE `agent_skills` ADD `composio_tool_names` text;