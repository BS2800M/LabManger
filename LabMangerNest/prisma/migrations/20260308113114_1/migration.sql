-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ReagentId" INTEGER NOT NULL,
    "LotId" INTEGER NOT NULL,
    "TeamId" INTEGER NOT NULL,
    "Number" INTEGER NOT NULL DEFAULT 0,
    "WarningType" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Inventory_ReagentId_fkey" FOREIGN KEY ("ReagentId") REFERENCES "Reagent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inventory_LotId_fkey" FOREIGN KEY ("LotId") REFERENCES "Lot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inventory_TeamId_fkey" FOREIGN KEY ("TeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Inventory" ("LotId", "Number", "ReagentId", "TeamId", "id") SELECT "LotId", "Number", "ReagentId", "TeamId", "id" FROM "Inventory";
DROP TABLE "Inventory";
ALTER TABLE "new_Inventory" RENAME TO "Inventory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
