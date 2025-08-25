import { Manufacturer } from "@/types";
import React from "react";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

interface ManufacturerRowProps {
    manufacturer: Manufacturer;
    onEditManufacturer: (
        manufacturer: ManufacturerRowProps["manufacturer"]
    ) => void;
    onShowManufacturer: (
        manufacturer: ManufacturerRowProps["manufacturer"]
    ) => void;
    onDeleteManufacturer: (
        manufacturer: ManufacturerRowProps["manufacturer"]
    ) => void;
}

export default function ManufacturerRow({
    manufacturer,
    onEditManufacturer,
    onShowManufacturer,
    onDeleteManufacturer,
}: ManufacturerRowProps) {
    return (
        <div className="bg-surface rounded-xl border border-surfaceContainerHigh p-4 hover:border-primary/30 transition-all duration-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        className="h-16 w-16 rounded-lg object-contain bg-surfaceContainerHigh p-2"
                        src={manufacturer.imgPath}
                        alt={manufacturer.name}
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-onSurface">
                            {manufacturer.name}
                        </h3>
                        <p className="text-sm text-onSurface/70 mt-1">
                            ID: {manufacturer.id}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onShowManufacturer(manufacturer)}
                        className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                        title="View details"
                    >
                        <FiEye />
                    </button>
                    <button
                        onClick={() => onEditManufacturer(manufacturer)}
                        className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                        title="Edit manufacturer"
                    >
                        <FiEdit />
                    </button>
                    <button
                        onClick={() => onDeleteManufacturer(manufacturer)}
                        className="p-2 bg-surfaceContainer rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                        title="Delete manufacturer"
                    >
                        <FiTrash2 />
                    </button>
                </div>
            </div>
        </div>
    );
}
