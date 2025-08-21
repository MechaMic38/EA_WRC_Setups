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
import { LocationSummary } from "@/types";

export default function LocationDeleteModal({
    isOpen,
    onClose,
    location,
}: {
    isOpen: boolean;
    onClose: () => void;
    location: LocationSummary | null;
}) {
    const { delete: deleteLocation, isProcessing } = useAxiosForm<void>([]);

    const handleDelete = () => {
        if (!location) return;

        deleteLocation(
            route("api.locations.destroy", { location: location.id }),
            {
                method: "delete",
                onSuccess: onClose,
            }
        );
    };

    if (!location) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="bg-surfaceContainer rounded-lg shadow-xl w-full max-w-md transform transition-all">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <DialogTitle className="text-2xl font-bold text-onSurface">
                                            Delete Location
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
                                            Are you sure you want to delete this
                                            location?
                                        </Description>

                                        <p className="text-onSurface/70 mb-4">
                                            This action cannot be undone. All
                                            setups associated with this location
                                            will be permanently removed.
                                        </p>

                                        <div className="bg-surface rounded-lg p-4 w-full">
                                            <div className="flex items-center justify-center mb-3">
                                                <img
                                                    src={location.imgBannerPath}
                                                    alt={location.name}
                                                    className="w-32 h-16 object-cover mr-4 rounded"
                                                />
                                                <span className="text-xl font-bold text-onSurface">
                                                    {location.name}
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
                                                : "Delete Location"}
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
