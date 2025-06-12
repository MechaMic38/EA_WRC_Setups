import { Head, Link, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiSave,
    FiSliders,
    FiInfo,
    FiX,
    FiCheck,
} from "react-icons/fi";
import { SetupBlueprint, SetupConfigsNumeric, SetupSection } from "@/types";

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

    const [blueprint, setBlueprint] = useState<SetupBlueprint | null>(null);
    const [activeTab, setActiveTab] = useState<SetupSection>("alignment");
    const [config, setConfig] = useState<SetupConfigsNumeric>({
        alignment: {},
        braking: {},
        differentials: {},
        gears: {},
        damping: {},
        springs: {},
    });
    const [showDescription, setShowDescription] = useState<string | null>(null);

    // Fetch vehicle blueprint
    useEffect(() => {
        getBlueprint(route("api.vehicles.blueprint.show", vehicle_id), {
            onSuccess: (response) => {
                setBlueprint(response.data);
                initializeConfig(response.data);
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

        setConfig(initialConfig);
    };

    // Handle slider change
    const handleSliderChange = (
        section: SetupSection,
        setting: string,
        value: string
    ) => {
        setConfig((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [setting]: parseFloat(value),
            },
        }));
    };

    // Submit the setup
    const submitSetup = () => {
        const setupData = {
            surface_condition,
            season,
            tyres,
            location_id,
            vehicle_id,
            configuration: config,
        };

        postConfiguration(route("api.setups.store"), {
            onSuccess: (response) => {
                // Redirect to setup show page or dashboard
                router.visit(route("setups.show", response.data.id));
            },
        });
    };

    // Render slider for a configuration option
    const renderSlider = (
        section: SetupSection,
        setting: string,
        option: any
    ) => {
        const value = config[section]?.[setting] || option.default_value;

        return (
            <div key={setting} className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                        <h3 className="font-medium text-onSurface mr-2">
                            {option.label}
                        </h3>
                        <button
                            onClick={() =>
                                setShowDescription(
                                    showDescription === setting ? null : setting
                                )
                            }
                            className="text-primary hover:text-primary-600"
                        >
                            <FiInfo size={16} />
                        </button>
                    </div>
                    <span className="bg-surfaceContainer px-3 py-1 rounded-full text-onSurface">
                        {value.toFixed(option.precision)}
                        {option.unit}
                    </span>
                </div>

                {showDescription === setting && (
                    <div className="bg-surfaceContainer/50 p-3 rounded-lg mb-3 text-sm text-onSurface">
                        {option.description}
                    </div>
                )}

                <div className="relative">
                    <input
                        type="range"
                        min={option.min_value}
                        max={option.max_value}
                        step={
                            (option.max_value - option.min_value) /
                            (option.steps - 1)
                        }
                        value={value}
                        onChange={(e) =>
                            handleSliderChange(section, setting, e.target.value)
                        }
                        className="w-full h-2 bg-surfaceContainer rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #CFBDFE 0%, #CFBDFE ${
                                ((value - option.min_value) /
                                    (option.max_value - option.min_value)) *
                                100
                            }%, #3A3643 ${
                                ((value - option.min_value) /
                                    (option.max_value - option.min_value)) *
                                100
                            }%, #3A3643 100%)`,
                        }}
                    />
                    <div className="flex justify-between text-xs text-onSurface/70 mt-1">
                        <span>
                            {option.min_value}
                            {option.unit}
                        </span>
                        <span>
                            {option.max_value}
                            {option.unit}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // Render configuration section
    const renderConfigurationSection = (section: SetupSection) => {
        if (!blueprint || !blueprint[section]) return null;

        return (
            <div className="bg-surfaceContainer rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-onSurface capitalize">
                        {section.replace("_", " ")}
                    </h3>
                    <button
                        onClick={() => {
                            // Reset to default values
                            const sectionDefaults: any = {};
                            Object.keys(blueprint[section]).forEach(
                                (setting) => {
                                    sectionDefaults[setting] =
                                        blueprint[section][
                                            setting
                                        ].default_value;
                                }
                            );

                            setConfig((prev: any) => ({
                                ...prev,
                                [section]: sectionDefaults,
                            }));
                        }}
                        className="text-sm text-primary hover:text-primary-600"
                    >
                        Reset to Default
                    </button>
                </div>

                {Object.entries(blueprint[section]).map(([setting, option]) =>
                    renderSlider(section, setting, option)
                )}
            </div>
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
            <div className="bg-surfaceContainer py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <Link
                                href={route("setups.create.options", {
                                    location_id,
                                    vehicle_id,
                                })}
                                className="inline-flex items-center text-primary hover:text-primary-600 mb-2"
                            >
                                <FiChevronLeft className="mr-1" /> Back to
                                Options
                            </Link>
                            <h1 className="text-2xl font-bold text-onSurface">
                                Configure Your Setup
                            </h1>
                            <p className="text-onSurface">
                                {surface_condition} • {season} • {tyres}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    // Reset all to default
                                    initializeConfig(blueprint!!);
                                }}
                                className="px-4 py-2 bg-surface text-primary border border-primary rounded-md hover:bg-surfaceContainer flex items-center"
                            >
                                <FiX className="mr-2" /> Reset All
                            </button>
                            <button
                                onClick={submitSetup}
                                disabled={isProcessingBlueprint}
                                className={`px-4 py-2 flex items-center ${
                                    isProcessingBlueprint
                                        ? "bg-surfaceContainer text-onSurface/50"
                                        : "bg-primary text-surfaceContainer hover:bg-primary-600"
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
                        {/* Configuration Tabs */}
                        <div className="lg:col-span-1">
                            <div className="bg-surfaceContainer rounded-lg overflow-hidden mb-6">
                                <nav className="flex flex-col">
                                    {configurationTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-3 font-medium text-sm flex items-center ${
                                                activeTab === tab.id
                                                    ? "bg-primary text-surfaceContainer"
                                                    : "text-onSurface hover:bg-surfaceContainer/50"
                                            }`}
                                        >
                                            {tab.icon}
                                            <span className="ml-2">
                                                {tab.label}
                                            </span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Setup Summary */}
                            <div className="bg-surfaceContainer rounded-lg p-6">
                                <h3 className="text-lg font-bold text-onSurface mb-4">
                                    Setup Summary
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-onSurface/70">
                                            Location
                                        </p>
                                        <p className="text-onSurface">
                                            ID: {location_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-onSurface/70">
                                            Vehicle
                                        </p>
                                        <p className="text-onSurface">
                                            ID: {vehicle_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-onSurface/70">
                                            Conditions
                                        </p>
                                        <p className="text-onSurface capitalize">
                                            {surface_condition} • {season} •{" "}
                                            {tyres}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Configuration Section */}
                        <div className="lg:col-span-3">
                            {isProcessingBlueprint && !blueprint ? (
                                <div className="bg-surfaceContainer rounded-lg p-6">
                                    <div className="animate-pulse space-y-6">
                                        <div className="h-8 bg-surfaceContainer/50 rounded w-1/3 mb-6"></div>
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="space-y-4">
                                                <div className="h-6 bg-surfaceContainer/50 rounded w-1/2"></div>
                                                <div className="h-2 bg-surfaceContainer/50 rounded-full"></div>
                                                <div className="flex justify-between">
                                                    <div className="h-4 bg-surfaceContainer/50 rounded w-1/4"></div>
                                                    <div className="h-4 bg-surfaceContainer/50 rounded w-1/4"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : blueprint ? (
                                <>
                                    <div className="bg-surfaceContainer rounded-lg overflow-hidden mb-6">
                                        <nav className="flex overflow-x-auto">
                                            {configurationTabs.map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() =>
                                                        setActiveTab(tab.id)
                                                    }
                                                    className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
                                                        activeTab === tab.id
                                                            ? "bg-primary text-surfaceContainer"
                                                            : "text-onSurface hover:bg-surfaceContainer/50"
                                                    }`}
                                                >
                                                    {tab.icon}
                                                    <span className="ml-2">
                                                        {tab.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </nav>
                                    </div>

                                    {renderConfigurationSection(activeTab)}
                                </>
                            ) : (
                                <div className="bg-surfaceContainer rounded-lg p-6 text-center">
                                    <p className="text-onSurface">
                                        Failed to load configuration options.
                                        Please try again.
                                    </p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="mt-4 px-4 py-2 bg-primary text-surfaceContainer rounded-md"
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
