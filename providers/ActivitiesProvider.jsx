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

    const [activity, setActivity] = useState({});
    const [loadingActivity, setLoadingActivity] = useState(false);
    
    const initial_state = {
        answer:{},
        status: ASSIGNMENT_STATUS.PENDIENTE 
    };

    const fetchActivity = useCallback(async(actNumber)=>{
        setLoadingActivity(true);

        try{    
            const request = `/api/assigment/${actNumber}`;
            const response = await fetch(request);
            const data = await response.json();

            setActivity(data);

        }catch(error){
            console.log('Algo ocurrio al momento de hacer fetch en una actividad  ',error );
        }
        finally{
            setLoadingActivity(false);
        }
    });



    const assignmentReducer = (state, action)=>{
        switch(action.type){
           case 'SET_INDICATOR':
    return {
        ...state,
        answer: {
            ...state.answer,
            [state.payload.id]: {
                id: state.payload.id
            }
        }
    };

        }
    };

    const value ={
        preActivities,
        fetchPreActivities,
        loadingPreActivites,
        loadingActivity,
        activity,
        fetchActivity
    };
    return (
        <ActivityContext.Provider value={value}>
            {children}
        </ActivityContext.Provider>
    );
};