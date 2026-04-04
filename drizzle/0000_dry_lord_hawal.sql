CREATE TABLE `admin_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`passwordHash` text NOT NULL,
	`passwordSalt` text NOT NULL,
	`name` text,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`lastSignedIn` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customerName` text NOT NULL,
	`customerPhone` text NOT NULL,
	`customerEmail` text NOT NULL,
	`serviceAddress` text NOT NULL,
	`services` text NOT NULL,
	`preferredDate` text,
	`preferredTime` text,
	`notes` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`updatedAt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `owner_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`passwordHash` text NOT NULL,
	`passwordSalt` text NOT NULL,
	`name` text,
	`createdAt` text DEFAULT (datetime('now')) NOT NULL,
	`lastSignedIn` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `owner_users_email_unique` ON `owner_users` (`email`);