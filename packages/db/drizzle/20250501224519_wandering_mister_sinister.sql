CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`agent_id` text,
	`chat_id` text,
	`full_name` text,
	`email` text,
	`phone` text,
	`subject_interest` text,
	`raw_message_json` text NOT NULL,
	`utm_source` text,
	`qualification` text,
	`qualification_score` integer,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
ALTER TABLE `agents` ADD `agent_type` text NOT NULL DEFAULT 'chat';