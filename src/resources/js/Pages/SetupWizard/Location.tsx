import { Head, Link, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiMapPin, FiChevronRight, FiCheck } from "react-icons/fi";
import { LocationSummary, PaginatedData } from "@/types";
import { SURFACE_TYPES_MAP } from "@/constants";

const SkeletonCard = () => (
    <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden animate-pulse">
        <div className="h-32 bg-surfaceContainerHigh"></div>
        <div className="p-4">
            <div className="flex items-center mb-3">
                <div className="h-10 w-10 bg-surfaceContainerHigh rounded-full mr-3"></div>
                <div className="h-5 w-3/4 bg-surfaceContainerHigh rounded"></div>
            </div>
            <div className="h-4 w-full bg-surfaceContainerHigh rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-surfaceContainerHigh rounded"></div>
        </div>
    </div>
);

export default function SetupCreateLocation() {
    const { get, isProcessing } = useAxiosForm<PaginatedData<LocationSummary>>(
        []
    );
    const [locations, setLocations] = useState<LocationSummary[]>([]);
    const [selectedLocation, setSelectedLocation] =
        useState<LocationSummary | null>(null);

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

    return (
        <UserLayout>
            <Head title="Create Setup - Choose Location" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

                    {isProcessing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {locations.map((location) => (
                                <button
                                    key={location.id}
                                    onClick={() =>
                                        setSelectedLocation(location)
                                    }
                                    className={`bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden hover:shadow-lg transition-all duration-200 group text-left ${
                                        selectedLocation?.id === location.id
                                            ? "ring-2 ring-primary border-primary/30"
                                            : "hover:border-primary/30"
                                    }`}
                                >
                                    {/* Location Image */}
                                    <div className="h-32 relative overflow-hidden">
                                        <img
                                            src={
                                                location.imgBgPath ||
                                                location.imgBannerPath
                                            }
                                            alt={location.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3">
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
                                        {selectedLocation?.id ===
                                            location.id && (
                                            <div className="absolute top-3 left-3">
                                                <div className="w-6 h-6 rounded-full bg-primary text-surfaceContainer flex items-center justify-center">
                                                    <FiCheck size={14} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Location Details */}
                                    <div className="p-4">
                                        <div className="flex items-center mb-3">
                                            {/* Location Logo */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={location.imgBannerPath}
                                                    alt={location.name}
                                                    className="h-10 w-10 object-contain"
                                                />
                                            </div>
                                            {/* Location Name */}
                                            <div className="flex-1 min-w-0 ml-3">
                                                <h3 className="text-lg font-bold text-onSurface truncate">
                                                    {location.name}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-sm text-onSurface/70 line-clamp-2">
                                            {location.description}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Next Button */}
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={proceedToVehicle}
                            disabled={!selectedLocation}
                            className={`px-8 py-4 rounded-xl flex items-center text-lg font-medium transition-all duration-200 ${
                                selectedLocation
                                    ? "bg-primary text-surfaceContainer hover:bg-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    : "bg-surfaceContainer text-onSurface/50 cursor-not-allowed"
                            }`}
                        >
                            Next: Choose Vehicle{" "}
                            <FiChevronRight className="ml-2" />
                        </button>
                    </div>

                    {/* Selected Location Preview */}
                    {selectedLocation && (
                        <div className="mt-8 p-6 bg-surfaceContainer rounded-xl border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <img
                                        src={selectedLocation.imgBannerPath}
                                        alt={selectedLocation.name}
                                        className="h-16 w-16 object-contain"
                                    />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-onSurface">
                                        {selectedLocation.name} Selected
                                    </h3>
                                    <p className="text-sm text-onSurface/70">
                                        Ready to choose a vehicle for this
                                        location
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
