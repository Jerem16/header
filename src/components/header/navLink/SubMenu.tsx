"use client";

import React from "react";
import { MenuItem } from "@assets/data/menuItems";
import { useNavigation } from "../../../utils/context/NavigationContext";

interface SubMenuProps {
    menuItem: MenuItem;
    isOpen: boolean;
    onSubItemClick: (path: string, scrollOffset?: number) => void;
    triggerRef?: React.RefObject<HTMLDivElement | HTMLElement | null>;
}

const isModifiedClick = (e: React.MouseEvent) =>
    e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;

const SubMenu: React.FC<SubMenuProps> = ({ menuItem, isOpen, onSubItemClick, triggerRef }) => {
    const { setOpenSubMenu } = useNavigation();

    const closeSubMenu = () => {
        setOpenSubMenu(null);
        if (triggerRef?.current) {
            (triggerRef.current as HTMLElement).focus?.();
        }
    };

    const handleSubItemClick = (
        path: string,
        subItemScrollOffset: number | undefined,
        e: React.MouseEvent | React.KeyboardEvent
    ) => {
        if ("button" in e && isModifiedClick(e as React.MouseEvent)) return;

        e.preventDefault();
        e.stopPropagation();
        const offset = subItemScrollOffset ?? menuItem.scrollOffset;
        onSubItemClick(path, offset);
        requestAnimationFrame(() => closeSubMenu());
    };

    const handleKeyDown = (
        path: string | null,
        subItemScrollOffset: number | undefined,
        e: React.KeyboardEvent<HTMLElement>
    ) => {
        if (["Enter", " "].includes(e.key) && path) {
            handleSubItemClick(path, subItemScrollOffset, e);
        } else if (e.key === "Escape") {
            e.preventDefault();
            closeSubMenu();
        }
    };

    if (!menuItem.subItems || menuItem.subItems.length === 0) return null;

    return (
        <div className={`submenu ${isOpen ? "open" : ""}`}>
            <div
                className="submenu_group"
                role="menu"
                id={`sub-${menuItem.id}`}
                onKeyDown={(e) => handleKeyDown(null, undefined, e)}
            >
                {menuItem.subItems.map((subItem) => {
                    const basePath = subItem.path ?? menuItem.path ?? "";
                    const href = `${basePath}${subItem.AnchorId ?? ""}`;
                    const offset = subItem.scrollOffset ?? menuItem.scrollOffset;
                    const fullPath = `${subItem.path ?? menuItem.path ?? ""}${subItem.AnchorId ?? ""}`;

                    return (
                        <a
                            key={subItem.id}
                            aria-label={`Section ${subItem.title}`}
                            href={href}
                            className={`nav-link ${subItem.class || null}`}
                            tabIndex={0}
                            onClick={(e) => handleSubItemClick(fullPath, offset, e)}
                            onKeyDown={(e) => handleKeyDown(fullPath, offset, e)}
                        >
                            {subItem.title}
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default SubMenu;
