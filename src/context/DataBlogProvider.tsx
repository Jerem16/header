// src/context/DataBlogContext.tsx
"use client";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useMemo,
} from "react";
import type { BlogData } from "@src/types/blog";

// prettier-ignore
// ⚠️ remplace
// const PUBLIC_DATA_URL = "/data/data.json";
// par :
const PUBLIC_DATA_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/data/data.json`;

interface DataBlogContextProps {
    data: BlogData | null;
    loading: boolean;
    error: Error | null;
}

const DataBlogContext = createContext<DataBlogContextProps | undefined>(
    undefined
);

export function DataBlogProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<BlogData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Charge le JSON depuis l’URL publique
    async function fetchData() {
        try {
            setLoading(true);
            const res = await fetch(PUBLIC_DATA_URL);
            if (!res.ok) throw new Error(`Erreur fetch : ${res.status}`);
            const json = (await res.json()) as BlogData;
            setData(json);
            setError(null);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err);
            } else {
                setError(new Error(String(err)));
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const value = useMemo(
        () => ({ data, loading, error }),
        [data, loading, error]
    );

    return (
        <DataBlogContext.Provider value={value}>
            {children}
        </DataBlogContext.Provider>
    );
}

export function useDataBlog() {
    const ctx = useContext(DataBlogContext);
    if (!ctx)
        throw new Error(
            "useDataBlog doit être utilisé dans un DataBlogProvider"
        );
    return ctx;
}
