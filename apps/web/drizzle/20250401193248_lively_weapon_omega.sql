CREATE TABLE `agents` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`owner_id` text,
	`name` text NOT NULL,
	`description` text,
	`instructions` text NOT NULL,
	`model_id` text,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `user_memberships` (
	`user_id` text PRIMARY KEY NOT NULL,
	`tier` text NOT NULL,
	`daily_reset_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`monthly_reset_at` integer DEFAULT ((unixepoch() + (31 * 24 * 60 * 60)) * 1000) NOT NULL,
	`daily_used` integer DEFAULT 0,
	`monthly_standard_used` integer DEFAULT 0,
	`monthly_premium_used` integer DEFAULT 0,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chats` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`user_id` text,
	`agent_id` text,
	`title` text,
	`visibility` text DEFAULT 'private' NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_chats`("created_at", "updated_at", "id", "project_id", "user_id", "agent_id", "title", "visibility") SELECT "created_at", "updated_at", "id", "project_id", "user_id", NULL, "title", "visibility" FROM `chats`;--> statement-breakpoint
DROP TABLE `chats`;--> statement-breakpoint
ALTER TABLE `__new_chats` RENAME TO `chats`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `sessions` ADD `impersonated_by` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `users` ADD `role` text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `banned` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `ban_reason` text;--> statement-breakpoint
ALTER TABLE `users` ADD `ban_expires` integer;