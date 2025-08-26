import { Head, Link, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiSave, FiSliders, FiX } from "react-icons/fi";
import {
    LocationSummary,
    SetupBlueprint,
    SetupConfigsNumeric,
    SetupSection,
    Vehicle,
} from "@/types";
import ConfigurationSection from "@/Components/Setup/ConfigurationSection";
import SuccessModal from "@/Components/Modals/SuccessModal";
import VehicleCard from "@/Components/Cards/VehicleCard";
import LocationCard from "@/Components/Cards/LocationCard";
import ConditionsCard from "@/Components/Cards/ConditionsCard";
import Configurationtabs from "@/Components/Setup/Configurationtabs";
import { CONFIGURATION_TABS } from "@/constants";

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

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdSetupId, setCreatedSetupId] = useState<string | null>(null);

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
                setCreatedSetupId(response.data.id);
                setShowSuccessModal(true);

                // Auto-redirect after 3 seconds
                setTimeout(() => {
                    router.visit(route("setups.show", response.data.id));
                }, 3000);
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
                                <LocationCard
                                    location={location}
                                    mode="display"
                                />
                            )}

                            {/* Vehicle Card */}
                            {vehicle && (
                                <VehicleCard vehicle={vehicle} mode="display" />
                            )}

                            {/* Conditions Card */}
                            <ConditionsCard
                                season={season}
                                surfaceCondition={surface_condition}
                                tyres={tyres}
                            />
                        </div>

                        {/* Configuration Section */}
                        <div className="lg:col-span-3">
                            <Configurationtabs
                                tabs={CONFIGURATION_TABS}
                                activeTab={activeTab}
                                onChangeTab={setActiveTab}
                            />

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

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                title="Setup Created Successfully!"
                message="Your setup has been saved and is now available. Redirecting to your setup page..."
                redirectUrl={
                    createdSetupId
                        ? route("setups.show", createdSetupId)
                        : undefined
                }
                redirectMessage="View Setup Now"
                onRedirect={() => setShowSuccessModal(false)}
                duration={3000}
            />
        </UserLayout>
    );
}
