import useAxiosForm from "@/Hooks/useAxiosForm";
import { Location, LocationSummary } from "@/types";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import BaseModal from "../BaseModal";

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
            <DialogPanel className="bg-surfaceContainer rounded-lg shadow-xl w-full max-w-3xl transform transition-all">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <DialogTitle className="text-2xl font-bold text-onSurface">
                            Location Details: {location.name}
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="text-onSurface hover:text-primary"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="mb-6">
                        <img
                            src={location.imgBannerPath}
                            alt={`${location.name} banner`}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                Description
                            </label>
                            <div className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface">
                                {location.description}
                            </div>
                        </div>

                        {/* Surface Type */}
                        <div>
                            <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                Surface Type
                            </label>
                            <div className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface capitalize">
                                {location.surfaceType}
                            </div>
                        </div>

                        {/* Seasons */}
                        <div>
                            <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                Seasons
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {location.seasons.map((season) => (
                                    <span
                                        key={season}
                                        className="px-3 py-1 bg-surfaceContainer rounded-full text-sm text-onSurface capitalize"
                                    >
                                        {season}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Surface Conditions */}
                        <div>
                            <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                Surface Conditions
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {location.surfaceConditions.map((condition) => (
                                    <span
                                        key={condition}
                                        className="px-3 py-1 bg-surfaceContainer rounded-full text-sm text-onSurface capitalize"
                                    >
                                        {condition}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Tyres */}
                        <div>
                            <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                Recommended Tyres
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {location.tyres.map((tyre) => (
                                    <span
                                        key={tyre}
                                        className="px-3 py-1 bg-surfaceContainer rounded-full text-sm text-onSurface"
                                    >
                                        {tyre}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Background Image Preview */}
                        <div>
                            <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                Background Image
                            </label>
                            <img
                                src={location.imgBgPath}
                                alt={`${location.name} background`}
                                className="h-48 w-full object-cover rounded-lg border border-surfaceContainer"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 mt-6 border-t border-surfaceContainer">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-onSurface bg-surfaceContainer rounded-md hover:bg-surfaceContainer/80"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
