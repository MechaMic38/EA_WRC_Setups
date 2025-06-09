import { Head, Link } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import {
    FiDownload,
    FiAward,
    FiUsers,
    FiBarChart2,
    FiUserPlus,
} from "react-icons/fi";
import UserLayout from "@/Layouts/UserLayout";

export default function Welcome() {
    return (
        <UserLayout>
            <div className="min-h-screen bg-surface text-onSurface">
                <Head title="EA Sports WRC - Ultimate Setup Hub" />

                {/* Hero Section */}
                <div className="relative overflow-hidden bg-surfaceContainer">
                    <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <ApplicationLogo className="mx-auto h-24 w-auto" />
                            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                Dominate the Stages
                            </h1>
                            <p className="mt-6 max-w-lg mx-auto text-xl">
                                Download and share the best rally car setups for
                                EA Sports WRC.
                            </p>
                            <div className="mt-10 flex justify-center gap-4">
                                <Link
                                    href={route("setups.index")}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-surfaceContainer bg-primary hover:bg-primary-600"
                                >
                                    <FiDownload className="mr-2" /> Browse
                                    Setups
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="inline-flex items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-surface hover:bg-surfaceContainer"
                                >
                                    <FiUserPlus className="mr-2" /> Join Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-16 bg-surface">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Why Choose Our Setups?
                            </h2>
                            <p className="mt-4 max-w-2xl text-xl mx-auto">
                                Optimized for every condition, tested by top
                                players.
                            </p>
                        </div>

                        <div className="mt-20">
                            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    {
                                        icon: (
                                            <FiAward className="h-12 w-12 text-primary" />
                                        ),
                                        title: "Pro-Tested",
                                        desc: "Setups used by top leaderboard players.",
                                    },
                                    {
                                        icon: (
                                            <FiBarChart2 className="h-12 w-12 text-primary" />
                                        ),
                                        title: "Stage-Specific",
                                        desc: "Tuned for each rally location and surface.",
                                    },
                                    {
                                        icon: (
                                            <FiUsers className="h-12 w-12 text-primary" />
                                        ),
                                        title: "Community Driven",
                                        desc: "Voted & reviewed by thousands of players.",
                                    },
                                    {
                                        icon: (
                                            <FiDownload className="h-12 w-12 text-primary" />
                                        ),
                                        title: "Always Updated",
                                        desc: "New setups added daily for the latest cars.",
                                    },
                                ].map((feature, index) => (
                                    <div key={index} className="text-center">
                                        <div className="flex justify-center">
                                            {feature.icon}
                                        </div>
                                        <h3 className="mt-6 text-lg font-medium">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-base">
                                            {feature.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popular Setups Preview */}
                <div className="py-16 bg-surfaceContainer">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-extrabold text-center mb-12">
                            Trending Setups
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="bg-surface p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="h-40 bg-surfaceContainer rounded-md mb-4"></div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        Hyundai i20 N Rally1
                                    </h3>
                                    <p className="mb-4">Monte Carlo - Tarmac</p>
                                    <Link
                                        href="#"
                                        className="inline-flex items-center text-primary hover:text-primary-600"
                                    >
                                        View Setup{" "}
                                        <span aria-hidden="true">&rarr;</span>
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

                {/* CTA Section */}
                <div className="bg-surface py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-extrabold mb-6">
                            Ready to Improve Your Times?
                        </h2>
                        <p className="text-xl mb-8 max-w-3xl mx-auto">
                            Join thousands of players using our setups to
                            dominate in EA Sports WRC.
                        </p>
                        <Link
                            href={route("register")}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-surfaceContainer bg-primary hover:bg-primary-600"
                        >
                            Sign Up for Free
                        </Link>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
