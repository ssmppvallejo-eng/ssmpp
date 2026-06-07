'use client';
import React, { useContext, useReducer, createContext, useState, useCallback } from "react";
import { ASSIGNMENT_STATUS } from '../constants/assignmentStatus';
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
            const data = await response.json();

            setPreActivities(data);
        } catch (error) {
            console.error("Ocurrio algo inesperado al momento de hacer fetch a las PREactividades: ", error);
        } finally {
            setLoadingPreActivities(false);
        }
    }, []);

    const initialStateAss: AssignmentState = {
        descriptors: {},
        status: ASSIGNMENT_STATUS.PENDIENTE,
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
                status: data.status || ASSIGNMENT_STATUS.PENDIENTE,
            };

            data.Judgement.forEach((j) => {
                j.Indicators.forEach((i) => {
                    fillState.descriptors[i.id] = {
                        assignmentIndicatorId: null,
                        descriptorId: null,
                        valueAssigned: null,
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

    const saveResponse = async (
        assignmentIndicatorId: number, 
        descriptorId: number, 
        valueAssigned: number, 
        comment?: string
    ) => {
        try {
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

            console.log(`Response saved for indicator ${assignmentIndicatorId}`);
        } catch (error) {
            console.error("Error saving response:", error);
        }
    };

    const value: ActivityContextType = {
        preActivities,
        fetchPreActivities,
        loadingPreActivites,
        loadingActivity,
        activity,
        fetchActivity,
        assignmentState,
        assignmentDispatch,
        saveResponse
    };

    return (
        <ActivityContext.Provider value={value}>
            {children}
        </ActivityContext.Provider>
    );
};
