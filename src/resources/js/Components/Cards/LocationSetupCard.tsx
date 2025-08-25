import { SURFACE_TYPES_MAP } from "@/constants";
import { LocationSummary } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";
import { FiChevronRight } from "react-icons/fi";

interface LocationSetupCardProps {
    location: LocationSummary;
}

export default function LocationSetupCard({
    location,
}: LocationSetupCardProps) {
    return (
        <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary/30 group">
            {/* Banner Image */}
            <div className="h-48 relative overflow-hidden">
                <img
                    src={location.imgBgPath}
                    alt={location.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4">
                    <img
                        src={location.imgBannerPath}
                        alt={location.name}
                        className="h-16 object-contain"
                    />
                </div>
                <div className="absolute top-4 right-4">
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
            </div>

            {/* Location Details */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-onSurface mb-3 line-clamp-1">
                    {location.name}
                </h3>
                <p className="text-onSurface/70 mb-4 line-clamp-3">
                    {location.description}
                </p>
                <Link
                    href={route("locations.show", location.id)}
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium"
                >
                    View Setups
                    <FiChevronRight className="ml-2" />
                </Link>
            </div>
        </div>
    );
}
