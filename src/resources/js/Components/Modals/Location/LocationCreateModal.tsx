import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment, useState, useRef, useEffect } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import {
    FiX,
    FiCheck,
    FiInfo,
    FiTrash2,
    FiMap,
    FiCalendar,
    FiCloud,
    FiAlertCircle,
} from "react-icons/fi";
import { GiCarWheel } from "react-icons/gi";
import { Location } from "@/types";
import ImagePicker from "@/Components/Form/ImagePicker";
import {
    SEASONS_MAP,
    SURFACE_CONDITIONS_MAP,
    SURFACE_TYPES_MAP,
    TYRES_MAP,
} from "@/constants";
import BaseModal from "../BaseModal";

interface LocationFormData {
    name: string;
    description: string;
    seasons: string[];
    tyres: string[];
    surface_conditions: string[];
    surface_type: string;
    img_bg: File | null;
    img_banner: File | null;
}

interface LocationCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (location: Location) => void;
}

export default function LocationCreateModal({
    isOpen,
    onClose,
    onSuccess,
}: LocationCreateModalProps) {
    const {
        data,
        setData,
        post: postLocation,
        isProcessing,
        errors,
        clearErrors,
    } = useAxiosForm<Location, LocationFormData>({
        name: "",
        description: "",
        seasons: [],
        tyres: [],
        surface_conditions: [],
        surface_type: "",
        img_bg: null,
        img_banner: null,
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Reset messages when modal opens/closes
        if (isOpen) {
            setShowSuccess(false);
            setShowError(false);
            setErrorMessage("");
            clearErrors();
        }
    }, [isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            clearErrors();
            setShowError(false);
        }
    };

    const onBackgroundImageChange = (file: File | null) => {
        setData((prev) => ({ ...prev, img_bg: file }));
    };

    const onBannerImageChange = (file: File | null) => {
        setData((prev) => ({ ...prev, img_banner: file }));
    };

    const toggleArrayOption = <
        K extends "seasons" | "tyres" | "surface_conditions"
    >(
        field: K,
        value: string
    ) => {
        setData((prev) => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter((v) => v !== value)
                : [...prev[field], value],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(false);
        setShowError(false);
        setErrorMessage("");

        postLocation(route("api.locations.store"), {
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
                        "An error occurred while creating the location. Please try again."
                );
            },
            headers: { "Content-Type": "multipart/form-data" },
        });
    };

    const handleClose = () => {
        setShowSuccess(false);
        setShowError(false);
        setErrorMessage("");
        clearErrors();
        onClose();
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

                        {/* Background Preview */}
                        <div className="relative h-40 mb-4 rounded-lg overflow-hidden border border-surfaceContainerHigh">
                            {data.img_bg ? (
                                <img
                                    src={URL.createObjectURL(data.img_bg)}
                                    alt="Background preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-surfaceContainerHigh flex items-center justify-center">
                                    <span className="text-onSurface/50">
                                        Background Image Preview
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Banner Preview */}
                        <div className="relative h-32 rounded-lg overflow-hidden border border-surfaceContainerHigh flex items-center justify-center">
                            {data.img_banner ? (
                                <img
                                    src={URL.createObjectURL(data.img_banner)}
                                    alt="Banner preview"
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full bg-surfaceContainerHigh flex items-center justify-center">
                                    <span className="text-onSurface/50">
                                        Banner Image Preview
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Name Preview */}
                        {data.name && (
                            <div className="mt-4 p-3 bg-surface rounded-lg">
                                <p className="text-onSurface font-medium">
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
                                <span>Location created successfully!</span>
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
                                    Create New Location
                                </DialogTitle>
                                <p className="text-onSurface/70 mt-1">
                                    Add details for a new racing location
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
                            {/* Name */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                    Location Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-surfaceContainer rounded-lg text-onSurface border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary"
                                    required
                                    placeholder="Enter location name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FiAlertCircle className="mr-1" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={data.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-surfaceContainer rounded-lg text-onSurface border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary"
                                    required
                                    placeholder="Describe this location"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FiAlertCircle className="mr-1" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Surface Type */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <div className="flex items-center mb-3">
                                    <div className="bg-primaryContainer/20 p-2 rounded-lg mr-3">
                                        <FiMap className="text-primary text-lg" />
                                    </div>
                                    <label className="block text-sm font-medium text-onSurface/70">
                                        Surface Type
                                    </label>
                                </div>
                                <select
                                    name="surface_type"
                                    value={data.surface_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-surfaceContainer rounded-lg text-onSurface border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary"
                                    required
                                >
                                    <option value="">
                                        Select Surface Type
                                    </option>
                                    {Object.entries(SURFACE_TYPES_MAP).map(
                                        ([key, value]) => (
                                            <option key={key} value={key}>
                                                {value.text}
                                            </option>
                                        )
                                    )}
                                </select>
                                {errors.surface_type && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FiAlertCircle className="mr-1" />
                                        {errors.surface_type}
                                    </p>
                                )}
                            </div>

                            {/* Seasons */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <div className="flex items-center mb-3">
                                    <div className="bg-secondaryContainer/20 p-2 rounded-lg mr-3">
                                        <FiCalendar className="text-secondary text-lg" />
                                    </div>
                                    <label className="block text-sm font-medium text-onSurface/70">
                                        Seasons
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(SEASONS_MAP).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex items-center bg-surfaceContainerHigh px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-surfaceContainerHighest"
                                                onClick={() =>
                                                    toggleArrayOption(
                                                        "seasons",
                                                        key
                                                    )
                                                }
                                            >
                                                <div
                                                    className={`h-5 w-5 rounded border flex items-center justify-center mr-2 ${
                                                        data.seasons.includes(
                                                            key
                                                        )
                                                            ? "bg-primary border-primary"
                                                            : "border-onSurface/30"
                                                    }`}
                                                >
                                                    {data.seasons.includes(
                                                        key
                                                    ) && (
                                                        <FiCheck className="text-white text-xs" />
                                                    )}
                                                </div>
                                                {value.icon}
                                                <span className="ml-2 text-onSurface capitalize">
                                                    {value.text}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                                {errors.seasons && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FiAlertCircle className="mr-1" />
                                        {errors.seasons}
                                    </p>
                                )}
                            </div>

                            {/* Surface Conditions */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <div className="flex items-center mb-3">
                                    <div className="bg-tertiaryContainer/20 p-2 rounded-lg mr-3">
                                        <FiCloud className="text-tertiary text-lg" />
                                    </div>
                                    <label className="block text-sm font-medium text-onSurface/70">
                                        Surface Conditions
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(SURFACE_CONDITIONS_MAP).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex items-center bg-surfaceContainerHigh px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-surfaceContainerHighest"
                                                onClick={() =>
                                                    toggleArrayOption(
                                                        "surface_conditions",
                                                        key
                                                    )
                                                }
                                            >
                                                <div
                                                    className={`h-5 w-5 rounded border flex items-center justify-center mr-2 ${
                                                        data.surface_conditions.includes(
                                                            key
                                                        )
                                                            ? "bg-primary border-primary"
                                                            : "border-onSurface/30"
                                                    }`}
                                                >
                                                    {data.surface_conditions.includes(
                                                        key
                                                    ) && (
                                                        <FiCheck className="text-white text-xs" />
                                                    )}
                                                </div>
                                                {value.icon}
                                                <span className="ml-2 text-onSurface capitalize">
                                                    {value.text}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                                {errors.surface_conditions && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FiAlertCircle className="mr-1" />
                                        {errors.surface_conditions}
                                    </p>
                                )}
                            </div>

                            {/* Tyres */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <div className="flex items-center mb-3">
                                    <div className="bg-primaryContainer/20 p-2 rounded-lg mr-3">
                                        <GiCarWheel className="text-primary text-lg" />
                                    </div>
                                    <label className="block text-sm font-medium text-onSurface/70">
                                        Recommended Tyres
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(TYRES_MAP).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex items-center bg-surfaceContainerHigh px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-surfaceContainerHighest"
                                                onClick={() =>
                                                    toggleArrayOption(
                                                        "tyres",
                                                        key
                                                    )
                                                }
                                            >
                                                <div
                                                    className={`h-5 w-5 rounded border flex items-center justify-center mr-2 ${
                                                        data.tyres.includes(key)
                                                            ? "bg-primary border-primary"
                                                            : "border-onSurface/30"
                                                    }`}
                                                >
                                                    {data.tyres.includes(
                                                        key
                                                    ) && (
                                                        <FiCheck className="text-white text-xs" />
                                                    )}
                                                </div>
                                                <span className="text-onSurface">
                                                    {value.text}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                                {errors.tyres && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FiAlertCircle className="mr-1" />
                                        {errors.tyres}
                                    </p>
                                )}
                            </div>

                            {/* Background Image */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                    Background Image
                                    <span className="text-xs text-onSurface/50 ml-1">
                                        (Recommended: 1920x1080)
                                    </span>
                                </label>
                                <ImagePicker
                                    onChange={onBackgroundImageChange}
                                />
                                {errors.img_bg && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FiAlertCircle className="mr-1" />
                                        {errors.img_bg}
                                    </p>
                                )}
                            </div>

                            {/* Banner Image */}
                            <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh">
                                <label className="block text-sm font-medium text-onSurface/70 mb-2">
                                    Banner Image
                                    <span className="text-xs text-onSurface/50 ml-1">
                                        (Recommended: 1200x300)
                                    </span>
                                </label>
                                <ImagePicker onChange={onBannerImageChange} />
                                {errors.img_banner && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FiAlertCircle className="mr-1" />
                                        {errors.img_banner}
                                    </p>
                                )}
                            </div>
                        </form>

                        <div className="pt-6 border-t border-surfaceContainerHigh">
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-6 py-3 text-onSurface bg-surfaceContainer rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={isProcessing}
                                    className={`px-6 py-3 flex items-center rounded-xl font-medium transition-colors duration-200 ${
                                        isProcessing
                                            ? "bg-surfaceContainer text-onSurface/50"
                                            : "bg-primary text-surfaceContainer hover:bg-primary-600"
                                    }`}
                                >
                                    <FiCheck className="mr-2" />
                                    {isProcessing
                                        ? "Creating..."
                                        : "Create Location"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </BaseModal>
    );
}
