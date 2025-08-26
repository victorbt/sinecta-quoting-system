-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'SELLER');

-- CreateEnum
CREATE TYPE "public"."Crop" AS ENUM ('MAIZ', 'TRIGO', 'SORGO', 'CAFE', 'AGAVE');

-- CreateEnum
CREATE TYPE "public"."MxState" AS ENUM ('JALISCO', 'MICHOACAN', 'SINALOA', 'CHIHUAHUA', 'SONORA');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'SELLER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quote" (
    "id" SERIAL NOT NULL,
    "clientName" TEXT NOT NULL,
    "crop" "public"."Crop" NOT NULL,
    "state" "public"."MxState" NOT NULL,
    "areaHa" DECIMAL(12,2) NOT NULL,
    "insuredAmount" DECIMAL(18,2) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3) NOT NULL,
    "polygon" JSONB NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "Quote_crop_state_idx" ON "public"."Quote"("crop", "state");

-- CreateIndex
CREATE INDEX "Quote_ownerId_idx" ON "public"."Quote"("ownerId");

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
