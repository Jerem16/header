import React from "react";

interface SubResultProps {
    suggestions: string[];
    isOpen: boolean;
    onSuggestionSelect: (suggestion: string) => void;
}

const SubResult: React.FC<SubResultProps> = ({ suggestions, isOpen, onSuggestionSelect }) => {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className={`submenu ${isOpen ? "open" : ""}`}>
            <div className="submenu_group">
                {suggestions.map((suggestion) => (
                    <option
                        key={suggestion}
                        aria-label={`Suggestion: ${suggestion}`}
                        className="nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSuggestionSelect(suggestion); // Appelle la méthode depuis NavInput
                        }}
                    >
                        {suggestion}
                    </option>
                ))}
            </div>
        </div>
    );
};

export default SubResult;
