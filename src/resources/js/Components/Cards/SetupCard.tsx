import { SEASONS_MAP, SURFACE_CONDITIONS_MAP, TYRES_MAP } from "@/constants";
import { Setup } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { GiCarWheel } from "react-icons/gi";

interface SetupCardProps {
    setup: Setup;
    hideVehicle?: boolean;
    hideLocation?: boolean;
}

export default function SetupCard({
    setup,
    hideVehicle = false,
    hideLocation = false,
}: SetupCardProps) {
    return (
        <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary/30 group">
            {/* Vehicle Image */}
            <div className="h-48 relative overflow-hidden bg-surfaceContainerHigh">
                <img
                    src={setup.vehicle.imgPath}
                    alt={setup.vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
                        {
                            SEASONS_MAP[
                                setup.season as keyof typeof SEASONS_MAP
                            ]?.icon
                        }
                        <span className="ml-1" />
                        {
                            SEASONS_MAP[
                                setup.season as keyof typeof SEASONS_MAP
                            ]?.text
                        }
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
                        {
                            SURFACE_CONDITIONS_MAP[
                                setup.surfaceCondition as keyof typeof SURFACE_CONDITIONS_MAP
                            ]?.icon
                        }
                        <span className="ml-1" />
                        {
                            SURFACE_CONDITIONS_MAP[
                                setup.surfaceCondition as keyof typeof SURFACE_CONDITIONS_MAP
                            ]?.text
                        }
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
                        <GiCarWheel className="text-secondary" />
                        <span className="ml-1" />
                        {TYRES_MAP[setup.tyres as keyof typeof TYRES_MAP]?.text}
                    </span>
                </div>
            </div>

            {/* Setup Details */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                setup.user.username
                            )}&background=CFBDFE&color=211F24`}
                            alt={setup.user.username}
                            className="h-8 w-8 rounded-full mr-3 border-2 border-surfaceContainerHigh"
                        />
                        <span className="text-sm font-medium text-onSurface">
                            {setup.user.username}
                        </span>
                    </div>
                    <span className="text-xs text-onSurface/70">
                        {new Date(setup.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {!hideVehicle && (
                    <div className="flex items-center mb-4">
                        {/* Manufacturer Logo */}
                        <div className="flex-shrink-0">
                            <img
                                src={setup.vehicle.manufacturer.imgPath}
                                alt={setup.vehicle.manufacturer.name}
                                className="h-12 w-12 object-contain"
                            />
                        </div>
                        {/* Vertical divider */}
                        <div className="hidden md:block w-px h-12 border border-tertiaryContainer mx-3" />
                        {/* Manufacturer Name and Vehicle Name */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-onSurface/70 truncate">
                                {setup.vehicle.manufacturer.name}
                            </p>
                            <h3 className="text-lg font-bold text-onSurface truncate">
                                {setup.vehicle.name}
                            </h3>
                        </div>
                    </div>
                )}

                {!hideLocation && (
                    <div className="flex items-center mb-4">
                        {/* Location Logo */}
                        <div className="flex-shrink-0">
                            <img
                                src={setup.location.imgBannerPath}
                                alt={setup.location.name}
                                className="h-12 w-12 object-contain"
                            />
                        </div>
                        {/* Vertical divider */}
                        <div className="hidden md:block w-px h-12 border border-tertiaryContainer mx-3" />
                        {/* Location Name */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-onSurface truncate">
                                {setup.location.name}
                            </h3>
                        </div>
                    </div>
                )}

                <Link
                    href={route("setups.show", setup.id)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium"
                >
                    View Setup Details
                    <FiChevronRight className="ml-2" />
                </Link>
            </div>
        </div>
    );
}
