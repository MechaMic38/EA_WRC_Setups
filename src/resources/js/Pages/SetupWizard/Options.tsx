import { useEffect, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {
    FiChevronLeft,
    FiCheck,
    FiDroplet,
    FiCalendar,
    FiSettings,
} from "react-icons/fi";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { Location } from "@/types";

export default function SetupCreateOptions({
    location_id,
    vehicle_id,
}: {
    location_id: string;
    vehicle_id: string;
}) {
    const { get: getLocation, isProcessing } = useAxiosForm<Location>([]);

    const [location, setLocation] = useState<Location | null>(null);
    const [options, setOptions] = useState({
        surface_condition: "",
        season: "",
        tyres: "",
    });

    // Fetch location details
    useEffect(() => {
        getLocation(route("api.locations.show", location_id), {
            onSuccess: (response) => {
                setLocation(response.data);

                // Set default options based on location data
                setOptions({
                    surface_condition: response.data.surfaceConditions[0] || "",
                    season: response.data.seasons[0] || "",
                    tyres: response.data.tyres[0] || "",
                });
            },
        });
    }, []);

    const proceedToConfiguration = () => {
        // Will implement this later
        console.log("Proceeding with:", {
            location_id,
            vehicle_id,
            ...options,
        });
        router.get(route("setups.create.configuration"), {
            location_id,
            vehicle_id,
            ...options,
        });
    };

    return (
        <UserLayout>
            <Head title="Create Setup - Choose Options" />

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
                            <span className="text-sm mt-2 text-onSurface">
                                Location
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-primary text-surfaceContainer flex items-center justify-center font-bold">
                                2
                            </div>
                            <span className="text-sm mt-2 text-onSurface">
                                Vehicle
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-primary text-surfaceContainer flex items-center justify-center font-bold">
                                3
                            </div>
                            <span className="text-sm mt-2 text-primary font-medium">
                                Options
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center text-primary hover:text-primary-600"
                        >
                            <FiChevronLeft className="mr-1" /> Back to Vehicles
                        </button>
                        <h2 className="text-xl font-semibold text-onSurface">
                            Setup Conditions
                        </h2>
                        <div className="w-24"></div> {/* Spacer */}
                    </div>

                    <div className="bg-surfaceContainer rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-onSurface mb-4 flex items-center">
                            <FiDroplet className="mr-2 text-primary" />
                            Surface Condition
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {location?.surfaceConditions.map((condition) => (
                                <button
                                    key={condition}
                                    onClick={() =>
                                        setOptions({
                                            ...options,
                                            surface_condition: condition,
                                        })
                                    }
                                    className={`py-3 rounded-md ${
                                        options.surface_condition === condition
                                            ? "bg-primary text-surfaceContainer"
                                            : "bg-surface text-onSurface hover:bg-surfaceContainer"
                                    }`}
                                >
                                    {condition}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-surfaceContainer rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-onSurface mb-4 flex items-center">
                            <FiCalendar className="mr-2 text-primary" />
                            Season
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {location?.seasons.map((season) => (
                                <button
                                    key={season}
                                    onClick={() =>
                                        setOptions({
                                            ...options,
                                            season: season,
                                        })
                                    }
                                    className={`py-3 rounded-md ${
                                        options.season === season
                                            ? "bg-primary text-surfaceContainer"
                                            : "bg-surface text-onSurface hover:bg-surfaceContainer"
                                    }`}
                                >
                                    {season}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-surfaceContainer rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-onSurface mb-4 flex items-center">
                            <FiSettings className="mr-2 text-primary" />
                            Tyre Compound
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {location?.tyres.map((tyre) => (
                                <button
                                    key={tyre}
                                    onClick={() =>
                                        setOptions({
                                            ...options,
                                            tyres: tyre,
                                        })
                                    }
                                    className={`py-3 rounded-md ${
                                        options.tyres === tyre
                                            ? "bg-primary text-surfaceContainer"
                                            : "bg-surface text-onSurface hover:bg-surfaceContainer"
                                    }`}
                                >
                                    {tyre}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-3 rounded-md flex items-center bg-surfaceContainer text-onSurface hover:bg-surfaceContainer/80"
                        >
                            <FiChevronLeft className="mr-2" /> Back
                        </button>
                        <button
                            onClick={proceedToConfiguration}
                            className="px-6 py-3 rounded-md flex items-center bg-primary text-surfaceContainer hover:bg-primary-600"
                        >
                            Configure Setup <FiCheck className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
