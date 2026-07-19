import { ReactNode } from "react";

export interface Descriptor {
  id: number;
  title: string;
  description: string;
  value: number;
}

export interface SavedResponse {
  descriptorId: number;
  valueAssigned: number;
  comment?: string | null;
  evidenceName?: string | null;
  evidenceUrl?: string | null;
}

export interface Indicator {
  id: number;
  /** Id del indicador dentro de la asignacion (AssignmentIndicator.id); se usa para guardar respuestas. */
  assignmentIndicatorId: number;
  code: string;
  description: string;
  descriptors: Descriptor[];
  savedResponse?: SavedResponse | null;
}

export interface Judgement {
  id: number;
  code: string;
  title: string;
  description: string;
  Indicators: Indicator[];
}

export interface Assignment {
  id: number;
  assignmentDate?: string | null;
  submissionDate?: string | null;
  status: string;
  Dimension?: {
    code: string;
    title: string;
    description: string;
    Component: any;
  } | null;
  Judgement: Judgement[];
}

export interface AssignmentState {
  descriptors: {
    [key: string]: {
      assignmentIndicatorId: number | null;
      descriptorId: number | null;
      valueAssigned: number | null;
      comment?: string | null;
    };
  };
  status: string;
}

export type AssignmentAction =
  | { type: 'INIT_ASSIGNMENT'; payload: AssignmentState }
  | { type: 'SET_DESCRIPTOR'; payload: { assignmentIndicatorId: number; descriptorId: number; valueAssigned: number } }
  | { type: 'SET_COMMENT'; payload: { assignmentIndicatorId: number; comment: string } }
  | { type: 'SET_STATUS'; payload: { status: string } };

export interface ActivityContextType {
  preActivities: any[];
  fetchPreActivities: () => Promise<void>;
  loadingPreActivites: boolean;
  loadingActivity: boolean;
  activity: Partial<Assignment>;
  fetchActivity: (actNumber: number | string) => Promise<void>;
  assignmentState: AssignmentState;
  assignmentDispatch: React.Dispatch<AssignmentAction>;
  saveResponse: (assignmentIndicatorId: number, descriptorId: number, valueAssigned: number, comment?: string) => Promise<void>;
  submitAssignment: () => Promise<{ ok: boolean; message?: string }>;
}

export interface ActivityProviderProps {
  children: ReactNode;
}
