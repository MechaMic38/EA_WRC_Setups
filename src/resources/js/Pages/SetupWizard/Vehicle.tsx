import { Head, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiFilter, FiSearch, FiX } from "react-icons/fi";
import { Category, Manufacturer, PaginatedData, Vehicle } from "@/types";
import { LiaCarSideSolid } from "react-icons/lia";
import VehicleCard from "@/Components/Cards/VehicleCard";
import VehicleCardSkeleton from "@/Components/Skeletons/VehicleCardSkeleton";
import CategoryListbox from "@/Components/Form/CategoryListbox";
import ManufacturerListbox from "@/Components/Form/ManufacturerListbox";
import TextInput from "@/Components/Form/TextInput";
import FilteredEmptyState from "@/Components/FilteredEmptyState";
import { Field, Label } from "@headlessui/react";

export default function SetupCreateVehicle({
    location_id,
}: {
    location_id: string;
}) {
    const { get, isProcessing } = useAxiosForm<PaginatedData<Vehicle>>([]);
    const { get: getManufacturers } =
        useAxiosForm<PaginatedData<Manufacturer>>([]);
    const { get: getCategories } = useAxiosForm<PaginatedData<Category>>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
        null
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        category: null as Category | null,
        manufacturer: null as Manufacturer | null,
    });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        get(route("api.vehicles.index", { paginate: false }), {
            onSuccess: (response) => {
                setVehicles(response.data.data);
            },
        });
        getManufacturers(
            route("api.manufacturers.index", { paginate: false }),
            { onSuccess: (response) => setManufacturers(response.data.data) }
        );
        getCategories(route("api.categories.index", { paginate: false }), {
            onSuccess: (response) => setCategories(response.data.data),
        });
    }, []);

    const proceedToOptions = () => {
        router.get(route("setups.create.options"), {
            location_id,
            vehicle_id: selectedVehicle?.id,
        });
    };

    const clearFilters = () => {
        setSearchQuery("");
        setFilters({ category: null, manufacturer: null });
    };

    const hasActiveFilters = Boolean(
        searchQuery || filters.category || filters.manufacturer
    );
    const filteredVehicles = vehicles.filter((vehicle) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            !query ||
            vehicle.name.toLowerCase().includes(query) ||
            vehicle.manufacturer.name.toLowerCase().includes(query) ||
            vehicle.category.name.toLowerCase().includes(query);
        const matchesCategory =
            !filters.category || vehicle.category.id === filters.category.id;
        const matchesManufacturer =
            !filters.manufacturer ||
            vehicle.manufacturer.id === filters.manufacturer.id;

        return matchesSearch && matchesCategory && matchesManufacturer;
    });

    return (
        <UserLayout>
            <Head title="Create Setup - Choose Vehicle" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-40">
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
                            <span className="text-sm mt-2 text-onSurface">
                                Location
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary text-surfaceContainer flex items-center justify-center font-bold text-lg">
                                2
                            </div>
                            <span className="text-sm mt-2 text-primary font-medium">
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
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center px-4 py-2 bg-surfaceContainer text-onSurface rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200"
                        >
                            <FiChevronLeft className="mr-2" /> Back to Locations
                        </button>
                        <h2 className="text-xl font-semibold text-onSurface flex items-center">
                            <LiaCarSideSolid className="mr-2 text-primary text-2xl" />
                            Select Vehicle
                        </h2>
                        <div className="w-24"></div> {/* Spacer for balance */}
                    </div>

                    <div className="mb-6 rounded-xl border border-surfaceContainerHigh bg-surfaceContainer p-4">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <TextInput
                                type="text"
                                name="search"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                icon={<FiSearch className="text-onSurface/50" />}
                                placeholder="Search vehicles by name, manufacturer, or category..."
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
                            <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border border-surfaceContainerHigh bg-surface p-4 md:grid-cols-2">
                                <Field>
                                    <Label className="mb-2 block text-sm font-medium text-onSurface/70">
                                        Category
                                    </Label>
                                    <CategoryListbox
                                        options={categories}
                                        selectedOption={filters.category}
                                        onChange={(category) =>
                                            setFilters({ ...filters, category })
                                        }
                                    />
                                </Field>
                                <Field>
                                    <Label className="mb-2 block text-sm font-medium text-onSurface/70">
                                        Manufacturer
                                    </Label>
                                    <ManufacturerListbox
                                        options={manufacturers}
                                        selectedOption={filters.manufacturer}
                                        onChange={(manufacturer) =>
                                            setFilters({ ...filters, manufacturer })
                                        }
                                    />
                                </Field>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center px-1 py-2 text-onSurface/70 transition-colors duration-200 hover:text-onSurface"
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
                                <VehicleCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredVehicles.length === 0 ? (
                        <FilteredEmptyState
                            entityName="vehicles"
                            title="No vehicles found"
                            description="Check back later for new vehicles"
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={clearFilters}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVehicles.map((vehicle) => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    mode="selection"
                                    selected={
                                        selectedVehicle?.id === vehicle.id
                                    }
                                    onSelect={setSelectedVehicle}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </div>
            <div className="fixed bottom-4 inset-x-4 z-40 mx-auto max-w-4xl rounded-2xl border border-surfaceContainerHigh bg-surfaceContainer/95 p-4 shadow-2xl backdrop-blur-sm sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3" aria-live="polite">
                        {selectedVehicle && (
                            <img
                                src={selectedVehicle.manufacturer.imgPath}
                                alt=""
                                className="h-12 w-12 shrink-0 rounded-lg object-contain"
                            />
                        )}
                        <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wide text-onSurface/60">
                                Selected vehicle
                            </p>
                            <p className="truncate font-semibold text-onSurface">
                                {selectedVehicle?.name || "Choose a vehicle to continue"}
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center rounded-xl bg-surfaceContainerHigh px-5 py-3 font-medium text-onSurface transition-colors duration-200 hover:bg-surfaceContainerHigh/80"
                        >
                            <FiChevronLeft className="mr-2" /> Back
                        </button>
                        <button
                            onClick={proceedToOptions}
                            disabled={!selectedVehicle}
                            className={`flex items-center rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                                selectedVehicle
                                    ? "bg-primary text-surfaceContainer shadow-lg hover:bg-primary-600 hover:shadow-xl"
                                    : "cursor-not-allowed bg-surfaceContainerHigh text-onSurface/50"
                            }`}
                        >
                            Next: Setup Options <FiChevronRight className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
