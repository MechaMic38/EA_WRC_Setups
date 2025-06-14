import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiCheck, FiTrash2 } from "react-icons/fi";
import { Category, Manufacturer, PaginatedData, Vehicle } from "@/types";

interface VehicleFormData {
    name: string;
    manufacturer_id: string;
    category_id: string;
    img: File | null;
}

export default function VehicleEditModal({
    isOpen,
    onClose,
    vehicle,
}: {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle | null;
}) {
    const {
        data,
        setData,
        setError,
        post: updateVehicle,
        isProcessing,
        errors,
    } = useAxiosForm<Vehicle, VehicleFormData>({
        name: "",
        manufacturer_id: "",
        category_id: "",
        img: null,
    });

    const { get: getManufacturers } = useAxiosForm<PaginatedData<Manufacturer>>(
        []
    );
    const { get: getCategories } = useAxiosForm<PaginatedData<Category>>([]);

    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Initialize form with vehicle data
    useEffect(() => {
        if (vehicle && isOpen) {
            setData({
                name: vehicle.name,
                manufacturer_id: vehicle.manufacturer.id,
                category_id: vehicle.category.id,
                img: null,
            });
            setImagePreview(vehicle.imgPath);
        }
    }, [vehicle, isOpen]);

    // Fetch manufacturers and categories
    useEffect(() => {
        if (isOpen) {
            getManufacturers(
                route("api.manufacturers.index", { paginate: false }),
                {
                    onSuccess: (response) =>
                        setManufacturers(response.data.data),
                }
            );

            getCategories(route("api.categories.index", { paginate: false }), {
                onSuccess: (response) => setCategories(response.data.data),
            });
        }
    }, [isOpen]);

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setData((prev) => ({ ...prev, img: file }));

            // Create preview
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const removeImage = () => {
        setData((prev) => ({ ...prev, img: null }));
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(vehicle?.imgPath || null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!vehicle) return;

        updateVehicle(route("api.vehicles.update", { vehicle: vehicle.id }), {
            method: "post", // Use POST with _method=PUT for Laravel
            onSuccess: onClose,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data: {
                ...data,
                _method: "PUT",
            },
        });
    };

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
                                            Edit Vehicle: {vehicle.name}
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
                                                    Vehicle Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={data.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface"
                                                    required
                                                />
                                            </div>

                                            {/* Manufacturer */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Manufacturer
                                                </label>
                                                <select
                                                    name="manufacturer_id"
                                                    value={data.manufacturer_id}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface"
                                                    required
                                                >
                                                    <option value="">
                                                        Select Manufacturer
                                                    </option>
                                                    {manufacturers.map(
                                                        (manufacturer) => (
                                                            <option
                                                                key={
                                                                    manufacturer.id
                                                                }
                                                                value={
                                                                    manufacturer.id
                                                                }
                                                            >
                                                                {
                                                                    manufacturer.name
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>

                                            {/* Category */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Category
                                                </label>
                                                <select
                                                    name="category_id"
                                                    value={data.category_id}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface"
                                                    required
                                                >
                                                    <option value="">
                                                        Select Category
                                                    </option>
                                                    {categories.map(
                                                        (category) => (
                                                            <option
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.id
                                                                }
                                                            >
                                                                {category.name}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>

                                            {/* Image Upload */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Vehicle Image
                                                    <span className="text-xs text-onSurface/70 ml-1">
                                                        (Recommended: 500x500)
                                                    </span>
                                                </label>

                                                <div className="flex flex-col items-center">
                                                    {/* Preview Area */}
                                                    <div className="relative mb-4">
                                                        {imagePreview ? (
                                                            <div className="relative">
                                                                <div className="bg-surface p-4 rounded-lg border border-surfaceContainer">
                                                                    <img
                                                                        src={
                                                                            imagePreview
                                                                        }
                                                                        alt="Vehicle preview"
                                                                        className="w-40 h-40 object-contain"
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
                                                                    <span className="text-sm text-onSurface">
                                                                        No image
                                                                        selected
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Upload Button */}
                                                    <label className="flex items-center justify-center px-4 py-2 bg-primary text-surfaceContainer rounded-md hover:bg-primary-600 cursor-pointer transition-colors">
                                                        <span>
                                                            Change Image
                                                        </span>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            onChange={
                                                                handleFileChange
                                                            }
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                    <p className="mt-2 text-xs text-onSurface/50">
                                                        Leave unchanged to keep
                                                        current image
                                                    </p>
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
                                                    ? "Updating..."
                                                    : "Update Vehicle"}
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
