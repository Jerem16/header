// src/utils/auth/goToLoginWithReturn.ts
"use client";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type GoToLoginOptions = {
    /** Utiliser router.replace au lieu de push (par défaut: true, idéal pour un guard) */
    replace?: boolean;
    /** Eviter de naviguer si on est déjà sur la page de login (par défaut: true) */
    skipIfAlreadyOnLogin?: boolean;
    /** Chemin de la page de login (par défaut: "/connexion") */
    loginPath?: string;
    /** Comment comparer le chemin de login (par défaut: "startsWith") */
    loginPathMatch?: "equals" | "startsWith";
    /** Inclure le hash (#ancre) dans le redirect (par défaut: true) */
    includeHash?: boolean;
};

export function goToLoginWithReturn(router: AppRouterInstance, opts: GoToLoginOptions = {}) {
    // 1) Options avec bons défauts pour un guard
    const {
        replace = true,
        skipIfAlreadyOnLogin = true,
        loginPath = "/connexion",
        loginPathMatch = "startsWith",
        includeHash = true,
    } = opts;

    // 2) Sécurité d’exécution côté client uniquement
    if (typeof window === "undefined") return;

    const { pathname, search, hash } = window.location;

    // 3) Ne rien faire si on est déjà sur la page de login (selon stratégie choisie)
    const isOnLogin =
        loginPathMatch === "equals" ? pathname === loginPath : pathname.startsWith(loginPath);

    if (skipIfAlreadyOnLogin && isOnLogin) return;

    // 4) Construire la cible avec ou sans hash
    const current = `${pathname}${search}${includeHash ? hash : ""}`;
    const redirect = encodeURIComponent(current);
    const url = `${loginPath}?redirect=${redirect}`;

    // 5) Eviter la boucle: si on calcule la même URL, on s’arrête
    const currentUrl = `${pathname}${search}${hash}`;
    if (url === currentUrl) return;

    // 6) Naviguer
    //! DON'T DELETE no-unused-expressions
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    replace ? router.replace(url) : router.push(url);
}
