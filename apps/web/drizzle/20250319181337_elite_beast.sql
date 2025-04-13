ALTER TABLE `chat_messages` ADD `parts` text NOT NULL;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD `attachments` text;--> statement-breakpoint
ALTER TABLE `chat_messages` DROP COLUMN `message`;--> statement-breakpoint
ALTER TABLE `chat_messages` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `chat_messages` DROP COLUMN `content`;--> statement-breakpoint
ALTER TABLE `chat_messages` DROP COLUMN `metadata`;--> statement-breakpoint
ALTER TABLE `chat_messages` DROP COLUMN `tokens`;--> statement-breakpoint
ALTER TABLE `chat_messages` DROP COLUMN `error`;--> statement-breakpoint
ALTER TABLE `chats` ADD `visibility` text DEFAULT 'private' NOT NULL;--> statement-breakpoint
ALTER TABLE `chats` DROP COLUMN `metadata`;--> statement-breakpoint
ALTER TABLE `chats` DROP COLUMN `last_message_at`;