/*
  Warnings:

  - Added the required column `catagory` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` ADD COLUMN `catagory` VARCHAR(30) NOT NULL;
