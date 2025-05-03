CREATE TABLE `workflows` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`n8n_workflow_id` text NOT NULL,
	`name` text,
	`description` text,
	`status` text DEFAULT 'inactive',
	`webhook_url` text NOT NULL,
	`input_schema` text,
	`output_schema` text,
	`last_sync_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workflows_n8n_workflow_id_unique` ON `workflows` (`n8n_workflow_id`);