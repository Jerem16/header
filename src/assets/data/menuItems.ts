/**
 *! ⚠️ NOTE IMPORTANTE SUR LA NAVIGATION DES SOUS-MENUS
 *
 ** Pour que les sous-menus fonctionnent correctement (clic et navigation),
 ** il faut ajouter `ref={navRef}` provenant du hook `useMenuBehavior`
 ** dans le bloc de navigation <nav.. <nav ref={navRef} className="main-nav">.
 *
 * Exemple (Nav.tsx) :
 *
 *   <div className="head-flex" >
 *     <nav ref={navRef} className="main-nav"> ... </nav>
 *     <nav className="reservationId"> ... </nav>
 *     <nav className="research"> ... </nav>
 *     <nav ref={navRef} className="connection"> ... </nav>
 *   </div>
 *
 *? 👉 Sans ça : les clics dans <nav class="connection"> ou dans un <SubMenu>
 *? sont considérés comme des "clics extérieurs" et ferment le menu avant la navigation.
 *
 */

import { MenuLinks } from "./interfaces/menu";
import { contentIndex } from "./content/index";
export const menuItems: MenuLinks = {
    mainLink: [
        {
            id: "menu-home",
            title: "Accueil",
            class: "",
            path: "/",
            AnchorId: "#slider",
            svg: "Home",
            subItems: [
                {
                    id: "menu-slider",
                    title: "Slider",
                    AnchorId: "#slider",
                    class: "",
                    content: contentIndex["#slider"],
                },
                {
                    id: "menu-about",
                    title: "À propos",
                    AnchorId: "#about",
                    class: "",
                    content: contentIndex["#about"],
                },
                {
                    id: "menu-services",
                    title: "Services",
                    AnchorId: "#services",
                    class: "",
                    content: contentIndex["#services"],
                },
                {
                    id: "menu-contact",
                    title: "Contact",
                    AnchorId: "#contact",
                    class: "",
                    content: contentIndex["#contact"],
                },
            ],
        },
        {
            id: "menu-services",
            title: "Services",
            class: "",
            path: "/p1",
            AnchorId: "#top",
            svg: "Services",
            scrollOffset: 0,
            subItems: [
                {
                    id: "menu-without-license",
                    title: "Sans Permis",
                    AnchorId: "#sans-permis",
                    class: "",
                    scrollOffset: 102,
                },
                {
                    id: "menu-with-license",
                    title: "Avec Permis",
                    AnchorId: "#avec-permis",
                    class: "",
                    scrollOffset: 102,
                },
            ],
        },
        {
            id: "menu-prices",
            title: "Tarifs",
            class: "",
            path: "/p2",
            AnchorId: "#top",
            svg: "Tarifs",
            scrollOffset: 0,
            subItems: [
                {
                    id: "menu-without-license",
                    title: "Débutant",
                    AnchorId: "#novice",
                    class: "",
                    scrollOffset: 102,
                },
                {
                    id: "menu-with-license",
                    title: "Confirmé",
                    AnchorId: "#expert",
                    class: "",
                    scrollOffset: 102,
                },
            ],
        },
        {
            id: "menu-blog",
            title: "Blog",
            class: "",
            path: "/p1",
            AnchorId: "#top",
            svg: "Blog",
        },
        {
            id: "menu-contact",
            title: "Contact",
            class: "",
            path: "/p2",
            AnchorId: "#expert",
            svg: "Contact",
        },
    ],
    reservation: [
        {
            id: "reservationId",
            title: "Réservation",
            class: "",
            path: "/p1",
            AnchorId: "#top",
            svg: "Reservation",
        },
    ],
    search: [
        {
            id: "search",
            title: "Rechercher ...",
            class: "",
            path: "/search",
            AnchorId: "#top",
            svg: "Search",
        },
    ],
    connection: [
        {
            id: "connexion",
            title: "Connexion",
            class: "",
            path: "/p2",
            AnchorId: "#top",
            svg: "Connection",
        },
    ],
};

export type { MenuItem } from "./interfaces/menu";
