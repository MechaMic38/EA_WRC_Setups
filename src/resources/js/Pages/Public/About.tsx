import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import { FiAward, FiUsers, FiCode, FiHeart } from "react-icons/fi";

export default function About() {
    return (
        <UserLayout>
            <Head title="About EA Sports WRC Setup Hub" />

            {/* Hero Section */}
            <div className="relative bg-surfaceContainer py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-onSurface">
                        About Our Community
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-onSurface">
                        The ultimate resource for EA Sports WRC tuning setups
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-invert max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-onSurface mb-6">
                            Our Mission
                        </h2>
                        <p className="text-onSurface mb-6">
                            At EA Sports WRC Setup Hub, we're passionate about
                            rally racing and helping drivers achieve their best
                            performance. Our platform was created to bring
                            together a community of players who share tuning
                            setups, strategies, and knowledge about the game.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                            {[
                                {
                                    icon: (
                                        <FiAward className="h-8 w-8 text-primary" />
                                    ),
                                    title: "Top-Tier Setups",
                                    description:
                                        "Curated collection of high-performance setups from experienced players",
                                },
                                {
                                    icon: (
                                        <FiUsers className="h-8 w-8 text-primary" />
                                    ),
                                    title: "Community Driven",
                                    description:
                                        "Built by players, for players - everyone can contribute",
                                },
                                {
                                    icon: (
                                        <FiCode className="h-8 w-8 text-primary" />
                                    ),
                                    title: "Open Platform",
                                    description:
                                        "Free access to all setups with detailed specifications",
                                },
                                {
                                    icon: (
                                        <FiHeart className="h-8 w-8 text-primary" />
                                    ),
                                    title: "Passion Project",
                                    description:
                                        "Created by rally enthusiasts who love the sport",
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-surfaceContainer p-6 rounded-lg"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 rounded-full bg-surface mr-4">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-onSurface">
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className="text-onSurface">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-2xl font-bold text-onSurface mb-6 mt-12">
                            How It Works
                        </h2>
                        <ol className="list-decimal pl-6 space-y-4 text-onSurface">
                            <li>
                                <strong>Browse setups</strong> - Search by
                                vehicle, location, or surface type
                            </li>
                            <li>
                                <strong>Download configurations</strong> - Get
                                detailed tuning specifications
                            </li>
                            <li>
                                <strong>Test and adapt</strong> - Adjust to your
                                driving style
                            </li>
                            <li>
                                <strong>Share your improvements</strong> -
                                Contribute back to the community
                            </li>
                        </ol>

                        <h2 className="text-2xl font-bold text-onSurface mb-6 mt-12">
                            The Team
                        </h2>
                        <p className="text-onSurface mb-6">
                            We're a small group of rally enthusiasts and
                            software developers who wanted to create a better
                            way to share tuning knowledge. Our team includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-onSurface mb-12">
                            <li>Former rally drivers</li>
                            <li>Game tuning specialists</li>
                            <li>Web developers passionate about racing</li>
                            <li>Community moderators</li>
                        </ul>

                        <div className="bg-surfaceContainer p-6 rounded-lg mt-12">
                            <h3 className="text-xl font-bold text-primary mb-4">
                                Join Our Community
                            </h3>
                            <p className="text-onSurface mb-4">
                                Whether you're a casual player or competitive
                                racer, we welcome you to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-onSurface">
                                <li>Share your favorite setups</li>
                                <li>Discuss tuning strategies</li>
                                <li>Help improve the platform</li>
                                <li>Connect with other rally fans</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
