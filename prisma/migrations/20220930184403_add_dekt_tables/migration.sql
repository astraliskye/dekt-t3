/*
  Warnings:

  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Example";

-- CreateTable
CREATE TABLE "Deck" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeckTag" (
    "deckId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "DeckTag_pkey" PRIMARY KEY ("deckId","tagId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "affinity" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "secondaryEffects" TEXT[],
    "teamSecondaryEffects" TEXT[],

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatEffect" (
    "id" TEXT NOT NULL,
    "effectTypeId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "percent" BOOLEAN NOT NULL,
    "cardId" TEXT NOT NULL,
    "teamCardId" TEXT NOT NULL,

    CONSTRAINT "StatEffect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EffectType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EffectType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckTag" ADD CONSTRAINT "DeckTag_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckTag" ADD CONSTRAINT "DeckTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatEffect" ADD CONSTRAINT "StatEffect_effectTypeId_fkey" FOREIGN KEY ("effectTypeId") REFERENCES "EffectType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatEffect" ADD CONSTRAINT "StatEffect_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatEffect" ADD CONSTRAINT "StatEffect_teamCardId_fkey" FOREIGN KEY ("teamCardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
