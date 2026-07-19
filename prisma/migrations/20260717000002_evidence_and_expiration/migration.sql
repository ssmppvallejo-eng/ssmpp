-- Estado de expiracion por fecha limite (RF-SIS-007)
ALTER TYPE "IndicatorStatus" ADD VALUE 'NO_COMPLETADO';

-- Archivos de evidencia documental (RF-IND-005), almacenados en la BD
CREATE TABLE "EvidenceFile" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceFile_pkey" PRIMARY KEY ("id")
);
