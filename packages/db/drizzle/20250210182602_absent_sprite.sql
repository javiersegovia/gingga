CREATE TABLE `chat_messages` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`message` text NOT NULL,
	`role` text NOT NULL,
	`status` text DEFAULT 'completed' NOT NULL,
	`parent_message_id` text,
	`content` text,
	`metadata` text,
	`tokens` integer,
	`model_id` text,
	`error` text,
	FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_message_id`) REFERENCES `chat_messages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `project_routes` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`path` text NOT NULL,
	`name` text NOT NULL,
	`purpose` text NOT NULL,
	`key_features` text,
	`user_interaction` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_chats` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`user_id` text NOT NULL,
	`title` text,
	`metadata` text,
	`last_message_at` integer DEFAULT (unixepoch() * 1000),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_chats`("created_at", "updated_at", "id", "project_id", "user_id") SELECT "created_at", "updated_at", "id", "project_id", "user_id" FROM `chats`;--> statement-breakpoint
DROP TABLE `chats`;--> statement-breakpoint
ALTER TABLE `__new_chats` RENAME TO `chats`;--> statement-breakpoint
PRAGMA foreign_keys=ON;