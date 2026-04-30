/*
  Warnings:

  - The primary key for the `AssignmentIndicatorDescriptor` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "AssignmentIndicatorDescriptor" DROP CONSTRAINT "AssignmentIndicatorDescriptor_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "AssignmentIndicatorDescriptor_pkey" PRIMARY KEY ("id");
