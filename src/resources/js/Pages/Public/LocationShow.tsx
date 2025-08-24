import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import {
    FiChevronRight,
    FiFilter,
    FiSearch,
    FiSettings,
    FiX,
} from "react-icons/fi";
import { GiCarWheel } from "react-icons/gi";
import { Location, PaginatedData, Setup, Vehicle } from "@/types";
import {
    SEASONS_MAP,
    SURFACE_CONDITIONS_MAP,
    SURFACE_TYPES_MAP,
    TYRES_MAP,
} from "@/constants";
import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import VehicleListbox from "@/Components/Form/VehicleListbox";
import { Field, Label } from "@headlessui/react";
import SeasonListbox from "@/Components/Form/SeasonListbox";
import SurfaceConditionListbox from "@/Components/Form/SurfaceConditionListbox";
import TyresListbox from "@/Components/Form/TyresListbox";
import TextInput from "@/Components/Form/TextInput";

interface LocationShowProps {
    location: Location;
}

export default function LocationShow({ location }: LocationShowProps) {
    const { get: getVehicles, isProcessing: isProcessingVehicles } =
        useAxiosForm<PaginatedData<Vehicle>>([]);
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
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const [filters, setFilters] = useState({
        vehicle_id: "",
        season: "",
        surface_condition: "",
        tyres: "",
    });

    // Initial data fetch
    useEffect(() => {
        getVehicles(route("api.vehicles.index", { paginate: false }), {
            onSuccess: (response) => {
                setVehicles(response.data.data);
            },
        });
        fetchSetups();
    }, []);

    // Apply filters with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSetups();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filters, searchQuery]);

    const fetchSetups = () => {
        const params: any = { location_id: location.id };
        if (searchQuery) params.search = searchQuery;
        if (filters.vehicle_id) params.vehicle_id = filters.vehicle_id;
        if (filters.season) params.season = filters.season;
        if (filters.surface_condition)
            params.surface_condition = filters.surface_condition;
        if (filters.tyres) params.tyres = filters.tyres;

        getSetup(route("api.setups.index", params), {
            onSuccess: (response) => {
                setSetupsData(response.data);
            },
        });
    };

    const onFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            vehicle_id: "",
            season: "",
            surface_condition: "",
            tyres: "",
        });
        setSearchQuery("");
    };

    const hasActiveFilters =
        filters.vehicle_id ||
        filters.season ||
        filters.surface_condition ||
        filters.tyres ||
        searchQuery;

    return (
        <UserLayout>
            <Head title={`${location.name} Setups`} />

            {/* Location Hero Banner */}
            <div className="relative h-64 w-full overflow-hidden bg-surfaceContainerHigh">
                <img
                    src={location.imgBgPath}
                    alt={location.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surfaceContainer to-transparent" />
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                        <div className="flex items-end justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={location.imgBannerPath}
                                        alt={location.name}
                                        className="h-16 w-16 object-contain mr-4"
                                    />
                                    <div>
                                        <h1 className="text-4xl font-bold text-onSurface">
                                            {location.name}
                                        </h1>
                                        <p className="text-onSurface mt-2 line-clamp-2">
                                            {location.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="inline-flex items-center px-4 py-2 bg-surfaceContainer/90 backdrop-blur-sm text-onSurface rounded-xl text-sm font-medium">
                                        {
                                            SURFACE_TYPES_MAP[
                                                location.surfaceType as keyof typeof SURFACE_TYPES_MAP
                                            ]?.icon
                                        }
                                        <span className="ml-1" />
                                        {SURFACE_TYPES_MAP[
                                            location.surfaceType as keyof typeof SURFACE_TYPES_MAP
                                        ]?.text || location.surfaceType}
                                    </span>
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
                                    placeholder="Search setups by vehicle or creator..."
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
                                    {/* Vehicle Filter */}
                                    <Field>
                                        <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                            Vehicle
                                        </Label>
                                        <VehicleListbox
                                            options={vehicles}
                                            selectedOption={
                                                vehicles.find(
                                                    (vehicle) =>
                                                        vehicle.id ===
                                                        filters.vehicle_id
                                                )!!
                                            }
                                            onChange={(value) =>
                                                onFilterChange(
                                                    "vehicle_id",
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
                                            options={location.seasons}
                                            selectedOption={filters.season}
                                            onChange={(value) =>
                                                onFilterChange(
                                                    "season",
                                                    value || ""
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
                                            options={location.surfaceConditions}
                                            selectedOption={
                                                filters.surface_condition
                                            }
                                            onChange={(value) =>
                                                onFilterChange(
                                                    "surface_condition",
                                                    value || ""
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
                                            options={location.tyres}
                                            selectedOption={filters.tyres}
                                            onChange={(value) =>
                                                onFilterChange(
                                                    "tyres",
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
                                {filters.vehicle_id && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
                                        Vehicle:{" "}
                                        {
                                            vehicles.find(
                                                (v) =>
                                                    v.id === filters.vehicle_id
                                            )?.name
                                        }
                                        <button
                                            onClick={() =>
                                                onFilterChange("vehicle_id", "")
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
                    {isProcessingSetup ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden animate-pulse"
                                >
                                    <div className="h-48 bg-surfaceContainerHigh"></div>
                                    <div className="p-4">
                                        <div className="h-6 w-3/4 bg-surfaceContainerHigh rounded mb-3"></div>
                                        <div className="h-4 w-full bg-surfaceContainerHigh rounded mb-2"></div>
                                        <div className="h-4 w-2/3 bg-surfaceContainerHigh rounded mb-4"></div>
                                        <div className="h-10 bg-surfaceContainerHigh rounded-lg"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : setupsData.data.length === 0 ? (
                        <div className="text-center py-12 bg-surfaceContainer rounded-xl border border-surfaceContainerHigh">
                            <FiSettings className="mx-auto text-4xl text-onSurface/50 mb-4" />
                            <h3 className="text-lg font-medium text-onSurface mb-2">
                                {hasActiveFilters
                                    ? "No setups match your filters"
                                    : `No setups found for ${location.name}`}
                            </h3>
                            <p className="text-onSurface/70 mb-4">
                                {hasActiveFilters
                                    ? "Try adjusting your filters"
                                    : "Be the first to create a setup for this location"}
                            </p>
                            {hasActiveFilters ? (
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200"
                                >
                                    Clear Filters
                                </button>
                            ) : (
                                <Link
                                    href={route("setups.create.location")}
                                    className="px-6 py-2 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 inline-block"
                                >
                                    Create First Setup
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {setupsData.data.map((setup) => (
                                <div
                                    key={setup.id}
                                    className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary/30 group"
                                >
                                    {/* Vehicle Image */}
                                    <div className="h-48 relative overflow-hidden bg-surfaceContainerHigh">
                                        <img
                                            src={setup.vehicle.imgPath}
                                            alt={setup.vehicle.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3 flex flex-col gap-3">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
                                                {
                                                    SEASONS_MAP[
                                                        setup.season as keyof typeof SEASONS_MAP
                                                    ]?.icon
                                                }
                                                <span className="ml-1" />
                                                {
                                                    SEASONS_MAP[
                                                        setup.season as keyof typeof SEASONS_MAP
                                                    ]?.text
                                                }
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
                                                {
                                                    SURFACE_CONDITIONS_MAP[
                                                        setup.surfaceCondition as keyof typeof SURFACE_CONDITIONS_MAP
                                                    ]?.icon
                                                }
                                                <span className="ml-1" />
                                                {
                                                    SURFACE_CONDITIONS_MAP[
                                                        setup.surfaceCondition as keyof typeof SURFACE_CONDITIONS_MAP
                                                    ]?.text
                                                }
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
                                                <GiCarWheel className="text-secondary" />
                                                <span className="ml-1" />
                                                {
                                                    TYRES_MAP[
                                                        setup.tyres as keyof typeof TYRES_MAP
                                                    ]?.text
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Setup Details */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                        setup.user.username
                                                    )}&background=CFBDFE&color=211F24`}
                                                    alt={setup.user.username}
                                                    className="h-8 w-8 rounded-full mr-3 border-2 border-surfaceContainerHigh"
                                                />
                                                <span className="text-sm font-medium text-onSurface">
                                                    {setup.user.username}
                                                </span>
                                            </div>
                                            <span className="text-xs text-onSurface/70">
                                                {new Date(
                                                    setup.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center mb-4">
                                            {/* Manufacturer Logo */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={
                                                        setup.vehicle
                                                            .manufacturer
                                                            .imgPath
                                                    }
                                                    alt={
                                                        setup.vehicle
                                                            .manufacturer.name
                                                    }
                                                    className="h-12 w-12 object-contain p-1"
                                                />
                                            </div>
                                            {/* Vertical divider */}
                                            <div className="hidden md:block w-px h-12 border border-tertiaryContainer mx-3" />
                                            {/* Manufacturer Name and Vehicle Name */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-onSurface/70 truncate">
                                                    {
                                                        setup.vehicle
                                                            .manufacturer.name
                                                    }
                                                </p>
                                                <h3 className="text-lg font-bold text-onSurface truncate">
                                                    {setup.vehicle.name}
                                                </h3>
                                            </div>
                                        </div>

                                        <Link
                                            href={route(
                                                "setups.show",
                                                setup.id
                                            )}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium"
                                        >
                                            View Setup Details
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
