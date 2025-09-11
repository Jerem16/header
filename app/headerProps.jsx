"use client";

import { NavigationProvider } from "@utils/context/NavigationContext";
import { Header } from "@nav/index";
import { menuItems } from "@nav-data/menuItems";
import { handleNavClick } from "@nav-utils/fnScrollUtils";

const HeaderProps = () => {
  return (
    <NavigationProvider>
      <Header
        menuItems={menuItems} // Assurez-vous que `menuItems` est bien importé
        onNavigationClick={handleNavClick} // Passez ici la fonction appropriée
      />
    </NavigationProvider>
  );
};

export default HeaderProps;
