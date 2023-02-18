-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "pwd" TEXT NOT NULL,
    "username" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,
    "friendAlias" TEXT NOT NULL DEFAULT '',
    "status" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromUid" INTEGER NOT NULL,
    "toUid" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromUid" INTEGER NOT NULL,
    "toUid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "msgType" INTEGER NOT NULL,
    "channelId" INTEGER,
    "pushed" BOOLEAN NOT NULL,
    "read" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "uidList" TEXT NOT NULL,
    "ownerUid" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Friend_uid_friendId_key" ON "Friend"("uid", "friendId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_fromUid_toUid_key" ON "FriendRequest"("fromUid", "toUid");

-- CreateIndex
CREATE INDEX "fromUidAndtoUidIdx" ON "Message"("fromUid", "toUid");

-- CreateIndex
CREATE INDEX "toUidAndFromUidIdx" ON "Message"("toUid", "fromUid");

-- CreateIndex
CREATE INDEX "ownerUidIdx" ON "Channel"("ownerUid");
