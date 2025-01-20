/*
  Warnings:

  - You are about to drop the column `catagory` on the `book` table. All the data in the column will be lost.
  - Added the required column `category` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` DROP COLUMN `catagory`,
    ADD COLUMN `category` VARCHAR(30) NOT NULL;
