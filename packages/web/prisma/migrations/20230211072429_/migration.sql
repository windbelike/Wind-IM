/*
  Warnings:

  - You are about to drop the column `uidList` on the `Channel` table. All the data in the column will be lost.
  - The primary key for the `Friend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `friendAlias` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Friend` table. All the data in the column will be lost.
  - Added the required column `status` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "UsersOnChannels" (
    "uid" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "invitedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("uid", "channelId"),
    CONSTRAINT "UsersOnChannels_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsersOnChannels_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromUid" INTEGER NOT NULL,
    "toUid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "msgType" INTEGER NOT NULL,
    "channelId" INTEGER,
    "pushed" BOOLEAN NOT NULL,
    "read" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_fromUid_fkey" FOREIGN KEY ("fromUid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_toUid_fkey" FOREIGN KEY ("toUid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("channelId", "content", "createdAt", "fromUid", "id", "msgType", "pushed", "read", "toUid", "updatedAt") SELECT "channelId", "content", "createdAt", "fromUid", "id", "msgType", "pushed", "read", "toUid", "updatedAt" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE INDEX "fromUidAndtoUidIdx" ON "Message"("fromUid", "toUid");
CREATE INDEX "toUidAndFromUidIdx" ON "Message"("toUid", "fromUid");
CREATE TABLE "new_Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "ownerUid" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Channel" ("createdAt", "desc", "id", "name", "ownerUid", "updatedAt") SELECT "createdAt", "desc", "id", "name", "ownerUid", "updatedAt" FROM "Channel";
DROP TABLE "Channel";
ALTER TABLE "new_Channel" RENAME TO "Channel";
CREATE INDEX "ownerUidIdx" ON "Channel"("ownerUid");
CREATE TABLE "new_Friend" (
    "uid" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,
    "alias" TEXT NOT NULL DEFAULT '',
    "status" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("uid", "friendId"),
    CONSTRAINT "Friend_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Friend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Friend" ("createdAt", "friendId", "status", "uid", "updatedAt") SELECT "createdAt", "friendId", "status", "uid", "updatedAt" FROM "Friend";
DROP TABLE "Friend";
ALTER TABLE "new_Friend" RENAME TO "Friend";
CREATE TABLE "new_FriendRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromUid" INTEGER NOT NULL,
    "toUid" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FriendRequest_fromUid_fkey" FOREIGN KEY ("fromUid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FriendRequest_toUid_fkey" FOREIGN KEY ("toUid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FriendRequest" ("content", "createdAt", "fromUid", "id", "status", "toUid", "updatedAt") SELECT "content", "createdAt", "fromUid", "id", "status", "toUid", "updatedAt" FROM "FriendRequest";
DROP TABLE "FriendRequest";
ALTER TABLE "new_FriendRequest" RENAME TO "FriendRequest";
CREATE UNIQUE INDEX "FriendRequest_fromUid_toUid_key" ON "FriendRequest"("fromUid", "toUid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
