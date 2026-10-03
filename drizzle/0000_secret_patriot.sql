-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `rsvps` (
	`hca_id` char(16) NOT NULL,
	`email` char(255) NOT NULL,
	`slack_id` char(16) NOT NULL,
	`name` char(255) NOT NULL,
	`timestamp` datetime NOT NULL DEFAULT 'current_timestamp()',
	`ysws_eligible` tinyint(4) NOT NULL,
	`verification_status` char(16) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shop_items` (
	`id` int(11) NOT NULL,
	`album` char(255) NOT NULL,
	`artist` char(255) NOT NULL,
	`genre` char(255) NOT NULL,
	`category` char(255) NOT NULL,
	`image` text NOT NULL,
	`description` text NOT NULL,
	`media` char(45) NOT NULL,
	`urls` text NOT NULL
);

*/