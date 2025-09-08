import { useEffect, useRef, useCallback } from "react";
import { MenuItem } from "@assets/data/menuItems";
import { SubItem } from "@assets/data/interfaces/menu";
import { useNavigation } from "./context/NavigationContext";

export const isMainItemActive = (itemPath: string | undefined, currentRoute: string): boolean => {
    if (!itemPath) {
        return false;
    }
    if (itemPath === "/") {
        return currentRoute === "/" || currentRoute.startsWith("/#");
    }

    return currentRoute.startsWith(itemPath);
};

/*-------------------------------------------------------*/

const updateSubItems = (subItems: SubItem[], activeSection: string): SubItem[] => {
    const activeSubItem = subItems.find((sub) => sub.AnchorId === `#${activeSection}`);
    return subItems.map((sub) => ({
        ...sub,
        class: activeSubItem?.id === sub.id ? "active" : "",
    }));
};
export const updateMenuItems = (
    items: MenuItem[],
    activeSection: string,
    currentRoute: string
): MenuItem[] => {
    return items.map((item) => ({
        ...item,
        class: isMainItemActive(item.path, currentRoute) ? "active" : "",
        subItems: item.subItems ? updateSubItems(item.subItems, activeSection) : undefined,
    }));
};

/*-------------------------------------------------------*/

export const updateMenuClasses = (
    mainLink?: MenuItem[],
    reservation?: MenuItem[],
    search?: MenuItem[],
    connection?: MenuItem[],
    activeSection = "",
    currentRoute = ""
) => ({
    mainLink: updateMenuItems(mainLink || [], activeSection, currentRoute),
    reservation: updateMenuItems(reservation || [], activeSection, currentRoute),
    search: updateMenuItems(search || [], activeSection, currentRoute),
    connection: updateMenuItems(connection || [], activeSection, currentRoute),
});

/*-------------------------------------------------------*/

export const resetActiveMenuClasses = () => {
    const activeLinks = document.querySelectorAll(".nav-link.active");

    activeLinks.forEach((link) => {
        if (link instanceof HTMLElement) {
            link.classList.remove("active");
        }
    });

    const submenus = document.querySelectorAll(".submenu.open");

    submenus.forEach((submenu) => {
        if (submenu instanceof HTMLElement) {
            submenu.style.display = "";
        }
    });
};

/*-------------------------------------------------------*/

const handleClickOutside = (
    e: MouseEvent,
    navRef: React.RefObject<HTMLElement | null>,
    setOpenSubMenu: React.Dispatch<React.SetStateAction<string | null>>
) => {
    if (!navRef.current) {
        return;
    }

    if (!navRef.current.contains(e.target as Node)) {
        setOpenSubMenu(null);
    }
};
const handleKeyDown = (
    e: KeyboardEvent,
    setOpenSubMenu: React.Dispatch<React.SetStateAction<string | null>>
) => {
    if (e.key === "Escape") {
        e.preventDefault();
        setOpenSubMenu(null);
    }
};
export const useMenuBehavior = () => {
    const navRef = useRef<HTMLElement | null>(null);
    const { openSubMenu, setOpenSubMenu } = useNavigation();

    // 🔄 Ref pour garder la valeur courante sans recréer les callbacks
    const latestOpenRef = useRef<string | null>(openSubMenu);
    useEffect(() => {
        latestOpenRef.current = openSubMenu;
    }, [openSubMenu]);

    // ✅ Bridge stable qui accepte valeur OU fonction
    const setOpenSubMenuBridge = useCallback<React.Dispatch<React.SetStateAction<string | null>>>(
        (value) => {
            if (typeof value === "function") {
                const compute = value as (prev: string | null) => string | null;
                const next = compute(latestOpenRef.current ?? null);
                setOpenSubMenu(next); // <- le setter réel n'accepte qu'une valeur
            } else {
                setOpenSubMenu(value);
            }
        },
        [setOpenSubMenu]
    );

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) =>
            handleClickOutside(e, navRef, setOpenSubMenuBridge);
        const onKeyDown = (e: KeyboardEvent) => handleKeyDown(e, setOpenSubMenuBridge);

        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [setOpenSubMenuBridge]);

    return { navRef, openSubMenu, setOpenSubMenu: setOpenSubMenuBridge };
};
