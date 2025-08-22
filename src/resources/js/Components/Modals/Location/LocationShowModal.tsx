import useAxiosForm from "@/Hooks/useAxiosForm";
import { Location, LocationSummary } from "@/types";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { FiX, FiMap, FiCalendar, FiCloud, FiInfo } from "react-icons/fi";
import BaseModal from "../BaseModal";
import {
    SEASONS_MAP,
    SURFACE_CONDITIONS_MAP,
    SURFACE_TYPES_MAP,
    TYRES_MAP,
} from "@/constants";
import { GiCarWheel } from "react-icons/gi";

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

    // return (
    //     <BaseModal isOpen={isOpen} onClose={onClose}>
    //         <DialogPanel className="bg-surfaceContainer rounded-xl shadow-2xl w-full max-w-4xl transform transition-all overflow-hidden">
    //             <div className="p-6">
    //                 <div className="flex justify-between items-start mb-6">
    //                     <DialogTitle className="text-2xl font-bold text-onSurface">
    //                         Location Details
    //                     </DialogTitle>
    //                     <button
    //                         onClick={onClose}
    //                         className="text-onSurface hover:text-primary transition-colors duration-200 p-1 rounded-full hover:bg-surfaceContainerHigh"
    //                     >
    //                         <FiX size={24} />
    //                     </button>
    //                 </div>

    //                 {/* Image Section - Banner and Background Side by Side */}
    //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    //                     {/* Banner Image with Location Name */}
    //                     <div className="relative rounded-xl overflow-hidden group">
    //                         <img
    //                             src={location.imgBannerPath}
    //                             alt={`${location.name} banner`}
    //                             className="w-full h-48 object-cover"
    //                         />
    //                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    //                         <div className="absolute bottom-4 left-4">
    //                             <h2 className="text-2xl font-bold text-white">
    //                                 {location.name}
    //                             </h2>
    //                         </div>
    //                     </div>

    //                     {/* Background Image */}
    //                     <div className="relative rounded-xl overflow-hidden">
    //                         <div className="absolute top-2 left-2 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
    //                             Background
    //                         </div>
    //                         <img
    //                             src={location.imgBgPath}
    //                             alt={`${location.name} background`}
    //                             className="w-full h-48 object-cover"
    //                         />
    //                     </div>
    //                 </div>

    //                 {/* Description */}
    //                 <div className="mb-8">
    //                     <div className="flex items-center mb-3">
    //                         <div className="bg-primaryContainer/20 p-2 rounded-lg mr-3">
    //                             <FiInfo className="text-primary text-xl" />
    //                         </div>
    //                         <h3 className="text-lg font-semibold text-onSurface">
    //                             Description
    //                         </h3>
    //                     </div>
    //                     <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh text-onSurface/80">
    //                         {location.description}
    //                     </div>
    //                 </div>

    //                 {/* Attributes Grid */}
    //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    //                     {/* Surface Type */}
    //                     <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
    //                         <div className="flex items-center mb-3">
    //                             <div className="bg-primaryContainer/20 p-2 rounded-lg mr-3">
    //                                 <FiMap className="text-primary text-xl" />
    //                             </div>
    //                             <h3 className="text-lg font-semibold text-onSurface">
    //                                 Surface Type
    //                             </h3>
    //                         </div>
    //                         <div className="flex items-center">
    //                             {SURFACE_TYPES_MAP[
    //                                 location.surfaceType as keyof typeof SURFACE_TYPES_MAP
    //                             ]?.icon || <FiMap />}
    //                             <span className="ml-2 text-onSurface capitalize">
    //                                 {SURFACE_TYPES_MAP[
    //                                     location.surfaceType as keyof typeof SURFACE_TYPES_MAP
    //                                 ]?.text || location.surfaceType}
    //                             </span>
    //                         </div>
    //                     </div>

    //                     {/* Seasons */}
    //                     <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
    //                         <div className="flex items-center mb-3">
    //                             <div className="bg-tertiaryContainer/20 p-2 rounded-lg mr-3">
    //                                 <FiCalendar className="text-tertiary text-xl" />
    //                             </div>
    //                             <h3 className="text-lg font-semibold text-onSurface">
    //                                 Seasons
    //                             </h3>
    //                         </div>
    //                         <div className="flex flex-wrap gap-3">
    //                             {location.seasons.map((season) => (
    //                                 <div
    //                                     key={season}
    //                                     className="flex items-center bg-surfaceContainerHigh px-3 py-2 rounded-lg"
    //                                 >
    //                                     {SEASONS_MAP[
    //                                         season as keyof typeof SEASONS_MAP
    //                                     ]?.icon || <FiCalendar />}
    //                                     <span className="ml-2 text-onSurface capitalize">
    //                                         {SEASONS_MAP[
    //                                             season as keyof typeof SEASONS_MAP
    //                                         ]?.text || season}
    //                                     </span>
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     </div>

    //                     {/* Surface Conditions */}
    //                     <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
    //                         <div className="flex items-center mb-3">
    //                             <div className="bg-secondaryContainer/20 p-2 rounded-lg mr-3">
    //                                 <FiCloud className="text-secondary text-xl" />
    //                             </div>
    //                             <h3 className="text-lg font-semibold text-onSurface">
    //                                 Surface Conditions
    //                             </h3>
    //                         </div>
    //                         <div className="flex flex-wrap gap-3">
    //                             {location.surfaceConditions.map((condition) => (
    //                                 <div
    //                                     key={condition}
    //                                     className="flex items-center bg-surfaceContainerHigh px-3 py-2 rounded-lg"
    //                                 >
    //                                     {SURFACE_CONDITIONS_MAP[
    //                                         condition as keyof typeof SURFACE_CONDITIONS_MAP
    //                                     ]?.icon || <FiCloud />}
    //                                     <span className="ml-2 text-onSurface capitalize">
    //                                         {SURFACE_CONDITIONS_MAP[
    //                                             condition as keyof typeof SURFACE_CONDITIONS_MAP
    //                                         ]?.text || condition}
    //                                     </span>
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     </div>

    //                     {/* Recommended Tyres */}
    //                     <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
    //                         <div className="flex items-center mb-3">
    //                             <div className="bg-primaryContainer/20 p-2 rounded-lg mr-3">
    //                                 <GiCarWheel className="text-primary text-xl" />
    //                             </div>
    //                             <h3 className="text-lg font-semibold text-onSurface">
    //                                 Recommended Tyres
    //                             </h3>
    //                         </div>
    //                         <div className="flex flex-wrap gap-2">
    //                             {location.tyres.map((tyre) => (
    //                                 <span
    //                                     key={tyre}
    //                                     className="px-3 py-2 bg-surfaceContainerHigh rounded-lg text-sm text-onSurface capitalize"
    //                                 >
    //                                     {TYRES_MAP[
    //                                         tyre as keyof typeof TYRES_MAP
    //                                     ]?.text || tyre}
    //                                 </span>
    //                             ))}
    //                         </div>
    //                     </div>
    //                 </div>

    //                 <div className="flex justify-end pt-6 border-t border-surfaceContainerHigh">
    //                     <button
    //                         onClick={onClose}
    //                         className="px-6 py-3 text-onSurface bg-surfaceContainer rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium"
    //                     >
    //                         Close Details
    //                     </button>
    //                 </div>
    //             </div>
    //         </DialogPanel>
    //     </BaseModal>
    // );
}
