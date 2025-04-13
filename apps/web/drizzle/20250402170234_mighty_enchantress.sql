CREATE TABLE `available_integrations` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`service_type` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`logo_url` text,
	`default_scopes` text,
	`is_enabled` integer DEFAULT true
);
--> statement-breakpoint
CREATE UNIQUE INDEX `available_integrations_service_type_unique` ON `available_integrations` (`service_type`);--> statement-breakpoint
CREATE TABLE `integration_action_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`user_integration_id` text NOT NULL,
	`action_type` text NOT NULL,
	`status` text NOT NULL,
	`details` text,
	`error_message` text,
	FOREIGN KEY (`user_integration_id`) REFERENCES `user_integrations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_integrations` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000),
	`user_id` text NOT NULL,
	`available_integration_id` text NOT NULL,
	`encrypted_access_token` text NOT NULL,
	`encrypted_refresh_token` text,
	`token_expires_at` integer,
	`granted_scopes` text,
	`status` text DEFAULT 'active' NOT NULL,
	`last_error` text,
	`external_account_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`available_integration_id`) REFERENCES `available_integrations`(`id`) ON UPDATE no action ON DELETE cascade
);
