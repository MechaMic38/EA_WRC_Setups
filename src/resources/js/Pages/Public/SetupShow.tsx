import { Head, Link } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import {
    FiChevronLeft,
    FiUser,
    FiCalendar,
    FiSettings,
    FiCopy,
    FiDownload,
    FiInfo,
    FiCloud,
} from "react-icons/fi";
import { Setup, SetupBlueprint, SetupSection } from "@/types";
import ConfigurationSection from "@/Components/Setup/ConfigurationSection";
import { SEASONS_MAP, SURFACE_CONDITIONS_MAP, TYRES_MAP } from "@/constants";
import { GiCarWheel } from "react-icons/gi";
import VehicleCard from "@/Components/Cards/VehicleCard";
import LocationCard from "@/Components/Cards/LocationCard";

export default function SetupShow({ setup: initialSetup }: { setup: Setup }) {
    const { get: getSetupBlueprint, isProcessing } =
        useAxiosForm<SetupBlueprint>([]);

    const [setup, setSetup] = useState<Setup>(initialSetup);
    const [setupBlueprint, setSetupBlueprint] = useState<SetupBlueprint | null>(
        null
    );
    const [activeTab, setActiveTab] = useState<SetupSection>("alignment");

    useEffect(() => {
        // Fetch setup options if not already loaded
        if (!setupBlueprint) {
            getSetupBlueprint(
                route("api.vehicles.blueprint.show", {
                    vehicle: setup?.vehicle.id,
                }),
                {
                    onSuccess: (response) => {
                        setSetupBlueprint(response.data);
                    },
                }
            );
        }
    }, []);

    if (!setupBlueprint) {
        return (
            <UserLayout>
                <Head title="Loading Setup..." />
                <div className="py-12 text-center text-onSurface">
                    Loading setup details...
                </div>
            </UserLayout>
        );
    }

    const renderConfigurationSection = (section: SetupSection) => {
        if (!setup.configuration || !setup.configuration[section]) return null;

        // Convert setup options from string to numeric
        const options = Object.fromEntries(
            Object.entries(setup.configuration[section]).map(([key, value]) => [
                key,
                typeof value === "string" ? Number(value) : value,
            ])
        );

        return (
            <ConfigurationSection
                section={section}
                options={options}
                blueprintOptions={setupBlueprint[section]}
                disabled
            />
        );
    };

    const configurationTabs: {
        id: SetupSection;
        icon: JSX.Element;
        label: string;
    }[] = [
        { id: "alignment", icon: <FiSettings />, label: "Alignment" },
        { id: "braking", icon: <FiSettings />, label: "Braking" },
        { id: "differentials", icon: <FiSettings />, label: "Differentials" },
        { id: "gears", icon: <FiSettings />, label: "Gears" },
        { id: "damping", icon: <FiSettings />, label: "Damping" },
        { id: "springs", icon: <FiSettings />, label: "Springs" },
    ];

    return (
        <UserLayout>
            <Head
                title={`${setup.vehicle.name} Setup - ${setup.location.name}`}
            />

            {/* Setup Header */}
            <div className="bg-surfaceContainer py-8 border-b border-surfaceContainerHigh">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <Link
                                href={route("vehicles.show", setup.vehicle.id)}
                                className="inline-flex items-center text-primary hover:text-primary-600 mb-4 transition-colors duration-200"
                            >
                                <FiChevronLeft className="mr-2" /> Back to
                                Vehicle
                            </Link>
                            <h1 className="text-3xl font-bold text-onSurface mb-2">
                                {setup.vehicle.name} Setup
                            </h1>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-surface text-primary border border-primary rounded-xl hover:bg-surfaceContainer transition-colors duration-200 flex items-center font-medium">
                                <FiCopy className="mr-2" /> Copy Setup
                            </button>
                            <button className="px-6 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 flex items-center font-medium">
                                <FiDownload className="mr-2" /> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-8 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Left Sidebar - Setup Details */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Creator and Date Card */}
                            <div className="bg-surfaceContainer rounded-xl p-6 border border-surfaceContainerHigh">
                                <h3 className="text-lg font-bold text-onSurface mb-4 flex items-center">
                                    <FiInfo className="mr-2 text-primary" />
                                    Setup Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                            <FiUser className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-onSurface/70">
                                                Creator
                                            </p>
                                            <p className="text-onSurface font-medium">
                                                {setup.user.username}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                            <FiCalendar className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-onSurface/70">
                                                Created
                                            </p>
                                            <p className="text-onSurface font-medium">
                                                {new Date(
                                                    setup.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle and Location Cards */}
                            {setup.vehicle && (
                                <VehicleCard
                                    vehicle={setup.vehicle}
                                    mode="display"
                                />
                            )}

                            {setup.location && (
                                <LocationCard
                                    location={setup.location}
                                    mode="display"
                                />
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
                                                        setup.season as keyof typeof SEASONS_MAP
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
                                                        setup.surfaceCondition as keyof typeof SURFACE_CONDITIONS_MAP
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
                                                        setup.tyres as keyof typeof TYRES_MAP
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

                            {renderConfigurationSection(activeTab)}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
