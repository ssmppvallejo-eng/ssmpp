'use client';

import { useCallback, useContext, createContext, useState, ReactNode } from "react";

interface StyleContextType {
    visibleNav: boolean;
    hideNav: () => void;
    showNav: () => void;
}

const StyleContext = createContext<StyleContextType | undefined>(undefined);

export const useStyle = () => {
    const context = useContext(StyleContext);

    if (!context) {
        throw new Error('useStyle must be used within a StyleProvider');
    }
    return context;
}

export const StyleProvider = ({ children }: { children: ReactNode }) => {
    const [visibleNav, setVisibleNav] = useState(true);

    const hideNav = useCallback(() => {
        setVisibleNav(false);
    }, []);

    const showNav = useCallback(() => {
        setVisibleNav(true);
    }, []);

    const value: StyleContextType = {
        visibleNav,
        hideNav,
        showNav
    };

    return (
        <StyleContext.Provider value={value}>
            {children}
        </StyleContext.Provider>
    );
};
