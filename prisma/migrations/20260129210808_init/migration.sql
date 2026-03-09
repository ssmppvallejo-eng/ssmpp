-- CreateEnum
CREATE TYPE "Area" AS ENUM ('CIENCIAS_EXACTAS', 'CIENCIAS_NATURALES_Y_AGROPECUARIAS', 'CIENCIAS_DE_LA_SALUD', 'CIENCIAS_DE_LA_EDUCACION_Y_HUMANIDADES', 'CIENCIAS_SOCIALES_Y_ADMINISTRATIVAS', 'INGENIERIA_Y_TECNOLOGIAS');

-- CreateEnum
CREATE TYPE "IndicatorStatus" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'ENVIADO', 'EN_REVISION', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('ESPECIALIDADES', 'MAESTRIAS', 'DOCTORADOS', 'ESPECIALIDADES_MEDICAS');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRADOR', 'ESTUDIANTE', 'COORDINADOR', 'PROFESOR', 'EVALUADOR');

-- CreateTable
CREATE TABLE "Answer" (
    "idAnswer" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "idIndicator" INTEGER NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("idAnswer")
);

-- CreateTable
CREATE TABLE "Assigment" (
    "idAssigment" SERIAL NOT NULL,
    "idUserOwner" INTEGER NOT NULL,
    "idSubsystem" INTEGER NOT NULL,
    "assignmentDate" TIMESTAMP(3),
    "submissionDate" TIMESTAMP(3),
    "status" "IndicatorStatus" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "Assigment_pkey" PRIMARY KEY ("idAssigment")
);

-- CreateTable
CREATE TABLE "AssigmentIndicator" (
    "idAssigmentIndicator" SERIAL NOT NULL,
    "idIndicator" INTEGER NOT NULL,
    "idAssigment" INTEGER NOT NULL,

    CONSTRAINT "AssigmentIndicator_pkey" PRIMARY KEY ("idAssigmentIndicator")
);

-- CreateTable
CREATE TABLE "AssigmentIndicatorAnswer" (
    "idAssigmentIndicator" INTEGER NOT NULL,
    "idAnswer" INTEGER NOT NULL,
    "value" INTEGER,
    "note" TEXT,
    "evidenceName" TEXT,
    "urlEvidence" TEXT,
    "complete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AssigmentIndicatorAnswer_pkey" PRIMARY KEY ("idAssigmentIndicator","idAnswer")
);

-- CreateTable
CREATE TABLE "Component" (
    "idComponent" SERIAL NOT NULL,
    "indicatorNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "idSubsystem" INTEGER NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("idComponent")
);

-- CreateTable
CREATE TABLE "Indicator" (
    "idIndicator" SERIAL NOT NULL,
    "indicatorNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "idJudgement" INTEGER NOT NULL,

    CONSTRAINT "Indicator_pkey" PRIMARY KEY ("idIndicator")
);

-- CreateTable
CREATE TABLE "Judgement" (
    "idJudgement" SERIAL NOT NULL,
    "indicatorNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "idComponent" INTEGER NOT NULL,

    CONSTRAINT "Judgement_pkey" PRIMARY KEY ("idJudgement")
);

-- CreateTable
CREATE TABLE "Posgraduate" (
    "idPosgraduate" SERIAL NOT NULL,
    "level" "Level" NOT NULL,
    "knowledgeArea" "Area" NOT NULL,
    "posgraduateTitle" TEXT NOT NULL,

    CONSTRAINT "Posgraduate_pkey" PRIMARY KEY ("idPosgraduate")
);

-- CreateTable
CREATE TABLE "Subsystem" (
    "idSubsystem" SERIAL NOT NULL,
    "indicatorNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Subsystem_pkey" PRIMARY KEY ("idSubsystem")
);

-- CreateTable
CREATE TABLE "Template" (
    "idTemplate" SERIAL NOT NULL,
    "nameTemplate" TEXT NOT NULL,
    "descriptionTemplate" TEXT,
    "idPosgraduate" INTEGER NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("idTemplate")
);

-- CreateTable
CREATE TABLE "TemplateIndicator" (
    "idTemplate" INTEGER NOT NULL,
    "idIndicator" INTEGER NOT NULL,

    CONSTRAINT "TemplateIndicator_pkey" PRIMARY KEY ("idTemplate","idIndicator")
);

-- CreateTable
CREATE TABLE "User" (
    "idUser" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "imgUser" TEXT,
    "userName" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ESTUDIANTE',
    "valid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "UserAssignTo" (
    "idAssigment" INTEGER NOT NULL,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "UserAssignTo_pkey" PRIMARY KEY ("idAssigment","idUser")
);

-- CreateTable
CREATE TABLE "UserPosgraduate" (
    "idUser" INTEGER NOT NULL,
    "idPosgraduate" INTEGER NOT NULL,

    CONSTRAINT "UserPosgraduate_pkey" PRIMARY KEY ("idUser","idPosgraduate")
);

-- CreateIndex
CREATE UNIQUE INDEX "Component_indicatorNumber_key" ON "Component"("indicatorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Indicator_indicatorNumber_key" ON "Indicator"("indicatorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Judgement_indicatorNumber_key" ON "Judgement"("indicatorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Subsystem_indicatorNumber_key" ON "Subsystem"("indicatorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_idIndicator_fkey" FOREIGN KEY ("idIndicator") REFERENCES "Indicator"("idIndicator") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigment" ADD CONSTRAINT "Assigment_idUserOwner_fkey" FOREIGN KEY ("idUserOwner") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assigment" ADD CONSTRAINT "Assigment_idSubsystem_fkey" FOREIGN KEY ("idSubsystem") REFERENCES "Subsystem"("idSubsystem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssigmentIndicator" ADD CONSTRAINT "AssigmentIndicator_idAssigment_fkey" FOREIGN KEY ("idAssigment") REFERENCES "Assigment"("idAssigment") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssigmentIndicator" ADD CONSTRAINT "AssigmentIndicator_idIndicator_fkey" FOREIGN KEY ("idIndicator") REFERENCES "Indicator"("idIndicator") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssigmentIndicatorAnswer" ADD CONSTRAINT "AssigmentIndicatorAnswer_idAnswer_fkey" FOREIGN KEY ("idAnswer") REFERENCES "Answer"("idAnswer") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssigmentIndicatorAnswer" ADD CONSTRAINT "AssigmentIndicatorAnswer_idAssigmentIndicator_fkey" FOREIGN KEY ("idAssigmentIndicator") REFERENCES "AssigmentIndicator"("idAssigmentIndicator") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_idSubsystem_fkey" FOREIGN KEY ("idSubsystem") REFERENCES "Subsystem"("idSubsystem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_idJudgement_fkey" FOREIGN KEY ("idJudgement") REFERENCES "Judgement"("idJudgement") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Judgement" ADD CONSTRAINT "Judgement_idComponent_fkey" FOREIGN KEY ("idComponent") REFERENCES "Component"("idComponent") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_idPosgraduate_fkey" FOREIGN KEY ("idPosgraduate") REFERENCES "Posgraduate"("idPosgraduate") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateIndicator" ADD CONSTRAINT "TemplateIndicator_idIndicator_fkey" FOREIGN KEY ("idIndicator") REFERENCES "Indicator"("idIndicator") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateIndicator" ADD CONSTRAINT "TemplateIndicator_idTemplate_fkey" FOREIGN KEY ("idTemplate") REFERENCES "Template"("idTemplate") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignTo" ADD CONSTRAINT "UserAssignTo_idAssigment_fkey" FOREIGN KEY ("idAssigment") REFERENCES "Assigment"("idAssigment") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignTo" ADD CONSTRAINT "UserAssignTo_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPosgraduate" ADD CONSTRAINT "UserPosgraduate_idPosgraduate_fkey" FOREIGN KEY ("idPosgraduate") REFERENCES "Posgraduate"("idPosgraduate") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPosgraduate" ADD CONSTRAINT "UserPosgraduate_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;
