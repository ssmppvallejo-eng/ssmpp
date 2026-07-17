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

export const AssignEvaluatorSchema = z.object({
  userId: z.number().int(),
});

export type AssignEvaluatorDTO = z.infer<typeof AssignEvaluatorSchema>;

// Juicio de valor por indicador (RF-ASIG-009): numerico en la escala 1-3 del
// instrumento y textual opcional.
export const SaveJudgementSchema = z.object({
  assignmentIndicatorId: z.number().int(),
  evaluationValue: z.number().int().min(1).max(3),
  note: z.string().optional().nullable(),
});

export type SaveJudgementDTO = z.infer<typeof SaveJudgementSchema>;
