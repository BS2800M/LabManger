-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "WarningType" INTEGER NOT NULL DEFAULT 0,
    "LastUploadTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastUploadTemperature" REAL NOT NULL DEFAULT 0,
    "LastUploadHumidity" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "Location_TeamId_fkey" FOREIGN KEY ("TeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Location" ("MaxHumidity", "MaxTemperature", "MinHumidity", "MinTemperature", "Name", "Note", "Status", "TeamId", "UploadIntervalMinutes", "id") SELECT "MaxHumidity", "MaxTemperature", "MinHumidity", "MinTemperature", "Name", "Note", "Status", "TeamId", "UploadIntervalMinutes", "id" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
