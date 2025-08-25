import { SURFACE_TYPES_MAP } from "@/constants";
import { LocationSummary } from "@/types";
import React from "react";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

interface LocationRowProps {
    location: LocationSummary;
    onShowLocation: (location: LocationSummary) => void;
    onEditLocation: (location: LocationSummary) => void;
    onDeleteLocation: (location: LocationSummary) => void;
}

export default function LocationRow({
    location,
    onShowLocation,
    onEditLocation,
    onDeleteLocation,
}: LocationRowProps) {
    return (
        <div className="bg-surface rounded-xl border border-surfaceContainerHigh p-4 hover:border-primary/30 transition-all duration-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        className="h-16 w-24 rounded-lg object-cover bg-surfaceContainerHigh"
                        src={location.imgBannerPath}
                        alt={location.name}
                    />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-onSurface">
                            {location.name}
                        </h3>
                        <p className="text-sm text-onSurface/70 line-clamp-2 mt-1">
                            {location.description}
                        </p>
                        <div className="flex items-center mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-surfaceContainerHigh text-xs text-onSurface">
                                {SURFACE_TYPES_MAP[
                                    location.surfaceType as keyof typeof SURFACE_TYPES_MAP
                                ]?.text || location.surfaceType}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onShowLocation(location)}
                        className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                        title="View details"
                    >
                        <FiEye />
                    </button>
                    <button
                        onClick={() => onEditLocation(location)}
                        className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                        title="Edit location"
                    >
                        <FiEdit />
                    </button>
                    <button
                        onClick={() => onDeleteLocation(location)}
                        className="p-2 bg-surfaceContainer rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                        title="Delete location"
                    >
                        <FiTrash2 />
                    </button>
                </div>
            </div>
        </div>
    );
}
