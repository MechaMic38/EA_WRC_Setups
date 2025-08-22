import VehicleCreateModal from "@/Components/Modals/Vehicle/VehicleCreateModal";
import VehicleEditModal from "@/Components/Modals/Vehicle/VehicleEditModal";
import useAxiosForm from "@/Hooks/useAxiosForm";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    PageProps,
    PaginatedData,
    Vehicle,
    Category,
    Manufacturer,
} from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiEdit,
    FiEye,
    FiMap,
    FiPlus,
    FiTrash2,
    FiSearch,
    FiFilter,
    FiRefreshCw,
    FiX,
    FiTruck,
    FiGrid,
    FiSettings,
} from "react-icons/fi";
import VehicleDeleteModal from "@/Components/Modals/Vehicle/VehicleDeleteModal";
import VehicleShowModal from "@/Components/Modals/Vehicle/VehicleShowModal";
import { Field, Label, Select } from "@headlessui/react";

interface VehicleIndexProps {
    page: number;
    category_id: string;
    manufacturer_id: string;
}

const SkeletonRow = () => (
    <div className="p-4 bg-surface rounded-xl border border-surfaceContainerHigh animate-pulse">
        <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-surfaceContainerHigh rounded-lg"></div>
            <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-surfaceContainerHigh rounded"></div>
                <div className="h-4 w-32 bg-surfaceContainerHigh rounded"></div>
            </div>
            <div className="flex space-x-2">
                <div className="h-8 w-8 bg-surfaceContainerHigh rounded"></div>
                <div className="h-8 w-8 bg-surfaceContainerHigh rounded"></div>
                <div className="h-8 w-8 bg-surfaceContainerHigh rounded"></div>
                <div className="h-8 w-8 bg-surfaceContainerHigh rounded"></div>
            </div>
        </div>
    </div>
);

const VehicleIndex = ({
    page,
    category_id,
    manufacturer_id,
}: VehicleIndexProps) => {
    const { get, isProcessing } = useAxiosForm<PaginatedData<Vehicle>>([]);
    const { get: getCategories } = useAxiosForm<PaginatedData<Category>>([]);
    const { get: getManufacturers } = useAxiosForm<PaginatedData<Manufacturer>>(
        []
    );

    const [vehiclesData, setVehiclesData] = useState<PaginatedData<Vehicle>>({
        data: [],
        links: {},
        meta: {
            current_page: 1,
            from: 0,
            last_page: 1,
            links: [],
            path: "",
            per_page: 15,
            to: 0,
            total: 0,
        },
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
        null
    );
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isShowOpen, setIsShowOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        page: page || 1,
        name: "",
        category_id: category_id || "",
        manufacturer_id: manufacturer_id || "",
    });

    // Initial data fetch
    useEffect(() => {
        fetchVehicles();
        fetchCategories();
        fetchManufacturers();
    }, []);

    // Apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchVehicles();
            updateUrlWithFilters(filters);
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [filters]);

    /**
     * Update the URL with the current filters and page.
     * @param newFilters The new filter values.
     * @param page The page number (optional).
     */
    const updateUrlWithFilters = (newFilters: typeof filters) => {
        const params: any = {};

        if (newFilters.category_id)
            params["category_id"] = newFilters.category_id;
        if (newFilters.manufacturer_id)
            params["manufacturer_id"] = newFilters.manufacturer_id;
        if (newFilters.page) params["page"] = newFilters.page;

        // Use Inertia's router to update URL without full page reload
        router.get(route("admin.vehicles.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * Fetch vehicles from the API.
     * @param url The API endpoint URL.
     */
    const fetchVehicles = async (url?: string) => {
        const params = new URLSearchParams();

        // Add current filters to the request
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.name) params.append("name", filters.name);
        if (filters.category_id)
            params.append("category_id", filters.category_id);
        if (filters.manufacturer_id)
            params.append("manufacturer_id", filters.manufacturer_id);

        // Add pagination parameters if it's a new URL
        if (url) {
            const urlObj = new URL(url);
            urlObj.searchParams.forEach((value, key) => {
                params.append(key, value);
            });
        }

        const finalUrl = url
            ? `${url.split("?")[0]}?${params.toString()}`
            : `${route("api.vehicles.index")}?${params.toString()}`;

        get(finalUrl, {
            onSuccess: (response) => {
                setVehiclesData(response.data);
            },
            onError: (error) => {
                console.error("Error fetching vehicles:", error);
            },
        });
    };

    /**
     * Fetch categories from the API.
     */
    const fetchCategories = async () => {
        getCategories(route("api.categories.index"), {
            onSuccess: (response) => {
                setCategories(response.data.data);
            },
        });
    };

    /**
     * Fetch manufacturers from the API.
     */
    const fetchManufacturers = async () => {
        getManufacturers(route("api.manufacturers.index"), {
            onSuccess: (response) => {
                setManufacturers(response.data.data);
            },
        });
    };

    /**
     * Handle the creation of a new vehicle.
     */
    const handleCreateVehicle = () => {
        setSelectedVehicle(null);
        setIsCreateOpen(true);
    };

    /**
     * Handle the display of a vehicle's details.
     * @param vehicle The vehicle to display.
     */
    const handleShowVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsShowOpen(true);
    };

    /**
     * Handle the editing of a vehicle.
     * @param vehicle The vehicle to edit.
     */
    const handleEditVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsEditOpen(true);
    };

    /**
     * Handle the deletion of a vehicle.
     * @param vehicle The vehicle to delete.
     */
    const handleDeleteVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsDeleteOpen(true);
    };

    /**
     * Handle filter changes.
     * @param key The filter key.
     * @param value The filter value.
     */
    const handleFilterChange = (key: string, value: string) => {
        switch (key) {
            case "name":
                setFilters((prev) => ({ ...prev, name: value }));
                break;
            case "category_id":
                setFilters((prev) => ({
                    ...prev,
                    category_id: value,
                    page: 1,
                }));
                break;
            case "manufacturer_id":
                setFilters((prev) => ({
                    ...prev,
                    manufacturer_id: value,
                    page: 1,
                }));
                break;
            default:
                break;
        }
    };

    /**
     * Clear all filters.
     */
    const clearFilters = () => {
        const newFilters = {
            page: 1,
            name: "",
            category_id: "",
            manufacturer_id: "",
        };
        setFilters(newFilters);
    };

    /**
     * Handle pagination.
     * @param url The pagination URL.
     */
    const handlePagination = (url: string) => {
        const urlObj = new URL(url);
        const page = urlObj.searchParams.get("page");
        if (page) {
            setFilters((prev) => ({
                ...prev,
                page: parseInt(page),
            }));
        }
    };

    const hasActiveFilters =
        filters.name || filters.category_id || filters.manufacturer_id;

    return (
        <AdminLayout>
            <Head title="Vehicles" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-onSurface">
                                Vehicle Management
                            </h1>
                            <p className="text-onSurface/70 mt-1">
                                Manage all vehicles of the game
                            </p>
                        </div>
                        <button
                            onClick={handleCreateVehicle}
                            className="flex items-center px-6 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <FiPlus className="mr-2" /> Create Vehicle
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-surfaceContainer rounded-xl p-4 mb-6 border border-surfaceContainerHigh">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-onSurface/50" />
                                <input
                                    type="text"
                                    placeholder="Search vehicles by name..."
                                    value={filters.name}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "name",
                                            e.target.value
                                        )
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
                            <button
                                onClick={() => {
                                    fetchVehicles();
                                    updateUrlWithFilters(filters);
                                }}
                                className="flex items-center px-4 py-3 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                            >
                                <FiRefreshCw className="text-onSurface/70" />
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
                                        <Select
                                            value={filters.category_id}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "category_id",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-2 bg-surfaceContainer rounded-lg border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary text-onSurface"
                                        >
                                            <option value="">
                                                All Categories
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </Field>

                                    {/* Manufacturer Filter */}
                                    <Field>
                                        <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                            Manufacturer
                                        </Label>
                                        <Select
                                            value={filters.manufacturer_id}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "manufacturer_id",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-2 bg-surfaceContainer rounded-lg border border-surfaceContainerHigh focus:border-primary focus:ring-1 focus:ring-primary text-onSurface"
                                        >
                                            <option value="">
                                                All Manufacturers
                                            </option>
                                            {manufacturers.map(
                                                (manufacturer) => (
                                                    <option
                                                        key={manufacturer.id}
                                                        value={manufacturer.id}
                                                    >
                                                        {manufacturer.name}
                                                    </option>
                                                )
                                            )}
                                        </Select>
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
                                {filters.name && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                        Name: {filters.name}
                                        <button
                                            onClick={() =>
                                                handleFilterChange("name", "")
                                            }
                                            className="ml-2 hover:text-primary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.category_id && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
                                        Category:{" "}
                                        {
                                            categories.find(
                                                (c) =>
                                                    c.id === filters.category_id
                                            )?.name
                                        }
                                        <button
                                            onClick={() =>
                                                handleFilterChange(
                                                    "category_id",
                                                    ""
                                                )
                                            }
                                            className="ml-2 hover:text-secondary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.manufacturer_id && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-sm">
                                        Manufacturer:{" "}
                                        {
                                            manufacturers.find(
                                                (m) =>
                                                    m.id ===
                                                    filters.manufacturer_id
                                            )?.name
                                        }
                                        <button
                                            onClick={() =>
                                                handleFilterChange(
                                                    "manufacturer_id",
                                                    ""
                                                )
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

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                                    <FiTruck className="text-primary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Total Vehicles
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {vehiclesData.meta.total}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="bg-secondary/10 p-3 rounded-lg mr-4">
                                    <FiGrid className="text-secondary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Active Categories
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {
                                            new Set(
                                                vehiclesData.data.map(
                                                    (v) => v.category.id
                                                )
                                            ).size
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="bg-tertiary/10 p-3 rounded-lg mr-4">
                                    <FiSettings className="text-tertiary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Manufacturers
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {
                                            new Set(
                                                vehiclesData.data.map(
                                                    (v) => v.manufacturer.id
                                                )
                                            ).size
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicles Grid */}
                    <div className="space-y-4">
                        {isProcessing ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonRow key={i} />
                            ))
                        ) : vehiclesData.data.length === 0 ? (
                            <div className="text-center py-12 bg-surfaceContainer rounded-xl border border-surfaceContainerHigh">
                                <FiTruck className="mx-auto text-4xl text-onSurface/50 mb-4" />
                                <h3 className="text-lg font-medium text-onSurface">
                                    {hasActiveFilters
                                        ? "No vehicles match your filters"
                                        : "No vehicles found"}
                                </h3>
                                <p className="text-onSurface/70 mt-1">
                                    {hasActiveFilters
                                        ? "Try adjusting your filters"
                                        : "Get started by creating your first vehicle"}
                                </p>
                                {hasActiveFilters ? (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 px-6 py-2 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200"
                                    >
                                        Clear Filters
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCreateVehicle}
                                        className="mt-4 px-6 py-2 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200"
                                    >
                                        Create Vehicle
                                    </button>
                                )}
                            </div>
                        ) : (
                            vehiclesData.data.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="bg-surface rounded-xl border border-surfaceContainerHigh p-4 hover:border-primary/30 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                className="h-16 w-16 rounded-lg object-contain bg-surfaceContainerHigh p-2"
                                                src={vehicle.imgPath}
                                                alt={vehicle.name}
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold text-onSurface">
                                                    {vehicle.name}
                                                </h3>
                                                <div className="flex items-center space-x-4 mt-1">
                                                    <div className="flex items-center">
                                                        <img
                                                            className="h-5 w-5 object-contain mr-2"
                                                            src={
                                                                vehicle
                                                                    .manufacturer
                                                                    .imgPath
                                                            }
                                                            alt={
                                                                vehicle
                                                                    .manufacturer
                                                                    .name
                                                            }
                                                        />
                                                        <span className="text-sm text-onSurface/70">
                                                            {
                                                                vehicle
                                                                    .manufacturer
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <img
                                                            className="h-5 w-5 object-contain mr-2"
                                                            src={
                                                                vehicle.category
                                                                    .imgPath
                                                            }
                                                            alt={
                                                                vehicle.category
                                                                    .name
                                                            }
                                                        />
                                                        <span className="text-sm text-onSurface/70">
                                                            {
                                                                vehicle.category
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleShowVehicle(vehicle)
                                                }
                                                className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                                                title="View details"
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleEditVehicle(vehicle)
                                                }
                                                className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                                                title="Edit vehicle"
                                            >
                                                <FiEdit />
                                            </button>
                                            <Link
                                                href={route(
                                                    "admin.vehicles.blueprint.edit",
                                                    {
                                                        vehicle: vehicle.id,
                                                    }
                                                )}
                                                className="p-2 bg-surfaceContainer rounded-lg text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200"
                                                title="Update Blueprint"
                                            >
                                                <FiMap />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDeleteVehicle(vehicle)
                                                }
                                                className="p-2 bg-surfaceContainer rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                                                title="Delete vehicle"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {vehiclesData.meta && vehiclesData.meta.total > 0 && (
                        <div className="bg-surfaceContainer rounded-xl p-6 mt-6 border border-surfaceContainerHigh">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-onSurface">
                                    Showing{" "}
                                    <span className="font-medium">
                                        {vehiclesData.meta.from}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium">
                                        {vehiclesData.meta.to}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">
                                        {vehiclesData.meta.total}
                                    </span>{" "}
                                    results
                                </div>
                                <nav className="flex items-center space-x-2">
                                    {vehiclesData.links.prev && (
                                        <button
                                            onClick={() =>
                                                handlePagination(
                                                    vehiclesData.links.prev!
                                                )
                                            }
                                            className="p-2 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                                        >
                                            <FiChevronLeft className="h-5 w-5" />
                                        </button>
                                    )}

                                    {vehiclesData.meta.links
                                        ?.slice(1, -1)
                                        .map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    link.url &&
                                                    handlePagination(link.url)
                                                }
                                                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                                                    link.active
                                                        ? "bg-primary border-primary text-surfaceContainer"
                                                        : "bg-surface border-surfaceContainerHigh text-onSurface hover:border-primary/30"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}

                                    {vehiclesData.links.next && (
                                        <button
                                            onClick={() =>
                                                handlePagination(
                                                    vehiclesData.links.next!
                                                )
                                            }
                                            className="p-2 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                                        >
                                            <FiChevronRight className="h-5 w-5" />
                                        </button>
                                    )}
                                </nav>
                            </div>
                        </div>
                    )}

                    {/* Modals */}
                    <VehicleCreateModal
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSuccess={() => {
                            setIsCreateOpen(false);
                            fetchVehicles();
                        }}
                    />
                    <VehicleEditModal
                        isOpen={isEditOpen}
                        vehicle={selectedVehicle}
                        onClose={() => setIsEditOpen(false)}
                        onSuccess={() => {
                            setIsEditOpen(false);
                            fetchVehicles();
                        }}
                    />
                    <VehicleShowModal
                        isOpen={isShowOpen}
                        vehicle={selectedVehicle}
                        onClose={() => setIsShowOpen(false)}
                    />
                    <VehicleDeleteModal
                        isOpen={isDeleteOpen}
                        vehicle={selectedVehicle}
                        onClose={() => setIsDeleteOpen(false)}
                        onSuccess={() => {
                            setIsDeleteOpen(false);
                            fetchVehicles();
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default VehicleIndex;
