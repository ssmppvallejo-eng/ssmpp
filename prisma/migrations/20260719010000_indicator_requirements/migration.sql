-- RF-IND-005: marca por indicador si comentario y/o evidencia son obligatorios
ALTER TABLE "Indicator" ADD COLUMN "requiresComment" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Indicator" ADD COLUMN "requiresEvidence" BOOLEAN NOT NULL DEFAULT false;
