import { Head, Link, usePage } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import {
    FiCalendar,
    FiDroplet,
    FiFilter,
    FiX,
    FiSearch,
    FiPlus,
} from "react-icons/fi";
import { GiTwirlyFlower, GiLindenLeaf } from "react-icons/gi";
import { FiSun } from "react-icons/fi";
import { FaRegSnowflake } from "react-icons/fa";
import { BsCloudSunFill, BsSnow2, BsWrenchAdjustable } from "react-icons/bs";
import { BiWater } from "react-icons/bi";
import { PaginatedData, Setup, Vehicle, LocationSummary } from "@/types";
import { SEASONS_MAP, SURFACE_CONDITIONS_MAP, TYRES_MAP } from "@/constants";
import TextInput from "@/Components/Form/TextInput";
import { Field, Label } from "@headlessui/react";
import VehicleListbox from "@/Components/Form/VehicleListbox";
import LocationListbox from "@/Components/Form/LocationListbox";
import SeasonListbox from "@/Components/Form/SeasonListbox";
import SurfaceConditionListbox from "@/Components/Form/SurfaceConditionListbox";
import TyresListbox from "@/Components/Form/TyresListbox";
import SetupCard from "@/Components/Cards/SetupCard";
import SetupCardSkeleton from "@/Components/Skeletons/SetupCardSkeleton";
import FilteredEmptyState from "@/Components/FilteredEmptyState";

export default function UserSetupIndex() {
    const user = usePage().props.auth.user;
    const { get: getSetups, isProcessing: isProcessingSetups } = useAxiosForm<
        PaginatedData<Setup>
    >([]);
    const { get: getVehicles, isProcessing: isProcessingVehicles } =
        useAxiosForm<PaginatedData<Vehicle>>([]);
    const { get: getLocations, isProcessing: isProcessingLocations } =
        useAxiosForm<PaginatedData<LocationSummary>>([]);

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
    const [locations, setLocations] = useState<LocationSummary[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        vehicle_id: "",
        location_id: "",
        season: "",
        surface_condition: "",
        tyres: "",
    });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        fetchSetups();
        getVehicles(route("api.vehicles.index", { paginate: false }), {
            onSuccess: (response) => {
                setVehicles(response.data.data);
            },
        });
        getLocations(route("api.locations.index", { paginate: false }), {
            onSuccess: (response) => {
                setLocations(response.data.data);
            },
        });
    }, []);

    const fetchSetups = () => {
        const params: any = { user_id: user.id };
        if (searchQuery) params.search = searchQuery;
        if (filters.vehicle_id) params.vehicle_id = filters.vehicle_id;
        if (filters.location_id) params.location_id = filters.location_id;
        if (filters.season) params.season = filters.season;
        if (filters.surface_condition)
            params.surface_condition = filters.surface_condition;
        if (filters.tyres) params.tyres = filters.tyres;

        getSetups(route("api.setups.index", params), {
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
            vehicle_id: "",
            location_id: "",
            season: "",
            surface_condition: "",
            tyres: "",
        });
        setSearchQuery("");
    };

    const hasActiveFilters =
        filters.vehicle_id ||
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

    // Helper function to get season icon
    const getSeasonIcon = (season: string) => {
        switch (season) {
            case "spring":
                return <GiTwirlyFlower className="text-green-500 text-lg" />;
            case "summer":
                return <FiSun className="text-yellow-500 text-lg" />;
            case "autumn":
                return <GiLindenLeaf className="text-orange-500 text-lg" />;
            case "winter":
                return <FaRegSnowflake className="text-blue-400 text-lg" />;
            default:
                return <FiCalendar className="text-primary text-lg" />;
        }
    };

    // Helper function to get surface condition icon
    const getSurfaceConditionIcon = (condition: string) => {
        switch (condition) {
            case "dry":
                return <BsCloudSunFill className="text-amber-500 text-lg" />;
            case "wet":
                return <BiWater className="text-blue-500 text-lg" />;
            case "snow":
                return <BsSnow2 className="text-blue-400 text-lg" />;
            default:
                return <FiDroplet className="text-primary text-lg" />;
        }
    };

    return (
        <UserLayout>
            <Head title="My Setups" />

            {/* Header Section */}
            <div className="bg-surfaceContainer py-8 border-b border-surfaceContainerHigh">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-onSurface mb-2">
                                My Setups
                            </h1>
                            <p className="text-onSurface/70">
                                Manage and view all your created setups
                            </p>
                        </div>
                        <Link
                            href={route("setups.create.location")}
                            className="px-6 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 flex items-center font-medium"
                        >
                            <FiPlus className="mr-2" /> Create New Setup
                        </Link>
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
                                    placeholder="Search your setups by vehicle or location..."
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                                            onChange={(vehicle) =>
                                                handleFilterChange(
                                                    "vehicle_id",
                                                    vehicle ? vehicle.id : ""
                                                )
                                            }
                                        />
                                    </Field>

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
                                            onChange={(location) =>
                                                handleFilterChange(
                                                    "location_id",
                                                    location ? location.id : ""
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
                                                handleFilterChange(
                                                    "vehicle_id",
                                                    ""
                                                )
                                            }
                                            className="ml-2 hover:text-secondary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.location_id && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-sm">
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
                                            className="ml-2 hover:text-tertiary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.season && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
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
                                            className="ml-2 hover:text-primary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.surface_condition && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
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
                                            className="ml-2 hover:text-secondary-800"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.tyres && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-sm">
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
                    {!isProcessingSetups && (
                        <div className="mb-6">
                            <p className="text-onSurface/70">
                                Showing {setupsData.data.length} setup
                                {setupsData.data.length !== 1 ? "s" : ""}
                                {hasActiveFilters && " (filtered)"}
                                {setupsData.meta.total > 0 &&
                                    ` of ${setupsData.meta.total} total`}
                            </p>
                        </div>
                    )}

                    {/* Setups Grid */}
                    {isProcessingSetups ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <SetupCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : setupsData.data.length === 0 ? (
                        <FilteredEmptyState
                            entityName="locations"
                            title="You haven't created any setups yet"
                            description="Get started by creating your first setup"
                            icon={<BsWrenchAdjustable />}
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={clearFilters}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {setupsData.data.map((setup) => (
                                <SetupCard key={setup.id} setup={setup} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
