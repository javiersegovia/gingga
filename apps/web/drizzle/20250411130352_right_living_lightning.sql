CREATE TABLE `agent_skills` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`id` text PRIMARY KEY NOT NULL,
	`agent_id` text NOT NULL,
	`skill_identifier` text NOT NULL,
	`configuration_data` text,
	`is_enabled` integer DEFAULT true,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `chats` DROP COLUMN `project_id`;
--> statement-breakpoint
DROP TABLE `ai_token_usage`;
--> statement-breakpoint
DROP TABLE `available_integrations`;
--> statement-breakpoint
DROP TABLE `complexity_assessment_criteria`;
--> statement-breakpoint
DROP TABLE `function_points`;
--> statement-breakpoint
DROP TABLE `functionality_time`;
--> statement-breakpoint
DROP TABLE `integration_action_logs`;
--> statement-breakpoint
DROP TABLE `module_time`;
--> statement-breakpoint
DROP TABLE `project_functionalities`;
--> statement-breakpoint
DROP TABLE `project_modules`;
--> statement-breakpoint
DROP TABLE `project_routes`;
--> statement-breakpoint
DROP TABLE `project_timelines`;
--> statement-breakpoint
DROP TABLE `projects`;
--> statement-breakpoint
DROP TABLE `test_cases`;
--> statement-breakpoint
DROP TABLE `timeline_items`;
--> statement-breakpoint
DROP TABLE `timeline_items_to_project_modules`;
--> statement-breakpoint
DROP TABLE `user_integrations`;