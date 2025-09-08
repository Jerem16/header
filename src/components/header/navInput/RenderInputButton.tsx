import React from "react";
import { svgComponents } from "../svgComponents";
import SearchClose from "../../svg_Icon/SearchClose";

interface RenderButtonProps {
    hasQuery: boolean;
    isSubmitted: boolean;
    showNavLinks: boolean;
    menuItem: { svg: SvgComponentKey };
    handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleReset: () => void;
}

type SvgComponentKey = keyof typeof svgComponents;
const RenderInputButton: React.FC<RenderButtonProps> = ({
    hasQuery,
    isSubmitted,
    showNavLinks,
    menuItem,
    handleSubmit,
    handleReset,
}) => {
    const SvgIcon = svgComponents[menuItem.svg];
    const shouldReset = hasQuery || isSubmitted;
    const handleClick = shouldReset ? handleReset : handleSubmit;

    if (!showNavLinks) return SvgIcon ? <SvgIcon /> : null;

    return (
        <button
            type={shouldReset ? "button" : "submit"}
            className="nav-icon flx-c"
            onClick={handleClick}
            aria-label={shouldReset ? "Réinitialiser la recherche" : "Valider la recherche"}
        >
            {shouldReset ? <SearchClose /> : SvgIcon && <SvgIcon />}
        </button>
    );
};

export default React.memo(RenderInputButton);
