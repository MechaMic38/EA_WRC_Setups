import { Head, Link, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiMapPin, FiChevronRight } from "react-icons/fi";
import { LocationSummary, PaginatedData } from "@/types";

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
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-onSurface mb-2">
                        Create New Setup
                    </h1>
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-primary text-surfaceContainer flex items-center justify-center font-bold">
                                1
                            </div>
                            <span className="text-sm mt-2 text-primary font-medium">
                                Location
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-surfaceContainer rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-surfaceContainer text-onSurface flex items-center justify-center font-bold">
                                2
                            </div>
                            <span className="text-sm mt-2 text-onSurface">
                                Vehicle
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-surfaceContainer rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-surfaceContainer text-onSurface flex items-center justify-center font-bold">
                                3
                            </div>
                            <span className="text-sm mt-2 text-onSurface">
                                Options
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    <h2 className="text-xl font-semibold text-onSurface mb-6 flex items-center">
                        <FiMapPin className="mr-2 text-primary" />
                        Select Rally Location
                    </h2>

                    {isProcessing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-surfaceContainer rounded-lg p-4 h-32 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {locations.map((location) => (
                                <button
                                    key={location.id}
                                    onClick={() =>
                                        setSelectedLocation(location)
                                    }
                                    className={`bg-surfaceContainer rounded-lg p-4 text-left transition-all ${
                                        selectedLocation?.id === location.id
                                            ? "ring-2 ring-primary"
                                            : "hover:bg-surfaceContainer/80"
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={location.imgBannerPath}
                                            alt={location.name}
                                            className="h-10 w-10 object-contain mr-3"
                                        />
                                        <h3 className="font-medium text-onSurface">
                                            {location.name}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-onSurface/70 mt-2 line-clamp-2">
                                        {location.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={proceedToVehicle}
                            disabled={!selectedLocation}
                            className={`px-6 py-3 rounded-md flex items-center ${
                                selectedLocation
                                    ? "bg-primary text-surfaceContainer hover:bg-primary-600"
                                    : "bg-surfaceContainer text-onSurface/50 cursor-not-allowed"
                            }`}
                        >
                            Next: Choose Vehicle{" "}
                            <FiChevronRight className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
