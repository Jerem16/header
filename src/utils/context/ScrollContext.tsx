"use client";
import { createContext, useState, useMemo, ReactNode } from "react";
import { createUseContext } from "./utils/createUseContext";
interface ScrollContextType {
    activeSection: string;
    setActiveSection: (section: string) => void;
}
const ScrollContext = createContext<ScrollContextType | undefined>(undefined);
interface ScrollProviderProps {
    children: ReactNode;
}
const ScrollProvider = ({ children }: ScrollProviderProps) => {
    const [activeSection, setActiveSection] = useState<string>("");
    const contextValue = useMemo(
        () => ({ activeSection, setActiveSection }),
        [activeSection]
    );
    return (
        <ScrollContext.Provider value={contextValue}>
            {children}
        </ScrollContext.Provider>
    );
};
export default ScrollProvider;
export const useScrollContext = createUseContext(
    ScrollContext,
    "useScrollContext"
);
