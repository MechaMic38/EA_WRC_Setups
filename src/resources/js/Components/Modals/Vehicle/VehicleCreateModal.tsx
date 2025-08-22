import { useState, useEffect } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiInfo, FiCheck, FiAlertCircle } from "react-icons/fi";
import {
    Category,
    Manufacturer,
    PaginatedData,
    SetupOptions,
    Vehicle,
} from "@/types";
import ImagePicker from "@/Components/Form/ImagePicker";
import {
    DialogPanel,
    DialogTitle,
    Field,
    Input,
    Label,
} from "@headlessui/react";
import ListBox from "@/Components/Form/ListBox";
import BaseModal from "../BaseModal";
import TextInput from "@/Components/Form/TextInput";
import SuccessMessage from "@/Components/Form/SuccessMessage";
import ErrorText from "@/Components/Form/ErrorText";

interface CreateVehicleFormData {
    name: string;
    manufacturer_id: string;
    category_id: string;
    setup_options: string[];
    img: File | null;
}

interface VehicleCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (vehicle: Vehicle) => void;
}

export default function VehicleCreateModal({
    isOpen,
    onClose,
    onSuccess,
}: VehicleCreateModalProps) {
    const { get: getManufacturers, isProcessing: isProcessingManufacturers } =
        useAxiosForm<PaginatedData<Manufacturer>>([]);
    const { get: getCategories, isProcessing: isProcessingCategories } =
        useAxiosForm<PaginatedData<Category>>([]);
    const { get: getSetupOptions, isProcessing: isProcessingSetupOptions } =
        useAxiosForm<SetupOptions>([]);

    const {
        data,
        setData,
        post: postVehicle,
        isProcessing: isProcessingVehicle,
        errors,
        setError,
        clearErrors,
    } = useAxiosForm<Vehicle, CreateVehicleFormData>({
        name: "",
        manufacturer_id: "",
        category_id: "",
        setup_options: [],
        img: null,
    });

    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [setupOptions, setSetupOptions] = useState<SetupOptions>({
        alignment: {},
        braking: {},
        differentials: {},
        gears: {},
        damping: {},
        springs: {},
    });

    const [selectedManufacturer, setSelectedManufacturer] =
        useState<Manufacturer | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [showSuccess, setShowSuccess] = useState(false);

    // Clear errors when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setShowSuccess(false);
        }
    }, [isOpen]);

    // Fetch initial data
    useEffect(() => {
        // Fetch manufacturers
        getManufacturers(route("api.manufacturers.index"), {
            onSuccess: (response) => setManufacturers(response.data.data),
        });

        // Fetch categories
        getCategories(route("api.categories.index"), {
            onSuccess: (response) => setCategories(response.data.data),
        });

        // Fetch setup options
        getSetupOptions(route("api.setup-options.index"), {
            onSuccess: (response) => setSetupOptions(response.data),
        });
    }, []);

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

    /**
     * Handles setup option toggle.
     * @param optionId The ID of the setup option
     */
    const toggleOption = (optionId: string) => {
        setData((prev) => {
            const newOptions = prev.setup_options.includes(optionId)
                ? prev.setup_options.filter((id) => id !== optionId)
                : [...prev.setup_options, optionId];
            return { ...prev, setup_options: newOptions };
        });
    };

    /**
     * Validates the form data.
     * @returns True if the form is valid, false otherwise.
     */
    const validateForm = () => {
        clearErrors();
        let isValid = true;

        if (!data.name) {
            setError("name", "Name is required");
            isValid = false;
        }
        if (!data.manufacturer_id) {
            setError("manufacturer_id", "Manufacturer is required");
            isValid = false;
        }
        if (!data.category_id) {
            setError("category_id", "Category is required");
            isValid = false;
        }
        if (!data.img) {
            setError("img", "Image is required");
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

        if (!validateForm()) return;

        postVehicle(route("api.vehicles.store"), {
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
    const getError = (
        fieldName: keyof CreateVehicleFormData
    ): string | null => {
        // Check if the field is an array or a string
        return Array.isArray(errors[fieldName])
            ? errors[fieldName][0]
            : errors[fieldName] || null;
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <DialogPanel className="bg-surfaceContainer rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-surfaceContainerHigh">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <DialogTitle className="text-2xl font-bold text-onSurface">
                            Create New Vehicle
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="text-onSurface hover:text-primary transition-colors duration-200 p-1 rounded-full hover:bg-surfaceContainerHigh"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Vehicle Name */}
                            <Field className="md:col-span-2">
                                <Label className="block text-sm font-medium text-onSurface mb-2">
                                    Vehicle Name *
                                </Label>
                                <TextInput
                                    name="name"
                                    value={data.name}
                                    onChange={handleInputChange}
                                    error={getError("name")}
                                />
                                {getError("name") && (
                                    <ErrorText message={getError("name")!!} />
                                )}
                            </Field>

                            {/* Make both selects as distant as possible within the cell */}
                            <div className="flex flex-col justify-between">
                                {/* Manufacturer */}
                                <Field>
                                    <Label className="block text-sm font-medium text-onSurface mb-2">
                                        Manufacturer *
                                    </Label>
                                    <ListBox
                                        options={manufacturers}
                                        selectedOption={selectedManufacturer}
                                        error={getError("manufacturer_id")}
                                        onChange={onManufacturerChange}
                                    />
                                    {getError("manufacturer_id") && (
                                        <ErrorText
                                            message={
                                                getError("manufacturer_id")!!
                                            }
                                        />
                                    )}
                                </Field>

                                {/* Category */}
                                <Field>
                                    <Label className="block text-sm font-medium text-onSurface mb-2">
                                        Category *
                                    </Label>
                                    <ListBox
                                        options={categories}
                                        selectedOption={selectedCategory}
                                        error={getError("category_id")}
                                        onChange={onCategoryChange}
                                    />
                                    {getError("category_id") && (
                                        <ErrorText
                                            message={getError("category_id")!!}
                                        />
                                    )}
                                </Field>
                            </div>

                            {/* Image Upload */}
                            <Field>
                                <Label className="block text-sm font-medium text-onSurface mb-2">
                                    Vehicle Image *
                                </Label>
                                <ImagePicker
                                    onChange={onImageChange}
                                    error={getError("img")}
                                />
                                {getError("img") && (
                                    <ErrorText message={getError("img")!!} />
                                )}
                            </Field>
                        </div>

                        {/* Setup Options */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-onSurface">
                                    Setup Options
                                </h3>
                                <span className="text-sm text-onSurface/70">
                                    {data.setup_options.length} selected
                                </span>
                            </div>

                            <div className="bg-surface rounded-xl p-4 border border-surfaceContainerHigh">
                                {Object.entries(setupOptions).map(
                                    ([category, options]) => (
                                        <div
                                            key={category}
                                            className="mb-6 last:mb-0"
                                        >
                                            <h4 className="text-md font-medium text-onSurface mb-3 capitalize">
                                                {category.replace("_", " ")}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {Object.entries(options).map(
                                                    ([optionId, option]) => (
                                                        <div
                                                            key={optionId}
                                                            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 group relative ${
                                                                data.setup_options.includes(
                                                                    optionId
                                                                )
                                                                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                                                                    : "border-surfaceContainerHigh hover:border-primary hover:bg-surfaceContainer/50"
                                                            }`}
                                                            onClick={() =>
                                                                toggleOption(
                                                                    optionId
                                                                )
                                                            }
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-onSurface font-medium">
                                                                    {
                                                                        option.label
                                                                    }
                                                                </span>
                                                                <div
                                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                                                        data.setup_options.includes(
                                                                            optionId
                                                                        )
                                                                            ? "bg-primary border-primary"
                                                                            : "bg-surface border-outline"
                                                                    }`}
                                                                >
                                                                    {data.setup_options.includes(
                                                                        optionId
                                                                    ) && (
                                                                        <FiCheck className="w-3 h-3 text-onPrimary" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center mt-2 text-sm text-onSurface/60">
                                                                <FiInfo className="mr-1 w-4 h-4" />
                                                                <span>
                                                                    Hover for
                                                                    details
                                                                </span>
                                                            </div>
                                                            <div className="opacity-0 group-hover:opacity-100 invisible group-hover:visible absolute z-10 mt-2 w-64 p-3 bg-surfaceContainer text-onSurface text-sm rounded-lg shadow-xl border border-surfaceContainerHigh transition-all duration-200">
                                                                {
                                                                    option.description
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-surfaceContainerHigh">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 text-onSurface bg-surfaceContainer rounded-lg hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium"
                                disabled={isProcessingVehicle}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isProcessingVehicle}
                                className={`px-6 py-3 flex items-center rounded-lg font-medium transition-all duration-200 ${
                                    isProcessingVehicle
                                        ? "bg-surfaceContainer text-onSurface/50 cursor-not-allowed"
                                        : "bg-primary text-onPrimary hover:bg-primary/90 hover:shadow-lg transform hover:scale-105"
                                }`}
                            >
                                {isProcessingVehicle ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-onPrimary border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <FiCheck className="mr-2" />
                                        Create Vehicle
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Success Message */}
                        {showSuccess && (
                            <SuccessMessage message="Vehicle created successfully!" />
                        )}
                    </form>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
