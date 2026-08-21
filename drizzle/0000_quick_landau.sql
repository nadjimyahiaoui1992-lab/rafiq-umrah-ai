CREATE TABLE `agencies` (
	`id` varchar(36) NOT NULL,
	`ownerUserId` int NOT NULL,
	`slug` varchar(120) NOT NULL,
	`legalName` varchar(180) NOT NULL,
	`displayName` varchar(180) NOT NULL,
	`description` text,
	`city` varchar(120),
	`address` text,
	`websiteUrl` varchar(500),
	`whatsappE164` varchar(18),
	`verificationStatus` enum('pending','verified','rejected','suspended') NOT NULL DEFAULT 'pending',
	`verificationNote` text,
	`logoKey` varchar(500),
	`lastProfileUpdatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agencies_id` PRIMARY KEY(`id`),
	CONSTRAINT `agencies_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `agencies_owner_unique` UNIQUE(`ownerUserId`)
);
--> statement-breakpoint
CREATE TABLE `agency_documents` (
	`id` varchar(36) NOT NULL,
	`agencyId` varchar(36) NOT NULL,
	`documentType` enum('registration','license','identity','other') NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`mimeType` varchar(120) NOT NULL,
	`reviewStatus` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`reviewedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agency_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` varchar(36) NOT NULL,
	`actorUserId` int,
	`action` varchar(120) NOT NULL,
	`entityType` varchar(80) NOT NULL,
	`entityId` varchar(36),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`offerId` varchar(36) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `favorites_user_offer_unique` UNIQUE(`userId`,`offerId`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` varchar(36) NOT NULL,
	`requestId` varchar(36) NOT NULL,
	`agencyId` varchar(36) NOT NULL,
	`matchScore` int NOT NULL,
	`status` enum('proposed','shared','contacted','won','lost','closed') NOT NULL DEFAULT 'proposed',
	`contactSharedAt` timestamp,
	`agencyNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `leads_request_agency_unique` UNIQUE(`requestId`,`agencyId`)
);
--> statement-breakpoint
CREATE TABLE `offer_events` (
	`id` varchar(36) NOT NULL,
	`offerId` varchar(36) NOT NULL,
	`agencyId` varchar(36) NOT NULL,
	`eventType` enum('view','request','whatsapp_click','compare','favorite') NOT NULL,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `offer_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `offer_media` (
	`id` varchar(36) NOT NULL,
	`offerId` varchar(36) NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`altText` varchar(200),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `offer_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `offers` (
	`id` varchar(36) NOT NULL,
	`agencyId` varchar(36) NOT NULL,
	`title` varchar(220) NOT NULL,
	`summary` text,
	`priceDzd` decimal(12,2) NOT NULL,
	`departureWilaya` varchar(80) NOT NULL,
	`departureDate` timestamp NOT NULL,
	`returnDate` timestamp NOT NULL,
	`durationDays` int NOT NULL,
	`makkahHotel` varchar(180),
	`madinahHotel` varchar(180),
	`hotelStars` int,
	`distanceToHaramMeters` int,
	`flightType` enum('direct','stopover','unknown') NOT NULL DEFAULT 'unknown',
	`airline` varchar(120),
	`transportIncluded` boolean NOT NULL DEFAULT false,
	`mealsIncluded` boolean NOT NULL DEFAULT false,
	`visaIncluded` boolean NOT NULL DEFAULT false,
	`services` json,
	`seatsAvailable` int,
	`terms` text,
	`sourceLabel` varchar(180),
	`sourceUrl` varchar(500),
	`sourceCheckedAt` timestamp,
	`priceUpdatedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	`status` enum('draft','pending_review','active','rejected','archived','expired') NOT NULL DEFAULT 'draft',
	`isFeatured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `offers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platform_settings` (
	`key` varchar(120) NOT NULL,
	`value` json NOT NULL,
	`updatedByUserId` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platform_settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`phoneE164` varchar(18),
	`wilaya` varchar(80),
	`preferredLocale` enum('ar','fr','en') NOT NULL DEFAULT 'ar',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` varchar(36) NOT NULL,
	`authorUserId` int NOT NULL,
	`agencyId` varchar(36),
	`offerId` varchar(36),
	`rating` int NOT NULL,
	`body` text,
	`status` enum('pending','published','reported','hidden') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `umrah_requests` (
	`id` varchar(36) NOT NULL,
	`userId` int,
	`wilaya` varchar(80) NOT NULL,
	`peopleCount` int NOT NULL,
	`travelDate` timestamp,
	`budgetDzd` decimal(12,2) NOT NULL,
	`desiredDurationDays` int,
	`hotelPreference` varchar(100),
	`maxDistanceMeters` int,
	`flightPreference` enum('direct','stopover','any') NOT NULL DEFAULT 'any',
	`requestedServices` json,
	`note` text,
	`contactPhoneE164` varchar(18) NOT NULL,
	`consentToShare` boolean NOT NULL DEFAULT false,
	`status` enum('new','matched','closed','cancelled') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `umrah_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','agency','admin','super_admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `agencies` ADD CONSTRAINT `agencies_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agency_documents` ADD CONSTRAINT `agency_documents_agencyId_agencies_id_fk` FOREIGN KEY (`agencyId`) REFERENCES `agencies`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agency_documents` ADD CONSTRAINT `agency_documents_reviewedByUserId_users_id_fk` FOREIGN KEY (`reviewedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_offerId_offers_id_fk` FOREIGN KEY (`offerId`) REFERENCES `offers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_requestId_umrah_requests_id_fk` FOREIGN KEY (`requestId`) REFERENCES `umrah_requests`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_agencyId_agencies_id_fk` FOREIGN KEY (`agencyId`) REFERENCES `agencies`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `offer_events` ADD CONSTRAINT `offer_events_offerId_offers_id_fk` FOREIGN KEY (`offerId`) REFERENCES `offers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `offer_events` ADD CONSTRAINT `offer_events_agencyId_agencies_id_fk` FOREIGN KEY (`agencyId`) REFERENCES `agencies`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `offer_media` ADD CONSTRAINT `offer_media_offerId_offers_id_fk` FOREIGN KEY (`offerId`) REFERENCES `offers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `offers` ADD CONSTRAINT `offers_agencyId_agencies_id_fk` FOREIGN KEY (`agencyId`) REFERENCES `agencies`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `platform_settings` ADD CONSTRAINT `platform_settings_updatedByUserId_users_id_fk` FOREIGN KEY (`updatedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_authorUserId_users_id_fk` FOREIGN KEY (`authorUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_agencyId_agencies_id_fk` FOREIGN KEY (`agencyId`) REFERENCES `agencies`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_offerId_offers_id_fk` FOREIGN KEY (`offerId`) REFERENCES `offers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `umrah_requests` ADD CONSTRAINT `umrah_requests_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `agencies_verification_idx` ON `agencies` (`verificationStatus`);--> statement-breakpoint
CREATE INDEX `agency_documents_agency_idx` ON `agency_documents` (`agencyId`);--> statement-breakpoint
CREATE INDEX `audit_logs_entity_idx` ON `audit_logs` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `audit_logs_actor_idx` ON `audit_logs` (`actorUserId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `leads_agency_status_idx` ON `leads` (`agencyId`,`status`);--> statement-breakpoint
CREATE INDEX `offer_events_offer_idx` ON `offer_events` (`offerId`,`eventType`,`occurredAt`);--> statement-breakpoint
CREATE INDEX `offer_events_agency_idx` ON `offer_events` (`agencyId`,`eventType`,`occurredAt`);--> statement-breakpoint
CREATE INDEX `offer_media_offer_idx` ON `offer_media` (`offerId`,`sortOrder`);--> statement-breakpoint
CREATE INDEX `offers_public_search_idx` ON `offers` (`status`,`departureWilaya`,`departureDate`);--> statement-breakpoint
CREATE INDEX `offers_agency_idx` ON `offers` (`agencyId`,`status`);--> statement-breakpoint
CREATE INDEX `offers_expiry_idx` ON `offers` (`expiresAt`);--> statement-breakpoint
CREATE INDEX `reviews_agency_status_idx` ON `reviews` (`agencyId`,`status`);--> statement-breakpoint
CREATE INDEX `reviews_offer_status_idx` ON `reviews` (`offerId`,`status`);--> statement-breakpoint
CREATE INDEX `umrah_requests_user_idx` ON `umrah_requests` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `umrah_requests_status_idx` ON `umrah_requests` (`status`);