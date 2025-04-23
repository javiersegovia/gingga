PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chats` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`user_id` text,
	`title` text,
	`metadata` text,
	`last_message_at` integer DEFAULT (unixepoch() * 1000),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_chats`("created_at", "updated_at", "id", "project_id", "user_id", "title", "metadata", "last_message_at") SELECT "created_at", "updated_at", "id", "project_id", "user_id", "title", "metadata", "last_message_at" FROM `chats`;--> statement-breakpoint
DROP TABLE `chats`;--> statement-breakpoint
ALTER TABLE `__new_chats` RENAME TO `chats`;--> statement-breakpoint
PRAGMA foreign_keys=ON;