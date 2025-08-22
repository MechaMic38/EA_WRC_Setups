import { Vehicle } from "@/types";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { FiX, FiInfo, FiStar, FiAward, FiPackage } from "react-icons/fi";
import BaseModal from "../BaseModal";
import { BsTools } from "react-icons/bs";

interface VehicleShowModalProps {
    isOpen: boolean;
    vehicle: Vehicle | null;
    onClose: () => void;
}

export default function VehicleShowModal({
    isOpen,
    vehicle,
    onClose,
}: VehicleShowModalProps) {
    if (!vehicle) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <DialogPanel className="bg-surfaceContainer rounded-xl shadow-2xl w-full max-w-4xl transform transition-all overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Vehicle Image Section - Full Height */}
                    <div className="md:w-1/2 bg-gradient-to-br from-surfaceContainerHigh to-surfaceContainer p-8 flex items-center justify-center">
                        <div className="relative w-full h-80 md:h-96 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-50"></div>
                            <img
                                src={vehicle.imgPath}
                                alt={vehicle.name}
                                className="relative z-10 max-h-full max-w-full object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="md:w-1/2 p-8 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <DialogTitle className="text-3xl font-bold text-onSurface">
                                    {vehicle.name}
                                </DialogTitle>
                                <p className="text-onSurface/70 mt-1">
                                    Vehicle Details
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
                            {/* Manufacturer */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                                <div className="flex items-center">
                                    <div className="bg-primaryContainer/20 p-3 rounded-lg mr-4">
                                        <BsTools className="text-primary text-xl" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm text-onSurface/70 mb-1">
                                            Manufacturer
                                        </p>
                                        <div className="flex items-center">
                                            <img
                                                src={
                                                    vehicle.manufacturer.imgPath
                                                }
                                                alt={vehicle.manufacturer.name}
                                                className="w-8 h-8 object-contain mr-3"
                                            />
                                            <p className="font-semibold text-onSurface">
                                                {vehicle.manufacturer.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                                <div className="flex items-center">
                                    <div className="bg-tertiaryContainer/20 p-3 rounded-lg mr-4">
                                        <FiPackage className="text-tertiary text-xl" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm text-onSurface/70 mb-1">
                                            Category
                                        </p>
                                        <div className="flex items-center">
                                            <img
                                                src={vehicle.category.imgPath}
                                                alt={vehicle.category.name}
                                                className="w-8 h-8 object-contain mr-3"
                                            />
                                            <p className="font-semibold text-onSurface">
                                                {vehicle.category.name}
                                            </p>
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
