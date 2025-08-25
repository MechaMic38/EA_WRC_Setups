import { Vehicle } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";
import { FiChevronRight } from "react-icons/fi";

interface VehicleSetupCardProps {
    vehicle: Vehicle;
}

export default function VehicleSetupCard({ vehicle }: VehicleSetupCardProps) {
    return (
        <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary/30 group">
            {/* Vehicle Image - Full width with object-cover */}
            <div className="h-48 relative overflow-hidden">
                <img
                    src={vehicle.imgPath}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
                        <img
                            src={vehicle.category.imgPath}
                            alt={vehicle.category.name}
                            className="h-4 w-4 object-contain mr-1"
                        />
                        {vehicle.category.name}
                    </span>
                </div>
            </div>

            {/* Vehicle Details */}
            <div className="p-6">
                <div className="flex items-center mb-4">
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
                <Link
                    href={route("vehicles.show", vehicle.id)}
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium"
                >
                    View Setups
                    <FiChevronRight className="ml-2" />
                </Link>
            </div>
        </div>
    );
}
