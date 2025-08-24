import React from "react";
import { Head, Link } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiChevronRight, FiFilter, FiX, FiSearch } from "react-icons/fi";
import { Category, Manufacturer, PaginatedData, Vehicle } from "@/types";
import CategoryListbox from "@/Components/Form/CategoryListbox";
import { Field, Label } from "@headlessui/react";
import ManufacturerListbox from "@/Components/Form/ManufacturerListbox";

const SkeletonCard = () => (
    <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden animate-pulse">
        <div className="h-48 bg-surfaceContainerHigh"></div>
        <div className="p-6">
            <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-surfaceContainerHigh rounded-full mr-3"></div>
                <div className="flex-1">
                    <div className="h-5 w-3/4 bg-surfaceContainerHigh rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-surfaceContainerHigh rounded"></div>
                </div>
            </div>
            <div className="h-10 bg-surfaceContainerHigh rounded-lg"></div>
        </div>
    </div>
);

export default function VehicleIndex() {
    // API hooks
    const { get: getVehicles, isProcessing: isProcessingVehicles } =
        useAxiosForm<PaginatedData<Vehicle>>([]);
    const { get: getManufacturers, isProcessing: isProcessingManufacturers } =
        useAxiosForm<PaginatedData<Manufacturer>>([]);
    const { get: getCategories, isProcessing: isProcessingCategories } =
        useAxiosForm<PaginatedData<Category>>([]);

    // State
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        category: null as Category | null,
        manufacturer: null as Manufacturer | null,
    });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Fetch data
    useEffect(() => {
        getManufacturers(
            route("api.manufacturers.index", { paginate: false }),
            {
                onSuccess: (response) => setManufacturers(response.data.data),
            }
        );

        getCategories(route("api.categories.index", { paginate: false }), {
            onSuccess: (response) => setCategories(response.data.data),
        });

        getVehicles(route("api.vehicles.index", { paginate: false }), {
            onSuccess: (response) => setVehicles(response.data.data),
        });
    }, []);

    // Filter vehicles
    const filteredVehicles = vehicles.filter((vehicle) => {
        // Search filter
        if (
            searchQuery &&
            !vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !vehicle.manufacturer.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) &&
            !vehicle.category.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        ) {
            return false;
        }

        // Category filter
        if (filters.category && vehicle.category.id !== filters.category.id)
            return false;

        // Manufacturer filter
        if (
            filters.manufacturer &&
            vehicle.manufacturer.id !== filters.manufacturer.id
        )
            return false;

        return true;
    });

    const onCategoryChange = (category: Category | null) => {
        setFilters({ ...filters, category });
    };

    const onManufacturerChange = (manufacturer: Manufacturer | null) => {
        setFilters({ ...filters, manufacturer });
    };

    const clearFilters = () => {
        setFilters({ category: null, manufacturer: null });
        setSearchQuery("");
    };

    const hasActiveFilters =
        filters.category || filters.manufacturer || searchQuery;

    return (
        <UserLayout>
            <Head title="Rally Vehicles" />

            {/* Hero Section */}
            <div className="relative bg-surfaceContainer py-16 border-b border-surfaceContainerHigh">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-onSurface">
                        Rally Vehicles
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-onSurface/70">
                        Discover all the powerful machines in EA Sports WRC
                    </p>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-surface py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-surfaceContainer rounded-xl p-4 mb-6 border border-surfaceContainerHigh">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-onSurface/50" />
                                <input
                                    type="text"
                                    placeholder="Search vehicles by name, manufacturer, or category..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-3 bg-surface rounded-lg border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary text-onSurface"
                                />
                            </div>
                            <button
                                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                className="flex items-center px-4 py-3 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                            >
                                <FiFilter className="mr-2 text-onSurface/70" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="ml-2 bg-primary text-surfaceContainer text-xs px-2 py-1 rounded-full">
                                        Active
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Advanced Filters Dropdown */}
                        {isFiltersOpen && (
                            <div className="mt-4 p-4 bg-surface rounded-lg border border-surfaceContainerHigh">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Category Filter */}
                                    <Field>
                                        <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                            Category
                                        </Label>
                                        <CategoryListbox
                                            options={categories}
                                            selectedOption={
                                                filters.category || null
                                            }
                                            onChange={onCategoryChange}
                                        />
                                    </Field>

                                    {/* Manufacturer Filter */}
                                    <Field>
                                        <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                            Manufacturer
                                        </Label>
                                        <ManufacturerListbox
                                            options={manufacturers}
                                            selectedOption={
                                                filters.manufacturer
                                            }
                                            onChange={onManufacturerChange}
                                        />
                                    </Field>
                                </div>

                                {/* Clear Filters Button */}
                                {hasActiveFilters && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center px-4 py-2 text-onSurface/70 hover:text-onSurface transition-colors duration-200"
                                        >
                                            <FiX className="mr-1" />
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="bg-surfaceContainer rounded-xl p-4 mb-6 border border-surfaceContainerHigh">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-onSurface/70">
                                    Active filters:
                                </span>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-primary hover:text-primary-600 transition-colors duration-200"
                                >
                                    Clear all
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {searchQuery && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                        Search: {searchQuery}
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="ml-2 hover:text-primary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.category && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
                                        Category: {filters.category.name}
                                        <button
                                            onClick={() =>
                                                onCategoryChange(null)
                                            }
                                            className="ml-2 hover:text-secondary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.manufacturer && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-sm">
                                        Manufacturer:{" "}
                                        {filters.manufacturer.name}
                                        <button
                                            onClick={() =>
                                                onManufacturerChange(null)
                                            }
                                            className="ml-2 hover:text-tertiary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    {!isProcessingVehicles && (
                        <div className="mb-6">
                            <p className="text-onSurface/70">
                                Showing {filteredVehicles.length} vehicle
                                {filteredVehicles.length !== 1 ? "s" : ""}
                                {hasActiveFilters && " (filtered)"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Vehicles Grid */}
            <div className="bg-surface py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isProcessingVehicles ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : filteredVehicles.length === 0 ? (
                        <div className="text-center py-12 bg-surfaceContainer rounded-xl border border-surfaceContainerHigh">
                            <div className="mx-auto text-4xl text-onSurface/50 mb-4">
                                🚗
                            </div>
                            <h3 className="text-lg font-medium text-onSurface">
                                {hasActiveFilters
                                    ? "No vehicles match your filters"
                                    : "No vehicles found"}
                            </h3>
                            <p className="text-onSurface/70 mt-1">
                                {hasActiveFilters
                                    ? "Try adjusting your filters"
                                    : "Check back later for new vehicles"}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-6 py-2 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary/30 group"
                                >
                                    {/* Vehicle Image - Full width with object-cover */}
                                    <div className="h-48 relative overflow-hidden">
                                        <img
                                            src={vehicle.imgPath}
                                            alt={vehicle.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 right-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
                                                <img
                                                    src={
                                                        vehicle.category.imgPath
                                                    }
                                                    alt={vehicle.category.name}
                                                    className="h-4 w-4 object-contain mr-1"
                                                />
                                                {vehicle.category.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Vehicle Details */}
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            {/* Manufacturer Logo */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={
                                                        vehicle.manufacturer
                                                            .imgPath
                                                    }
                                                    alt={
                                                        vehicle.manufacturer
                                                            .name
                                                    }
                                                    className="h-12 w-12 object-contain p-1"
                                                />
                                            </div>
                                            {/* Vertical divider */}
                                            <div className="hidden md:block w-px h-12 border border-tertiaryContainer mx-3" />
                                            {/* Manufacturer Name and Vehicle Name */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-onSurface/70 truncate">
                                                    {vehicle.manufacturer.name}
                                                </p>
                                                <h3 className="text-lg font-bold text-onSurface truncate">
                                                    {vehicle.name}
                                                </h3>
                                            </div>
                                        </div>
                                        <Link
                                            href={route(
                                                "vehicles.show",
                                                vehicle.id
                                            )}
                                            className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium"
                                        >
                                            View Setups
                                            <FiChevronRight className="ml-2" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
