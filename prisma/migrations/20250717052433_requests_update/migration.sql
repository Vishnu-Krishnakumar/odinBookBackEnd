/*
  Warnings:

  - You are about to drop the column `published` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "published";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "requests" INTEGER[];
