import { Manufacturer } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiX } from "react-icons/fi";

export default function ManufacturerShowModal({
    isOpen,
    onClose,
    manufacturer,
}: {
    isOpen: boolean;
    onClose: () => void;
    manufacturer: Manufacturer | null;
}) {
    if (!manufacturer) return null;

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
                                            Manufacturer Details
                                        </Dialog.Title>
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
                                                        src={
                                                            manufacturer.imgPath
                                                        }
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
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
