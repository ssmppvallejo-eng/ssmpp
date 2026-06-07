export enum Role {
  ADMINISTRADOR = 'ADMINISTRADOR',
  ESTUDIANTE = 'ESTUDIANTE',
  COORDINADOR = 'COORDINADOR',
  PROFESOR = 'PROFESOR',
  EVALUADOR = 'EVALUADOR',
}

export interface User {
  id: number;
  email: string;
  name?: string | null;
  image?: string | null;
  role: Role;
  active: boolean;
}
