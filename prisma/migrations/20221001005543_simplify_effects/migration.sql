/*
  Warnings:

  - You are about to drop the column `secondaryEffects` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `teamSecondaryEffects` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `teamCardId` on the `StatEffect` table. All the data in the column will be lost.
  - Added the required column `team` to the `StatEffect` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StatEffect" DROP CONSTRAINT "StatEffect_teamCardId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "secondaryEffects",
DROP COLUMN "teamSecondaryEffects";

-- AlterTable
ALTER TABLE "StatEffect" DROP COLUMN "teamCardId",
ADD COLUMN     "team" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "SecondaryEffect" (
    "id" TEXT NOT NULL,
    "effect" TEXT NOT NULL,
    "team" BOOLEAN NOT NULL,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "SecondaryEffect_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SecondaryEffect" ADD CONSTRAINT "SecondaryEffect_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
