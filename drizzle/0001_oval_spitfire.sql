CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sender` varchar(50) NOT NULL,
	`text` text NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `modules_id` PRIMARY KEY(`id`),
	CONSTRAINT `modules_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `operatorData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`data` date NOT NULL,
	`operador` varchar(255) NOT NULL,
	`leads` int NOT NULL DEFAULT 0,
	`ligacoes` int NOT NULL DEFAULT 0,
	`atendidas` int NOT NULL DEFAULT 0,
	`reunioesAgendadas` int NOT NULL DEFAULT 0,
	`reunioesRealizadas` int NOT NULL DEFAULT 0,
	`vendas` int NOT NULL DEFAULT 0,
	`noShow` int NOT NULL DEFAULT 0,
	`mrr` decimal(10,2) NOT NULL DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `operatorData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `operators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `operators_id` PRIMARY KEY(`id`),
	CONSTRAINT `operators_name_unique` UNIQUE(`name`)
);
