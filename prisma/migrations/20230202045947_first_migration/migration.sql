-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "pwd" TEXT NOT NULL,
    "username" TEXT,
    "bio" TEXT
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,
    "create_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "from_uid" INTEGER NOT NULL,
    "to_uid" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "create_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "msg_type" INTEGER NOT NULL,
    "channel_id" INTEGER,
    "pushed" BOOLEAN NOT NULL,
    "read" BOOLEAN NOT NULL,
    "create_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "uid_list" TEXT NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "create_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Friend_uid_friend_id_key" ON "Friend"("uid", "friend_id");
