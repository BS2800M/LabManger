/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Session";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Team";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Reagent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Specifications" TEXT NOT NULL,
    "Price" INTEGER NOT NULL DEFAULT 0,
    "StorageCondition" TEXT NOT NULL,
    "Manufacturer" TEXT NOT NULL,
    "Note" TEXT NOT NULL,
    "WarnNumber" INTEGER NOT NULL DEFAULT 0,
    "WarnDays" INTEGER NOT NULL DEFAULT 0,
    "CreateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TeamId" INTEGER NOT NULL,
    "Status" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Lot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ReagentId" INTEGER NOT NULL,
    "ExpirationDate" DATETIME NOT NULL,
    "Status" INTEGER NOT NULL DEFAULT 0,
    "TeamId" INTEGER NOT NULL,
    CONSTRAINT "Lot_ReagentId_fkey" FOREIGN KEY ("ReagentId") REFERENCES "Reagent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ReagentId" INTEGER NOT NULL,
    "LotId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,
    "TeamId" INTEGER NOT NULL,
    "CreateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "BarcodeNumber" TEXT NOT NULL,
    "Action" INTEGER NOT NULL,
    "Note" TEXT NOT NULL,
    "Status" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Operation_ReagentId_fkey" FOREIGN KEY ("ReagentId") REFERENCES "Reagent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Operation_LotId_fkey" FOREIGN KEY ("LotId") REFERENCES "Lot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ReagentId" INTEGER NOT NULL,
    "LotId" INTEGER NOT NULL,
    "TeamId" INTEGER NOT NULL,
    "Number" INTEGER NOT NULL DEFAULT 0,
    "WarningNum" BOOLEAN NOT NULL DEFAULT false,
    "WarningExpirationDate" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Inventory_ReagentId_fkey" FOREIGN KEY ("ReagentId") REFERENCES "Reagent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inventory_LotId_fkey" FOREIGN KEY ("LotId") REFERENCES "Lot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Note" TEXT NOT NULL,
    "Status" INTEGER NOT NULL DEFAULT 0,
    "TeamId" INTEGER NOT NULL,
    "UploadIntervalMinutes" INTEGER NOT NULL DEFAULT 0,
    "MaxTemperature" REAL NOT NULL DEFAULT -50,
    "MinTemperature" REAL NOT NULL DEFAULT -50,
    "MaxHumidity" REAL NOT NULL DEFAULT 100,
    "MinHumidity" REAL NOT NULL DEFAULT 100,
    "LastUploadTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastUploadTemperature" REAL NOT NULL DEFAULT 0,
    "LastUploadHumidity" REAL NOT NULL DEFAULT 0,
    "WarningTemperature" BOOLEAN NOT NULL DEFAULT false,
    "WarningHumidity" BOOLEAN NOT NULL DEFAULT false,
    "WarningUploadTime" BOOLEAN NOT NULL DEFAULT false,
    "LastUploadBattery" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "SensorRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "LocationId" INTEGER NOT NULL,
    "TeamId" INTEGER NOT NULL,
    "TeamName" TEXT NOT NULL DEFAULT '',
    "CreateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Temperature" REAL NOT NULL,
    "Humidity" REAL NOT NULL,
    "Battery" INTEGER NOT NULL DEFAULT 0,
    "WarningTemperature" BOOLEAN NOT NULL DEFAULT false,
    "WarningHumidity" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "SensorRecord_LocationId_fkey" FOREIGN KEY ("LocationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BarcodeCounter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "value" BIGINT NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE INDEX "Operation_BarcodeNumber_idx" ON "Operation"("BarcodeNumber");

-- CreateIndex
CREATE INDEX "Operation_CreateTime_idx" ON "Operation"("CreateTime");

-- CreateIndex
CREATE INDEX "Operation_TeamId_idx" ON "Operation"("TeamId");
