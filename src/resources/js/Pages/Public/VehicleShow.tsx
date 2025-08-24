import { Head, Link } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import {
    FiChevronRight,
    FiSettings,
    FiFilter,
    FiX,
    FiSearch,
} from "react-icons/fi";
import { GiCarWheel } from "react-icons/gi";
import { LocationSummary, PaginatedData, Setup, Vehicle } from "@/types";
import { SEASONS_MAP, SURFACE_CONDITIONS_MAP, TYRES_MAP } from "@/constants";
import SeasonListbox from "@/Components/Form/SeasonListbox";
import { Field, Label } from "@headlessui/react";
import SurfaceConditionListbox from "@/Components/Form/SurfaceConditionListbox";
import TyresListbox from "@/Components/Form/TyresListbox";
import LocationListbox from "@/Components/Form/LocationListbox";
import TextInput from "@/Components/Form/TextInput";

interface VehicleShowProps {
    vehicle: Vehicle;
}

export default function VehicleShow({ vehicle }: VehicleShowProps) {
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
        location_id: "",
        season: "",
        surface_condition: "",
        tyres: "",
    });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        fetchSetups();
        getLocations(route("api.locations.index", { paginate: false }), {
            onSuccess: (response) => {
                console.log("Locations", response.data);
                console.log("Locations data", response.data.data);
                setLocations(response.data.data);
            },
        });
    }, [vehicle.id]);

    const fetchSetups = () => {
        const params: any = { vehicle_id: vehicle.id };
        if (searchQuery) params.search = searchQuery;
        if (filters.location_id) params.location_id = filters.location_id;
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

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            location_id: "",
            season: "",
            surface_condition: "",
            tyres: "",
        });
        setSearchQuery("");
    };

    const hasActiveFilters =
        filters.location_id ||
        filters.season ||
        filters.surface_condition ||
        filters.tyres ||
        searchQuery;

    // Apply filters with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSetups();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filters, searchQuery]);

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
                                                handleFilterChange(
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
                                                handleFilterChange(
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
                                                handleFilterChange(
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
                                                handleFilterChange(
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
                                                handleFilterChange(
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
                                                handleFilterChange("season", "")
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
                                                handleFilterChange(
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
                                                handleFilterChange("tyres", "")
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
                                    : `No setups found for ${vehicle.name}`}
                            </h3>
                            <p className="text-onSurface/70 mb-4">
                                {hasActiveFilters
                                    ? "Try adjusting your filters"
                                    : "Be the first to create a setup for this vehicle"}
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
                                    {/* Location Image */}
                                    <div className="h-48 relative overflow-hidden">
                                        <img
                                            src={
                                                setup.location.imgBgPath ||
                                                setup.location.imgBannerPath
                                            }
                                            alt={setup.location.name}
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

                                        <div className="flex items-center mb-3">
                                            {/* Location Logo */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={
                                                        setup.location
                                                            .imgBannerPath
                                                    }
                                                    alt={setup.location.name}
                                                    className="h-10 w-10 object-contain"
                                                />
                                            </div>
                                            {/* Location Name */}
                                            <div className="flex-1 min-w-0 ml-3">
                                                <h3 className="text-lg font-bold text-onSurface truncate">
                                                    {setup.location.name}
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
