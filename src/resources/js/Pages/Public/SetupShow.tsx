import { Head, Link, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import {
    FiChevronLeft,
    FiUser,
    FiCalendar,
    FiDownload,
    FiInfo,
    FiEdit,
    FiTrash2,
} from "react-icons/fi";
import { Setup, SetupBlueprint, SetupSection } from "@/types";
import ConfigurationSection from "@/Components/Setup/ConfigurationSection";
import VehicleCard from "@/Components/Cards/VehicleCard";
import LocationCard from "@/Components/Cards/LocationCard";
import ConditionsCard from "@/Components/Cards/ConditionsCard";
import SetupDeleteModal from "@/Components/Modals/Setup/SetupDeleteModal";
import SuccessModal from "@/Components/Modals/SuccessModal";
import Configurationtabs from "@/Components/Setup/Configurationtabs";
import { CONFIGURATION_TABS } from "@/constants";

export default function SetupShow({ setup: initialSetup }: { setup: Setup }) {
    const { get: getSetupBlueprint, isProcessing } =
        useAxiosForm<SetupBlueprint>([]);

    const [setup, setSetup] = useState<Setup>(initialSetup);
    const [setupBlueprint, setSetupBlueprint] = useState<SetupBlueprint | null>(
        null
    );

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
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

    const onDeleteSetup = () => {
        setIsDeleteOpen(true);
    };

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
                            {setup.permissions.delete && (
                                <button
                                    onClick={onDeleteSetup}
                                    className="px-6 py-3 bg-surface text-error border border-error rounded-xl hover:bg-errorContainer/10 transition-colors duration-200 flex items-center font-medium"
                                >
                                    <FiTrash2 className="mr-2" /> Delete Setup
                                </button>
                            )}
                            {setup.permissions.update && (
                                <Link
                                    href={route(
                                        "setups.edit.configuration",
                                        setup.id
                                    )}
                                    className="px-6 py-3 bg-surface text-primary border border-primary rounded-xl hover:bg-surfaceContainer transition-colors duration-200 flex items-center font-medium"
                                >
                                    <FiEdit className="mr-2" /> Edit Setup
                                </Link>
                            )}
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
                            <ConditionsCard
                                season={setup.season}
                                surfaceCondition={setup.surfaceCondition}
                                tyres={setup.tyres}
                            />
                        </div>

                        {/* Configuration Section */}
                        <div className="lg:col-span-3">
                            <Configurationtabs
                                tabs={CONFIGURATION_TABS}
                                activeTab={activeTab}
                                onChangeTab={setActiveTab}
                            />

                            {renderConfigurationSection(activeTab)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Setup Modal */}
            <SetupDeleteModal
                isOpen={isDeleteOpen}
                setup={setup}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={() => {
                    setIsDeleteOpen(false);
                    setShowSuccessModal(true);

                    // Auto-redirect after 3 seconds
                    setTimeout(() => {
                        router.visit(route("profile.setups.index"));
                    }, 3000);
                }}
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                title="Setup Deleted Successfully!"
                message="Your setup has been deleted and is no longer available. Redirecting to your setup page..."
                redirectUrl={route("profile.setups.index")}
                redirectMessage="Go back to setups"
                onRedirect={() => setShowSuccessModal(false)}
                duration={3000}
            />
        </UserLayout>
    );
}
