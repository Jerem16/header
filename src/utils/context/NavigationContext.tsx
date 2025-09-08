import React, { createContext, useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface NavigationContextType {
    currentRoute: string;
    updateRoute: (path: string) => void;
    openSubMenu: string | null;
    setOpenSubMenu: (subMenuId: string | null) => void;
    showNavLinks: boolean;
    setShowNavLinks: (showNavLinks: boolean) => void;
    resetDisplayStyles: () => void;
    hamburgerMenuIsOpen: boolean;
    openHamburgerMenu: () => void;
    closeHamburgerMenu: (delay?: number) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

const useNavigationState = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [currentRoute, setCurrentRoute] = useState(pathname || "/");
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const [showNavLinks, setShowNavLinks] = useState<boolean>(true);
    const [hamburgerMenuIsOpen, setHamburgerMenuIsOpen] = useState(false);
    const openHamburgerMenu = () => setHamburgerMenuIsOpen(true);
    const closeHamburgerMenu = (delay: number = 0) => {
        setTimeout(() => setHamburgerMenuIsOpen(false), delay);
    };
    const resetDisplayStyles = useCallback(() => {
        setOpenSubMenu(null); // Ferme tous les sous-menus
    }, []);

    useEffect(() => {
        setCurrentRoute(pathname || "/");
    }, [pathname]);

    const updateRoute = useCallback(
        (path: string) => {
            setCurrentRoute(path);
            router.push(path);
        },
        [router]
    );
    return {
        currentRoute,
        updateRoute,
        openSubMenu,
        setOpenSubMenu,
        resetDisplayStyles,
        showNavLinks,
        setShowNavLinks,
        hamburgerMenuIsOpen,
        openHamburgerMenu,
        closeHamburgerMenu,
    };
};
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const navigationState = useNavigationState();
    return (
        <NavigationContext.Provider value={navigationState}>
            {children}
        </NavigationContext.Provider>
    );
};
import { createUseContext } from "./utils/createUseContext";
export const useNavigation = createUseContext(
    NavigationContext,
    "useNavigation"
);
