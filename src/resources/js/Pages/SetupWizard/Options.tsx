import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {
    FiChevronLeft,
    FiCheck,
    FiCalendar,
    FiSettings,
    FiCloud,
} from "react-icons/fi";
import { GiCarWheel } from "react-icons/gi";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { Location } from "@/types";
import { SEASONS_MAP, SURFACE_CONDITIONS_MAP, TYRES_MAP } from "@/constants";

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
        router.get(route("setups.create.configuration"), {
            location_id,
            vehicle_id,
            ...options,
        });
    };

    const getDisplayIcon = (
        type: "season" | "surface_condition",
        value: string
    ) => {
        const maps = {
            season: SEASONS_MAP,
            surface_condition: SURFACE_CONDITIONS_MAP,
        };

        return (
            (maps[type] as Record<string, { icon: JSX.Element }>)[value]
                ?.icon || null
        );
    };

    // Helper function to get display text for options
    const getDisplayText = (
        type: "season" | "surface_condition" | "tyres",
        value: string
    ) => {
        const maps = {
            season: SEASONS_MAP,
            surface_condition: SURFACE_CONDITIONS_MAP,
            tyres: TYRES_MAP,
        };

        return (
            (maps[type] as Record<string, { text: string }>)[value]?.text ||
            value
        );
    };

    return (
        <UserLayout>
            <Head title="Create Setup - Choose Options" />

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
                            <span className="text-sm mt-2 text-onSurface">
                                Location
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary text-surfaceContainer flex items-center justify-center font-bold text-lg">
                                2
                            </div>
                            <span className="text-sm mt-2 text-onSurface">
                                Vehicle
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary text-surfaceContainer flex items-center justify-center font-bold text-lg">
                                3
                            </div>
                            <span className="text-sm mt-2 text-primary font-medium">
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
                            <FiChevronLeft className="mr-2" /> Back to Vehicles
                        </button>
                        <h2 className="text-xl font-semibold text-onSurface">
                            Setup Conditions
                        </h2>
                        <div className="w-24"></div> {/* Spacer for balance */}
                    </div>

                    {/* Season Selection */}
                    <div className="bg-surfaceContainer rounded-xl p-6 mb-6 border border-surfaceContainerHigh">
                        <h3 className="text-lg font-medium text-onSurface mb-6 flex items-center">
                            <FiCalendar className="mr-2 text-primary text-xl" />
                            Season
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {location?.seasons.map((season) => (
                                <button
                                    key={season}
                                    onClick={() =>
                                        setOptions({
                                            ...options,
                                            season: season,
                                        })
                                    }
                                    className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center ${
                                        options.season === season
                                            ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                            : "border-surfaceContainerHigh bg-surface hover:border-primary/30"
                                    }`}
                                >
                                    <div className="mb-3">
                                        {getDisplayIcon("season", season)}
                                    </div>
                                    <span
                                        className={`font-medium ${
                                            options.season === season
                                                ? "text-primary"
                                                : "text-onSurface"
                                        }`}
                                    >
                                        {getDisplayText("season", season)}
                                    </span>
                                    {options.season === season && (
                                        <div className="mt-2 w-6 h-6 rounded-full bg-primary text-surfaceContainer flex items-center justify-center">
                                            <FiCheck size={14} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Surface Condition Selection */}
                    <div className="bg-surfaceContainer rounded-xl p-6 mb-6 border border-surfaceContainerHigh">
                        <h3 className="text-lg font-medium text-onSurface mb-6 flex items-center">
                            <FiCloud className="mr-2 text-primary text-xl" />
                            Surface Condition
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {location?.surfaceConditions.map((condition) => (
                                <button
                                    key={condition}
                                    onClick={() =>
                                        setOptions({
                                            ...options,
                                            surface_condition: condition,
                                        })
                                    }
                                    className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center ${
                                        options.surface_condition === condition
                                            ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                            : "border-surfaceContainerHigh bg-surface hover:border-primary/30"
                                    }`}
                                >
                                    <div className="mb-3">
                                        {getDisplayIcon(
                                            "surface_condition",
                                            condition
                                        )}
                                    </div>
                                    <span
                                        className={`font-medium ${
                                            options.surface_condition ===
                                            condition
                                                ? "text-primary"
                                                : "text-onSurface"
                                        }`}
                                    >
                                        {getDisplayText(
                                            "surface_condition",
                                            condition
                                        )}
                                    </span>
                                    {options.surface_condition ===
                                        condition && (
                                        <div className="mt-2 w-6 h-6 rounded-full bg-primary text-surfaceContainer flex items-center justify-center">
                                            <FiCheck size={14} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tyre Compound Selection */}
                    <div className="bg-surfaceContainer rounded-xl p-6 mb-6 border border-surfaceContainerHigh">
                        <h3 className="text-lg font-medium text-onSurface mb-6 flex items-center">
                            <GiCarWheel className="mr-2 text-primary text-xl" />
                            Tyre Compound
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {location?.tyres.map((tyre) => (
                                <button
                                    key={tyre}
                                    onClick={() =>
                                        setOptions({
                                            ...options,
                                            tyres: tyre,
                                        })
                                    }
                                    className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center ${
                                        options.tyres === tyre
                                            ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                            : "border-surfaceContainerHigh bg-surface hover:border-primary/30"
                                    }`}
                                >
                                    <span
                                        className={`font-medium text-center ${
                                            options.tyres === tyre
                                                ? "text-primary"
                                                : "text-onSurface"
                                        }`}
                                    >
                                        {getDisplayText("tyres", tyre)}
                                    </span>
                                    {options.tyres === tyre && (
                                        <div className="mt-2 w-6 h-6 rounded-full bg-primary text-surfaceContainer flex items-center justify-center">
                                            <FiCheck size={14} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-12 flex justify-between">
                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-3 rounded-xl flex items-center bg-surfaceContainer text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium"
                        >
                            <FiChevronLeft className="mr-2" /> Back
                        </button>
                        <button
                            onClick={proceedToConfiguration}
                            className="px-8 py-3 rounded-xl flex items-center bg-primary text-surfaceContainer hover:bg-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
                        >
                            Configure Setup <FiCheck className="ml-2" />
                        </button>
                    </div>

                    {/* Selected Options Preview */}
                    {(options.surface_condition ||
                        options.season ||
                        options.tyres) && (
                        <div className="mt-8 p-6 bg-surfaceContainer rounded-xl border border-surfaceContainerHigh">
                            <h3 className="text-lg font-bold text-onSurface mb-4">
                                Selected Options
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {options.surface_condition && (
                                    <div className="flex items-center">
                                        {getDisplayIcon(
                                            "surface_condition",
                                            options.surface_condition
                                        )}
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-onSurface/70">
                                                Surface
                                            </p>
                                            <p className="text-onSurface">
                                                {getDisplayText(
                                                    "surface_condition",
                                                    options.surface_condition
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {options.season && (
                                    <div className="flex items-center">
                                        {getDisplayIcon(
                                            "season",
                                            options.season
                                        )}
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-onSurface/70">
                                                Season
                                            </p>
                                            <p className="text-onSurface">
                                                {getDisplayText(
                                                    "season",
                                                    options.season
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {options.tyres && (
                                    <div className="flex items-center">
                                        <FiSettings className="text-primary" />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-onSurface/70">
                                                Tyres
                                            </p>
                                            <p className="text-onSurface">
                                                {getDisplayText(
                                                    "tyres",
                                                    options.tyres
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
