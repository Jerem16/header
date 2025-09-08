"use client";
import { useEffect } from "react";
import { useScrollContext } from "./context/ScrollContext";
import { resetActiveMenuClasses } from "./updateMenuUtils";
import { menuItems } from "@assets/data/menuItems";
import {
    addNewUrl,
    updateSectionClasses,
    scrollInView,
    currentSectionId,
    handleScrollClick,
} from "./fnScrollUtils";
import type { MenuItem, SubItem } from "@assets/data/interfaces/menu";

/**
 * Détermine l'offset de défilement à appliquer.
 * Priorité : SubItem > MenuItem > 0.
 */
export function resolveScrollOffset(
    menuItem?: Pick<MenuItem, "scrollOffset">,
    subItem?: Pick<SubItem, "scrollOffset">
): number {
    if (typeof subItem?.scrollOffset === "number") return subItem.scrollOffset;
    if (typeof menuItem?.scrollOffset === "number")
        return menuItem.scrollOffset;
    return 0;
}
const SCROLL_INTENT_KEY = "__SCROLL_INTENT__";
/*-------------------------------------------------------*/
function popScrollIntent(): { id: string; offset: number } | null {
    const raw = sessionStorage.getItem(SCROLL_INTENT_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(SCROLL_INTENT_KEY);
    try {
        return JSON.parse(raw) as { id: string; offset: number };
    } catch {
        return null;
    }
}
export const useInitialScroll = (pathname: string | null) => {
    useEffect(() => {
        const allItems = [
            ...menuItems.mainLink,
            ...(menuItems.reservation ?? []),
            ...(menuItems.search ?? []),
            ...(menuItems.connection ?? []),
        ];
        const menuItem = allItems.find((item) => item.path === pathname);

        const run = () => {
            // 1) Priorité à l’intention cross-page (id + offset)
            const intent = popScrollIntent();
            if (intent) {
                requestAnimationFrame(() =>
                    requestAnimationFrame(() =>
                        handleScrollClick(intent.id, intent.offset)
                    )
                );
                return;
            }

            // 2) Sinon, hash direct (offset calculé menu/submenu)
            const hashWithSharp = window.location.hash;
            if (hashWithSharp) {
                const hash = hashWithSharp.substring(1);
                if (hash === "top") {
                    window.scrollTo({ top: 0 });
                    return;
                }
                const subItem = menuItem?.subItems?.find(
                    (s) => s.AnchorId === hashWithSharp
                );
                const offset = resolveScrollOffset(menuItem, subItem);
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => handleScrollClick(hash, offset))
                );
            }
        };

        // Arrivée initiale + changements de hash sur la même page
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0 });
            run();
            resetActiveMenuClasses();
            window.addEventListener("hashchange", run);
            return () => window.removeEventListener("hashchange", run);
        }
    }, [pathname]);
};

/*-------------------------------------------------------*/

export const useScrollAnchors = (sections: { id: string }[]) => {
    const { setActiveSection } = useScrollContext();
    useEffect(() => {
        const handleScroll = () => {
            scrollInView(sections);
            addNewUrl(currentSectionId);
            updateSectionClasses(sections, setActiveSection);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [sections, setActiveSection]);
};
