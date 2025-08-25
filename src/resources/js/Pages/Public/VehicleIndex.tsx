import React from "react";
import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiFilter, FiX, FiSearch } from "react-icons/fi";
import { Category, Manufacturer, PaginatedData, Vehicle } from "@/types";
import CategoryListbox from "@/Components/Form/CategoryListbox";
import { Field, Label } from "@headlessui/react";
import ManufacturerListbox from "@/Components/Form/ManufacturerListbox";
import TextInput from "@/Components/Form/TextInput";
import VehicleSetupCard from "@/Components/Cards/VehicleSetupCard";
import VehicleSetupCardSkeleton from "@/Components/Skeletons/VehicleSetupCardSkeleton";
import FilteredEmptyState from "@/Components/FilteredEmptyState";
import { LiaCarSideSolid } from "react-icons/lia";

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
                                <TextInput
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    icon={
                                        <FiSearch className="text-onSurface/50" />
                                    }
                                    placeholder="Search vehicles by name, manufacturer, or category..."
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
                                <VehicleSetupCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredVehicles.length === 0 ? (
                        <FilteredEmptyState
                            entityName="vehicles"
                            title="No vehicles found"
                            description="Check back later for new vehicles"
                            icon={<LiaCarSideSolid />}
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={clearFilters}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVehicles.map((vehicle) => (
                                <VehicleSetupCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
