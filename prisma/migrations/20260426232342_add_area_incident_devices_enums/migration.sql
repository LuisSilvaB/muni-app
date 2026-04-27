/*
  Warnings:

  - You are about to drop the column `branch_id` on the `user_roots` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('COMPUTER', 'PRINTER', 'SERVER', 'NETWORK', 'OTHER');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED');

-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('HARDWARE', 'SOFTWARE', 'NETWORK', 'POWER', 'OTHER');

-- CreateEnum
CREATE TYPE "IncidentPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- AlterTable
ALTER TABLE "user_roots" DROP COLUMN "branch_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" VARCHAR(50),
ADD COLUMN     "position" VARCHAR(100);

-- CreateTable
CREATE TABLE "user_areas" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "area_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" UUID NOT NULL,
    "root_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50),
    "description" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" UUID NOT NULL,
    "root_id" UUID NOT NULL,
    "area_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "DeviceType" NOT NULL DEFAULT 'COMPUTER',
    "serial_number" VARCHAR(100),
    "brand" VARCHAR(100),
    "model" VARCHAR(100),
    "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
    "ip_address" VARCHAR(50),
    "purchase_date" DATE,
    "warranty_expiry" DATE,
    "notes" VARCHAR(1000),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" UUID NOT NULL,
    "root_id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "area_id" UUID NOT NULL,
    "reported_by_id" UUID NOT NULL,
    "assigned_to_id" UUID,
    "type" "IncidentType" NOT NULL DEFAULT 'HARDWARE',
    "priority" "IncidentPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "description" VARCHAR(2000) NOT NULL,
    "solution" VARCHAR(2000),
    "observations" VARCHAR(1000),
    "location" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "resolved_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_attachments" (
    "id" UUID NOT NULL,
    "incident_id" UUID NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_type" VARCHAR(100),
    "file_size" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incident_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_areas_user_id_area_id_key" ON "user_areas"("user_id", "area_id");

-- CreateIndex
CREATE INDEX "areas_deleted_at_idx" ON "areas"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "areas_root_id_code_key" ON "areas"("root_id", "code");

-- CreateIndex
CREATE INDEX "devices_deleted_at_idx" ON "devices"("deleted_at");

-- CreateIndex
CREATE INDEX "incidents_deleted_at_idx" ON "incidents"("deleted_at");

-- AddForeignKey
ALTER TABLE "user_areas" ADD CONSTRAINT "user_areas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_areas" ADD CONSTRAINT "user_areas_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_root_id_fkey" FOREIGN KEY ("root_id") REFERENCES "roots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_root_id_fkey" FOREIGN KEY ("root_id") REFERENCES "roots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_root_id_fkey" FOREIGN KEY ("root_id") REFERENCES "roots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_reported_by_id_fkey" FOREIGN KEY ("reported_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_attachments" ADD CONSTRAINT "incident_attachments_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
