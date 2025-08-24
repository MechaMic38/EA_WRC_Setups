import { Head, Link } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import {
    FiMapPin,
    FiChevronRight,
    FiSearch,
    FiFilter,
    FiX,
} from "react-icons/fi";
import { LocationSummary, PaginatedData } from "@/types";
import { SURFACE_TYPES_MAP } from "@/constants";
import SurfaceTypeListbox from "@/Components/Form/SurfaceTypeListbox";
import { Field, Label } from "@headlessui/react";
import TextInput from "@/Components/Form/TextInput";

const SkeletonCard = () => (
    <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh p-4 animate-pulse">
        <div className="h-48 bg-surfaceContainerHigh rounded-lg mb-4"></div>
        <div className="h-6 w-3/4 bg-surfaceContainerHigh rounded mb-3"></div>
        <div className="h-4 w-full bg-surfaceContainerHigh rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-surfaceContainerHigh rounded mb-4"></div>
        <div className="h-10 bg-surfaceContainerHigh rounded-lg"></div>
    </div>
);

export default function LocationIndex() {
    const { get, isProcessing } = useAxiosForm<PaginatedData<LocationSummary>>(
        []
    );
    const [locations, setLocations] = useState<LocationSummary[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [surfaceFilter, setSurfaceFilter] = useState("");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = () => {
        const params: any = { paginate: false };
        if (searchQuery) params.name = searchQuery;
        if (surfaceFilter) params.surface_type = surfaceFilter;

        get(route("api.locations.index", params), {
            onSuccess: (response) => {
                setLocations(response.data.data);
            },
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const onSurfaceFilterChange = (surfaceType: string | null) => {
        setSurfaceFilter(surfaceType || "");
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSurfaceFilter("");
    };

    const hasActiveFilters = searchQuery || surfaceFilter;

    // Apply filters with a slight delay to avoid too many requests
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchLocations();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, surfaceFilter]);

    const filteredLocations = locations.filter((location) => {
        const matchesSearch =
            !searchQuery ||
            location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            location.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesSurface =
            !surfaceFilter || location.surfaceType === surfaceFilter;

        return matchesSearch && matchesSurface;
    });

    return (
        <UserLayout>
            <Head title="Rally Locations" />

            {/* Hero Section */}
            <div className="relative bg-surfaceContainer py-16 border-b border-surfaceContainerHigh">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-onSurface">
                        Rally Locations
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-onSurface/70">
                        Discover all the challenging stages in EA Sports WRC
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
                                    type="text"
                                    name="search"
                                    placeholder="Search locations by name or description..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    icon={
                                        <FiSearch className="text-onSurface/50" />
                                    }
                                    className=""
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
                                    {/* Surface Type Filter */}
                                    <Field>
                                        <Label className="block text-sm font-medium text-onSurface/70 mb-2">
                                            Surface Type
                                        </Label>
                                        <SurfaceTypeListbox
                                            options={Object.keys(
                                                SURFACE_TYPES_MAP
                                            )}
                                            selectedOption={surfaceFilter}
                                            onChange={onSurfaceFilterChange}
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
                                {surfaceFilter && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
                                        Surface:{" "}
                                        {SURFACE_TYPES_MAP[
                                            surfaceFilter as keyof typeof SURFACE_TYPES_MAP
                                        ]?.text || surfaceFilter}
                                        <button
                                            onClick={() => setSurfaceFilter("")}
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
                    {!isProcessing && (
                        <div className="mb-6">
                            <p className="text-onSurface/70">
                                Showing {filteredLocations.length} location
                                {filteredLocations.length !== 1 ? "s" : ""}
                                {hasActiveFilters && " (filtered)"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Locations Grid */}
            <div className="bg-surface py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isProcessing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : filteredLocations.length === 0 ? (
                        <div className="text-center py-12 bg-surfaceContainer rounded-xl border border-surfaceContainerHigh">
                            <FiMapPin className="mx-auto text-4xl text-onSurface/50 mb-4" />
                            <h3 className="text-lg font-medium text-onSurface">
                                {hasActiveFilters
                                    ? "No locations match your filters"
                                    : "No locations found"}
                            </h3>
                            <p className="text-onSurface/70 mt-1">
                                {hasActiveFilters
                                    ? "Try adjusting your filters"
                                    : "Check back later for new locations"}
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
                            {filteredLocations.map((location) => (
                                <div
                                    key={location.id}
                                    className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary/30 group"
                                >
                                    {/* Banner Image */}
                                    <div className="h-48 relative overflow-hidden">
                                        <img
                                            src={location.imgBgPath}
                                            alt={location.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-4 left-4">
                                            <img
                                                src={location.imgBannerPath}
                                                alt={location.name}
                                                className="h-16 object-contain"
                                            />
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
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

                                    {/* Location Details */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-onSurface mb-3 line-clamp-1">
                                            {location.name}
                                        </h3>
                                        <p className="text-onSurface/70 mb-4 line-clamp-3">
                                            {location.description}
                                        </p>
                                        <Link
                                            href={route(
                                                "locations.show",
                                                location.id
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
