import { z } from "zod";

export const SaveAssignmentResponseSchema = z.object({
  assignmentIndicatorId: z.number(),
  descriptorId: z.number(),
  valueAssigned: z.number(),
  comment: z.string().optional().nullable(),
});

export type SaveAssignmentResponseDTO = z.infer<typeof SaveAssignmentResponseSchema>;
