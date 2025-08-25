import { Vehicle } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";
import { FiEdit, FiEye, FiMap, FiTrash2 } from "react-icons/fi";

interface VehicleRowProps {
    vehicle: Vehicle;
    onShowVehicle: (vehicle: Vehicle) => void;
    onEditVehicle: (vehicle: Vehicle) => void;
    onDeleteVehicle: (vehicle: Vehicle) => void;
}

export default function VehicleRow({
    vehicle,
    onShowVehicle,
    onEditVehicle,
    onDeleteVehicle,
}: VehicleRowProps) {
    return (
        <div className="bg-surface rounded-xl border border-surfaceContainerHigh p-4 hover:border-primary/30 transition-all duration-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        className="h-16 w-16 rounded-lg object-contain bg-surfaceContainerHigh p-2"
                        src={vehicle.imgPath}
                        alt={vehicle.name}
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-onSurface">
                            {vehicle.name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center">
                                <img
                                    className="h-5 w-5 object-contain mr-2"
                                    src={vehicle.manufacturer.imgPath}
                                    alt={vehicle.manufacturer.name}
                                />
                                <span className="text-sm text-onSurface/70">
                                    {vehicle.manufacturer.name}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <img
                                    className="h-5 w-5 object-contain mr-2"
                                    src={vehicle.category.imgPath}
                                    alt={vehicle.category.name}
                                />
                                <span className="text-sm text-onSurface/70">
                                    {vehicle.category.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onShowVehicle(vehicle)}
                        className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                        title="View details"
                    >
                        <FiEye />
                    </button>
                    <button
                        onClick={() => onEditVehicle(vehicle)}
                        className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                        title="Edit vehicle"
                    >
                        <FiEdit />
                    </button>
                    <Link
                        href={route("admin.vehicles.blueprint.edit", {
                            vehicle: vehicle.id,
                        })}
                        className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                        title="Update Blueprint"
                    >
                        <FiMap />
                    </Link>
                    <button
                        onClick={() => onDeleteVehicle(vehicle)}
                        className="p-2 bg-surfaceContainer rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                        title="Delete vehicle"
                    >
                        <FiTrash2 />
                    </button>
                </div>
            </div>
        </div>
    );
}
