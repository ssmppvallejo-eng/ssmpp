'use client';
import React, { useContext, useReducer, createContext, useState, useCallback } from "react";
import { 
  ActivityContextType, 
  ActivityProviderProps, 
  AssignmentState, 
  AssignmentAction, 
  Assignment 
} from "../src/core/domain/entities/Activities";

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivity = () => {
    const context = useContext(ActivityContext);

    if(!context){
        throw new Error("useActivity must be used within a ActivityProvider");
    }
    return context;
};

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
    // Fetching info that describes activities
    const [preActivities, setPreActivities] = useState<any[]>([]);
    const [loadingPreActivites, setLoadingPreActivities] = useState(false);

    const fetchPreActivities = useCallback(async () => {
        setLoadingPreActivities(true);

        try {
            const request = '/api/assignment/my';
            const response = await fetch(request);
            if (!response.ok) {
                throw new Error(`No se pudieron obtener las actividades (${response.status})`);
            }
            const data = await response.json();

            // Blindaje: si la API devolviera algo que no es lista, no romper la UI.
            setPreActivities(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Ocurrio algo inesperado al momento de hacer fetch a las PREactividades: ", error);
        } finally {
            setLoadingPreActivities(false);
        }
    }, []);

    const initialStateAss: AssignmentState = {
        descriptors: {},
        status: 'PENDIENTE',
    };

    const assignmentReducer = (state: AssignmentState, action: AssignmentAction): AssignmentState => {
        switch (action.type) {
            case 'INIT_ASSIGNMENT':
                return {
                    ...state,
                    ...action.payload,
                };
            case 'SET_DESCRIPTOR':
                return {
                    ...state,
                    descriptors: {
                        ...state.descriptors,
                        [action.payload.assignmentIndicatorId]: {
                            assignmentIndicatorId: action.payload.assignmentIndicatorId,
                            descriptorId: action.payload.descriptorId,
                            valueAssigned: action.payload.valueAssigned
                        }
                    }
                };
            case "SET_COMMENT":
                if (state.descriptors[action.payload.assignmentIndicatorId]?.comment === action.payload.comment) {
                    return state;
                }
                return {
                    ...state,
                    descriptors: {
                        ...state.descriptors,
                        [action.payload.assignmentIndicatorId]: {
                            ...state.descriptors[action.payload.assignmentIndicatorId],
                            comment: action.payload.comment
                        }
                    }
                };
            case "SET_STATUS":
                return {
                    ...state,
                    status: action.payload.status,
                };
            default:
                return state;
        }
    };

    const [assignmentState, assignmentDispatch] = useReducer(assignmentReducer, initialStateAss);

    const [activity, setActivity] = useState<Partial<Assignment>>({});
    const [loadingActivity, setLoadingActivity] = useState(false);

    const fetchActivity = useCallback(async (actNumber: number | string) => {
        setLoadingActivity(true);

        try {
            const request = `/api/assignment/${actNumber}`;
            const response = await fetch(request);
            const data: Assignment = await response.json();

            const fillState: AssignmentState = {
                descriptors: {},
                status: data.status || 'PENDIENTE',
            };

            data.Judgement.forEach((j) => {
                j.Indicators.forEach((i) => {
                    // Estado keyed por AssignmentIndicator.id, prellenado con la
                    // respuesta ya guardada para no perder seleccion al recargar.
                    fillState.descriptors[i.assignmentIndicatorId] = {
                        assignmentIndicatorId: i.savedResponse ? i.assignmentIndicatorId : null,
                        descriptorId: i.savedResponse?.descriptorId ?? null,
                        valueAssigned: i.savedResponse?.valueAssigned ?? null,
                        comment: i.savedResponse?.comment ?? null,
                    };
                });
            });

            assignmentDispatch({
                type: 'INIT_ASSIGNMENT',
                payload: fillState,
            });

            setActivity(data);
        } catch (error) {
            console.error('Algo ocurrio al momento de hacer fetch en una actividad ', error);
        } finally {
            setLoadingActivity(false);
        }
    }, []);

    const persistResponse = useCallback(async (
        assignmentIndicatorId: number,
        descriptorId: number,
        valueAssigned: number,
        comment?: string
    ) => {
        if (!activity.id) {
            throw new Error("No activity loaded to save response");
        }

        const response = await fetch(`/api/assignment/${activity.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                assignmentIndicatorId,
                descriptorId,
                valueAssigned,
                comment
            })
        });

        if (!response.ok) {
            throw new Error("Failed to save response");
        }
    }, [activity.id]);

    const saveResponse = useCallback(async (
        assignmentIndicatorId: number, 
        descriptorId: number, 
        valueAssigned: number, 
        comment?: string
    ) => {
        try {
            await persistResponse(assignmentIndicatorId, descriptorId, valueAssigned, comment);
            console.log(`Response saved for indicator ${assignmentIndicatorId}`);
        } catch (error) {
            console.error("Error saving response:", error);
        }
    }, [persistResponse]);

    const submitAssignment = useCallback(async () => {
        if (!activity.id) {
            return { ok: false, message: "No hay una actividad cargada para enviar." };
        }

        try {
            const selectedResponses = Object.values(assignmentState.descriptors).filter(
                (descriptor) => descriptor.assignmentIndicatorId && descriptor.descriptorId && descriptor.valueAssigned
            );

            await Promise.all(
                selectedResponses.map((descriptor) =>
                    persistResponse(
                        descriptor.assignmentIndicatorId as number,
                        descriptor.descriptorId as number,
                        descriptor.valueAssigned as number,
                        descriptor.comment || undefined
                    )
                )
            );

            const response = await fetch(`/api/assignment/${activity.id}/submit`, {
                method: "POST",
            });

            if (!response.ok) {
                if (response.status === 409) {
                    const body = await response.json().catch(() => null);
                    const missing: Array<{ indicatorCode: string; missingResponse: boolean; missingComment: boolean; missingEvidence: boolean }> = body?.missing ?? [];

                    if (missing.length > 0) {
                        const details = missing.map((item) => {
                            if (item.missingResponse) return `${item.indicatorCode}: sin responder`;
                            const parts = [];
                            if (item.missingComment) parts.push("falta comentario");
                            if (item.missingEvidence) parts.push("falta evidencia");
                            return `${item.indicatorCode}: ${parts.join(" y ")}`;
                        });
                        return {
                            ok: false,
                            message: `Completa lo siguiente antes de enviar: ${details.join("; ")}.`,
                        };
                    }

                    return { ok: false, message: "Responde todos los indicadores antes de enviar la actividad." };
                }

                throw new Error("Failed to submit assignment");
            }

            const updatedAssignment = await response.json();

            assignmentDispatch({
                type: "SET_STATUS",
                payload: { status: updatedAssignment.status },
            });

            setActivity((currentActivity) => ({
                ...currentActivity,
                status: updatedAssignment.status,
            }));

            setPreActivities((currentActivities) =>
                currentActivities.map((preActivity) =>
                    preActivity.assignmentId === updatedAssignment.id
                        ? { ...preActivity, status: updatedAssignment.status }
                        : preActivity
                    )
            );
            
            return { ok: true };
        } catch (error) {
            console.error("Error submitting assignment:", error);
            return { ok: false, message: "No se pudo enviar la actividad. Inténtalo de nuevo." };
        }
    }, [activity.id, assignmentState.descriptors, persistResponse]);

    const value: ActivityContextType = {
        preActivities,
        fetchPreActivities,
        loadingPreActivites,
        loadingActivity,
        activity,
        fetchActivity,
        assignmentState,
        assignmentDispatch,
        saveResponse,
        submitAssignment
    };

    return (
        <ActivityContext.Provider value={value}>
            {children}
        </ActivityContext.Provider>
    );
};
