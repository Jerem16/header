import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Logo from "@nav-icons/Logo";
import { useScrollContext } from "@utils/context/ScrollContext";
import { useNavigation } from "@utils/context/NavigationContext";
import { MenuItem, menuItems } from "@nav-data/menuItems";
import { updateMenuClasses } from "@nav-utils/updateMenuUtils";
import { handleScrollClick, handleNavClick } from "@nav-utils/fnScrollUtils";
import { useInitialScroll } from "@nav-utils/scrollUtils";
import useResize from "@nav-components/utils/useResize";

interface NavProps {
  menuItems: MenuItem[];
  onNavigationClick: (path: string, scrollOffset?: number) => void;
  openButton: boolean;
  openMainButton: boolean;
  tabletMain: boolean;
  bigMenu: boolean;
  setBigMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenMainButton: React.Dispatch<React.SetStateAction<boolean>>;
  setTabletMain: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<NavProps> = () => {
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
      scrollOffset,
    );
  };

  const updatedMenuItems = updateMenuClasses(
    menuItems.mainLink,
    menuItems.reservation,
    menuItems.search,
    menuItems.connection,
    activeSection,
    currentRoute,
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
