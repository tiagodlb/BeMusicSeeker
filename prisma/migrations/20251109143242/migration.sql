/*
  Warnings:

  - You are about to alter the column `social_links` on the `users` table. The data in that column could be lost. The data in that column will be cast from `JsonB` to `VarChar(255)`.
  - Made the column `social_links` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "social_links" SET NOT NULL,
ALTER COLUMN "social_links" SET DATA TYPE VARCHAR(255);
