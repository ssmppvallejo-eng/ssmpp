export enum Role {
  ADMINISTRADOR = 'ADMINISTRADOR',
  ESTUDIANTE = 'ESTUDIANTE',
  COORDINADOR = 'COORDINADOR',
  PROFESOR = 'PROFESOR',
  EVALUADOR = 'EVALUADOR',
}

export enum AccessStatus {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
}

export interface User {
  id: number;
  email: string;
  name?: string | null;
  image?: string | null;
  role: Role;
  accessStatus: AccessStatus;
}
