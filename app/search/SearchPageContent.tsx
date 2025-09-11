"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearch } from "@/src/utils/context/SearchContext";
import type { Result } from "@/src/utils/context/SearchContext";
import searchQuery from "@/src/features/navigation/utils/searchMenu";
import useSessionStorage from "@/src/utils//sessionStorage/useSessionStorage";
// Si tu as supprimé le hook ci-dessus, remplace la ligne par :
// const useSessionStorage = <T,>(k: string, init: T): [T, (v: T) => void] => useState<T>(init);

export default function SearchPageContent() {
    const router = useRouter();
    const { results, setResults, menuData, setQuery } = useSearch();
    const [validQuery, setValidQuery] = useState<string>("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [storedSlideRef, setStoredSlideRef] = useSessionStorage<number>(
        "slideRef",
        0
    );

    const searchParams = useSearchParams();
    const badKeyWord = searchParams.get("badKeyWord") ?? "";
    const queryFromUrl = searchParams.get("query") ?? "";

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams]
    );

    useEffect(() => {
        if (queryFromUrl && queryFromUrl !== validQuery) {
            setValidQuery(queryFromUrl);
            setQuery(queryFromUrl);

            if (Array.isArray(menuData) && menuData.length > 0) {
                const searchResults: Result[] = searchQuery(
                    menuData,
                    queryFromUrl
                );
                setResults(searchResults);
            } else {
                setResults([]);
            }
        }
    }, [queryFromUrl, menuData, validQuery, setQuery, setResults]);

    const uniqueResults = useMemo<Result[]>(() => {
        return results.filter(
            (result: Result, index: number, self: Result[]) =>
                index ===
                self.findIndex(
                    (r) =>
                        r.path === result.path &&
                        r.text.trim() === result.text.trim()
                )
        );
    }, [results]);

    const resultsCount = uniqueResults.length;
    const searchMessage = badKeyWord
        ? `0 résultat pour "${badKeyWord}"`
        : `${resultsCount} résultat${
              resultsCount !== 1 ? "s" : ""
          } de recherche pour : "${validQuery}"`;

    return (
        <section className="section" id="s1">
            <div className="fixed-menu"></div>
            <h2>{searchMessage}</h2>
            <div className="s1">
                {!badKeyWord ? (
                    uniqueResults.map((result) => (
                        <div key={`${result.path}-${result.text}`}>
                            <button
                                className="result-link"
                                onClick={() => {
                                    if (result.go) {
                                        const slideRef =
                                            result.go.split("=")[1] ?? "0"; // extraction safe
                                        setStoredSlideRef(result.slideRef); // persist
                                        const queryString = createQueryString(
                                            "slideRef",
                                            slideRef
                                        );
                                        router.push(
                                            `${result.path}?${queryString}`
                                        );
                                    } else {
                                        router.push(result.path);
                                    }
                                }}
                            >
                                {result.text}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Aucun résultat à afficher.</p>
                )}
            </div>
        </section>
    );
}
