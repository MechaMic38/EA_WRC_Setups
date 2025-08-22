import { Manufacturer } from "@/types";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import BaseModal from "../BaseModal";
import { BsTools } from "react-icons/bs";

interface ManufacturerShowModalProps {
    isOpen: boolean;
    manufacturer: Manufacturer | null;
    onClose: () => void;
}

export default function ManufacturerShowModal({
    isOpen,
    manufacturer,
    onClose,
}: ManufacturerShowModalProps) {
    if (!manufacturer) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <DialogPanel className="bg-surfaceContainer rounded-xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
                <div className="flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 bg-gradient-to-r from-surfaceContainerHigh to-surfaceContainer flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-primaryContainer/20 p-3 rounded-lg mr-4">
                                <BsTools className="text-primary text-xl" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-onSurface">
                                    Manufacturer Details
                                </DialogTitle>
                                <p className="text-onSurface/70 text-sm">
                                    View manufacturer information
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-onSurface hover:text-primary transition-colors duration-200 p-1 rounded-full hover:bg-surfaceContainerHigh"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-6">
                        {/* Image Preview - Centered with decorative elements */}
                        <div className="flex justify-center">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                <div className="bg-surface p-6 rounded-xl border border-surfaceContainerHigh transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg">
                                    <img
                                        src={manufacturer.imgPath}
                                        alt={manufacturer.name}
                                        className="w-48 h-48 object-contain transform group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Name Display */}
                        <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh transition-all duration-300 hover:border-primary/30">
                            <div className="flex items-center">
                                <div className="bg-secondaryContainer/20 p-2 rounded-lg mr-4">
                                    <BsTools className="text-secondary text-lg" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm text-onSurface/70 mb-1">
                                        Manufacturer Name
                                    </p>
                                    <p className="text-onSurface font-semibold text-lg">
                                        {manufacturer.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="p-6 pt-0">
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 text-onSurface bg-surfaceContainer rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium text-center"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
