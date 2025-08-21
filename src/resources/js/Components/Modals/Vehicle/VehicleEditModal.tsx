import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiCheck, FiTrash2 } from "react-icons/fi";
import { Category, Manufacturer, PaginatedData, Vehicle } from "@/types";
import ImagePicker from "@/Components/Form/ImagePicker";
import BaseModal from "../BaseModal";

interface VehicleFormData {
    _method: "PATCH";
    name: string;
    manufacturer_id: string;
    category_id: string;
    img: File | null;
}

interface VehicleEditModalProps {
    isOpen: boolean;
    vehicle: Vehicle | null;
    onClose: () => void;
    onSuccess: (vehicle: Vehicle) => void;
}

export default function VehicleEditModal({
    isOpen,
    vehicle,
    onClose,
    onSuccess,
}: VehicleEditModalProps) {
    const {
        data,
        setData,
        setError,
        post: updateVehicle,
        isProcessing,
        errors,
    } = useAxiosForm<Vehicle, VehicleFormData>({
        _method: "PATCH",
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

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // Initialize form with vehicle data
    useEffect(() => {
        if (vehicle && vehicle.imgPath) {
            setImageUrl(vehicle.imgPath);
        }
    }, [vehicle, isOpen]);

    useEffect(() => {
        if (vehicle && isOpen) {
            setData({
                _method: "PATCH",
                name: vehicle.name,
                manufacturer_id: vehicle.manufacturer.id,
                category_id: vehicle.category.id,
                img: null,
            });
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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const onImageChange = (file: File | null) => {
        setData((prev) => ({ ...prev, img: file }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!vehicle) return;

        updateVehicle(route("api.vehicles.update", { vehicle: vehicle.id }), {
            onSuccess: (res) => {
                onSuccess(res.data);
                onClose();
            },
            headers: {
                "Content-Type": "multipart/form-data",
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
                            Edit Vehicle: {vehicle.name}
                        </DialogTitle>
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
                                    {manufacturers.map((manufacturer) => (
                                        <option
                                            key={manufacturer.id}
                                            value={manufacturer.id}
                                        >
                                            {manufacturer.name}
                                        </option>
                                    ))}
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
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
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

                                <ImagePicker
                                    fileUrl={imageUrl}
                                    onChange={onImageChange}
                                />
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
                    </form>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
