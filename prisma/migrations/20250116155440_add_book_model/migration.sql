-- CreateTable
CREATE TABLE `Book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookName` VARCHAR(191) NOT NULL,
    `catagory` VARCHAR(30) NOT NULL,
    `price` DECIMAL(5, 2) NOT NULL,

    UNIQUE INDEX `Book_bookName_key`(`bookName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
