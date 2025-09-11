"use client";

import React, { createContext, useEffect, useMemo, useState } from "react";
import { initializeMenuWithContent } from "@/src/features/navigation/utils/initializeMenu";
import type { MenuLinks } from "@/src/features/navigation";
import { createUseContext } from "./utils/createUseContext";

// On exporte pour pouvoir réutiliser le type dans d'autres fichiers
export interface Result {
    path: string;
    text: string;
    go?: string; // ← optionnel car tu fais `if (result.go)`
    slideRef: number;
}

export interface SearchContextType {
    results: Result[];
    setResults: React.Dispatch<React.SetStateAction<Result[]>>;
    menuData: MenuLinks | null;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [results, setResults] = useState<Result[]>([]);
    const [menuData, setMenuData] = useState<MenuLinks | null>(null);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const data = initializeMenuWithContent();
        setMenuData(data);
    }, []);

    const value = useMemo(
        () => ({ results, setResults, menuData, query, setQuery }),
        [results, menuData, query]
    );

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

// Option A — via ton utilitaire générique (recommandé)
export const useSearch = createUseContext<SearchContextType>(
    SearchContext,
    "useSearch"
);

// Option B — vanilla React (décommente si tu ne veux pas d'utilitaire)
// export function useSearch(): SearchContextType {
//   const ctx = useContext(SearchContext);
//   if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
//   return ctx;
// }
