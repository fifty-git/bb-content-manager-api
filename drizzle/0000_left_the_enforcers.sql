-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `bundle_options` (
	`bundle_option_id` int AUTO_INCREMENT NOT NULL,
	`bundle_id` int,
	`option_catalog_id` int,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bundle_options_bundle_option_id` PRIMARY KEY(`bundle_option_id`)
);
--> statement-breakpoint
CREATE TABLE `bundle_products` (
	`bundle_product_id` int AUTO_INCREMENT NOT NULL,
	`bundle_id` int NOT NULL,
	`product_id` int NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bundle_products_bundle_product_id` PRIMARY KEY(`bundle_product_id`)
);
--> statement-breakpoint
CREATE TABLE `bundle_variants` (
	`bundle_variant_id` int AUTO_INCREMENT NOT NULL,
	`bundle_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` decimal(6,2) NOT NULL,
	`active` tinyint NOT NULL DEFAULT 0,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bundle_variants_bundle_variant_id` PRIMARY KEY(`bundle_variant_id`)
);
--> statement-breakpoint
CREATE TABLE `bundles` (
	`bundle_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`active` tinyint NOT NULL DEFAULT 1,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bundles_bundle_id` PRIMARY KEY(`bundle_id`)
);
--> statement-breakpoint
CREATE TABLE `carrier_services` (
	`carrier_service_id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(50) NOT NULL,
	`type` enum('domestic','international') NOT NULL DEFAULT 'domestic',
	`carrier_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `carrier_services_carrier_service_id` PRIMARY KEY(`carrier_service_id`)
);
--> statement-breakpoint
CREATE TABLE `carriers` (
	`carrier_id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(50) NOT NULL,
	`accountNumber` varchar(255) NOT NULL,
	`active` tinyint NOT NULL DEFAULT 1,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `carriers_carrier_id` PRIMARY KEY(`carrier_id`)
);
--> statement-breakpoint
CREATE TABLE `farm_product_varieties` (
	`farm_product_variety_id` int AUTO_INCREMENT NOT NULL,
	`farm_id` int NOT NULL,
	`variety_id` int NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `farm_product_varieties_farm_product_variety_id` PRIMARY KEY(`farm_product_variety_id`)
);
--> statement-breakpoint
CREATE TABLE `farms` (
	`farm_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`country` varchar(50) NOT NULL,
	`city` varchar(255) NOT NULL,
	`email` varchar(50) NOT NULL,
	`active` tinyint NOT NULL DEFAULT 1,
	`carrier_id` int NOT NULL,
	`service_id` int NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `farms_farm_id` PRIMARY KEY(`farm_id`)
);
--> statement-breakpoint
CREATE TABLE `menu` (
	`menu_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`href` varchar(50) NOT NULL,
	`default_href` varchar(50) NOT NULL,
	`icon` varchar(50) NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'default',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `menu_menu_id` PRIMARY KEY(`menu_id`)
);
--> statement-breakpoint
CREATE TABLE `options_catalog` (
	`option_catalog_id` int AUTO_INCREMENT NOT NULL,
	`dropdown_name` varchar(100),
	`product_exists` tinyint DEFAULT 1,
	`creates_po` tinyint DEFAULT 1,
	`manual_options` json,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `options_catalog_option_catalog_id` PRIMARY KEY(`option_catalog_id`)
);
--> statement-breakpoint
CREATE TABLE `product_options` (
	`product_option_id` int AUTO_INCREMENT NOT NULL,
	`option_catalog_id` int,
	`product_id` int,
	`option_name` varchar(100),
	`additional_price` decimal(10,0) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `product_options_product_option_id` PRIMARY KEY(`product_option_id`)
);
--> statement-breakpoint
CREATE TABLE `product_tags` (
	`tag_id` int NOT NULL,
	`product_id` int NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `product_variants` (
	`variant_id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`units` int NOT NULL,
	`measure_units` varchar(20) NOT NULL,
	`season_start` enum('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec') NOT NULL DEFAULT 'Jan',
	`season_end` enum('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec') NOT NULL DEFAULT 'Dec',
	`active` tinyint NOT NULL DEFAULT 1,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `product_variants_variant_id` PRIMARY KEY(`variant_id`)
);
--> statement-breakpoint
CREATE TABLE `product_varieties` (
	`product_variety_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`sku` varchar(255) NOT NULL,
	`cost` decimal(6,2) NOT NULL DEFAULT '0.00',
	`active` tinyint NOT NULL DEFAULT 1,
	`quality` enum('A','B','C') NOT NULL DEFAULT 'A',
	`product_id` int NOT NULL DEFAULT 1,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `product_varieties_product_variety_id` PRIMARY KEY(`product_variety_id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`product_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`upc` varchar(50) NOT NULL,
	`active` tinyint NOT NULL DEFAULT 1,
	`is_standalone` tinyint NOT NULL DEFAULT 1,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `products_product_id` PRIMARY KEY(`product_id`),
	CONSTRAINT `products_pk` UNIQUE(`upc`)
);
--> statement-breakpoint
CREATE TABLE `submenu` (
	`submenu_id` int AUTO_INCREMENT NOT NULL,
	`menu_id` int NOT NULL,
	`name` varchar(50) NOT NULL,
	`href` varchar(50) NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'default',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `submenu_submenu_id` PRIMARY KEY(`submenu_id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`tag_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('PRODUCT','ORDER','PURCHASE ORDER','SEARCHABLE') NOT NULL DEFAULT 'PRODUCT',
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `tags_tag_id` PRIMARY KEY(`tag_id`),
	CONSTRAINT `name` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(50) NOT NULL,
	`last_name` varchar(50) NOT NULL,
	`email` varchar(200) NOT NULL,
	`login` varchar(50) NOT NULL,
	`password` varchar(500) NOT NULL,
	`secure_password` varchar(128),
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_pk` UNIQUE(`login`)
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`workspace_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`bookmarks` json NOT NULL,
	CONSTRAINT `workspaces_workspace_id` PRIMARY KEY(`workspace_id`)
);
--> statement-breakpoint
CREATE INDEX `bundle_id` ON `bundle_products` (`bundle_id`);--> statement-breakpoint
CREATE INDEX `product_id` ON `bundle_products` (`product_id`);--> statement-breakpoint
CREATE INDEX `bundle_id` ON `bundle_variants` (`bundle_id`);--> statement-breakpoint
CREATE INDEX `carrier_id` ON `carrier_services` (`carrier_id`);--> statement-breakpoint
CREATE INDEX `farm_id` ON `farm_product_varieties` (`farm_id`);--> statement-breakpoint
CREATE INDEX `variety_id` ON `farm_product_varieties` (`variety_id`);--> statement-breakpoint
CREATE INDEX `carrier_id` ON `farms` (`carrier_id`);--> statement-breakpoint
CREATE INDEX `service_id` ON `farms` (`service_id`);--> statement-breakpoint
CREATE INDEX `tag_id` ON `product_tags` (`tag_id`);--> statement-breakpoint
CREATE INDEX `product_id` ON `product_tags` (`product_id`);--> statement-breakpoint
ALTER TABLE `bundle_options` ADD CONSTRAINT `bundle_options_bundles_bundle_id_fk` FOREIGN KEY (`bundle_id`) REFERENCES `bundles`(`bundle_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bundle_options` ADD CONSTRAINT `bundle_options_options_catalog_option_catalog_id_fk` FOREIGN KEY (`option_catalog_id`) REFERENCES `options_catalog`(`option_catalog_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bundle_products` ADD CONSTRAINT `bundle_products_ibfk_1` FOREIGN KEY (`bundle_id`) REFERENCES `bundles`(`bundle_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bundle_products` ADD CONSTRAINT `bundle_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bundle_variants` ADD CONSTRAINT `bundle_variants_ibfk_1` FOREIGN KEY (`bundle_id`) REFERENCES `bundles`(`bundle_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `carrier_services` ADD CONSTRAINT `carrier_services_ibfk_1` FOREIGN KEY (`carrier_id`) REFERENCES `carriers`(`carrier_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `farm_product_varieties` ADD CONSTRAINT `farm_product_varieties_ibfk_1` FOREIGN KEY (`farm_id`) REFERENCES `farms`(`farm_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `farm_product_varieties` ADD CONSTRAINT `farm_product_varieties_ibfk_2` FOREIGN KEY (`variety_id`) REFERENCES `product_varieties`(`product_variety_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `farms` ADD CONSTRAINT `farms_ibfk_1` FOREIGN KEY (`carrier_id`) REFERENCES `carriers`(`carrier_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `farms` ADD CONSTRAINT `farms_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `carrier_services`(`carrier_service_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_options` ADD CONSTRAINT `product_options_options_catalog_option_catalog_id_fk` FOREIGN KEY (`option_catalog_id`) REFERENCES `options_catalog`(`option_catalog_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_options` ADD CONSTRAINT `product_options_products_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_tags` ADD CONSTRAINT `product_tags_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`tag_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_tags` ADD CONSTRAINT `product_tags_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_products_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_varieties` ADD CONSTRAINT `product_varieties_products_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `submenu` ADD CONSTRAINT `submenu_menu_menu_id_fk` FOREIGN KEY (`menu_id`) REFERENCES `menu`(`menu_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workspaces` ADD CONSTRAINT `workspaces_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;
*/