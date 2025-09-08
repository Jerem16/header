import React from "react";
import RenderInputButton from "./RenderInputButton";
import HiddenDelayComponent from "../utils/HiddenDelayComponent";
import { getShowClass } from "../utils/menuUtils";
import { MenuItem } from "@assets/data/interfaces/menu";
import { svgComponents } from "../svgComponents";
interface RenderInputProps {
    isSubmitted: boolean;
    showNavLinks: boolean;
    menuItem: MenuItem;
    handleSubmit: (
        e?:
            | React.FormEvent<HTMLFormElement>
            | React.KeyboardEvent<HTMLInputElement>
            | React.MouseEvent<HTMLButtonElement>
    ) => void;
    handleReset: () => void;
    query: string;
    placeholder?: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
}
export type SvgComponentKey = keyof typeof svgComponents;
const RenderInput: React.FC<RenderInputProps> = ({
    isSubmitted,
    showNavLinks,
    menuItem,
    handleSubmit,
    handleReset,
    query,
    placeholder = "Rechercher...",
    handleSearch,
    onFocus,
}) => {
    return (
        <>
            <RenderInputButton
                hasQuery={query.length > 0}
                isSubmitted={isSubmitted}
                showNavLinks={showNavLinks}
                menuItem={{ svg: menuItem.svg as keyof typeof svgComponents }}
                handleSubmit={handleSubmit}
                handleReset={handleReset}
            />
            <HiddenDelayComponent isVisible={showNavLinks} delay={450}>
                {(isHidden) =>
                    !isHidden && (
                        <input
                            id="search-input"
                            type="search"
                            name="search"
                            autoComplete="off"
                            aria-label="Recherche"
                            value={query}
                            placeholder={placeholder}
                            onChange={handleSearch}
                            onFocus={onFocus}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSubmit(e as React.KeyboardEvent<HTMLInputElement>);
                                }
                            }}
                            className={`nav-link ${getShowClass(
                                showNavLinks
                            )} ${isHidden ? "display-none" : ""}`}
                        />
                    )
                }
            </HiddenDelayComponent>
        </>
    );
};

export default RenderInput;
