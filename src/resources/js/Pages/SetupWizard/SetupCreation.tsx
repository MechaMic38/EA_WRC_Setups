import { Head, Link, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import {
    FiChevronLeft,
    FiSave,
    FiSliders,
    FiX,
    FiInfo,
    FiSettings,
    FiCalendar,
    FiCloud,
} from "react-icons/fi";
import {
    LocationSummary,
    SetupBlueprint,
    SetupConfigsNumeric,
    SetupSection,
    Vehicle,
} from "@/types";
import ConfigurationSection from "@/Components/Setup/ConfigurationSection";
import {
    SEASONS_MAP,
    SURFACE_CONDITIONS_MAP,
    SURFACE_TYPES_MAP,
    TYRES_MAP,
} from "@/constants";
import { GiCarWheel } from "react-icons/gi";

interface SetupCreationProps {
    location_id: string;
    vehicle_id: string;
    surface_condition: string;
    season: string;
    tyres: string;
}

interface SetupConfigResponse {
    id: string;
}

interface SetupConfigFormData {
    location_id: string;
    vehicle_id: string;
    surface_condition: string;
    season: string;
    tyres: string;
    configuration: SetupConfigsNumeric;
}

export default function SetupCreation({
    location_id,
    vehicle_id,
    surface_condition,
    season,
    tyres,
}: SetupCreationProps) {
    const { get: getBlueprint, isProcessing: isProcessingBlueprint } =
        useAxiosForm<SetupBlueprint>([]);
    const { get: getVehicle, isProcessing: isProcessingVehicle } =
        useAxiosForm<Vehicle>([]);
    const { get: getLocation, isProcessing: isProcessingLocation } =
        useAxiosForm<LocationSummary>([]);
    const {
        data,
        setData,
        post: postConfiguration,
        errors,
    } = useAxiosForm<SetupConfigResponse, SetupConfigFormData>({
        location_id,
        vehicle_id,
        surface_condition,
        season,
        tyres,
        configuration: {
            alignment: {},
            braking: {},
            differentials: {},
            gears: {},
            damping: {},
            springs: {},
        },
    });

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [location, setLocation] = useState<LocationSummary | null>(null);
    const [blueprint, setBlueprint] = useState<SetupBlueprint | null>(null);
    const [activeTab, setActiveTab] = useState<SetupSection>("alignment");

    // Fetch vehicle blueprint
    useEffect(() => {
        getBlueprint(route("api.vehicles.blueprint.show", vehicle_id), {
            onSuccess: (response) => {
                setBlueprint(response.data);
                initializeConfig(response.data);
            },
        });

        getVehicle(route("api.vehicles.show", vehicle_id), {
            onSuccess: (response) => {
                setVehicle(response.data);
            },
        });

        getLocation(route("api.locations.show", location_id), {
            onSuccess: (response) => {
                setLocation(response.data);
            },
        });
    }, [vehicle_id]);

    // Initialize configuration with default values
    const initializeConfig = (blueprintData: SetupBlueprint) => {
        const initialConfig: SetupConfigsNumeric = {
            alignment: {},
            braking: {},
            differentials: {},
            gears: {},
            damping: {},
            springs: {},
        };

        const sections: SetupSection[] = [
            "alignment",
            "braking",
            "differentials",
            "gears",
            "damping",
            "springs",
        ];

        sections.forEach((section) => {
            initialConfig[section] = {};

            Object.keys(blueprintData[section]).forEach((setting) => {
                const option = blueprintData[section][setting];
                initialConfig[section][setting] = option.default_value;
            });
        });

        setData((prev) => ({
            ...prev,
            configuration: initialConfig,
        }));
    };

    // Handle slider change
    const onConfigurationChange = (
        section: SetupSection,
        setting: string,
        value: number
    ) => {
        setData((prev) => ({
            ...prev,
            configuration: {
                ...prev.configuration,
                [section]: {
                    ...prev.configuration[section],
                    [setting]: value,
                },
            },
        }));
    };

    // Handle configuration section reset
    const onReset = (section: SetupSection) => {
        if (!blueprint || !blueprint[section]) return;

        const sectionDefaults: any = {};
        Object.keys(blueprint[section]).forEach((setting) => {
            sectionDefaults[setting] =
                blueprint[section][setting].default_value;
        });

        setData((prev) => ({
            ...prev,
            configuration: {
                ...prev.configuration,
                [section]: sectionDefaults,
            },
        }));
    };

    // Submit the setup
    const submitSetup = () => {
        postConfiguration(route("api.setups.store"), {
            onSuccess: (response) => {
                router.visit(route("setups.show", response.data.id));
            },
        });
    };

    // Render configuration section
    const renderConfigurationSection = (section: SetupSection) => {
        if (!blueprint || !blueprint[section]) return null;

        return (
            <ConfigurationSection
                section={section}
                options={data.configuration[section]}
                blueprintOptions={blueprint[section]}
                onConfigurationChange={onConfigurationChange}
                onReset={onReset}
            />
        );
    };

    // Configuration tabs
    const configurationTabs: {
        id: SetupSection;
        icon: JSX.Element;
        label: string;
    }[] = [
        { id: "alignment", icon: <FiSliders />, label: "Alignment" },
        { id: "braking", icon: <FiSliders />, label: "Braking" },
        { id: "differentials", icon: <FiSliders />, label: "Differentials" },
        { id: "gears", icon: <FiSliders />, label: "Gears" },
        { id: "damping", icon: <FiSliders />, label: "Damping" },
        { id: "springs", icon: <FiSliders />, label: "Springs" },
    ];

    return (
        <UserLayout>
            <Head title="Configure Setup" />

            {/* Setup Header */}
            <div className="bg-surfaceContainer py-8 border-b border-surfaceContainerHigh">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <Link
                                href={route("setups.create.options", {
                                    location_id,
                                    vehicle_id,
                                })}
                                className="inline-flex items-center text-primary hover:text-primary-600 mb-4 transition-colors duration-200"
                            >
                                <FiChevronLeft className="mr-2" /> Back to
                                Options
                            </Link>
                            <h1 className="text-3xl font-bold text-onSurface mb-2">
                                Configure Your Setup
                            </h1>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    if (blueprint) initializeConfig(blueprint);
                                }}
                                className="px-6 py-3 bg-surface text-primary border border-primary rounded-xl hover:bg-surfaceContainer transition-colors duration-200 flex items-center font-medium"
                            >
                                <FiX className="mr-2" /> Reset All
                            </button>
                            <button
                                onClick={submitSetup}
                                disabled={isProcessingBlueprint}
                                className={`px-6 py-3 rounded-xl flex items-center font-medium transition-all duration-200 ${
                                    isProcessingBlueprint
                                        ? "bg-surfaceContainer text-onSurface/50 cursor-not-allowed"
                                        : "bg-primary text-surfaceContainer hover:bg-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                                }`}
                            >
                                <FiSave className="mr-2" />{" "}
                                {isProcessingBlueprint
                                    ? "Saving..."
                                    : "Save Setup"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-8 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Left Sidebar - Location and Vehicle Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Location Card */}
                            {location && (
                                <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden">
                                    <div className="h-32 relative overflow-hidden">
                                        <img
                                            src={
                                                location.imgBgPath ||
                                                location.imgBannerPath
                                            }
                                            alt={location.name}
                                            className="w-full h-full object-cover"
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
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center mb-3">
                                            <img
                                                src={location.imgBannerPath}
                                                alt={location.name}
                                                className="h-10 w-10 object-contain mr-3"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-onSurface truncate">
                                                    {location.name}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-sm text-onSurface/70 line-clamp-2">
                                            {location.description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Vehicle Card */}
                            {vehicle && (
                                <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden">
                                    <div className="h-32 relative overflow-hidden bg-surfaceContainerHigh">
                                        <img
                                            src={vehicle.imgPath}
                                            alt={vehicle.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
                                                <img
                                                    src={
                                                        vehicle.category.imgPath
                                                    }
                                                    alt={vehicle.category.name}
                                                    className="h-4 w-4 object-contain mr-1"
                                                />
                                                {vehicle.category.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center mb-3">
                                            {/* Manufacturer Logo */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={
                                                        vehicle.manufacturer
                                                            .imgPath
                                                    }
                                                    alt={
                                                        vehicle.manufacturer
                                                            .name
                                                    }
                                                    className="h-12 w-12 object-contain p-1"
                                                />
                                            </div>
                                            {/* Vertical divider */}
                                            <div className="hidden md:block w-px h-12 border border-tertiaryContainer mx-3" />
                                            {/* Manufacturer Name and Vehicle Name */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-onSurface/70 truncate">
                                                    {vehicle.manufacturer.name}
                                                </p>
                                                <h3 className="text-lg font-bold text-onSurface truncate">
                                                    {vehicle.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Conditions Card */}
                            <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                                <h3 className="text-lg font-bold text-onSurface mb-4 flex items-center">
                                    <FiSettings className="mr-2 text-primary" />
                                    Conditions
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
                                            <FiCalendar className="text-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-onSurface/70">
                                                Season
                                            </p>
                                            <p className="text-onSurface font-medium capitalize">
                                                {
                                                    SEASONS_MAP[
                                                        season as keyof typeof SEASONS_MAP
                                                    ].text
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-tertiary/10 rounded-full flex items-center justify-center mr-3">
                                            <FiCloud className="text-tertiary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-onSurface/70">
                                                Surface
                                            </p>
                                            <p className="text-onSurface font-medium capitalize">
                                                {
                                                    SURFACE_CONDITIONS_MAP[
                                                        surface_condition as keyof typeof SURFACE_CONDITIONS_MAP
                                                    ].text
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                            <GiCarWheel className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-onSurface/70">
                                                Tyres
                                            </p>
                                            <p className="text-onSurface font-medium capitalize">
                                                {
                                                    TYRES_MAP[
                                                        tyres as keyof typeof TYRES_MAP
                                                    ].text
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Configuration Section */}
                        <div className="lg:col-span-3">
                            {/* Configuration Tabs */}
                            <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden mb-6">
                                <nav className="flex overflow-x-auto">
                                    {configurationTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-6 py-4 font-medium text-sm flex items-center whitespace-nowrap transition-colors duration-200 ${
                                                activeTab === tab.id
                                                    ? "bg-primary text-surfaceContainer"
                                                    : "text-onSurface hover:bg-surfaceContainerHigh"
                                            }`}
                                        >
                                            <span className="text-lg mr-3">
                                                {tab.icon}
                                            </span>
                                            <span>{tab.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {isProcessingBlueprint && !blueprint ? (
                                <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                                    <div className="animate-pulse space-y-6">
                                        <div className="h-8 bg-surfaceContainerHigh rounded w-1/3 mb-6"></div>
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="space-y-4">
                                                <div className="h-6 bg-surfaceContainerHigh rounded w-1/2"></div>
                                                <div className="h-2 bg-surfaceContainerHigh rounded-full"></div>
                                                <div className="flex justify-between">
                                                    <div className="h-4 bg-surfaceContainerHigh rounded w-1/4"></div>
                                                    <div className="h-4 bg-surfaceContainerHigh rounded w-1/4"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : blueprint ? (
                                renderConfigurationSection(activeTab)
                            ) : (
                                <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh text-center">
                                    <p className="text-onSurface mb-4">
                                        Failed to load configuration options.
                                    </p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-6 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200"
                                    >
                                        Reload Page
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
