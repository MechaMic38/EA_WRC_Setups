import { useState, useEffect } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import {
    FiX,
    FiInfo,
    FiCheck,
    FiAlertCircle,
    FiPackage,
    FiTool,
} from "react-icons/fi";
import { BsTools } from "react-icons/bs";
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
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Clear errors when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setShowSuccess(false);
            setShowError(false);
            setErrorMessage("");
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

        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            clearErrors();
            setShowError(false);
        }
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
     * Handles form submission.
     * @param e The form event
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(false);
        setShowError(false);
        setErrorMessage("");

        postVehicle(route("api.vehicles.store"), {
            onSuccess: (res) => {
                setShowSuccess(true);
                setTimeout(() => {
                    onSuccess(res.data);
                    onClose();
                }, 1500);
            },
            onError: (error) => {
                setShowError(true);
                setErrorMessage(
                    error.response?.data?.message ||
                        "An error occurred while creating the vehicle. Please try again."
                );
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

    const handleClose = () => {
        setShowSuccess(false);
        setShowError(false);
        setErrorMessage("");
        clearErrors();
        onClose();
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
        <BaseModal isOpen={isOpen} onClose={handleClose}>
            <DialogPanel className="bg-surfaceContainer rounded-xl shadow-2xl w-full max-w-6xl transform transition-all overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Preview Section */}
                    <div className="md:w-2/5 bg-gradient-to-br from-surfaceContainerHigh to-surfaceContainer p-6 flex flex-col justify-center">
                        <h3 className="text-lg font-semibold text-onSurface mb-4">
                            Preview
                        </h3>

                        {/* Image Preview */}
                        <div className="relative h-60 mb-4 rounded-lg overflow-hidden border border-surfaceContainerHigh flex items-center justify-center">
                            {data.img ? (
                                <img
                                    src={URL.createObjectURL(data.img)}
                                    alt="Vehicle preview"
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full bg-surfaceContainerHigh flex items-center justify-center">
                                    <span className="text-onSurface/50">
                                        Vehicle Image Preview
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Name Preview */}
                        {data.name && (
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <p className="text-onSurface font-medium text-center">
                                    {data.name}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="md:w-3/5 p-8 flex flex-col relative">
                        {/* Success Message */}
                        {showSuccess && (
                            <div className="absolute top-4 left-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center z-10">
                                <FiCheck className="mr-2 text-green-600" />
                                <span>Vehicle created successfully!</span>
                            </div>
                        )}

                        {/* Error Message */}
                        {showError && (
                            <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-start z-10">
                                <FiAlertCircle className="mr-2 text-red-600 mt-0.5 flex-shrink-0" />
                                <span>{errorMessage}</span>
                                <button
                                    onClick={() => setShowError(false)}
                                    className="ml-auto text-red-700 hover:text-red-900"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <DialogTitle className="text-2xl font-bold text-onSurface">
                                    Create New Vehicle
                                </DialogTitle>
                                <p className="text-onSurface/70 mt-1">
                                    Add details for a new vehicle
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-onSurface hover:text-primary transition-colors duration-200 p-1 rounded-full hover:bg-surfaceContainerHigh"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 mb-8 flex-grow overflow-y-auto max-h-[60vh] pr-2"
                        >
                            {/* Vehicle Name */}
                            <Field className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                    Vehicle Name
                                </Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-surfaceContainer rounded-lg text-onSurface border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary"
                                    required
                                    placeholder="Enter vehicle name"
                                />
                                {getError("name") && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FiAlertCircle className="mr-1" />
                                        {getError("name")}
                                    </p>
                                )}
                            </Field>

                            {/* Manufacturer */}
                            <Field className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <div className="flex items-center mb-3">
                                    <div className="bg-primaryContainer/20 p-2 rounded-lg mr-3">
                                        <BsTools className="text-primary text-lg" />
                                    </div>
                                    <Label className="block text-sm font-medium text-onSurface/70">
                                        Manufacturer
                                    </Label>
                                </div>
                                <ListBox
                                    options={manufacturers}
                                    selectedOption={selectedManufacturer}
                                    error={getError("manufacturer_id")}
                                    onChange={onManufacturerChange}
                                />
                                {getError("manufacturer_id") && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FiAlertCircle className="mr-1" />
                                        {getError("manufacturer_id")}
                                    </p>
                                )}
                            </Field>

                            {/* Category */}
                            <Field className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <div className="flex items-center mb-3">
                                    <div className="bg-tertiaryContainer/20 p-2 rounded-lg mr-3">
                                        <FiPackage className="text-tertiary text-lg" />
                                    </div>
                                    <Label className="block text-sm font-medium text-onSurface/70">
                                        Category
                                    </Label>
                                </div>
                                <ListBox
                                    options={categories}
                                    selectedOption={selectedCategory}
                                    error={getError("category_id")}
                                    onChange={onCategoryChange}
                                />
                                {getError("category_id") && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FiAlertCircle className="mr-1" />
                                        {getError("category_id")}
                                    </p>
                                )}
                            </Field>

                            {/* Image Upload */}
                            <Field className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                    Vehicle Image
                                    <span className="text-xs text-onSurface/50 ml-1">
                                        (Recommended: 1280x720)
                                    </span>
                                </Label>
                                <ImagePicker
                                    onChange={onImageChange}
                                    error={getError("img")}
                                />
                                {getError("img") && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FiAlertCircle className="mr-1" />
                                        {getError("img")}
                                    </p>
                                )}
                            </Field>

                            {/* Setup Options */}
                            <Field className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <div className="flex items-center mb-3">
                                    <div className="bg-secondaryContainer/20 p-2 rounded-lg mr-3">
                                        <FiTool className="text-secondary text-lg" />
                                    </div>
                                    <div className="flex-grow">
                                        <Label className="block text-sm font-medium text-onSurface/70">
                                            Setup Options
                                        </Label>
                                        <p className="text-xs text-onSurface/50">
                                            {data.setup_options.length} selected
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(setupOptions).map(
                                        ([category, options]) => (
                                            <div
                                                key={category}
                                                className="mb-4 last:mb-0"
                                            >
                                                <h4 className="text-md font-medium text-onSurface mb-3 capitalize">
                                                    {category.replace("_", " ")}
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {Object.entries(
                                                        options
                                                    ).map(
                                                        ([
                                                            optionId,
                                                            option,
                                                        ]) => (
                                                            <div
                                                                key={optionId}
                                                                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 group relative ${
                                                                    data.setup_options.includes(
                                                                        optionId
                                                                    )
                                                                        ? "border-primary bg-primary/10"
                                                                        : "border-surfaceContainerHigh hover:border-primary/30"
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
                                                                        className={`h-5 w-5 rounded border flex items-center justify-center ${
                                                                            data.setup_options.includes(
                                                                                optionId
                                                                            )
                                                                                ? "bg-primary border-primary"
                                                                                : "border-onSurface/30"
                                                                        }`}
                                                                    >
                                                                        {data.setup_options.includes(
                                                                            optionId
                                                                        ) && (
                                                                            <FiCheck className="w-3 h-3 text-white" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center mt-2 text-sm text-onSurface/60">
                                                                    <FiInfo className="mr-1 w-4 h-4" />
                                                                    <span>
                                                                        Hover
                                                                        for
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
                            </Field>
                        </form>

                        <div className="pt-6 border-t border-surfaceContainerHigh">
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-6 py-3 text-onSurface bg-surfaceContainer rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium"
                                    disabled={isProcessingVehicle}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={isProcessingVehicle}
                                    className={`px-6 py-3 flex items-center rounded-xl font-medium transition-colors duration-200 ${
                                        isProcessingVehicle
                                            ? "bg-surfaceContainer text-onSurface/50"
                                            : "bg-primary text-surfaceContainer hover:bg-primary-600"
                                    }`}
                                >
                                    <FiCheck className="mr-2" />
                                    {isProcessingVehicle
                                        ? "Creating..."
                                        : "Create Vehicle"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
