import FilteredEmptyState from "@/Components/FilteredEmptyState";
import SurfaceTypeListbox from "@/Components/Form/SurfaceTypeListbox";
import TextInput from "@/Components/Form/TextInput";
import LocationCreateModal from "@/Components/Modals/Location/LocationCreateModal";
import LocationDeleteModal from "@/Components/Modals/Location/LocationDeleteModal";
import LocationEditModal from "@/Components/Modals/Location/LocationEditModal";
import LocationShowModal from "@/Components/Modals/Location/LocationShowModal";
import Pagination from "@/Components/Pagination";
import LocationRow from "@/Components/Rows/LocationRow";
import LocationRowSkeleton from "@/Components/Skeletons/LocationRowSkeleton";
import { SURFACE_TYPES_MAP } from "@/constants";
import useAxiosForm from "@/Hooks/useAxiosForm";
import AdminLayout from "@/Layouts/AdminLayout";
import { LocationSummary, PaginatedData } from "@/types";
import { Field, Label } from "@headlessui/react";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiRefreshCw,
    FiX,
    FiMapPin,
    FiGlobe,
    FiPackage,
} from "react-icons/fi";

interface LocationIndexProps {
    page?: number;
    surface_type?: string;
}

const LocationIndex = ({ page, surface_type }: LocationIndexProps) => {
    const { get, isProcessing } = useAxiosForm<PaginatedData<LocationSummary>>(
        []
    );
    const [locationsData, setLocationsData] = useState<
        PaginatedData<LocationSummary>
    >({
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

    const [selectedLocation, setSelectedLocation] =
        useState<LocationSummary | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isShowOpen, setIsShowOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Filter states - initialize from URL parameters
    const [filters, setFilters] = useState({
        page: page || 1,
        name: "",
        surface_type: surface_type || "",
    });

    // Initial data fetch
    useEffect(() => {
        fetchLocations();
    }, []);

    // Apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchLocations();
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

        if (newFilters.name) params["name"] = newFilters.name;
        if (newFilters.surface_type)
            params["surface_type"] = newFilters.surface_type;
        if (newFilters.page) params["page"] = newFilters.page;

        router.get(route("admin.locations.index"), params, {
            preserveState: true,
            replace: true,
        });
    };

    /**
     * Fetch locations from the API.
     * @param url The API endpoint URL (optional).
     */
    const fetchLocations = async (url?: string) => {
        const params = new URLSearchParams();

        // Add current filters to the request
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.name) params.append("name", filters.name);
        if (filters.surface_type)
            params.append("surface_type", filters.surface_type);

        // Add pagination parameters if it's a new URL
        if (url) {
            const urlObj = new URL(url);
            urlObj.searchParams.forEach((value, key) => {
                params.append(key, value);
            });
        }

        const finalUrl = url
            ? `${url.split("?")[0]}?${params.toString()}`
            : `${route("api.locations.index")}?${params.toString()}`;

        get(finalUrl, {
            onSuccess: (response) => {
                setLocationsData(response.data);
            },
            onError: (error) => {
                console.error("Error fetching locations:", error);
            },
        });
    };

    /**
     * Open the create location modal.
     */
    const onCreateLocation = () => {
        setSelectedLocation(null);
        setIsCreateOpen(true);
    };

    /**
     * Open the show location modal.
     * @param location The location to show.
     */
    const onShowLocation = (location: LocationSummary) => {
        setSelectedLocation(location);
        setIsShowOpen(true);
    };

    /**
     * Open the edit location modal.
     * @param location The location to edit.
     */
    const onEditLocation = (location: LocationSummary) => {
        setSelectedLocation(location);
        setIsEditOpen(true);
    };

    /**
     * Open the delete location modal.
     * @param location The location to delete.
     */
    const onDeleteLocation = (location: LocationSummary) => {
        setSelectedLocation(location);
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
                setFilters((prev) => ({
                    ...prev,
                    name: value,
                }));
                break;
            case "surface_type":
                setFilters((prev) => ({
                    ...prev,
                    surface_type: value,
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
            surface_type: "",
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

    const hasActiveFilters = filters.name || filters.surface_type;

    return (
        <AdminLayout>
            <Head title="Locations" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-onSurface">
                                Location Management
                            </h1>
                            <p className="text-onSurface/70 mt-1">
                                Manage all racing locations.
                            </p>
                        </div>
                        <button
                            onClick={onCreateLocation}
                            className="flex items-center px-6 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <FiPlus className="mr-2" /> Create Location
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-surfaceContainer rounded-xl p-4 mb-6 border border-surfaceContainerHigh">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <TextInput
                                    type="text"
                                    name="search"
                                    placeholder="Search locations by name..."
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
                                onClick={() => fetchLocations()}
                                className="flex items-center px-4 py-3 bg-surface rounded-lg border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                            >
                                <FiRefreshCw className="text-onSurface/70" />
                            </button>
                        </div>

                        {/* Advanced Filters Dropdown */}
                        {isFiltersOpen && (
                            <div className="mt-4 p-4 bg-surface rounded-lg border border-surfaceContainerHigh">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Surface Type Filter */}
                                    <Field>
                                        <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                            Surface Type
                                        </Label>
                                        <SurfaceTypeListbox
                                            options={Object.keys(
                                                SURFACE_TYPES_MAP
                                            )}
                                            selectedOption={
                                                filters.surface_type
                                            }
                                            onChange={(value) =>
                                                onFilterChange(
                                                    "surface_type",
                                                    value || ""
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
                                {filters.surface_type && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
                                        Surface:{" "}
                                        {SURFACE_TYPES_MAP[
                                            filters.surface_type as keyof typeof SURFACE_TYPES_MAP
                                        ]?.text || filters.surface_type}
                                        <button
                                            onClick={() =>
                                                onFilterChange(
                                                    "surface_type",
                                                    ""
                                                )
                                            }
                                            className="ml-2 hover:text-secondary-800"
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
                                    <FiMapPin className="text-primary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Total Locations
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {locationsData.meta.total}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="bg-secondary/10 p-3 rounded-lg mr-4">
                                    <FiGlobe className="text-secondary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Active Locations
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {locationsData.data.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="bg-tertiary/10 p-3 rounded-lg mr-4">
                                    <FiPackage className="text-tertiary text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-onSurface/70">
                                        Per Page
                                    </p>
                                    <p className="text-2xl font-bold text-onSurface">
                                        {locationsData.meta.per_page}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Locations Grid */}
                    <div className="space-y-4">
                        {isProcessing ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <LocationRowSkeleton key={i} />
                            ))
                        ) : locationsData.data.length === 0 ? (
                            <FilteredEmptyState
                                entityName="locations"
                                icon={<FiMapPin />}
                                hasActiveFilters={hasActiveFilters}
                                onClearFilters={clearFilters}
                                onCreate={onCreateLocation}
                            />
                        ) : (
                            locationsData.data.map((location) => (
                                <LocationRow
                                    key={location.id}
                                    location={location}
                                    onShowLocation={onShowLocation}
                                    onEditLocation={onEditLocation}
                                    onDeleteLocation={onDeleteLocation}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {locationsData.meta && locationsData.meta.total > 0 && (
                        <Pagination
                            meta={locationsData.meta}
                            links={locationsData.links}
                            onPageChange={onPageChange}
                        />
                    )}

                    {/* Modals */}
                    <LocationCreateModal
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        onSuccess={() => {
                            setIsCreateOpen(false);
                            fetchLocations();
                        }}
                    />
                    <LocationEditModal
                        isOpen={isEditOpen}
                        location={selectedLocation}
                        onClose={() => setIsEditOpen(false)}
                        onSuccess={() => {
                            setIsEditOpen(false);
                            fetchLocations();
                        }}
                    />
                    <LocationShowModal
                        isOpen={isShowOpen}
                        location={selectedLocation}
                        onClose={() => setIsShowOpen(false)}
                    />
                    <LocationDeleteModal
                        isOpen={isDeleteOpen}
                        location={selectedLocation}
                        onClose={() => setIsDeleteOpen(false)}
                        onSuccess={() => {
                            setIsDeleteOpen(false);
                            fetchLocations();
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default LocationIndex;
