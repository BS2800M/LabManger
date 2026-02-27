-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "SessionId" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    "TeamId" INTEGER NOT NULL,
    "Role" INTEGER NOT NULL,
    "CreateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_SessionId_key" ON "Session"("SessionId");
