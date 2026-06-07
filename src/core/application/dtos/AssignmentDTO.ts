import { z } from "zod";

export const SaveAssignmentResponseSchema = z.object({
  assignmentIndicatorId: z.number({
    required_error: "assignmentIndicatorId is required",
    invalid_type_error: "assignmentIndicatorId must be a number",
  }),
  descriptorId: z.number({
    required_error: "descriptorId is required",
    invalid_type_error: "descriptorId must be a number",
  }),
  valueAssigned: z.number({
    required_error: "valueAssigned is required",
    invalid_type_error: "valueAssigned must be a number",
  }),
  comment: z.string().optional().nullable(),
});

export type SaveAssignmentResponseDTO = z.infer<typeof SaveAssignmentResponseSchema>;
