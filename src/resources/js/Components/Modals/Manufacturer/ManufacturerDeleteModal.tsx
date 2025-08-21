// File: src/Components/Modals/CategoryDeleteModal.tsx
import {
    Description,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { Manufacturer } from "@/types";
import BaseModal from "../BaseModal";

interface ManufacturerDeleteModalProps {
    isOpen: boolean;
    manufacturer: Manufacturer | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ManufacturerDeleteModal({
    isOpen,
    manufacturer,
    onClose,
    onSuccess,
}: ManufacturerDeleteModalProps) {
    const { delete: deleteCategory, isProcessing } = useAxiosForm<void>([]);

    const handleDelete = () => {
        if (!manufacturer) return;

        deleteCategory(
            route("api.manufacturers.destroy", {
                manufacturer: manufacturer.id,
            }),
            {
                onSuccess: () => {
                    onSuccess();
                    onClose();
                },
            }
        );
    };

    if (!manufacturer) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <DialogPanel className="bg-surfaceContainer rounded-lg shadow-xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <DialogTitle className="text-2xl font-bold text-onSurface">
                            Delete Manufacturer
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="text-onSurface hover:text-primary"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                            <FiAlertTriangle className="text-red-500 text-2xl" />
                        </div>

                        <Description className="text-lg font-medium text-onSurface mb-2">
                            Are you sure you want to delete this manufacturer?
                        </Description>

                        <p className="text-onSurface/70 mb-4">
                            This action cannot be undone. All vehicles in this
                            manufacturer will need to be reassigned.
                        </p>

                        <div className="bg-surface rounded-lg p-4 w-full">
                            <div className="flex items-center justify-center mb-3">
                                <img
                                    src={manufacturer.imgPath}
                                    alt={manufacturer.name}
                                    className="w-16 h-16 object-contain mr-4"
                                />
                                <span className="text-xl font-bold text-onSurface">
                                    {manufacturer.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-surfaceContainer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-onSurface bg-surfaceContainer rounded-md hover:bg-surfaceContainer/80"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isProcessing}
                            className={`px-4 py-2 flex items-center ${
                                isProcessing
                                    ? "bg-surfaceContainer text-onSurface/50"
                                    : "bg-red-500 text-surfaceContainer hover:bg-red-600"
                            } rounded-md`}
                        >
                            <FiTrash2 className="mr-2" />
                            {isProcessing
                                ? "Deleting..."
                                : "Delete Manufacturer"}
                        </button>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
