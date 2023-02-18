/*
  Warnings:

  - A unique constraint covering the columns `[fromUid,toUid]` on the table `PrivateMsg` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PrivateMsg_fromUid_toUid_key" ON "PrivateMsg"("fromUid", "toUid");
