import { Head, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiMapPin, FiChevronRight, FiFilter, FiSearch, FiX } from "react-icons/fi";
import { LocationSummary, PaginatedData } from "@/types";
import LocationCard from "@/Components/Cards/LocationCard";
import LocationCardSkeleton from "@/Components/Skeletons/LocationCardSkeleton";
import { SURFACE_TYPES_MAP } from "@/constants";
import SurfaceTypeListbox from "@/Components/Form/SurfaceTypeListbox";
import TextInput from "@/Components/Form/TextInput";
import FilteredEmptyState from "@/Components/FilteredEmptyState";
import { Field, Label } from "@headlessui/react";

export default function SetupCreateLocation() {
    const { get, isProcessing } = useAxiosForm<PaginatedData<LocationSummary>>(
        []
    );
    const [locations, setLocations] = useState<LocationSummary[]>([]);
    const [selectedLocation, setSelectedLocation] =
        useState<LocationSummary | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [surfaceFilter, setSurfaceFilter] = useState("");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        get(route("api.locations.index", { paginate: false }), {
            onSuccess: (response) => {
                setLocations(response.data.data);
            },
        });
    }, []);

    const proceedToVehicle = () => {
        router.get(route("setups.create.vehicle"), {
            location_id: selectedLocation?.id,
        });
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSurfaceFilter("");
    };

    const hasActiveFilters = Boolean(searchQuery || surfaceFilter);
    const filteredLocations = locations.filter((location) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            !query ||
            location.name.toLowerCase().includes(query) ||
            location.description.toLowerCase().includes(query);
        const matchesSurface =
            !surfaceFilter || location.surfaceType === surfaceFilter;

        return matchesSearch && matchesSurface;
    });

    return (
        <UserLayout>
            <Head title="Create Setup - Choose Location" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
                {/* Progress Steps */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-onSurface mb-8">
                        Create New Setup
                    </h1>
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary text-surfaceContainer flex items-center justify-center font-bold text-lg">
                                1
                            </div>
                            <span className="text-sm mt-2 text-primary font-medium">
                                Location
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-surfaceContainer rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-surfaceContainer text-onSurface flex items-center justify-center font-bold text-lg">
                                2
                            </div>
                            <span className="text-sm mt-2 text-onSurface">
                                Vehicle
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-surfaceContainer rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-surfaceContainer text-onSurface flex items-center justify-center font-bold text-lg">
                                3
                            </div>
                            <span className="text-sm mt-2 text-onSurface">
                                Options
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold text-onSurface mb-6 flex items-center justify-center">
                        <FiMapPin className="mr-2 text-primary text-2xl" />
                        Select Rally Location
                    </h2>

                    <div className="mb-6 rounded-xl border border-surfaceContainerHigh bg-surfaceContainer p-4">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <TextInput
                                type="text"
                                name="search"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                icon={<FiSearch className="text-onSurface/50" />}
                                placeholder="Search locations by name or description..."
                            />
                            <button
                                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                className="flex items-center rounded-lg border border-surfaceContainerHigh bg-surface px-4 py-3 transition-colors duration-200 hover:border-primary/30"
                            >
                                <FiFilter className="mr-2 text-onSurface/70" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs text-surfaceContainer">
                                        Active
                                    </span>
                                )}
                            </button>
                        </div>
                        {isFiltersOpen && (
                            <div className="mt-4 rounded-lg border border-surfaceContainerHigh bg-surface p-4">
                                <Field>
                                    <Label className="mb-2 block text-sm font-medium text-onSurface/70">
                                        Surface Type
                                    </Label>
                                    <SurfaceTypeListbox
                                        options={Object.keys(SURFACE_TYPES_MAP)}
                                        selectedOption={surfaceFilter}
                                        onChange={(surfaceType) =>
                                            setSurfaceFilter(surfaceType || "")
                                        }
                                    />
                                </Field>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 flex items-center px-1 py-2 text-onSurface/70 transition-colors duration-200 hover:text-onSurface"
                                    >
                                        <FiX className="mr-1" /> Clear all filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {isProcessing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <LocationCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredLocations.length === 0 ? (
                        <FilteredEmptyState
                            entityName="locations"
                            title="No locations found"
                            description="Check back later for new locations"
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={clearFilters}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredLocations.map((location) => (
                                <LocationCard
                                    key={location.id}
                                    location={location}
                                    mode="selection"
                                    selected={
                                        selectedLocation?.id === location.id
                                    }
                                    onSelect={setSelectedLocation}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </div>
            <div className="fixed bottom-4 inset-x-4 z-40 mx-auto max-w-4xl rounded-2xl border border-surfaceContainerHigh bg-surfaceContainer/95 p-4 shadow-2xl backdrop-blur-sm sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3" aria-live="polite">
                        {selectedLocation && (
                            <img
                                src={selectedLocation.imgBannerPath}
                                alt=""
                                className="h-12 w-16 shrink-0 rounded-lg object-contain"
                            />
                        )}
                        <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wide text-onSurface/60">
                                Selected location
                            </p>
                            <p className="truncate font-semibold text-onSurface">
                                {selectedLocation?.name || "Choose a location to continue"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={proceedToVehicle}
                        disabled={!selectedLocation}
                        className={`flex shrink-0 items-center justify-center rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                            selectedLocation
                                ? "bg-primary text-surfaceContainer shadow-lg hover:bg-primary-600 hover:shadow-xl"
                                : "cursor-not-allowed bg-surfaceContainerHigh text-onSurface/50"
                        }`}
                    >
                        Next: Choose Vehicle <FiChevronRight className="ml-2" />
                    </button>
                </div>
            </div>
        </UserLayout>
    );
}
