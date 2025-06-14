import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiCheck, FiTrash2, FiUpload } from "react-icons/fi";
import { Manufacturer } from "@/types";

interface ManufacturerFormData {
    name: string;
    img: File | null;
}

export default function ManufacturerCreateModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const {
        data,
        setData,
        post: postManufacturer,
        isProcessing,
        errors,
        reset,
    } = useAxiosForm<Manufacturer, ManufacturerFormData>({
        name: "",
        img: null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset();
            setImagePreview(null);
        }
    }, [isOpen]);

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, name: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setData({ ...data, img: file });

            // Create preview
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const removeImage = () => {
        setData({ ...data, img: null });
        setImagePreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postManufacturer(route("api.manufacturers.store"), {
            onSuccess: onClose,
            headers: { "Content-Type": "multipart/form-data" },
        });
    };

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
                                            Create New Manufacturer
                                        </Dialog.Title>
                                        <button
                                            onClick={onClose}
                                            className="text-onSurface hover:text-primary"
                                        >
                                            <FiX size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-6 mb-6">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Manufacturer Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface"
                                                    placeholder="e.g., Toyota, Ford, Subaru"
                                                    required
                                                    autoFocus
                                                />
                                            </div>

                                            {/* Logo Upload */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Manufacturer Logo
                                                    <span className="text-xs text-onSurface/70 ml-1">
                                                        (Recommended: 300x300
                                                        transparent PNG)
                                                    </span>
                                                </label>

                                                <div className="flex flex-col items-center">
                                                    {/* Preview Area */}
                                                    <div className="relative mb-4">
                                                        {imagePreview ? (
                                                            <div className="relative">
                                                                <div className="bg-surface p-4 rounded-lg">
                                                                    <img
                                                                        src={
                                                                            imagePreview
                                                                        }
                                                                        alt="Logo preview"
                                                                        className="w-32 h-32 object-contain"
                                                                    />
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        removeImage
                                                                    }
                                                                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                                                >
                                                                    <FiTrash2
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="w-40 h-40 flex items-center justify-center border-2 border-dashed border-surfaceContainer rounded-lg bg-surface">
                                                                <div className="text-center p-4">
                                                                    <FiUpload className="text-onSurface/50 text-2xl mx-auto mb-2" />
                                                                    <span className="text-sm text-onSurface/70">
                                                                        No logo
                                                                        selected
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Upload Button */}
                                                    <label className="flex items-center justify-center px-4 py-2 bg-primary text-surfaceContainer rounded-md hover:bg-primary-600 cursor-pointer transition-colors">
                                                        <FiUpload className="mr-2" />
                                                        <span>Select Logo</span>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            onChange={
                                                                handleFileChange
                                                            }
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form Actions */}
                                        <div className="flex justify-end space-x-3 pt-4 border-t border-surfaceContainer">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-4 py-2 text-onSurface bg-surfaceContainer rounded-md hover:bg-surfaceContainer/80"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isProcessing}
                                                className={`px-4 py-2 flex items-center ${
                                                    isProcessing
                                                        ? "bg-surfaceContainer text-onSurface/50"
                                                        : "bg-primary text-surfaceContainer hover:bg-primary-600"
                                                } rounded-md`}
                                            >
                                                <FiCheck className="mr-2" />
                                                {isProcessing
                                                    ? "Creating..."
                                                    : "Create Manufacturer"}
                                            </button>
                                        </div>

                                        {errors && (
                                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-md">
                                                {Object.values(errors).map(
                                                    (error, i) => (
                                                        <p key={i}>{error}</p>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
