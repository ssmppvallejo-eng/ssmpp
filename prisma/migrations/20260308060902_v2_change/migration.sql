/*
  Warnings:

  - You are about to drop the column `subsystemId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `subsystemId` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssignmentIndicatorAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subsystem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dimensionId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dimensionId` to the `Component` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_indicatorId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_subsystemId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentIndicatorAnswer" DROP CONSTRAINT "AssignmentIndicatorAnswer_answerId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentIndicatorAnswer" DROP CONSTRAINT "AssignmentIndicatorAnswer_assignmentIndicatorId_fkey";

-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_subsystemId_fkey";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "subsystemId",
ADD COLUMN     "dimensionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "subsystemId",
ADD COLUMN     "dimensionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "AssignmentIndicatorAnswer";

-- DropTable
DROP TABLE "Subsystem";

-- CreateTable
CREATE TABLE "Descriptor" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "indicatorId" INTEGER NOT NULL,

    CONSTRAINT "Descriptor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentIndicatorDescriptor" (
    "assignmentIndicatorId" INTEGER NOT NULL,
    "descriptorId" INTEGER NOT NULL,
    "valueAssigned" INTEGER NOT NULL,
    "evaluationValue" INTEGER,
    "note" TEXT,
    "evidenceName" TEXT,
    "evidenceUrl" TEXT,
    "addComment" BOOLEAN NOT NULL DEFAULT false,
    "addEvidence" BOOLEAN NOT NULL DEFAULT false,
    "complete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AssignmentIndicatorDescriptor_pkey" PRIMARY KEY ("assignmentIndicatorId","descriptorId")
);

-- CreateTable
CREATE TABLE "Dimension" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Dimension_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dimension_code_key" ON "Dimension"("code");

-- AddForeignKey
ALTER TABLE "Descriptor" ADD CONSTRAINT "Descriptor_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_dimensionId_fkey" FOREIGN KEY ("dimensionId") REFERENCES "Dimension"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentIndicatorDescriptor" ADD CONSTRAINT "AssignmentIndicatorDescriptor_descriptorId_fkey" FOREIGN KEY ("descriptorId") REFERENCES "Descriptor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentIndicatorDescriptor" ADD CONSTRAINT "AssignmentIndicatorDescriptor_assignmentIndicatorId_fkey" FOREIGN KEY ("assignmentIndicatorId") REFERENCES "AssignmentIndicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_dimensionId_fkey" FOREIGN KEY ("dimensionId") REFERENCES "Dimension"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
