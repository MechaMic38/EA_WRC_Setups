import React, { Fragment } from "react";
import { Head, Link } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiChevronRight, FiFilter, FiX } from "react-icons/fi";
import { Listbox, Transition } from "@headlessui/react";
import { Category, Manufacturer, PaginatedData, Vehicle } from "@/types";

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
    const [filters, setFilters] = useState({
        category: null as Category | null,
        manufacturer: null as Manufacturer | null,
    });

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
        if (filters.category && vehicle.category.id !== filters.category.id)
            return false;
        if (
            filters.manufacturer &&
            vehicle.manufacturer.id !== filters.manufacturer.id
        )
            return false;
        return true;
    });

    const clearFilters = () =>
        setFilters({ category: null, manufacturer: null });

    return (
        <UserLayout>
            <Head title="Rally Vehicles" />

            {/* Hero Section */}
            <div className="relative bg-surfaceContainer py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-onSurface">
                        Rally Vehicles
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-onSurface">
                        Discover all the powerful machines in EA Sports WRC
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="sticky top-0 z-50 bg-surface py-4 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-4">
                        <FiFilter className="text-primary text-lg" />
                        <h2 className="font-medium text-onSurface">Filters</h2>
                        {(filters.category || filters.manufacturer) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center text-primary hover:text-primary-600 ml-auto"
                            >
                                <FiX className="mr-1" /> Clear
                            </button>
                        )}
                    </div>

                    {/* Filters Row */}
                    <div className="flex gap-6">
                        {/* Category Filter */}
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-onSurface mb-2">
                                Category
                            </h3>
                            <Listbox
                                value={filters.category}
                                onChange={(cat) =>
                                    setFilters({ ...filters, category: cat })
                                }
                            >
                                <div className="relative">
                                    <Listbox.Button className="w-full px-4 py-2 pr-10 text-left bg-surfaceContainer rounded-md border border-outline focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between">
                                        {filters.category ? (
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        filters.category.imgPath
                                                    }
                                                    alt={filters.category.name}
                                                    className="h-5 w-5 object-contain"
                                                />
                                                <span>
                                                    {filters.category.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <span>All Categories</span>
                                        )}
                                        <FiChevronRight className="w-4 h-4 text-onSurface" />
                                    </Listbox.Button>

                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-20 mt-1 w-full bg-surfaceContainer rounded-md shadow-lg max-h-60 py-1 text-base overflow-auto focus:outline-none">
                                            <Listbox.Option
                                                key="all"
                                                value={null}
                                                className={({ active }) =>
                                                    `cursor-pointer select-none relative py-2 pl-4 pr-10 ${
                                                        active
                                                            ? "bg-surfaceContainerHigh"
                                                            : ""
                                                    }`
                                                }
                                            >
                                                {({ selected }) => (
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`block truncate ${
                                                                selected
                                                                    ? "font-semibold"
                                                                    : ""
                                                            }`}
                                                        >
                                                            All Categories
                                                        </span>
                                                    </div>
                                                )}
                                            </Listbox.Option>
                                            {categories.map((category) => (
                                                <Listbox.Option
                                                    key={category.id}
                                                    value={category}
                                                    className={({ active }) =>
                                                        `cursor-pointer select-none relative py-2 pl-4 pr-10 ${
                                                            active
                                                                ? "bg-surfaceContainerHigh"
                                                                : ""
                                                        }`
                                                    }
                                                >
                                                    {({ selected }) => (
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={
                                                                    category.imgPath
                                                                }
                                                                alt={
                                                                    category.name
                                                                }
                                                                className="h-5 w-5 object-contain"
                                                            />
                                                            <span
                                                                className={`block truncate ${
                                                                    selected
                                                                        ? "font-semibold"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {category.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>

                        {/* Manufacturer Filter */}
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-onSurface mb-2">
                                Manufacturer
                            </h3>
                            <Listbox
                                value={filters.manufacturer}
                                onChange={(man) =>
                                    setFilters({
                                        ...filters,
                                        manufacturer: man,
                                    })
                                }
                            >
                                <div className="relative">
                                    <Listbox.Button className="w-full px-4 py-2 pr-10 text-left bg-surfaceContainer rounded-md border border-outline focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between">
                                        {filters.manufacturer ? (
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        filters.manufacturer
                                                            .imgPath
                                                    }
                                                    alt={
                                                        filters.manufacturer
                                                            .name
                                                    }
                                                    className="h-5 w-5 object-contain"
                                                />
                                                <span>
                                                    {filters.manufacturer.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <span>All Manufacturers</span>
                                        )}
                                        <FiChevronRight className="w-4 h-4 text-onSurface" />
                                    </Listbox.Button>

                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-20 mt-1 w-full bg-surfaceContainer rounded-md shadow-lg max-h-60 py-1 text-base overflow-auto focus:outline-none">
                                            <Listbox.Option
                                                key="all"
                                                value={null}
                                                className={({ active }) =>
                                                    `cursor-pointer select-none relative py-2 pl-4 pr-10 ${
                                                        active
                                                            ? "bg-surfaceContainerHigh"
                                                            : ""
                                                    }`
                                                }
                                            >
                                                {({ selected }) => (
                                                    <span
                                                        className={`block truncate ${
                                                            selected
                                                                ? "font-semibold"
                                                                : ""
                                                        }`}
                                                    >
                                                        All Manufacturers
                                                    </span>
                                                )}
                                            </Listbox.Option>
                                            {manufacturers.map(
                                                (manufacturer) => (
                                                    <Listbox.Option
                                                        key={manufacturer.id}
                                                        value={manufacturer}
                                                        className={({
                                                            active,
                                                        }) =>
                                                            `cursor-pointer select-none relative py-2 pl-4 pr-10 ${
                                                                active
                                                                    ? "bg-surfaceContainerHigh"
                                                                    : ""
                                                            }`
                                                        }
                                                    >
                                                        {({ selected }) => (
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={
                                                                        manufacturer.imgPath
                                                                    }
                                                                    alt={
                                                                        manufacturer.name
                                                                    }
                                                                    className="h-5 w-5 object-contain"
                                                                />
                                                                <span
                                                                    className={`block truncate ${
                                                                        selected
                                                                            ? "font-semibold"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {
                                                                        manufacturer.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </Listbox.Option>
                                                )
                                            )}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vehicles Grid */}
            <div className="py-12 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isProcessingVehicles ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <VehicleCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredVehicles.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl text-onSurface mb-4">
                                No vehicles match your filters
                            </p>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-primary text-surfaceContainer rounded-md hover:bg-primary-600 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredVehicles.map((vehicle) => (
                                <VehicleCard
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

// Extracted Components
const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => (
    <div className="bg-surfaceContainer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group">
        <div className="relative h-48 w-full overflow-hidden">
            <img
                src={vehicle.imgPath}
                alt={vehicle.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
                className="absolute inset-0 bg-gradient-to-t from-surfaceContainer via-surfaceContainer/20 to-transparent"
                style={{ height: "100%", bottom: 0 }}
            />
        </div>
        <div className="p-6 relative z-10 -mt-6">
            <h3 className="text-xl font-bold text-onSurface mb-3">
                {vehicle.name}
            </h3>
            <div className="flex items-center mb-4">
                <img
                    src={vehicle.manufacturer.imgPath}
                    alt={vehicle.manufacturer.name}
                    className="h-8 w-8 object-contain mr-3"
                />
                <span className="text-sm font-medium text-onSurface">
                    {vehicle.manufacturer.name}
                </span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src={vehicle.category.imgPath}
                        alt={vehicle.category.name}
                        className="h-6 w-6 object-contain mr-2"
                    />
                    <span className="text-sm text-onSurface">
                        {vehicle.category.name}
                    </span>
                </div>
                <Link
                    href={route("vehicles.show", vehicle.id)}
                    className="inline-flex items-center text-primary hover:text-primary-600 font-medium"
                >
                    View Setups <FiChevronRight className="ml-1" />
                </Link>
            </div>
        </div>
    </div>
);

const VehicleCardSkeleton = () => (
    <div className="bg-surfaceContainer rounded-lg overflow-hidden shadow-md animate-pulse">
        <div className="h-48 bg-surfaceContainer/50"></div>
        <div className="p-6">
            <div className="h-6 w-3/4 bg-surfaceContainer/50 rounded mb-4"></div>
            <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-surfaceContainer/50 mr-2"></div>
                <div className="h-4 w-20 bg-surfaceContainer/50 rounded"></div>
            </div>
            <div className="h-4 w-full bg-surfaceContainer/50 rounded mb-2"></div>
        </div>
    </div>
);
