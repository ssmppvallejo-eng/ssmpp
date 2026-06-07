-- Rename the typo column used by earlier migrations so it matches schema.prisma.
ALTER TABLE "AssignmentIndicatorDescriptor"
RENAME COLUMN "commment" TO "comment";

-- Required by Prisma upsert where assignmentIndicatorId_descriptorId.
CREATE UNIQUE INDEX "AssignmentIndicatorDescriptor_assignmentIndicatorId_descriptorId_key"
ON "AssignmentIndicatorDescriptor"("assignmentIndicatorId", "descriptorId");
