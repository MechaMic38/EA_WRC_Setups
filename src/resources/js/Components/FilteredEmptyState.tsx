import React from "react";
import { FiGrid, FiFilter } from "react-icons/fi";

interface FilteredEmptyStateProps {
    entityName: string;
    hasActiveFilters: any;
    title?: string;
    description?: string;
    filterTitle?: string;
    filterDescription?: string;
    icon?: React.ReactNode;
    className?: string;
    onClearFilters?: () => void;
    onCreate?: () => void;
}

const FilteredEmptyState: React.FC<FilteredEmptyStateProps> = ({
    entityName = "items",
    hasActiveFilters = false,
    title,
    description,
    filterTitle,
    filterDescription,
    onClearFilters,
    onCreate,
    icon,
    className = "",
}) => {
    const defaultIcon =
        icon ||
        (hasActiveFilters ? (
            <FiFilter className="mx-auto text-4xl text-onSurface/50 mb-4" />
        ) : (
            <FiGrid className="mx-auto text-4xl text-onSurface/50 mb-4" />
        ));

    const displayedTitle = hasActiveFilters
        ? filterTitle || `No ${entityName} match your search`
        : title || `No ${entityName} found`;

    const displayedDescription = hasActiveFilters
        ? filterDescription || "Try adjusting your search terms"
        : description || `Get started by creating your first ${entityName}`;

    const action = hasActiveFilters ? (
        <button
            onClick={onClearFilters}
            className="px-6 py-2 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200"
        >
            Clear Search
        </button>
    ) : onCreate ? (
        <button
            onClick={onCreate}
            className="px-6 py-2 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200"
        >
            Create {entityName.charAt(0).toUpperCase() + entityName.slice(1)}
        </button>
    ) : null;

    return (
        <div
            className={`text-center py-12 bg-surfaceContainer rounded-xl border border-surfaceContainerHigh ${className}`}
        >
            <div className="flex items-center justify-center text-4xl text-onSurface/50 mb-4">
                {defaultIcon}
            </div>
            <h3 className="text-lg font-medium text-onSurface">
                {displayedTitle}
            </h3>
            <p className="text-onSurface/70 mt-1">{displayedDescription}</p>
            {(onClearFilters || onCreate) && (
                <div className="mt-4">{action}</div>
            )}
        </div>
    );
};

export default FilteredEmptyState;
