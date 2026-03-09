'use client';

import { useContext, createContext, useState } from "react";
const StyleContext= createContext();

export const useStyle = () =>{
    const context = useContext(StyleContext);

    if(!context){
        throw new Error('useStyle must be used within a Style Provider');
         
    }
    return context;
}

export const StyleProvider = ({children}) =>{
    const [visibleNav, setVisibleNav] = useState(true);

    const hiddeNav = () =>{
        setVisibleNav(false);
    };

    const showNav = ()=>{
        setVisibleNav(true);
    };

    const value ={
        visibleNav,
        hiddeNav,
        showNav
    };

    return(
        <StyleContext.Provider value={value}>
            {children}
        </StyleContext.Provider>
    );

};