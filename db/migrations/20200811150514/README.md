# Migration `20200811150514`

This migration has been generated by Alan at 8/11/2020, 5:05:14 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_User" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" DATETIME NOT NULL,
"name" TEXT ,
"email" TEXT NOT NULL,
"hashedPassword" TEXT ,
"role" TEXT NOT NULL DEFAULT 'user')

INSERT INTO "new_User" ("id", "createdAt", "updatedAt", "role") SELECT "id", "createdAt", "updatedAt", "role" FROM "User"

PRAGMA foreign_keys=off;
DROP TABLE "User";;
PRAGMA foreign_keys=on

ALTER TABLE "new_User" RENAME TO "User";

CREATE UNIQUE INDEX "User.email_unique" ON "User"("email")

PRAGMA foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200811142623..20200811150514
--- datamodel.dml
+++ datamodel.dml
@@ -2,16 +2,16 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource sqlite {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 // SQLite is easy to start with, but if you use Postgres in production
 // you should also use it in development with the following:
 //datasource postgresql {
 //  provider = "postgresql"
-//  url = "***"
+//  url = "***"
 //}
 generator client {
   provider = "prisma-client-js"
@@ -19,13 +19,16 @@
 // --------------------------------------
 model User {
-  id        Int       @default(autoincrement()) @id
-  createdAt DateTime  @default(now())
-  updatedAt DateTime  @updatedAt
-  role      String    @default("user")
-  sessions  Session[]
+  id             Int       @default(autoincrement()) @id
+  createdAt      DateTime  @default(now())
+  updatedAt      DateTime  @updatedAt
+  name           String?
+  email          String    @unique
+  hashedPassword String?
+  role           String    @default("user")
+  sessions       Session[]
 }
 model Session {
   id                 Int       @default(autoincrement()) @id
```

