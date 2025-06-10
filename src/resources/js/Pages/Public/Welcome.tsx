import { Head, Link } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {
    FiDownload,
    FiUpload,
    FiAward,
    FiFilter,
    FiUsers,
    FiClock,
} from "react-icons/fi";

export default function Welcome() {
    return (
        <UserLayout>
            <Head title="EA Sports WRC - Ultimate Setup Hub" />

            {/* Hero Section */}
            <div className="relative bg-surfaceContainer">
                <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        Master Every Stage
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-onSurface">
                        Find & share{" "}
                        <span className="text-primary">
                            precision-tuned setups
                        </span>{" "}
                        for all EA Sports WRC cars and locations.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Link
                            href={route("setups.index")}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-surfaceContainer bg-primary hover:bg-primary-600"
                        >
                            <FiDownload className="mr-2" /> Browse Setups
                        </Link>
                        <Link
                            href={route("register")}
                            className="inline-flex items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-surface hover:bg-surfaceContainer"
                        >
                            <FiUpload className="mr-2" /> Share Your Setup
                        </Link>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-16 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-onSurface">
                            Optimize Your Performance
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl mx-auto text-onSurface">
                            Filter setups by{" "}
                            <span className="text-primary">
                                car, location, and conditions
                            </span>{" "}
                            to find the perfect match.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <FiFilter className="h-8 w-8 text-primary" />
                                ),
                                title: "Smart Filters",
                                desc: "Search by vehicle, location, surface type, and weather.",
                            },
                            {
                                icon: (
                                    <FiClock className="h-8 w-8 text-primary" />
                                ),
                                title: "Real-Time Updates",
                                desc: "Fresh setups added daily for the latest patches.",
                            },
                            {
                                icon: (
                                    <FiAward className="h-8 w-8 text-primary" />
                                ),
                                title: "Community Rated",
                                desc: "Top-voted setups highlighted for each stage.",
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-surfaceContainer p-6 rounded-lg text-center"
                            >
                                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-surface mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-medium text-onSurface">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-onSurface">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Setup Showcase */}
            <div className="py-16 bg-surfaceContainer">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-center mb-12 text-onSurface">
                        Popular This Week
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                car: "Toyota GR Yaris Rally1",
                                location: "Monte Carlo",
                                conditions: "Dry Tarmac",
                                user: "RallyPro92",
                            },
                            {
                                car: "Hyundai i20 N Rally1",
                                location: "Sweden",
                                conditions: "Snowy",
                                user: "IceDrifter",
                            },
                            {
                                car: "Ford Puma Rally1",
                                location: "Kenya",
                                conditions: "Rough Gravel",
                                user: "SafariMaster",
                            },
                        ].map((setup, index) => (
                            <div
                                key={index}
                                className="bg-surface p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="aspect-video bg-surfaceContainer rounded-md mb-4 flex items-center justify-center text-onSurface">
                                    <span className="text-lg font-medium">
                                        {setup.car.split(" ")[0]}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-1 text-onSurface">
                                    {setup.car}
                                </h3>
                                <p className="text-sm mb-2 text-onSurface">
                                    <span className="font-medium">
                                        {setup.location}
                                    </span>{" "}
                                    • {setup.conditions}
                                </p>
                                <p className="text-sm text-onSurface/70">
                                    By {setup.user}
                                </p>
                                <Link
                                    href="#"
                                    className="mt-4 inline-flex items-center text-primary hover:text-primary-600 text-sm"
                                >
                                    View Setup Details →
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <Link
                            href={route("setups.index")}
                            className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-surfaceContainer bg-primary hover:bg-primary-600"
                        >
                            Explore All Setups
                        </Link>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
