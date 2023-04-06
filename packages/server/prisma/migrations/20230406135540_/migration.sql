/*
  Warnings:

  - You are about to drop the column `channelId` on the `Message` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromUid" INTEGER NOT NULL,
    "toUid" INTEGER,
    "content" TEXT NOT NULL,
    "msgType" INTEGER NOT NULL,
    "privateMsgId" INTEGER,
    "roomId" INTEGER,
    "pushed" BOOLEAN,
    "read" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_fromUid_fkey" FOREIGN KEY ("fromUid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_toUid_fkey" FOREIGN KEY ("toUid") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("content", "createdAt", "fromUid", "id", "msgType", "privateMsgId", "pushed", "read", "toUid", "updatedAt") SELECT "content", "createdAt", "fromUid", "id", "msgType", "privateMsgId", "pushed", "read", "toUid", "updatedAt" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE INDEX "fromUidAndtoUidIdx" ON "Message"("fromUid", "toUid");
CREATE INDEX "toUidAndFromUidIdx" ON "Message"("toUid", "fromUid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
