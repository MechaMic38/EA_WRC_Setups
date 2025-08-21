import { useState, useEffect, Fragment } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { FiX, FiInfo, FiCheck } from "react-icons/fi";
import {
    Category,
    Manufacturer,
    PaginatedData,
    SetupOptions,
    Vehicle,
} from "@/types";
import ImagePicker from "@/Components/Form/ImagePicker";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import Select from "@/Components/Form/Select";

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
}

export default function VehicleCreateModal({
    isOpen,
    onClose,
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
     * Handle input change
     * @param e The change event
     */
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Handle manufacturer selection change
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
     * Handle category selection change
     * @param category The selected category
     */
    const onCategoryChange = (category: Category | null) => {
        setSelectedCategory(category);
        setData((prev) => ({ ...prev, category_id: category?.id || "" }));
    };

    /**
     * Handle image change
     * @param file The selected image file
     */
    const onImageChange = (file: File | null) => {
        setData((prev) => ({ ...prev, img: file }));
    };

    const toggleOption = (optionId: string) => {
        setData((prev) => {
            const newOptions = prev.setup_options.includes(optionId)
                ? prev.setup_options.filter((id) => id !== optionId)
                : [...prev.setup_options, optionId];
            return { ...prev, setup_options: newOptions };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        postVehicle(route("api.vehicles.store"), {
            onSuccess: (response) => {
                onClose();
                // Optionally refresh the page or vehicle list
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

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
                            <DialogPanel className="bg-surfaceContainer rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <DialogTitle className="text-2xl font-bold text-onSurface">
                                            Create New Vehicle
                                        </DialogTitle>
                                        <button
                                            onClick={onClose}
                                            className="text-onSurface hover:text-primary"
                                        >
                                            <FiX size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {/* Vehicle Name */}
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
                                                <Select
                                                    options={manufacturers}
                                                    selectedOption={
                                                        selectedManufacturer
                                                    }
                                                    onChange={
                                                        onManufacturerChange
                                                    }
                                                />
                                            </div>

                                            {/* Category */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Category
                                                </label>
                                                <Select
                                                    options={categories}
                                                    selectedOption={
                                                        selectedCategory
                                                    }
                                                    onChange={onCategoryChange}
                                                />
                                            </div>

                                            {/* Image Upload */}
                                            <ImagePicker
                                                onChange={onImageChange}
                                            />
                                        </div>

                                        {/* Setup Options */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-medium text-onSurface">
                                                    Setup Options
                                                </h3>
                                                <span className="text-sm text-onSurface/70">
                                                    {data.setup_options.length}{" "}
                                                    selected
                                                </span>
                                            </div>

                                            <div className="bg-surface rounded-lg p-4">
                                                {Object.entries(
                                                    setupOptions
                                                ).map(([category, options]) => (
                                                    <div
                                                        key={category}
                                                        className="mb-6"
                                                    >
                                                        <h4 className="text-md font-medium text-onSurface mb-3 capitalize">
                                                            {category.replace(
                                                                "_",
                                                                " "
                                                            )}
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
                                                                        key={
                                                                            optionId
                                                                        }
                                                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                                                            data.setup_options.includes(
                                                                                optionId
                                                                            )
                                                                                ? "border-primary bg-primary/10"
                                                                                : "border-surfaceContainer hover:bg-surfaceContainer/30"
                                                                        }`}
                                                                        onClick={() =>
                                                                            toggleOption(
                                                                                optionId
                                                                            )
                                                                        }
                                                                    >
                                                                        <div className="flex justify-between items-start">
                                                                            <span className="text-onSurface">
                                                                                {
                                                                                    option.label
                                                                                }
                                                                            </span>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={data.setup_options.includes(
                                                                                    optionId
                                                                                )}
                                                                                onChange={() => {}}
                                                                                className="ml-2 h-5 w-5 text-primary focus:ring-primary"
                                                                            />
                                                                        </div>
                                                                        <div className="flex items-center mt-2 text-sm text-onSurface/70">
                                                                            <FiInfo className="mr-1" />
                                                                            <span>
                                                                                Hover
                                                                                for
                                                                                details
                                                                            </span>
                                                                        </div>
                                                                        <div className="hidden group-hover:block absolute z-10 mt-2 w-64 p-3 bg-surfaceContainer text-onSurface text-sm rounded shadow-lg">
                                                                            {
                                                                                option.description
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
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
                                                disabled={
                                                    isProcessingManufacturers
                                                }
                                                className={`px-4 py-2 flex items-center ${
                                                    isProcessingManufacturers
                                                        ? "bg-surfaceContainer text-onSurface/50"
                                                        : "bg-primary text-surfaceContainer hover:bg-primary-600"
                                                } rounded-md`}
                                            >
                                                <FiCheck className="mr-2" />
                                                {isProcessingManufacturers
                                                    ? "Creating..."
                                                    : "Create Vehicle"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
