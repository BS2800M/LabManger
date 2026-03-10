/*
  Warnings:

  - You are about to drop the column `WarningType` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `WarningType` on the `Location` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ReagentId" INTEGER NOT NULL,
    "LotId" INTEGER NOT NULL,
    "TeamId" INTEGER NOT NULL,
    "Number" INTEGER NOT NULL DEFAULT 0,
    "WarningNum" BOOLEAN NOT NULL DEFAULT false,
    "WarningExpirationDate" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Inventory_ReagentId_fkey" FOREIGN KEY ("ReagentId") REFERENCES "Reagent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inventory_LotId_fkey" FOREIGN KEY ("LotId") REFERENCES "Lot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inventory_TeamId_fkey" FOREIGN KEY ("TeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Inventory" ("LotId", "Number", "ReagentId", "TeamId", "id") SELECT "LotId", "Number", "ReagentId", "TeamId", "id" FROM "Inventory";
DROP TABLE "Inventory";
ALTER TABLE "new_Inventory" RENAME TO "Inventory";
CREATE TABLE "new_Location" (
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
    CONSTRAINT "Location_TeamId_fkey" FOREIGN KEY ("TeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Location" ("LastUploadHumidity", "LastUploadTemperature", "LastUploadTime", "MaxHumidity", "MaxTemperature", "MinHumidity", "MinTemperature", "Name", "Note", "Status", "TeamId", "UploadIntervalMinutes", "id") SELECT "LastUploadHumidity", "LastUploadTemperature", "LastUploadTime", "MaxHumidity", "MaxTemperature", "MinHumidity", "MinTemperature", "Name", "Note", "Status", "TeamId", "UploadIntervalMinutes", "id" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
