import { Head, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useRef, useState } from "react";
import { FiFilter, FiX, FiSearch } from "react-icons/fi";
import { LocationSummary, PaginatedData, Setup, Vehicle } from "@/types";
import { SEASONS_MAP, SURFACE_CONDITIONS_MAP, TYRES_MAP } from "@/constants";
import SeasonListbox from "@/Components/Form/SeasonListbox";
import { Field, Label } from "@headlessui/react";
import SurfaceConditionListbox from "@/Components/Form/SurfaceConditionListbox";
import TyresListbox from "@/Components/Form/TyresListbox";
import LocationListbox from "@/Components/Form/LocationListbox";
import TextInput from "@/Components/Form/TextInput";
import SetupCard from "@/Components/Cards/SetupCard";
import SetupCardSkeleton from "@/Components/Skeletons/SetupCardSkeleton";
import FilteredEmptyState from "@/Components/FilteredEmptyState";
import Pagination from "@/Components/Pagination";
import { BsWrenchAdjustable } from "react-icons/bs";

interface VehicleShowProps {
    vehicle: Vehicle;
    page?: number;
    location_id?: string;
}

export default function VehicleShow({
    vehicle,
    page,
    location_id,
}: VehicleShowProps) {
    const { get: getLocations, isProcessing: isProcessingLocations } =
        useAxiosForm<PaginatedData<LocationSummary>>([]);
    const { get: getSetup, isProcessing: isProcessingSetup } = useAxiosForm<
        PaginatedData<Setup>
    >([]);

    const [setupsData, setSetupsData] = useState<PaginatedData<Setup>>({
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
    const [locations, setLocations] = useState<LocationSummary[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        page: page || 1,
        location_id: location_id || "",
        season: "",
        surface_condition: "",
        tyres: "",
    });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const isInitialMount = useRef(true);

    // Initial data fetch
    useEffect(() => {
        getLocations(route("api.locations.index", { paginate: false }), {
            onSuccess: (response) => {
                setLocations(response.data.data);
            },
        });
        fetchSetups();
    }, [vehicle.id]);

    // Apply filters with debounce
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            fetchSetups();
            updateUrlWithFilters(filters);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filters]);

    /**
     * Update the URL with the current filters.
     * @param newFilters The new filter values.
     */
    const updateUrlWithFilters = (newFilters: typeof filters) => {
        const params: any = {};

        if (newFilters.location_id)
            params["location_id"] = newFilters.location_id;
        if (newFilters.page) params["page"] = newFilters.page;

        // Use Inertia's router to update URL without full page reload
        router.get(route("vehicles.show", vehicle.id), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    /**
     * Fetch setups based on the current filters.
     */
    const fetchSetups = () => {
        const params: any = { vehicle_id: vehicle.id };

        if (filters.page) params["page"] = filters.page;
        if (filters.location_id) params["location_id"] = filters.location_id;
        if (filters.season) params["season"] = filters.season;
        if (filters.surface_condition)
            params["surface_condition"] = filters.surface_condition;
        if (filters.tyres) params["tyres"] = filters.tyres;

        getSetup(route("api.setups.index", params), {
            onSuccess: (response) => {
                setSetupsData(response.data);
                setIsInitialLoading(false);
            },
        });
    };

    /**
     * Handle filter changes.
     * @param key The filter key.
     * @param value The filter value.
     */
    const onFilterChange = (key: string, value: string) => {
        switch (key) {
            case "page":
                setFilters((prev) => ({ ...prev, page: parseInt(value) }));
                break;
            case "location_id":
                setFilters((prev) => ({
                    ...prev,
                    location_id: value,
                    page: 1,
                }));
                break;
            case "season":
                setFilters((prev) => ({ ...prev, season: value }));
                break;
            case "surface_condition":
                setFilters((prev) => ({ ...prev, surface_condition: value }));
                break;
            case "tyres":
                setFilters((prev) => ({ ...prev, tyres: value }));
                break;
            default:
                break;
        }
    };

    const clearFilters = () => {
        setFilters({
            page: 1,
            location_id: "",
            season: "",
            surface_condition: "",
            tyres: "",
        });
        setSearchQuery("");
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
        filters.location_id ||
        filters.season ||
        filters.surface_condition ||
        filters.tyres ||
        searchQuery;

    return (
        <UserLayout>
            <Head title={`${vehicle.name} Setups`} />

            {/* Vehicle Hero Banner */}
            <div className="relative h-64 w-full overflow-hidden bg-surfaceContainerHigh">
                <img
                    src={vehicle.imgPath}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surfaceContainer to-transparent" />
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-onSurface">
                                    {vehicle.name}
                                </h1>
                                <div className="mt-4 flex items-center gap-6">
                                    <div className="flex items-center bg-surfaceContainer/90 backdrop-blur-sm px-4 py-2 rounded-xl">
                                        <img
                                            src={vehicle.manufacturer.imgPath}
                                            alt={vehicle.manufacturer.name}
                                            className="h-8 w-8 object-contain mr-3"
                                        />
                                        <span className="text-onSurface font-medium">
                                            {vehicle.manufacturer.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center bg-surfaceContainer/90 backdrop-blur-sm px-4 py-2 rounded-xl">
                                        <img
                                            src={vehicle.category.imgPath}
                                            alt={vehicle.category.name}
                                            className="h-6 w-6 object-contain mr-3"
                                        />
                                        <span className="text-onSurface font-medium">
                                            {vehicle.category.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-surface py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search and Filter Bar */}
                    <div className="bg-surfaceContainer rounded-xl p-4 mb-6 border border-surfaceContainerHigh">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <TextInput
                                    type="text"
                                    name="search"
                                    placeholder="Search setups by location or creator..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
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
                        </div>

                        {/* Advanced Filters Dropdown */}
                        {isFiltersOpen && (
                            <div className="mt-4 p-4 bg-surface rounded-lg border border-surfaceContainerHigh">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Location Filter */}
                                    <Field>
                                        <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                            Location
                                        </Label>
                                        <LocationListbox
                                            options={locations}
                                            selectedOption={
                                                locations.find(
                                                    (location) =>
                                                        location.id ===
                                                        filters.location_id
                                                )!!
                                            }
                                            onChange={(value) =>
                                                onFilterChange(
                                                    "location_id",
                                                    value?.id || ""
                                                )
                                            }
                                        />
                                    </Field>

                                    {/* Season Filter */}
                                    <Field>
                                        <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                            Season
                                        </Label>
                                        <SeasonListbox
                                            options={Object.keys(SEASONS_MAP)}
                                            selectedOption={filters.season}
                                            onChange={(option) =>
                                                onFilterChange(
                                                    "season",
                                                    option || ""
                                                )
                                            }
                                        />
                                    </Field>

                                    {/* Surface Condition Filter */}
                                    <Field>
                                        <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                            Surface Condition
                                        </Label>
                                        <SurfaceConditionListbox
                                            options={Object.keys(
                                                SURFACE_CONDITIONS_MAP
                                            )}
                                            selectedOption={
                                                filters.surface_condition
                                            }
                                            onChange={(option) =>
                                                onFilterChange(
                                                    "surface_condition",
                                                    option || ""
                                                )
                                            }
                                        />
                                    </Field>

                                    {/* Tyres Filter */}
                                    <Field>
                                        <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                            Tyre Compound
                                        </Label>
                                        <TyresListbox
                                            options={Object.keys(TYRES_MAP)}
                                            selectedOption={filters.tyres}
                                            onChange={(option) =>
                                                onFilterChange(
                                                    "tyres",
                                                    option || ""
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
                                {filters.location_id && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
                                        Location:{" "}
                                        {
                                            locations.find(
                                                (l) =>
                                                    l.id === filters.location_id
                                            )?.name
                                        }
                                        <button
                                            onClick={() =>
                                                onFilterChange(
                                                    "location_id",
                                                    ""
                                                )
                                            }
                                            className="ml-2 hover:text-secondary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.season && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-sm">
                                        Season:{" "}
                                        {
                                            SEASONS_MAP[
                                                filters.season as keyof typeof SEASONS_MAP
                                            ]?.text
                                        }
                                        <button
                                            onClick={() =>
                                                onFilterChange("season", "")
                                            }
                                            className="ml-2 hover:text-tertiary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.surface_condition && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                        Surface:{" "}
                                        {
                                            SURFACE_CONDITIONS_MAP[
                                                filters.surface_condition as keyof typeof SURFACE_CONDITIONS_MAP
                                            ]?.text
                                        }
                                        <button
                                            onClick={() =>
                                                onFilterChange(
                                                    "surface_condition",
                                                    ""
                                                )
                                            }
                                            className="ml-2 hover:text-primary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.tyres && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
                                        Tyres:{" "}
                                        {
                                            TYRES_MAP[
                                                filters.tyres as keyof typeof TYRES_MAP
                                            ]?.text
                                        }
                                        <button
                                            onClick={() =>
                                                onFilterChange("tyres", "")
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

                    {/* Results Count */}
                    {!isProcessingSetup && (
                        <div className="mb-6">
                            <p className="text-onSurface/70">
                                Showing {setupsData.data.length} setup
                                {setupsData.data.length !== 1 ? "s" : ""}
                                {hasActiveFilters && " (filtered)"}
                            </p>
                        </div>
                    )}

                    {/* Setups Grid */}
                    {isInitialLoading || isProcessingSetup ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <SetupCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : setupsData.data.length === 0 ? (
                        <FilteredEmptyState
                            entityName="setups"
                            title={`No setups found for ${vehicle.name}`}
                            description="Come back later to see if new setups have been created"
                            icon={<BsWrenchAdjustable />}
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={clearFilters}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {setupsData.data.map((setup) => (
                                <SetupCard
                                    key={setup.id}
                                    setup={setup}
                                    image="location"
                                    hideVehicle
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {setupsData.meta && setupsData.meta.total > 0 && (
                        <Pagination
                            meta={setupsData.meta}
                            links={setupsData.links}
                            onPageChange={onPageChange}
                        />
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
