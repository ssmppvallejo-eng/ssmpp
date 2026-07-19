-- Rol de actores externos (egresados, empleadores, sector productivo regional)
ALTER TYPE "Role" ADD VALUE 'ACTORES_EXTERNOS';

-- Fecha real de envio del evaluado (submissionDate sigue siendo la fecha limite)
ALTER TABLE "Assignment" ADD COLUMN "submittedAt" TIMESTAMP(3);

-- Historial de edicion del instrumento
CREATE TYPE "InstrumentEntity" AS ENUM ('DIMENSION', 'COMPONENT', 'JUDGEMENT', 'INDICATOR', 'DESCRIPTOR');
CREATE TYPE "InstrumentAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

CREATE TABLE "InstrumentEditLog" (
    "id" SERIAL NOT NULL,
    "entityType" "InstrumentEntity" NOT NULL,
    "entityId" INTEGER NOT NULL,
    "entityCode" TEXT,
    "action" "InstrumentAction" NOT NULL,
    "changes" JSONB,
    "userId" INTEGER,
    "userEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstrumentEditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InstrumentEditLog_entityType_entityId_idx" ON "InstrumentEditLog"("entityType", "entityId");
CREATE INDEX "InstrumentEditLog_createdAt_idx" ON "InstrumentEditLog"("createdAt");
