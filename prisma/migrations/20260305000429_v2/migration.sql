/*
  Warnings:

  - The primary key for the `Answer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAnswer` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `idIndicator` on the `Answer` table. All the data in the column will be lost.
  - The primary key for the `Component` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idComponent` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `idSubsystem` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `indicatorNumber` on the `Component` table. All the data in the column will be lost.
  - The primary key for the `Indicator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idIndicator` on the `Indicator` table. All the data in the column will be lost.
  - You are about to drop the column `idJudgement` on the `Indicator` table. All the data in the column will be lost.
  - You are about to drop the column `indicatorNumber` on the `Indicator` table. All the data in the column will be lost.
  - The primary key for the `Judgement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idComponent` on the `Judgement` table. All the data in the column will be lost.
  - You are about to drop the column `idJudgement` on the `Judgement` table. All the data in the column will be lost.
  - You are about to drop the column `indicatorNumber` on the `Judgement` table. All the data in the column will be lost.
  - The primary key for the `Subsystem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idSubsystem` on the `Subsystem` table. All the data in the column will be lost.
  - You are about to drop the column `indicatorNumber` on the `Subsystem` table. All the data in the column will be lost.
  - The primary key for the `Template` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `descriptionTemplate` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `idPosgraduate` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `idTemplate` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `nameTemplate` on the `Template` table. All the data in the column will be lost.
  - The primary key for the `TemplateIndicator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idIndicator` on the `TemplateIndicator` table. All the data in the column will be lost.
  - You are about to drop the column `idTemplate` on the `TemplateIndicator` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idUser` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `imgUser` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `valid` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserAssignTo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idAssigment` on the `UserAssignTo` table. All the data in the column will be lost.
  - You are about to drop the column `idUser` on the `UserAssignTo` table. All the data in the column will be lost.
  - You are about to drop the `Assigment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssigmentIndicator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssigmentIndicatorAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Posgraduate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPosgraduate` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Component` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Indicator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Judgement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Subsystem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `indicatorId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subsystemId` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Indicator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judgementId` to the `Indicator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Judgement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `componentId` to the `Judgement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Subsystem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postgraduateId` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indicatorId` to the `TemplateIndicator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateId` to the `TemplateIndicator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignmentId` to the `UserAssignTo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserAssignTo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_idIndicator_fkey";

-- DropForeignKey
ALTER TABLE "Assigment" DROP CONSTRAINT "Assigment_idSubsystem_fkey";

-- DropForeignKey
ALTER TABLE "Assigment" DROP CONSTRAINT "Assigment_idUserOwner_fkey";

-- DropForeignKey
ALTER TABLE "AssigmentIndicator" DROP CONSTRAINT "AssigmentIndicator_idAssigment_fkey";

-- DropForeignKey
ALTER TABLE "AssigmentIndicator" DROP CONSTRAINT "AssigmentIndicator_idIndicator_fkey";

-- DropForeignKey
ALTER TABLE "AssigmentIndicatorAnswer" DROP CONSTRAINT "AssigmentIndicatorAnswer_idAnswer_fkey";

-- DropForeignKey
ALTER TABLE "AssigmentIndicatorAnswer" DROP CONSTRAINT "AssigmentIndicatorAnswer_idAssigmentIndicator_fkey";

-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_idSubsystem_fkey";

-- DropForeignKey
ALTER TABLE "Indicator" DROP CONSTRAINT "Indicator_idJudgement_fkey";

-- DropForeignKey
ALTER TABLE "Judgement" DROP CONSTRAINT "Judgement_idComponent_fkey";

-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_idPosgraduate_fkey";

-- DropForeignKey
ALTER TABLE "TemplateIndicator" DROP CONSTRAINT "TemplateIndicator_idIndicator_fkey";

-- DropForeignKey
ALTER TABLE "TemplateIndicator" DROP CONSTRAINT "TemplateIndicator_idTemplate_fkey";

-- DropForeignKey
ALTER TABLE "UserAssignTo" DROP CONSTRAINT "UserAssignTo_idAssigment_fkey";

-- DropForeignKey
ALTER TABLE "UserAssignTo" DROP CONSTRAINT "UserAssignTo_idUser_fkey";

-- DropForeignKey
ALTER TABLE "UserPosgraduate" DROP CONSTRAINT "UserPosgraduate_idPosgraduate_fkey";

-- DropForeignKey
ALTER TABLE "UserPosgraduate" DROP CONSTRAINT "UserPosgraduate_idUser_fkey";

-- DropIndex
DROP INDEX "Component_indicatorNumber_key";

-- DropIndex
DROP INDEX "Indicator_indicatorNumber_key";

-- DropIndex
DROP INDEX "Judgement_indicatorNumber_key";

-- DropIndex
DROP INDEX "Subsystem_indicatorNumber_key";

-- AlterTable
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_pkey",
DROP COLUMN "idAnswer",
DROP COLUMN "idIndicator",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "indicatorId" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "value" INTEGER NOT NULL,
ADD CONSTRAINT "Answer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Component" DROP CONSTRAINT "Component_pkey",
DROP COLUMN "idComponent",
DROP COLUMN "idSubsystem",
DROP COLUMN "indicatorNumber",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "subsystemId" INTEGER NOT NULL,
ADD CONSTRAINT "Component_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Indicator" DROP CONSTRAINT "Indicator_pkey",
DROP COLUMN "idIndicator",
DROP COLUMN "idJudgement",
DROP COLUMN "indicatorNumber",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "judgementId" INTEGER NOT NULL,
ADD CONSTRAINT "Indicator_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Judgement" DROP CONSTRAINT "Judgement_pkey",
DROP COLUMN "idComponent",
DROP COLUMN "idJudgement",
DROP COLUMN "indicatorNumber",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "componentId" INTEGER NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Judgement_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Subsystem" DROP CONSTRAINT "Subsystem_pkey",
DROP COLUMN "idSubsystem",
DROP COLUMN "indicatorNumber",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Subsystem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Template" DROP CONSTRAINT "Template_pkey",
DROP COLUMN "descriptionTemplate",
DROP COLUMN "idPosgraduate",
DROP COLUMN "idTemplate",
DROP COLUMN "nameTemplate",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "postgraduateId" INTEGER NOT NULL,
ADD CONSTRAINT "Template_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TemplateIndicator" DROP CONSTRAINT "TemplateIndicator_pkey",
DROP COLUMN "idIndicator",
DROP COLUMN "idTemplate",
ADD COLUMN     "indicatorId" INTEGER NOT NULL,
ADD COLUMN     "templateId" INTEGER NOT NULL,
ADD CONSTRAINT "TemplateIndicator_pkey" PRIMARY KEY ("templateId", "indicatorId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "idUser",
DROP COLUMN "imgUser",
DROP COLUMN "userName",
DROP COLUMN "valid",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserAssignTo" DROP CONSTRAINT "UserAssignTo_pkey",
DROP COLUMN "idAssigment",
DROP COLUMN "idUser",
ADD COLUMN     "assignmentId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "UserAssignTo_pkey" PRIMARY KEY ("assignmentId", "userId");

-- DropTable
DROP TABLE "Assigment";

-- DropTable
DROP TABLE "AssigmentIndicator";

-- DropTable
DROP TABLE "AssigmentIndicatorAnswer";

-- DropTable
DROP TABLE "Posgraduate";

-- DropTable
DROP TABLE "UserPosgraduate";

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "subsystemId" INTEGER NOT NULL,
    "assignmentDate" TIMESTAMP(3),
    "submissionDate" TIMESTAMP(3),
    "status" "IndicatorStatus" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentIndicator" (
    "id" SERIAL NOT NULL,
    "indicatorId" INTEGER NOT NULL,
    "assignmentId" INTEGER NOT NULL,

    CONSTRAINT "AssignmentIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentIndicatorAnswer" (
    "assignmentIndicatorId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,
    "answerValue" INTEGER,
    "evaluationValue" INTEGER,
    "note" TEXT,
    "evidenceName" TEXT,
    "evidenceUrl" TEXT,
    "addComment" BOOLEAN NOT NULL DEFAULT false,
    "addEvidence" BOOLEAN NOT NULL DEFAULT false,
    "complete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AssignmentIndicatorAnswer_pkey" PRIMARY KEY ("assignmentIndicatorId","answerId")
);

-- CreateTable
CREATE TABLE "Postgraduate" (
    "id" SERIAL NOT NULL,
    "level" "Level" NOT NULL,
    "knowledgeArea" "Area" NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Postgraduate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPostgraduate" (
    "userId" INTEGER NOT NULL,
    "postgraduateId" INTEGER NOT NULL,

    CONSTRAINT "UserPostgraduate_pkey" PRIMARY KEY ("userId","postgraduateId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Component_code_key" ON "Component"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Indicator_code_key" ON "Indicator"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Judgement_code_key" ON "Judgement"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Subsystem_code_key" ON "Subsystem"("code");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_subsystemId_fkey" FOREIGN KEY ("subsystemId") REFERENCES "Subsystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentIndicator" ADD CONSTRAINT "AssignmentIndicator_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentIndicator" ADD CONSTRAINT "AssignmentIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentIndicatorAnswer" ADD CONSTRAINT "AssignmentIndicatorAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentIndicatorAnswer" ADD CONSTRAINT "AssignmentIndicatorAnswer_assignmentIndicatorId_fkey" FOREIGN KEY ("assignmentIndicatorId") REFERENCES "AssignmentIndicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_subsystemId_fkey" FOREIGN KEY ("subsystemId") REFERENCES "Subsystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_judgementId_fkey" FOREIGN KEY ("judgementId") REFERENCES "Judgement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Judgement" ADD CONSTRAINT "Judgement_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_postgraduateId_fkey" FOREIGN KEY ("postgraduateId") REFERENCES "Postgraduate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateIndicator" ADD CONSTRAINT "TemplateIndicator_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateIndicator" ADD CONSTRAINT "TemplateIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignTo" ADD CONSTRAINT "UserAssignTo_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignTo" ADD CONSTRAINT "UserAssignTo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPostgraduate" ADD CONSTRAINT "UserPostgraduate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPostgraduate" ADD CONSTRAINT "UserPostgraduate_postgraduateId_fkey" FOREIGN KEY ("postgraduateId") REFERENCES "Postgraduate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
