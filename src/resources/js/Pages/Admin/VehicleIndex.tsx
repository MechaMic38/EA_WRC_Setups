import VehicleCreateModal from "@/Components/Modals/Vehicle/VehicleCreateModal";
import VehicleEditModal from "@/Components/Modals/Vehicle/VehicleEditModal";
import useAxiosForm from "@/Hooks/useAxiosForm";
import AdminLayout from "@/Layouts/AdminLayout";
import { PaginatedData, Vehicle, Category, Manufacturer } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiRefreshCw,
    FiX,
    FiTag,
} from "react-icons/fi";
import VehicleDeleteModal from "@/Components/Modals/Vehicle/VehicleDeleteModal";
import VehicleShowModal from "@/Components/Modals/Vehicle/VehicleShowModal";
import { Field, Label, Select } from "@headlessui/react";
import { LiaCarSideSolid } from "react-icons/lia";
import { BsTools } from "react-icons/bs";
import CategoryListbox from "@/Components/Form/CategoryListbox";
import ManufacturerListbox from "@/Components/Form/ManufacturerListbox";
import TextInput from "@/Components/Form/TextInput";
import VehicleRowSkeleton from "@/Components/Skeletons/VehicleRowSkeleton";
import Pagination from "@/Components/Pagination";
import VehicleRow from "@/Components/Rows/VehicleRow";
import FilteredEmptyState from "@/Components/FilteredEmptyState";

interface VehicleIndexProps {
    page?: number;
    category_id?: string;
    manufacturer_id?: string;
}

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

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const isInitialMount = useRef(true);

    // Initial data fetch
    useEffect(() => {
        fetchVehicles();
        fetchCategories();
        fetchManufacturers();
    }, []);

    // Apply filters when they change
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            fetchVehicles();
            updateUrlWithFilters(filters);
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [filters]);

    /**
     * Update the URL with the current filters.
     * @param newFilters The new filter values.
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
            preserveScroll: true,
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
                setIsInitialLoading(false);
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
        getCategories(route("api.categories.index", { paginate: false }), {
            onSuccess: (response) => {
                setCategories(response.data.data);
            },
        });
    };

    /**
     * Fetch manufacturers from the API.
     */
    const fetchManufacturers = async () => {
        getManufacturers(
            route("api.manufacturers.index", { paginate: false }),
            {
                onSuccess: (response) => {
                    setManufacturers(response.data.data);
                },
            }
        );
    };

    /**
     * Open the create vehicle modal.
     */
    const onCreateVehicle = () => {
        setSelectedVehicle(null);
        setIsCreateOpen(true);
    };

    /**
     * Open the show vehicle modal.
     * @param vehicle The vehicle to show.
     */
    const onShowVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsShowOpen(true);
    };

    /**
     * Open the edit vehicle modal.
     * @param vehicle The vehicle to edit.
     */
    const onEditVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsEditOpen(true);
    };

    /**
     * Open the delete vehicle modal.
     * @param vehicle The vehicle to delete.
     */
    const onDeleteVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsDeleteOpen(true);
    };

    /**
     * Handle filter changes.
     * @param key The filter key.
     * @param value The filter value.
     */
    const onFilterChange = (key: string, value: string) => {
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
    const onPageChange = (url: string) => {
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
                            onClick={onCreateVehicle}
                            className="flex items-center px-6 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <FiPlus className="mr-2" /> Create Vehicle
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-surfaceContainer rounded-xl p-4 mb-6 border border-surfaceContainerHigh">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <TextInput
                                    type="text"
                                    name="search"
                                    placeholder="Search vehicles by name..."
                                    value={filters.name}
                                    onChange={(e) =>
                                        onFilterChange("name", e.target.value)
                                    }
                                    icon={
                                        <FiSearch className="text-onSurface/50" />
                                    }
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
                                        <CategoryListbox
                                            options={categories}
                                            selectedOption={
                                                categories.find(
                                                    (category) =>
                                                        category.id ===
                                                        filters.category_id
                                                )!!
                                            }
                                            onChange={(value) =>
                                                onFilterChange(
                                                    "category_id",
                                                    value?.id || ""
                                                )
                                            }
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
                                                manufacturers.find(
                                                    (manufacturer) =>
                                                        manufacturer.id ===
                                                        filters.manufacturer_id
                                                )!!
                                            }
                                            onChange={(value) =>
                                                onFilterChange(
                                                    "manufacturer_id",
                                                    value?.id || ""
                                                )
                                            }
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
                                {filters.name && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                        Name: {filters.name}
                                        <button
                                            onClick={() =>
                                                onFilterChange("name", "")
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
                                                onFilterChange(
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
                                                onFilterChange(
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
                                    <LiaCarSideSolid className="text-primary text-xl" />
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
                                    <FiTag className="text-secondary text-xl" />
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
                                    <BsTools className="text-tertiary text-xl" />
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
                        {isInitialLoading || isProcessing ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <VehicleRowSkeleton key={i} />
                            ))
                        ) : vehiclesData.data.length === 0 ? (
                            <FilteredEmptyState
                                entityName="vehicles"
                                icon={<LiaCarSideSolid />}
                                hasActiveFilters={hasActiveFilters}
                                onClearFilters={clearFilters}
                                onCreate={onCreateVehicle}
                            />
                        ) : (
                            vehiclesData.data.map((vehicle) => (
                                <VehicleRow
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    onShowVehicle={onShowVehicle}
                                    onEditVehicle={onEditVehicle}
                                    onDeleteVehicle={onDeleteVehicle}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {vehiclesData.meta && vehiclesData.meta.total > 0 && (
                        <Pagination
                            meta={vehiclesData.meta}
                            links={vehiclesData.links}
                            onPageChange={onPageChange}
                        />
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
