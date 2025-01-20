-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` TEXT NOT NULL,
    `credit` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `totalCredit` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookName` VARCHAR(191) NOT NULL,
    `price` DECIMAL(5, 2) NOT NULL,

    UNIQUE INDEX `Book_bookName_key`(`bookName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
