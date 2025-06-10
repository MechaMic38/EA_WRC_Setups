import { Head, Link } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiMapPin, FiChevronRight } from "react-icons/fi";
import { LocationSummary, PaginatedData } from "@/types";

export default function LocationIndex() {
    const { get, isProcessing } = useAxiosForm<PaginatedData<LocationSummary>>(
        []
    );
    const [locations, setLocations] = useState<LocationSummary[]>([]);

    useEffect(() => {
        get(route("api.locations.index", { paginate: false }), {
            onSuccess: (response) => {
                setLocations(response.data.data);
            },
        });
    }, []);

    return (
        <UserLayout>
            <Head title="Rally Locations" />

            {/* Hero Section */}
            <div className="relative bg-surfaceContainer py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-onSurface">
                        Rally Locations
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-onSurface">
                        Discover all the challenging stages in EA Sports WRC
                    </p>
                </div>
            </div>

            {/* Locations Grid */}
            <div className="py-12 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isProcessing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-surfaceContainer rounded-lg overflow-hidden shadow-md animate-pulse"
                                >
                                    <div className="h-48 bg-surfaceContainer/50"></div>
                                    <div className="p-6">
                                        <div className="h-6 w-3/4 bg-surfaceContainer/50 rounded mb-4"></div>
                                        <div className="h-4 w-full bg-surfaceContainer/50 rounded mb-2"></div>
                                        <div className="h-4 w-2/3 bg-surfaceContainer/50 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {locations.map((location) => (
                                <div
                                    key={location.id}
                                    className="bg-surfaceContainer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    {/* Banner Image */}
                                    <div
                                        className="h-48 bg-cover bg-center relative"
                                        style={{
                                            backgroundImage: `url(${location.imgBgPath})`,
                                        }}
                                    >
                                        <img
                                            src={location.imgBannerPath}
                                            alt={location.name}
                                            className="absolute bottom-4 left-4 h-16 object-contain"
                                        />
                                    </div>

                                    {/* Location Details */}
                                    <div className="p-6">
                                        <div className="flex items-center mb-2">
                                            <FiMapPin className="text-primary mr-2" />
                                            <span className="text-sm font-medium text-primary uppercase">
                                                {location.surfaceType}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-onSurface mb-3">
                                            {location.name}
                                        </h3>
                                        <p className="text-onSurface mb-4 line-clamp-3">
                                            {location.description}
                                        </p>
                                        <Link
                                            href={route(
                                                "locations.show",
                                                location.id
                                            )}
                                            className="inline-flex items-center text-primary hover:text-primary-600 font-medium"
                                        >
                                            View Setups{" "}
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
