import { Vehicle } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiX } from "react-icons/fi";

export default function VehicleShowModal({
    isOpen,
    onClose,
    vehicle,
}: {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle | null;
}) {
    if (!vehicle) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="bg-surfaceContainer rounded-lg shadow-xl w-full max-w-md transform transition-all">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <Dialog.Title className="text-2xl font-bold text-onSurface">
                                            Vehicle Details
                                        </Dialog.Title>
                                        <button
                                            onClick={onClose}
                                            className="text-onSurface hover:text-primary"
                                        >
                                            <FiX size={24} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col items-center mb-6">
                                        <div className="bg-surface p-6 rounded-lg border border-surfaceContainer mb-4">
                                            <img
                                                src={vehicle.imgPath}
                                                alt={vehicle.name}
                                                className="w-64 h-64 object-contain"
                                            />
                                        </div>
                                        <h3 className="text-xl font-bold text-onSurface">
                                            {vehicle.name}
                                        </h3>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        {/* Manufacturer */}
                                        <div className="flex items-center p-3 bg-surface rounded-lg border border-surfaceContainer">
                                            <img
                                                src={
                                                    vehicle.manufacturer.imgPath
                                                }
                                                alt={vehicle.manufacturer.name}
                                                className="w-12 h-12 object-contain mr-4"
                                            />
                                            <div>
                                                <p className="text-sm text-onSurface/70">
                                                    Manufacturer
                                                </p>
                                                <p className="font-medium text-onSurface">
                                                    {vehicle.manufacturer.name}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div className="flex items-center p-3 bg-surface rounded-lg border border-surfaceContainer">
                                            <img
                                                src={vehicle.category.imgPath}
                                                alt={vehicle.category.name}
                                                className="w-12 h-12 object-contain mr-4"
                                            />
                                            <div>
                                                <p className="text-sm text-onSurface/70">
                                                    Category
                                                </p>
                                                <p className="font-medium text-onSurface">
                                                    {vehicle.category.name}
                                                </p>
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
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
