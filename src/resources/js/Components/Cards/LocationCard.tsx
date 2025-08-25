import { SURFACE_TYPES_MAP } from "@/constants";
import { LocationSummary } from "@/types";
import React from "react";
import { FiCheck } from "react-icons/fi";

interface LocationCardProps {
    location: LocationSummary;
    mode?: "display" | "selection";
    selected?: boolean;
    onSelect?: (location: LocationSummary) => void;
    className?: string;
}

export default function LocationCard({
    location,
    mode = "display",
    selected = false,
    onSelect,
    className = "",
}: LocationCardProps) {
    const onClick = () => {
        if (mode === "selection" && onSelect) {
            onSelect(location);
        }
    };

    const baseClasses =
        "bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden group";
    const selectionClasses = selected
        ? "ring-2 ring-primary border-primary/30"
        : "hover:border-primary/30";
    const hoverEffect =
        mode === "selection"
            ? "hover:shadow-lg transition-all duration-200"
            : "";

    const cardClasses = `${baseClasses} ${
        mode === "selection" ? selectionClasses : ""
    } ${hoverEffect} ${className}`;

    const CardWrapper = mode === "selection" ? "button" : "div";

    return (
        <CardWrapper
            className={cardClasses}
            onClick={onClick}
            type={mode === "selection" ? "button" : undefined}
        >
            {/* Location Image */}
            <div className="h-32 relative overflow-hidden">
                <img
                    src={location.imgBgPath || location.imgBannerPath}
                    alt={location.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
                        {
                            SURFACE_TYPES_MAP[
                                location.surfaceType as keyof typeof SURFACE_TYPES_MAP
                            ]?.icon
                        }
                        <span className="ml-1" />
                        {SURFACE_TYPES_MAP[
                            location.surfaceType as keyof typeof SURFACE_TYPES_MAP
                        ]?.text || location.surfaceType}
                    </span>
                </div>
                {mode === "selection" && selected && (
                    <div className="absolute top-3 left-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-surfaceContainer flex items-center justify-center">
                            <FiCheck size={14} />
                        </div>
                    </div>
                )}
            </div>

            {/* Location Details */}
            <div className="p-4 text-left">
                <div className="flex items-center mb-4">
                    {/* Location Logo */}
                    <div className="flex-shrink-0">
                        <img
                            src={location.imgBannerPath}
                            alt={location.name}
                            className="h-12 w-12 object-contain"
                        />
                    </div>
                    {/* Vertical divider */}
                    <div className="hidden md:block w-px h-12 border border-tertiaryContainer mx-3" />
                    {/* Location Name */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-onSurface truncate">
                            {location.name}
                        </h3>
                    </div>
                </div>
                <p className="text-sm text-onSurface/70 line-clamp-2">
                    {location.description}
                </p>
            </div>
        </CardWrapper>
    );
}
