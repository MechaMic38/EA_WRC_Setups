// components/Cards/VehicleCard.tsx
import React from "react";
import { FiCheck } from "react-icons/fi";
import { Vehicle } from "@/types";

interface VehicleCardProps {
    vehicle: Vehicle;
    mode?: "display" | "selection";
    selected?: boolean;
    onSelect?: (vehicle: Vehicle) => void;
    className?: string;
}

export default function VehicleCard({
    vehicle,
    mode = "display",
    selected = false,
    onSelect,
    className = "",
}: VehicleCardProps) {
    const onClick = () => {
        if (mode === "selection" && onSelect) {
            onSelect(vehicle);
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
            {/* Vehicle Image */}
            <div className="h-32 relative overflow-hidden bg-surfaceContainerHigh">
                <img
                    src={vehicle.imgPath}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
                        <img
                            src={vehicle.category.imgPath}
                            alt={vehicle.category.name}
                            className="h-4 w-4 object-contain mr-1"
                        />
                        {vehicle.category.name}
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

            {/* Vehicle Details */}
            <div className="p-4 text-left">
                <div className="flex items-center">
                    {/* Manufacturer Logo */}
                    <div className="flex-shrink-0">
                        <img
                            src={vehicle.manufacturer.imgPath}
                            alt={vehicle.manufacturer.name}
                            className="h-12 w-12 object-contain p-1"
                        />
                    </div>
                    {/* Vertical divider */}
                    <div className="hidden md:block w-px h-12 border border-tertiaryContainer mx-3" />
                    {/* Manufacturer Name and Vehicle Name */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-onSurface/70 truncate">
                            {vehicle.manufacturer.name}
                        </p>
                        <h3 className="text-lg font-bold text-onSurface truncate">
                            {vehicle.name}
                        </h3>
                    </div>
                </div>
            </div>
        </CardWrapper>
    );
}
