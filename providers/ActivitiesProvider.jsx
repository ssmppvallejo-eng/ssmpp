'use client';
import { useContext, useReducer, createContext, useState, useCallback } from "react";
import {ASSIGNMENT_STATUS} from '../constants/assignmentStatus'

const ActivityContext = createContext();

export const useActivity = () => {
    const context = useContext(ActivityContext);

    if(!context){
        throw new Error("useActiviy must be used within a Activity Provider");
    }
    return context;
};

export const  ActivityProvider = ({children}) =>{
    // Fetching info that describes activites
    const [preActivities, setPreActivities] = useState([]);
    const [loadingPreActivites, setLoadingPreActivities] = useState(false);

    const fetchPreActivities = useCallback(async() =>{
        setLoadingPreActivities(true);

        try{
            const request = '/api/assigment/my';
            const response = await fetch(request);
            const data  = await response.json();

            setPreActivities(data);
            

        }catch(error){
            console.log("Ocurrio algo inesperado al momento de hacer fetch a las PREactividades: ",error);
        }
        finally{
            setLoadingPreActivities(false);
        }
    },[]);

    const initialStateAss = {
        descriptors:{},
        status: ASSIGNMENT_STATUS.PENDIENTE,
    };

    const assignmentReducer = (state, action)=>{
        switch(action.type){
            case 'INIT_ASSIGNMENT':
            return{
                ...state,
                ...action.payload,
            }
            case 'SET_DESCRIPTOR':
            return{
                ...state,
                descriptors:{
                    ...state.descriptors,
                    [action.payload.assignmentIndicatorId]:{
                        assignmentIndicatorId: action.payload.assignmentIndicatorId,
                        descriptorId: action.payload.descriptorId,
                        valueAssigned: action.payload.valueAssigned
                    }
                
                }
            }
            case "SET_COMMENT":
            return{
                ...state,
                descriptors:{
                    ...state.descriptors, 
                    [action.payload.assignmentIndicatorId]:{
                        ...state.descriptors.[action.payload.assignmentIndicatorId],
                        comment:action.payload.comment
                    }
                }
            }
            default:
            return state;

        }
    };
    const [assignmentState, assignmentDispatch]= useReducer (assignmentReducer,initialStateAss);

    const [activity, setActivity] = useState({});
    const [loadingActivity, setLoadingActivity] = useState(false);
    
    const fetchActivity = useCallback(async(actNumber)=>{
        setLoadingActivity(true);

        try{    
            const request = `/api/assigment/${actNumber}`;
            const response = await fetch(request);
            const data = await response.json();

            const fillState = {
                descriptors:{},
                status: ASSIGNMENT_STATUS.PENDIENTE,
            };

            data.Judgement.forEach((j)=>{
                fillState.descriptors[j.id]={
                    assignmentIndicatorId: null, 
                    descriptorId: null,
                    valueAssigned: null,
                };
            });

            assignmentDispatch({
                type: 'INIT_ASSIGNMENT',
                payload: fillState,
            })

            console.log("INITIAL STATE: ",initialStateAss);

            setActivity(data);

        }catch(error){
            console.log('Algo ocurrio al momento de hacer fetch en una actividad  ',error );
        }
        finally{
            setLoadingActivity(false);
        }
    });


    const value ={
        preActivities,
        fetchPreActivities,
        loadingPreActivites,
        loadingActivity,
        activity,
        fetchActivity,
        // Reducer for assignment form
        assignmentState,
        assignmentDispatch
    };
    return (
        <ActivityContext.Provider value={value}>
            {children}
        </ActivityContext.Provider>
    );
};