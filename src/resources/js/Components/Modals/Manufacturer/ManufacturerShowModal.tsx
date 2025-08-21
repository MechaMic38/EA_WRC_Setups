import { Manufacturer } from "@/types";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { FiX } from "react-icons/fi";
import BaseModal from "../BaseModal";

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
            <DialogPanel className="bg-surfaceContainer rounded-lg shadow-xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <DialogTitle className="text-2xl font-bold text-onSurface">
                            Manufacturer Details
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="text-onSurface hover:text-primary"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                Manufacturer Name
                            </label>
                            <div className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface">
                                {manufacturer.name}
                            </div>
                        </div>

                        {/* Image Preview */}
                        <div>
                            <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                Manufacturer Image
                            </label>
                            <div className="flex justify-center">
                                <div className="bg-surface p-4 rounded-lg border border-surfaceContainer">
                                    <img
                                        src={manufacturer.imgPath}
                                        alt={`${manufacturer.name} preview`}
                                        className="w-40 h-40 object-contain"
                                    />
                                </div>
                            </div>
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
