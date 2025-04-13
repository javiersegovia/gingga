DROP INDEX "function_points_project_functionality_id_unique";--> statement-breakpoint
DROP INDEX "functionality_time_project_functionality_id_unique";--> statement-breakpoint
DROP INDEX "module_time_project_module_id_unique";--> statement-breakpoint
DROP INDEX "project_timelines_project_id_unique";--> statement-breakpoint
DROP INDEX "projects_slug_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `timeline_items` ALTER COLUMN "month_number" TO "month_number" integer;--> statement-breakpoint
CREATE UNIQUE INDEX `function_points_project_functionality_id_unique` ON `function_points` (`project_functionality_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `functionality_time_project_functionality_id_unique` ON `functionality_time` (`project_functionality_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `module_time_project_module_id_unique` ON `module_time` (`project_module_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `project_timelines_project_id_unique` ON `project_timelines` (`project_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);