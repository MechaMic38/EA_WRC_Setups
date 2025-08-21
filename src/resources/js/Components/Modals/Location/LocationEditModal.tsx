import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import useAxiosForm from "@/Hooks/useAxiosForm";
import {
    FiX,
    FiCheck,
    FiTrash2,
    FiEye,
    FiEyeOff,
    FiInfo,
} from "react-icons/fi";
import { Location, LocationSummary } from "@/types";
import ImagePicker from "@/Components/ImagePicker";

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

// Predefined options
const SEASON_OPTIONS = ["spring", "summer", "autumn", "winter"];
const TYRE_OPTIONS = [
    "gravel soft",
    "gravel medium",
    "gravel hard",
    "tarmac soft",
    "tarmac medium",
    "tarmac hard",
    "snow",
    "ice",
];
const SURFACE_CONDITIONS = ["dry", "wet", "snow", "ice"];
const SURFACE_TYPES = ["gravel", "tarmac", "snow", "ice", "mixed"];

export default function LocationEditModal({
    isOpen,
    onClose,
    location,
}: {
    isOpen: boolean;
    onClose: () => void;
    location: LocationSummary | null;
}) {
    const { get: getLocation } = useAxiosForm<Location>([]);
    const {
        data,
        setData,
        setError,
        post: updateLocation,
        isProcessing,
        errors,
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

    const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);
    const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);

    // Initialize form with location data
    useEffect(() => {
        if (location && isOpen) {
            getLocation(
                route("api.locations.show", { location: location.id }),
                {
                    onSuccess: (response) => {
                        const locationData = response.data;

                        // Set form data
                        setData({
                            name: locationData.name,
                            description: locationData.description,
                            seasons: locationData.seasons || [],
                            tyres: locationData.tyres || [],
                            surface_conditions:
                                locationData.surfaceConditions || [],
                            surface_type: locationData.surfaceType || "",
                            img_bg: null, // Reset file inputs
                            img_banner: null,
                        });

                        // Set image preview URLs
                        setBgImageUrl(locationData.imgBgPath || null);
                        setBannerImageUrl(locationData.imgBannerPath || null);
                    },
                }
            );
        }
    }, [location, isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
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

        if (!location) return;

        updateLocation(
            route("api.locations.update", { location: location.id }),
            {
                method: "post", // Use POST with _method=PUT for Laravel
                onSuccess: onClose,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: {
                    ...data,
                    _method: "PUT",
                },
            }
        );
    };

    if (!location) return null;

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
                            <Dialog.Panel className="bg-surfaceContainer rounded-lg shadow-xl w-full max-w-3xl transform transition-all max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <Dialog.Title className="text-2xl font-bold text-onSurface">
                                            Edit Location: {location.name}
                                        </Dialog.Title>
                                        <button
                                            onClick={onClose}
                                            className="text-onSurface hover:text-primary"
                                        >
                                            <FiX size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {/* Name */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Location Name
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

                                            {/* Description */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Description
                                                </label>
                                                <textarea
                                                    name="description"
                                                    value={data.description}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface"
                                                    required
                                                />
                                            </div>

                                            {/* Surface Type */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Surface Type
                                                </label>
                                                <select
                                                    name="surface_type"
                                                    value={data.surface_type}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-surfaceContainer rounded-md bg-surface text-onSurface"
                                                    required
                                                >
                                                    <option value="">
                                                        Select Surface Type
                                                    </option>
                                                    {SURFACE_TYPES.map(
                                                        (type) => (
                                                            <option
                                                                key={type}
                                                                value={type}
                                                            >
                                                                {type}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>

                                            {/* Seasons */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Seasons
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {SEASON_OPTIONS.map(
                                                        (season) => (
                                                            <div
                                                                key={season}
                                                                className="flex items-center"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    id={`season-${season}`}
                                                                    checked={data.seasons.includes(
                                                                        season
                                                                    )}
                                                                    onChange={() =>
                                                                        toggleArrayOption(
                                                                            "seasons",
                                                                            season
                                                                        )
                                                                    }
                                                                    className="h-4 w-4 text-primary rounded"
                                                                />
                                                                <label
                                                                    htmlFor={`season-${season}`}
                                                                    className="ml-2 text-onSurface capitalize"
                                                                >
                                                                    {season}
                                                                </label>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Surface Conditions */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Surface Conditions
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {SURFACE_CONDITIONS.map(
                                                        (condition) => (
                                                            <div
                                                                key={condition}
                                                                className="flex items-center"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    id={`condition-${condition}`}
                                                                    checked={data.surface_conditions.includes(
                                                                        condition
                                                                    )}
                                                                    onChange={() =>
                                                                        toggleArrayOption(
                                                                            "surface_conditions",
                                                                            condition
                                                                        )
                                                                    }
                                                                    className="h-4 w-4 text-primary rounded"
                                                                />
                                                                <label
                                                                    htmlFor={`condition-${condition}`}
                                                                    className="ml-2 text-onSurface capitalize"
                                                                >
                                                                    {condition}
                                                                </label>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Tyres */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Recommended Tyres
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {TYRE_OPTIONS.map(
                                                        (tyre) => (
                                                            <div
                                                                key={tyre}
                                                                className="flex items-center"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    id={`tyre-${tyre}`}
                                                                    checked={data.tyres.includes(
                                                                        tyre
                                                                    )}
                                                                    onChange={() =>
                                                                        toggleArrayOption(
                                                                            "tyres",
                                                                            tyre
                                                                        )
                                                                    }
                                                                    className="h-4 w-4 text-primary rounded"
                                                                />
                                                                <label
                                                                    htmlFor={`tyre-${tyre}`}
                                                                    className="ml-2 text-onSurface"
                                                                >
                                                                    {tyre}
                                                                </label>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Background Image */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Background Image
                                                    <span className="text-xs text-onSurface/70 ml-1">
                                                        (Recommended: 1920x1080)
                                                    </span>
                                                </label>
                                                <ImagePicker
                                                    fileUrl={bgImageUrl}
                                                    onChange={
                                                        onBackgroundImageChange
                                                    }
                                                />
                                                <p className="mt-1 text-xs text-onSurface/50">
                                                    Leave unchanged to keep
                                                    current image
                                                </p>
                                            </div>

                                            {/* Banner Image */}
                                            <div>
                                                <label className="block text-sm font-medium text-onSurface mb-2">
                                                    Banner Image
                                                    <span className="text-xs text-onSurface/70 ml-1">
                                                        (Recommended: 1200x300)
                                                    </span>
                                                </label>
                                                <ImagePicker
                                                    fileUrl={bannerImageUrl}
                                                    onChange={
                                                        onBannerImageChange
                                                    }
                                                />
                                                <p className="mt-1 text-xs text-onSurface/50">
                                                    Leave unchanged to keep
                                                    current image
                                                </p>
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
                                                    : "Update Location"}
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
