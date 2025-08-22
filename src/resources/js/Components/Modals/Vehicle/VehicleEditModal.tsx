import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Field,
    Label,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiCheck, FiTrash2 } from "react-icons/fi";
import { Category, Manufacturer, PaginatedData, Vehicle } from "@/types";
import ImagePicker from "@/Components/Form/ImagePicker";
import BaseModal from "../BaseModal";
import ListBox from "@/Components/Form/ListBox";
import TextInput from "@/Components/Form/TextInput";
import ErrorText from "@/Components/Form/ErrorText";
import SuccessMessage from "@/Components/Form/SuccessMessage";

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
        isProcessing,
        errors,
        post: updateVehicle,
        setError,
        clearErrors,
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

    const [selectedManufacturer, setSelectedManufacturer] =
        useState<Manufacturer | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const [showSuccess, setShowSuccess] = useState(false);

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
            setSelectedManufacturer(vehicle.manufacturer);
            setSelectedCategory(vehicle.category);
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

    /**
     * Handles input change events for form fields.
     * @param e The change event
     */
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Handles manufacturer selection change.
     * @param manufacturer The selected manufacturer
     */
    const onManufacturerChange = (manufacturer: Manufacturer | null) => {
        setSelectedManufacturer(manufacturer);
        setData((prev) => ({
            ...prev,
            manufacturer_id: manufacturer?.id || "",
        }));
    };

    /**
     * Handles category selection change.
     * @param category The selected category
     */
    const onCategoryChange = (category: Category | null) => {
        setSelectedCategory(category);
        setData((prev) => ({ ...prev, category_id: category?.id || "" }));
    };

    /**
     * Handles image change.
     * @param file The selected image file
     */
    const onImageChange = (file: File | null) => {
        setData((prev) => ({ ...prev, img: file }));
    };

    const validateForm = () => {
        clearErrors();
        let isValid = true;

        if (!data.name) {
            setError("name", "Name is required");
            isValid = false;
        }

        if (!selectedManufacturer) {
            setError("manufacturer_id", "Manufacturer is required");
            isValid = false;
        }

        if (!selectedCategory) {
            setError("category_id", "Category is required");
            isValid = false;
        }

        return isValid;
    };

    /**
     * Handles form submission.
     * @param e The form event
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!vehicle) return;

        if (!validateForm()) return;

        updateVehicle(route("api.vehicles.update", { vehicle: vehicle.id }), {
            onSuccess: (res) => {
                setShowSuccess(true);
                setTimeout(() => {
                    onSuccess(res.data);
                    onClose();
                    setShowSuccess(false);
                }, 1500);
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

    /**
     * Retrieves the error message for a specific form field.
     * @param fieldName The name of the form field
     * @returns The error message or null if no error exists
     */
    const getError = (fieldName: keyof VehicleFormData): string | null => {
        // Check if the field is an array or a string
        return Array.isArray(errors[fieldName])
            ? errors[fieldName][0]
            : errors[fieldName] || null;
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
                            <Field>
                                <Label className="block text-sm font-medium text-onSurface mb-2">
                                    Vehicle Name
                                </Label>
                                <TextInput
                                    name="name"
                                    value={data.name}
                                    onChange={handleInputChange}
                                />
                                {getError("name") && (
                                    <ErrorText message={getError("name")!!} />
                                )}
                            </Field>

                            {/* Manufacturer */}
                            <Field>
                                <Label className="block text-sm font-medium text-onSurface mb-2">
                                    Manufacturer
                                </Label>
                                <ListBox
                                    options={manufacturers}
                                    selectedOption={selectedManufacturer}
                                    onChange={onManufacturerChange}
                                />
                                {getError("manufacturer_id") && (
                                    <ErrorText
                                        message={getError("manufacturer_id")!!}
                                    />
                                )}
                            </Field>

                            {/* Category */}
                            <Field>
                                <Label className="block text-sm font-medium text-onSurface mb-2">
                                    Category
                                </Label>
                                <ListBox
                                    options={categories}
                                    selectedOption={selectedCategory}
                                    onChange={onCategoryChange}
                                />
                                {getError("category_id") && (
                                    <ErrorText
                                        message={getError("category_id")!!}
                                    />
                                )}
                            </Field>

                            {/* Image Upload */}
                            <Field>
                                <Label className="block text-sm font-medium text-onSurface mb-2">
                                    Vehicle Image
                                    <span className="text-xs text-onSurface/70 ml-1">
                                        (Recommended: 500x500)
                                    </span>
                                </Label>
                                <ImagePicker
                                    fileUrl={imageUrl}
                                    onChange={onImageChange}
                                />
                                {getError("img") && (
                                    <ErrorText message={getError("img")!!} />
                                )}
                            </Field>
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

                        {/* Success Message */}
                        {showSuccess && (
                            <SuccessMessage message="Vehicle updated successfully!" />
                        )}
                    </form>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
