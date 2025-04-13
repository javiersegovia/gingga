CREATE TABLE `accounts` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `verifications` (
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);--> statement-breakpoint
ALTER TABLE `sessions` ADD COLUMN `created_at` integer;--> statement-breakpoint
UPDATE `sessions` SET `created_at` = (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `sessions` ADD COLUMN `updated_at` integer;--> statement-breakpoint
UPDATE `sessions` SET `updated_at` = (unixepoch() * 1000);--> statement-breakpoint
ALTER TABLE `sessions` ADD COLUMN `ip_address` text;--> statement-breakpoint
ALTER TABLE `sessions` ADD COLUMN `user_agent` text;--> statement-breakpoint
ALTER TABLE `sessions` ADD COLUMN `token` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `email_verified` integer;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `email_verified_at`;