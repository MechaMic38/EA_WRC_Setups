import { Head, Link } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import {
    FiChevronRight,
    FiClock,
    FiUser,
    FiSettings,
    FiCalendar,
    FiDroplet,
} from "react-icons/fi";
import { LocationSummary, PaginatedData, Setup } from "@/types";

export default function LocationShow({
    location,
}: {
    location: LocationSummary;
}) {
    const { get, isProcessing } = useAxiosForm<PaginatedData<Setup>>([]);
    const [setupsData, setSetupsData] = useState<PaginatedData<Setup>>({
        data: [],
        links: {},
        meta: {
            current_page: 1,
            from: 0,
            last_page: 1,
            links: [],
            path: "",
            per_page: 15,
            to: 0,
            total: 0,
        },
    });
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        console.log("Location:", location);
        get(route("api.setups.index", { location_id: location.id }), {
            onSuccess: (response) => {
                setSetupsData(response.data);
            },
        });
    }, [location.id]);

    const filteredSetups = setupsData.data.filter((setup) => {
        if (activeTab === "all") return true;
        return setup.surfaceCondition === activeTab;
    });

    const surfaceConditions = [
        { id: "all", name: "All Conditions" },
        { id: "dry", name: "Dry" },
        { id: "wet", name: "Wet" },
        { id: "mixed", name: "Mixed" },
    ];

    return (
        <UserLayout>
            <Head title={`${location.name} Setups`} />

            {/* Location Hero Banner */}
            <div className="relative h-64 w-full overflow-hidden">
                <img
                    src={location.imgBgPath}
                    alt={location.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surfaceContainer to-transparent" />
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-onSurface">
                                    {location.name}
                                </h1>
                                <p className="text-onSurface mt-2">
                                    {location.description}
                                </p>
                                <div className="mt-4 flex items-center text-onSurface">
                                    <span className="px-3 py-1 bg-surfaceContainer rounded-full text-sm">
                                        {location.surfaceType}
                                    </span>
                                </div>
                            </div>
                            <img
                                src={location.imgBannerPath}
                                alt={location.name}
                                className="h-24 object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-surface py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Surface Condition Tabs */}
                    <div className="mb-8 border-b border-surfaceContainer">
                        <nav className="-mb-px flex space-x-8">
                            {surfaceConditions.map((condition) => (
                                <button
                                    key={condition.id}
                                    onClick={() => setActiveTab(condition.id)}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === condition.id
                                            ? "border-primary text-primary"
                                            : "border-transparent text-onSurface hover:text-primary"
                                    }`}
                                >
                                    {condition.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Setups Grid */}
                    {isProcessing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-surfaceContainer rounded-lg p-4 animate-pulse"
                                >
                                    <div className="h-40 bg-surfaceContainer/50 rounded mb-4"></div>
                                    <div className="h-4 w-3/4 bg-surfaceContainer/50 rounded mb-2"></div>
                                    <div className="h-4 w-1/2 bg-surfaceContainer/50 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredSetups.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl text-onSurface">
                                No setups found for {location.name}{" "}
                                {activeTab !== "all" &&
                                    `with ${activeTab} conditions`}
                            </p>
                            <Link
                                href={route("setups.index")}
                                className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-surfaceContainer rounded-md hover:bg-primary-600"
                            >
                                Be the first to share a setup
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSetups.map((setup) => (
                                <div
                                    key={setup.id}
                                    className="bg-surfaceContainer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                                >
                                    {/* Vehicle Image */}
                                    <div className="relative h-40 w-full">
                                        <img
                                            src={setup.vehicle.imgPath}
                                            alt={setup.vehicle.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 left-2 bg-surfaceContainer/90 text-onSurface px-2 py-1 rounded text-xs">
                                            {setup.vehicle.name}
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-surfaceContainer/90 text-onSurface px-2 py-1 rounded text-xs">
                                            {setup.surfaceCondition}
                                        </div>
                                    </div>

                                    {/* Setup Details */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${setup.user.username}&background=CFBDFE&color=211F24`}
                                                    alt={setup.user.username}
                                                    className="h-8 w-8 rounded-full mr-2"
                                                />
                                                <span className="text-sm font-medium text-onSurface">
                                                    {setup.user.username}
                                                </span>
                                            </div>
                                            <span className="text-xs text-onSurface/70">
                                                {new Date(
                                                    setup.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                            <div className="flex items-center text-onSurface">
                                                <FiDroplet className="mr-1 text-primary" />
                                                {setup.surfaceCondition}
                                            </div>
                                            <div className="flex items-center text-onSurface">
                                                <FiCalendar className="mr-1 text-primary" />
                                                {setup.season}
                                            </div>
                                            <div className="flex items-center text-onSurface">
                                                <FiSettings className="mr-1 text-primary" />
                                                {setup.tyres}
                                            </div>
                                        </div>

                                        <Link
                                            href={route(
                                                "setups.show",
                                                setup.id
                                            )}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-surface text-primary border border-primary rounded-md hover:bg-surfaceContainer"
                                        >
                                            View Setup Details{" "}
                                            <FiChevronRight className="ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
