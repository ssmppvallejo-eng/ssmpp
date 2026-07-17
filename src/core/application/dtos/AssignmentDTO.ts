import { z } from "zod";

export const SaveAssignmentResponseSchema = z.object({
  assignmentIndicatorId: z.number(),
  descriptorId: z.number(),
  valueAssigned: z.number(),
  comment: z.string().optional().nullable(),
});

export type SaveAssignmentResponseDTO = z.infer<typeof SaveAssignmentResponseSchema>;

// RF "Asignacion de una asignacion": por indicador o por plantilla, exclusivamente uno de los dos.
export const CreateAssignmentSchema = z.object({
  dimensionId: z.number().int(),
  dueDate: z.coerce.date(),
  userIds: z.array(z.number().int()).min(1, "Debe asignar al menos un usuario"),
  indicatorIds: z.array(z.number().int()).min(1).optional(),
  templateId: z.number().int().optional(),
}).refine(
  (data) => (data.indicatorIds !== undefined) !== (data.templateId !== undefined),
  { message: "Debe indicar indicatorIds o templateId, pero no ambos" }
);

export type CreateAssignmentDTO = z.infer<typeof CreateAssignmentSchema>;
