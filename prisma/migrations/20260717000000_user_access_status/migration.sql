-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- Replace User.active with User.accessStatus, preserving existing approvals
ALTER TABLE "User" ADD COLUMN "accessStatus" "AccessStatus" NOT NULL DEFAULT 'PENDIENTE';

UPDATE "User" SET "accessStatus" = 'APROBADO' WHERE "active" = true;

ALTER TABLE "User" DROP COLUMN "active";
