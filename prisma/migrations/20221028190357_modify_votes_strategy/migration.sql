/*
  Warnings:

  - You are about to drop the column `votes` on the `Deck` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "votes",
ADD COLUMN     "voteCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "upvote" BOOLEAN NOT NULL,
    "deckId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
