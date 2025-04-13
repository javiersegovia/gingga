CREATE TABLE `oauth_accounts` (
	`provider_id` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`user_id` text NOT NULL,
	PRIMARY KEY(`provider_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `connections`;--> statement-breakpoint
DROP TABLE `general_modules`;--> statement-breakpoint
DROP TABLE `passwords`;--> statement-breakpoint
DROP TABLE `permissions`;--> statement-breakpoint
DROP TABLE `role_permissions`;--> statement-breakpoint
DROP TABLE `roles`;--> statement-breakpoint
DROP TABLE `user_roles`;--> statement-breakpoint
DROP TABLE `verifications`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS "function_points_project_functionality_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "functionality_time_project_functionality_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "module_time_project_module_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "project_timelines_project_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "projects_slug_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "users_email_unique";--> statement-breakpoint
ALTER TABLE `chats` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
CREATE UNIQUE INDEX `function_points_project_functionality_id_unique` ON `function_points` (`project_functionality_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `functionality_time_project_functionality_id_unique` ON `functionality_time` (`project_functionality_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `module_time_project_module_id_unique` ON `module_time` (`project_module_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `project_timelines_project_id_unique` ON `project_timelines` (`project_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `chats` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `complexity_assessment_criteria` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `complexity_assessment_criteria` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `function_points` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `function_points` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `functionality_time` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `functionality_time` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `module_time` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `module_time` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `project_functionalities` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `project_functionalities` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `project_modules` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `project_modules` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `project_timelines` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `project_timelines` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `test_cases` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `test_cases` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `timeline_items` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `timeline_items` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `timeline_items_to_project_modules` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `timeline_items_to_project_modules` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "updated_at" TO "updated_at" integer DEFAULT (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `users` ADD `name` text;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verified_at` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `image` text;