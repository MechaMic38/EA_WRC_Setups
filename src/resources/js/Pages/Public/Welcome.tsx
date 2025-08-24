import { Head, Link } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {
    FiSearch,
    FiMapPin,
    FiUploadCloud,
    FiFilter,
    FiClock,
    FiAward,
    FiUsers,
    FiShare2,
} from "react-icons/fi";
import { LiaCarSideSolid } from "react-icons/lia";

export default function Welcome() {
    return (
        <UserLayout>
            <Head title="EA Sports WRC - Ultimate Setup Hub" />

            {/* Hero Section */}
            <div className="relative bg-surfaceContainer py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-onSurface mb-6">
                        Master Every Stage
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-onSurface/70">
                        Find and share{" "}
                        <span className="text-primary font-medium">
                            precision-tuned setups
                        </span>{" "}
                        for all EA Sports WRC cars and locations
                    </p>

                    {/* Action Cards Grid */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Search by Vehicle Card */}
                        <div className="bg-surface rounded-xl p-8 border border-surfaceContainerHigh hover:shadow-lg transition-all duration-300 group">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <LiaCarSideSolid className="text-primary text-2xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-onSurface mb-4">
                                Search by Vehicle
                            </h3>
                            <p className="text-onSurface/70 mb-6">
                                Find optimal setups for your favorite rally car
                                across all locations and conditions
                            </p>
                            <Link
                                href={route("vehicles.index")}
                                className="inline-flex items-center px-6 py-3 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium group-hover:shadow-lg"
                            >
                                <FiSearch className="mr-2" />
                                Browse Vehicles
                            </Link>
                        </div>

                        {/* Search by Location Card */}
                        <div className="bg-surface rounded-xl p-8 border border-surfaceContainerHigh hover:shadow-lg transition-all duration-300 group">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FiMapPin className="text-secondary text-2xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-onSurface mb-4">
                                Search by Location
                            </h3>
                            <p className="text-onSurface/70 mb-6">
                                Discover the best setups for specific rally
                                stages and surface conditions
                            </p>
                            <Link
                                href={route("locations.index")}
                                className="inline-flex items-center px-6 py-3 bg-secondary text-onSecondary rounded-xl hover:bg-secondary-600 transition-colors duration-200 font-medium group-hover:shadow-lg"
                            >
                                <FiMapPin className="mr-2" />
                                Explore Locations
                            </Link>
                        </div>

                        {/* Share Setup Card */}
                        <div className="bg-surface rounded-xl p-8 border border-surfaceContainerHigh hover:shadow-lg transition-all duration-300 group">
                            <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FiShare2 className="text-tertiary text-2xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-onSurface mb-4">
                                Share Your Setup
                            </h3>
                            <p className="text-onSurface/70 mb-6">
                                Contribute to the community by sharing your
                                winning configurations and tuning expertise
                            </p>
                            <Link
                                href={route("setups.create.location")}
                                className="inline-flex items-center px-6 py-3 bg-tertiary text-onTertiary rounded-xl hover:bg-tertiary-600 transition-colors duration-200 font-medium group-hover:shadow-lg"
                            >
                                <FiUploadCloud className="mr-2" />
                                Share Setup
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-onSurface mb-4">
                            Why Choose Our Setup Hub?
                        </h2>
                        <p className="text-xl text-onSurface/70 max-w-3xl mx-auto">
                            The most comprehensive collection of EA Sports WRC
                            setups, curated and tested by the community
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <FiFilter className="h-8 w-8 text-primary" />
                                ),
                                title: "Advanced Filtering",
                                desc: "Find exactly what you need with filters for vehicle type, location, surface conditions, weather, and more",
                            },
                            {
                                icon: (
                                    <FiClock className="h-8 w-8 text-secondary" />
                                ),
                                title: "Always Updated",
                                desc: "Fresh setups added daily, keeping pace with game updates and meta changes",
                            },
                            {
                                icon: (
                                    <FiUsers className="h-8 w-8 text-tertiary" />
                                ),
                                title: "Community Driven",
                                desc: "Learn from experienced players and share your own expertise with fellow enthusiasts",
                            },
                            {
                                icon: (
                                    <FiAward className="h-8 w-8 text-primary" />
                                ),
                                title: "Quality Rated (not yet)",
                                desc: "Community ratings help you identify the most effective and reliable setups",
                            },
                            {
                                icon: (
                                    <FiSearch className="h-8 w-8 text-secondary" />
                                ),
                                title: "Easy Discovery",
                                desc: "Intuitive search and categorization make finding the perfect setup effortless",
                            },
                            {
                                icon: (
                                    <FiShare2 className="h-8 w-8 text-tertiary" />
                                ),
                                title: "Simple Sharing",
                                desc: "Easy-to-use tools for sharing your setups with detailed configuration options",
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-surfaceContainer p-6 rounded-xl border border-surfaceContainerHigh hover:border-primary/30 transition-colors duration-200"
                            >
                                <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-onSurface mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-onSurface/70">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <div className="text-center mt-16">
                        <h3 className="text-2xl font-semibold text-onSurface mb-4">
                            Ready to Improve Your Rally Experience?
                        </h3>
                        <p className="text-onSurface/70 mb-8 max-w-2xl mx-auto">
                            Join thousands of players who have already found
                            their perfect setups and started winning more stages
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href={route("vehicles.index")}
                                className="inline-flex items-center px-8 py-4 bg-primary text-surfaceContainer rounded-xl hover:bg-primary-600 transition-colors duration-200 font-medium text-lg"
                            >
                                <LiaCarSideSolid className="mr-3" />
                                Find Vehicle Setups
                            </Link>
                            <Link
                                href={route("locations.index")}
                                className="inline-flex items-center px-8 py-4 bg-surfaceContainer text-onSurface border border-surfaceContainerHigh rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium text-lg"
                            >
                                <FiMapPin className="mr-3" />
                                Explore Locations
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
