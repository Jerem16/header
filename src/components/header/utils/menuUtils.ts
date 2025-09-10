// menuUtils.ts

export const getShowGroupClass = (
    menuItemId: string,
    showNavLinks: boolean
): string => {
    return `group_link-submenu ${menuItemId} ${
        !showNavLinks ? "nav-circle" : "nav-padding"
    }`;
};

export const getShowClass = (showNavLinks: boolean): string => {
    return !showNavLinks ? "hidden" : "show-link";
};
