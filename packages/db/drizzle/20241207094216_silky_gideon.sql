PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_project_modules` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`additional_info` text,
	`order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_project_modules`("created_at", "updated_at", "id", "project_id", "name", "description", "additional_info", "order") SELECT "created_at", "updated_at", "id", "project_id", "name", "description", "additional_info", "order" FROM `project_modules`;--> statement-breakpoint
DROP TABLE `project_modules`;--> statement-breakpoint
ALTER TABLE `__new_project_modules` RENAME TO `project_modules`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_test_cases` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`id` text PRIMARY KEY NOT NULL,
	`project_functionality_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`project_functionality_id`) REFERENCES `project_functionalities`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_test_cases`("created_at", "updated_at", "id", "project_functionality_id", "name", "description") SELECT "created_at", "updated_at", "id", "project_functionality_id", "name", "description" FROM `test_cases`;--> statement-breakpoint
DROP TABLE `test_cases`;--> statement-breakpoint
ALTER TABLE `__new_test_cases` RENAME TO `test_cases`;--> statement-breakpoint
DROP INDEX IF EXISTS "function_points_project_functionality_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "functionality_time_project_functionality_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "module_time_project_module_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "project_timelines_project_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "projects_slug_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "users_email_unique";--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "name" TO "name" text;--> statement-breakpoint
CREATE UNIQUE INDEX `function_points_project_functionality_id_unique` ON `function_points` (`project_functionality_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `functionality_time_project_functionality_id_unique` ON `functionality_time` (`project_functionality_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `module_time_project_module_id_unique` ON `module_time` (`project_module_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `project_timelines_project_id_unique` ON `project_timelines` (`project_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);