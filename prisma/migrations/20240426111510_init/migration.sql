-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "apuntes" INTEGER NOT NULL,
    "apuntesFavoritos" TEXT NOT NULL,
    "cantidadApuntesFavoritos" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Apunte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "apunte" TEXT NOT NULL,
    "state" INTEGER NOT NULL,
    "cantidadFavoritos" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
