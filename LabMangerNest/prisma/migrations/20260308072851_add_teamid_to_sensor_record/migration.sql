/*
  Warnings:

  - Added the required column `TeamId` to the `SensorRecord` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SensorRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "LocationId" INTEGER NOT NULL,
    "TeamId" INTEGER NOT NULL,
    "CreateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Temperature" REAL NOT NULL,
    "Humidity" REAL NOT NULL,
    CONSTRAINT "SensorRecord_LocationId_fkey" FOREIGN KEY ("LocationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SensorRecord_TeamId_fkey" FOREIGN KEY ("TeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SensorRecord" ("CreateTime", "Humidity", "LocationId", "TeamId", "Temperature", "id") SELECT "CreateTime", "Humidity", "LocationId", 1, "Temperature", "id" FROM "SensorRecord";
DROP TABLE "SensorRecord";
ALTER TABLE "new_SensorRecord" RENAME TO "SensorRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
