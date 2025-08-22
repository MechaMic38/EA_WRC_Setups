import {
    Description,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { Vehicle } from "@/types";
import BaseModal from "../BaseModal";
import SuccessMessage from "@/Components/Form/SuccessMessage";
import ErrorMessage from "@/Components/Form/ErrorMessage";

interface VehicleDeleteModalProps {
    isOpen: boolean;
    vehicle: Vehicle | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function VehicleDeleteModal({
    isOpen,
    vehicle,
    onClose,
    onSuccess,
}: VehicleDeleteModalProps) {
    const { delete: deleteVehicle, isProcessing } = useAxiosForm<void>([]);

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleDelete = () => {
        setShowSuccess(false);
        setShowError(false);

        if (!vehicle) return;

        deleteVehicle(route("api.vehicles.destroy", { vehicle: vehicle.id }), {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                    setShowSuccess(false);
                }, 1500);
            },
            onError: () => {
                setShowError(true);
            },
        });
    };

    if (!vehicle) return null;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <DialogPanel className="bg-surfaceContainer rounded-lg shadow-xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <DialogTitle className="text-2xl font-bold text-onSurface">
                            Delete Vehicle
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
                            Are you sure you want to delete this vehicle?
                        </Description>

                        <p className="text-onSurface/70 mb-4">
                            This action cannot be undone. All setups associated
                            with this vehicle will be permanently removed.
                        </p>

                        <div className="bg-surface rounded-lg p-4 w-full">
                            <div className="flex flex-col items-center">
                                <img
                                    src={vehicle.imgPath}
                                    alt={vehicle.name}
                                    className="w-48 h-32 object-contain mb-4"
                                />
                                <span className="text-xl font-bold text-onSurface">
                                    {vehicle.name}
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
                            {isProcessing ? "Deleting..." : "Delete Vehicle"}
                        </button>
                    </div>

                    {/* Messages */}
                    {showSuccess && (
                        <SuccessMessage message="Vehicle removed successfully!" />
                    )}
                    {showError && (
                        <ErrorMessage message="An error occurred while deleting the vehicle." />
                    )}
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
