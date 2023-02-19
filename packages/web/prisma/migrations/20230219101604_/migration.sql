-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromUid" INTEGER NOT NULL,
    "toUid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "msgType" INTEGER NOT NULL,
    "privateMsgId" INTEGER,
    "channelId" INTEGER,
    "pushed" BOOLEAN,
    "read" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_fromUid_fkey" FOREIGN KEY ("fromUid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_toUid_fkey" FOREIGN KEY ("toUid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("channelId", "content", "createdAt", "fromUid", "id", "msgType", "privateMsgId", "pushed", "read", "toUid", "updatedAt") SELECT "channelId", "content", "createdAt", "fromUid", "id", "msgType", "privateMsgId", "pushed", "read", "toUid", "updatedAt" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE INDEX "fromUidAndtoUidIdx" ON "Message"("fromUid", "toUid");
CREATE INDEX "toUidAndFromUidIdx" ON "Message"("toUid", "fromUid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
