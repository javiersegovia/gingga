DROP INDEX "workflows_n8n_workflow_id_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `agents` ALTER COLUMN "agent_type" TO "agent_type" text NOT NULL DEFAULT 'chat';--> statement-breakpoint
CREATE UNIQUE INDEX `workflows_n8n_workflow_id_unique` ON `workflows` (`n8n_workflow_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);