-- CreateTable
CREATE TABLE "SensorRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "LocationId" INTEGER NOT NULL,
    "CreateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Temperature" REAL NOT NULL,
    "Humidity" REAL NOT NULL,
    CONSTRAINT "SensorRecord_LocationId_fkey" FOREIGN KEY ("LocationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
