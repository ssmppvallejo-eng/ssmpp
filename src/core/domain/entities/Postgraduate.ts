export const LEVELS = ["ESPECIALIDADES", "MAESTRIAS", "DOCTORADOS", "ESPECIALIDADES_MEDICAS"] as const;

export const AREAS = [
  "CIENCIAS_EXACTAS",
  "CIENCIAS_NATURALES_Y_AGROPECUARIAS",
  "CIENCIAS_DE_LA_SALUD",
  "CIENCIAS_DE_LA_EDUCACION_Y_HUMANIDADES",
  "CIENCIAS_SOCIALES_Y_ADMINISTRATIVAS",
  "INGENIERIA_Y_TECNOLOGIAS",
] as const;

export type Level = (typeof LEVELS)[number];
export type Area = (typeof AREAS)[number];

export interface Postgraduate {
  id: number;
  title: string;
  level: Level;
  knowledgeArea: Area;
}
