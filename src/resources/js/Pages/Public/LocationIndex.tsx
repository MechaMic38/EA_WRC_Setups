import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiMapPin, FiSearch, FiFilter, FiX } from "react-icons/fi";
import { LocationSummary, PaginatedData } from "@/types";
import { SURFACE_TYPES_MAP } from "@/constants";
import SurfaceTypeListbox from "@/Components/Form/SurfaceTypeListbox";
import { Field, Label } from "@headlessui/react";
import TextInput from "@/Components/Form/TextInput";
import LocationSetupCard from "@/Components/Cards/LocationSetupCard";
import LocationSetupCardSkeleton from "@/Components/Skeletons/LocationSetupCardSkeleton";
import FilteredEmptyState from "@/Components/FilteredEmptyState";

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
                                <LocationSetupCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredLocations.length === 0 ? (
                        <FilteredEmptyState
                            entityName="locations"
                            title="No locations found"
                            description="Check back later for new locations"
                            icon={<FiMapPin />}
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={clearFilters}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredLocations.map((location) => (
                                <LocationSetupCard
                                    key={location.id}
                                    location={location}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
