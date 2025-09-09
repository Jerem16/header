"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Logo from "../svg_Icon/Logo";
import { useScrollContext } from "../../utils/context/ScrollContext";
import { useNavigation } from "../../utils/context/NavigationContext";
import { menuItems } from "@assets/data/menuItems";
import { updateMenuClasses } from "../../utils/updateMenuUtils";
import { handleScrollClick, handleNavClick } from "../../utils/fnScrollUtils";
import { useInitialScroll } from "../../utils/scrollUtils";
import useResize from "./utils/useResize";

const Header: React.FC = () => {
    const pathname = usePathname();
    const { currentRoute, updateRoute } = useNavigation();
    const { activeSection } = useScrollContext();

    useInitialScroll(pathname);

    const [tabletMain, setTabletMain] = useState(false);
    const [openMainButton, setOpenMainButton] = useState(false);
    const [openButton, setOpenButton] = useState(false);
    const [bigMenu, setBigMenu] = useState(false);

    useResize(setTabletMain, setOpenMainButton, setOpenButton, setBigMenu);

    // Wrapper pour adapter `handleNavClick`
    const handleNavigationClick = (path: string, scrollOffset = 0) => {
        handleNavClick(
            path,
            currentRoute,
            updateRoute,
            handleScrollClick,
            scrollOffset
        );
    };

    const updatedMenuItems = updateMenuClasses(
        menuItems.mainLink,
        menuItems.reservation,
        menuItems.search,
        menuItems.connection,
        activeSection,
        currentRoute
    );

    return (
        <div className="header">
            <Link
                href="/#slider"
                aria-label="Retour à la page d'accueil : Peur de la conduite"
                className="logo-link"
            >
                <Logo />
            </Link>
            <Nav
                menuItems={updatedMenuItems}
                onNavigationClick={handleNavigationClick}
                tabletMain={tabletMain} // Gestion de la vue tablette
                openMainButton={openMainButton} // Gestion de la vue Desktop
                setOpenMainButton={setOpenMainButton}
                openButton={openButton}
                bigMenu={bigMenu} // Gestion de la vue Desktop large
            />
        </div>
    );
};

export default Header;
