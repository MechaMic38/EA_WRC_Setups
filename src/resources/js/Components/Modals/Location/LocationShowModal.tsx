import useAxiosForm from "@/Hooks/useAxiosForm";
import { Location, LocationSummary } from "@/types";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { FiX, FiMap, FiCalendar, FiCloud, FiInfo } from "react-icons/fi";
import BaseModal from "../BaseModal";
import {
    SEASONS_MAP,
    SURFACE_CONDITIONS_MAP,
    SURFACE_TYPES_MAP,
} from "@/constants";

interface LocationShowModalProps {
    isOpen: boolean;
    location: LocationSummary | null;
    onClose: () => void;
}

export default function LocationShowModal({
    isOpen,
    onClose,
    location: incompleteLocation,
}: LocationShowModalProps) {
    const { get: getLocation } = useAxiosForm<Location>([]);

    const [location, setLocation] = useState<Location | null>();

    useEffect(() => {
        if (incompleteLocation && isOpen) {
            getLocation(
                route("api.locations.show", {
                    location: incompleteLocation.id,
                }),
                {
                    onSuccess: (response) => {
                        setLocation(response.data);
                    },
                }
            );
        }
    }, [incompleteLocation, isOpen]);

    if (!location) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <DialogPanel className="bg-surfaceContainer rounded-xl shadow-2xl w-full max-w-6xl transform transition-all overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Vehicle Image Section - Full Height */}
                    <div className="md:w-3/5 bg-gradient-to-br from-surfaceContainerHigh to-surfaceContainer flex items-center justify-center">
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Use the location.imgBgPath as background */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${location.imgBgPath})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            ></div>
                            <img
                                src={location.imgBannerPath}
                                alt={location.name}
                                className="relative z-10 max-h-full max-w-full object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="md:w-2/5 p-8 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <DialogTitle className="text-3xl font-bold text-onSurface">
                                    {location.name}
                                </DialogTitle>
                                <p className="text-onSurface/70 mt-1">
                                    Location Details
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-onSurface hover:text-primary transition-colors duration-200 p-1 rounded-full hover:bg-surfaceContainerHigh"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="space-y-6 mb-8 flex-grow">
                            {/* Description */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                                <div className="flex items-center">
                                    <div className="bg-primaryContainer/20 p-3 rounded-lg mr-4">
                                        <FiInfo className="text-primary text-xl" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm text-onSurface/70 mb-1">
                                            Description
                                        </p>
                                        <p className="text-onSurface">
                                            {location.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Surface Type */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                                <div className="flex items-center">
                                    <div className="bg-primaryContainer/20 p-3 rounded-lg mr-4">
                                        <FiMap className="text-primary text-xl" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm text-onSurface/70 mb-1">
                                            Surface Type
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center bg-surfaceContainerHigh px-3 py-2 rounded-lg">
                                                {SURFACE_TYPES_MAP[
                                                    location.surfaceType as keyof typeof SURFACE_TYPES_MAP
                                                ]?.icon || <FiMap />}
                                                <span className="ml-2 text-onSurface capitalize">
                                                    {SURFACE_TYPES_MAP[
                                                        location.surfaceType as keyof typeof SURFACE_TYPES_MAP
                                                    ]?.text ||
                                                        location.surfaceType}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Seasons */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                                <div className="flex items-center">
                                    <div className="bg-secondaryContainer/20 p-3 rounded-lg mr-4">
                                        <FiCalendar className="text-secondary text-xl" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm text-onSurface/70 mb-1">
                                            Seasons
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {location.seasons.map((season) => (
                                                <div
                                                    key={season}
                                                    className="flex items-center bg-surfaceContainerHigh px-3 py-2 rounded-lg"
                                                >
                                                    {SEASONS_MAP[
                                                        season as keyof typeof SEASONS_MAP
                                                    ]?.icon || <FiCalendar />}
                                                    <span className="ml-2 text-onSurface capitalize">
                                                        {SEASONS_MAP[
                                                            season as keyof typeof SEASONS_MAP
                                                        ]?.text || season}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Surface Conditions */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                                <div className="flex items-center">
                                    <div className="bg-tertiaryContainer/20 p-3 rounded-lg mr-4">
                                        <FiCloud className="text-tertiary text-xl" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm text-onSurface/70 mb-1">
                                            Surface Conditions
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {location.surfaceConditions.map(
                                                (condition) => (
                                                    <div
                                                        key={condition}
                                                        className="flex items-center bg-surfaceContainerHigh px-3 py-2 rounded-lg"
                                                    >
                                                        {SURFACE_CONDITIONS_MAP[
                                                            condition as keyof typeof SURFACE_CONDITIONS_MAP
                                                        ]?.icon || <FiCloud />}
                                                        <p className="ml-2 text-onSurface capitalize">
                                                            {SURFACE_CONDITIONS_MAP[
                                                                condition as keyof typeof SURFACE_CONDITIONS_MAP
                                                            ]?.text ||
                                                                condition}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-surfaceContainerHigh">
                            <button
                                onClick={onClose}
                                className="w-full px-6 py-3 text-onSurface bg-surfaceContainer rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium text-center"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
