import { Head, Link } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import {
    FiChevronLeft,
    FiUser,
    FiCalendar,
    FiDroplet,
    FiSettings,
    FiMapPin,
    FiTruck,
    FiCopy,
    FiDownload,
} from "react-icons/fi";
import { Setup, SetupOptions } from "@/types";

type SetupSection =
    | "alignment"
    | "braking"
    | "differentials"
    | "gears"
    | "damping"
    | "springs";

export default function SetupShow({ setup: initialSetup }: { setup: Setup }) {
    const { get: getSetup, isProcessing: isProcessingSetup } =
        useAxiosForm<Setup>(initialSetup);
    const { get: getSetupOptions, isProcessing: isProcessingSetupOptions } =
        useAxiosForm<SetupOptions>([]);
    const [setup, setSetup] = useState<Setup | null>(initialSetup);
    const [setupOptions, setSetupOptions] = useState<SetupOptions | null>(null);
    const [activeTab, setActiveTab] = useState<SetupSection>("alignment");

    useEffect(() => {
        // Fetch setup options if not already loaded
        if (!setupOptions) {
            getSetupOptions(route("api.setup-options.index"), {
                onSuccess: (response) => {
                    setSetupOptions(response.data);
                },
            });
        }
    }, []);

    if (!setup || !setupOptions) {
        return (
            <UserLayout>
                <Head title="Loading Setup..." />
                <div className="py-12 text-center text-onSurface">
                    Loading setup details...
                </div>
            </UserLayout>
        );
    }

    const renderSlider = (
        section: SetupSection,
        key: string,
        value: string
    ) => {
        const option = setupOptions[section]?.[key];
        if (!option) return null;

        const numericValue = parseFloat(value);
        const percentage =
            ((numericValue - option.min_value) /
                (option.max_value - option.min_value)) *
            100;

        return (
            <div key={key} className="mb-6">
                <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-onSurface">
                        {option.label}
                    </label>
                    <span className="text-onSurface">
                        {numericValue.toFixed(option.precision)}
                        {option.unit}
                    </span>
                </div>
                <div className="relative h-2 bg-surfaceContainer rounded-full">
                    <div
                        className="absolute h-2 bg-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
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
                {option.description && (
                    <p className="text-sm text-onSurface/70 mt-2">
                        {option.description}
                    </p>
                )}
            </div>
        );
    };

    const renderConfigurationSection = (section: SetupSection) => {
        if (!setup.configuration || !setup.configuration[section]) return null;

        return (
            <div className="bg-surfaceContainer rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-onSurface mb-4 capitalize">
                    {section.replace("_", " ")}
                </h3>
                {Object.entries(setup.configuration[section]).map(
                    ([key, value]) =>
                        renderSlider(section, key, value as string)
                )}
            </div>
        );
    };

    const configurationTabs = [
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
            <div className="bg-surfaceContainer py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <Link
                                href={route("vehicles.show", setup.vehicle.id)}
                                className="inline-flex items-center text-primary hover:text-primary-600 mb-2"
                            >
                                <FiChevronLeft className="mr-1" /> Back to
                                vehicle
                            </Link>
                            <h1 className="text-2xl font-bold text-onSurface">
                                {setup.vehicle.name} Setup
                            </h1>
                            <p className="text-onSurface">
                                {setup.location.name} • {setup.surfaceCondition}{" "}
                                • {setup.season}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-surface text-primary border border-primary rounded-md hover:bg-surfaceContainer flex items-center">
                                <FiCopy className="mr-2" /> Copy Setup
                            </button>
                            <button className="px-4 py-2 bg-primary text-surfaceContainer rounded-md hover:bg-primary-600 flex items-center">
                                <FiDownload className="mr-2" /> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-8 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Setup Meta */}
                        <div className="lg:col-span-1">
                            <div className="bg-surfaceContainer rounded-lg p-6 mb-6">
                                <h3 className="text-xl font-bold text-onSurface mb-4">
                                    Setup Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <FiUser className="text-primary mr-3" />
                                        <div>
                                            <p className="text-sm text-onSurface/70">
                                                Creator
                                            </p>
                                            <p className="text-onSurface">
                                                {setup.user.username}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FiCalendar className="text-primary mr-3" />
                                        <div>
                                            <p className="text-sm text-onSurface/70">
                                                Created
                                            </p>
                                            <p className="text-onSurface">
                                                {new Date(
                                                    setup.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FiDroplet className="text-primary mr-3" />
                                        <div>
                                            <p className="text-sm text-onSurface/70">
                                                Surface
                                            </p>
                                            <p className="text-onSurface capitalize">
                                                {setup.surfaceCondition}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FiSettings className="text-primary mr-3" />
                                        <div>
                                            <p className="text-sm text-onSurface/70">
                                                Tires
                                            </p>
                                            <p className="text-onSurface capitalize">
                                                {setup.tyres}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surfaceContainer rounded-lg p-6">
                                <h3 className="text-xl font-bold text-onSurface mb-4">
                                    Vehicle & Location
                                </h3>
                                <div className="flex items-center mb-4">
                                    <FiTruck className="text-primary mr-3" />
                                    <div>
                                        <p className="text-sm text-onSurface/70">
                                            Vehicle
                                        </p>
                                        <p className="text-onSurface">
                                            {setup.vehicle.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FiMapPin className="text-primary mr-3" />
                                    <div>
                                        <p className="text-sm text-onSurface/70">
                                            Location
                                        </p>
                                        <p className="text-onSurface">
                                            {setup.location.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Configuration */}
                        <div className="lg:col-span-2">
                            <div className="bg-surfaceContainer rounded-lg overflow-hidden mb-6">
                                <nav className="flex overflow-x-auto">
                                    {configurationTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
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
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
