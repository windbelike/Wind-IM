-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FriendRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "from_uid" INTEGER NOT NULL,
    "to_uid" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "create_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_FriendRequest" ("create_time", "from_uid", "id", "status", "to_uid", "update_time") SELECT "create_time", "from_uid", "id", "status", "to_uid", "update_time" FROM "FriendRequest";
DROP TABLE "FriendRequest";
ALTER TABLE "new_FriendRequest" RENAME TO "FriendRequest";
CREATE UNIQUE INDEX "FriendRequest_from_uid_to_uid_key" ON "FriendRequest"("from_uid", "to_uid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
