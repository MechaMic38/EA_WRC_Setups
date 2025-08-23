import { Head, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiCheck } from "react-icons/fi";
import { PaginatedData, Vehicle } from "@/types";
import { LiaCarSideSolid } from "react-icons/lia";

const SkeletonCard = () => (
    <div className="bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden animate-pulse">
        <div className="h-32 bg-surfaceContainerHigh"></div>
        <div className="p-4">
            <div className="flex items-center mb-3">
                <div className="h-10 w-10 bg-surfaceContainerHigh rounded-full mr-3"></div>
                <div className="flex-1">
                    <div className="h-5 w-3/4 bg-surfaceContainerHigh rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-surfaceContainerHigh rounded"></div>
                </div>
            </div>
        </div>
    </div>
);

export default function SetupCreateVehicle({
    location_id,
}: {
    location_id: string;
}) {
    const { get, isProcessing } = useAxiosForm<PaginatedData<Vehicle>>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
        null
    );

    useEffect(() => {
        get(route("api.vehicles.index", { paginate: false }), {
            onSuccess: (response) => {
                setVehicles(response.data.data);
            },
        });
    }, []);

    const proceedToOptions = () => {
        router.get(route("setups.create.options"), {
            location_id,
            vehicle_id: selectedVehicle?.id,
        });
    };

    return (
        <UserLayout>
            <Head title="Create Setup - Choose Vehicle" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Progress Steps */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-onSurface mb-8">
                        Create New Setup
                    </h1>
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary text-surfaceContainer flex items-center justify-center font-bold text-lg">
                                1
                            </div>
                            <span className="text-sm mt-2 text-onSurface">
                                Location
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary text-surfaceContainer flex items-center justify-center font-bold text-lg">
                                2
                            </div>
                            <span className="text-sm mt-2 text-primary font-medium">
                                Vehicle
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-surfaceContainer rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-surfaceContainer text-onSurface flex items-center justify-center font-bold text-lg">
                                3
                            </div>
                            <span className="text-sm mt-2 text-onSurface">
                                Options
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center px-4 py-2 bg-surfaceContainer text-onSurface rounded-xl hover:bg-surfaceContainerHigh transition-colors duration-200"
                        >
                            <FiChevronLeft className="mr-2" /> Back to Locations
                        </button>
                        <h2 className="text-xl font-semibold text-onSurface flex items-center">
                            <LiaCarSideSolid className="mr-2 text-primary text-2xl" />
                            Select Vehicle
                        </h2>
                        <div className="w-24"></div> {/* Spacer for balance */}
                    </div>

                    {isProcessing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vehicles.map((vehicle) => (
                                <button
                                    key={vehicle.id}
                                    onClick={() => setSelectedVehicle(vehicle)}
                                    className={`bg-surfaceContainer rounded-xl border border-surfaceContainerHigh overflow-hidden hover:shadow-lg transition-all duration-200 group text-left ${
                                        selectedVehicle?.id === vehicle.id
                                            ? "ring-2 ring-primary border-primary/30"
                                            : "hover:border-primary/30"
                                    }`}
                                >
                                    {/* Vehicle Image */}
                                    <div className="h-32 relative overflow-hidden bg-surfaceContainerHigh">
                                        <img
                                            src={vehicle.imgPath}
                                            alt={vehicle.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceContainer/90 text-xs font-medium text-onSurface backdrop-blur-sm">
                                                <img
                                                    src={
                                                        vehicle.category.imgPath
                                                    }
                                                    alt={vehicle.category.name}
                                                    className="h-4 w-4 object-contain mr-1"
                                                />
                                                {vehicle.category.name}
                                            </span>
                                        </div>
                                        {selectedVehicle?.id === vehicle.id && (
                                            <div className="absolute top-3 left-3">
                                                <div className="w-6 h-6 rounded-full bg-primary text-surfaceContainer flex items-center justify-center">
                                                    <FiCheck size={14} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Vehicle Details */}
                                    <div className="p-4">
                                        <div className="flex items-center mb-3">
                                            {/* Manufacturer Logo */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={
                                                        vehicle.manufacturer
                                                            .imgPath
                                                    }
                                                    alt={
                                                        vehicle.manufacturer
                                                            .name
                                                    }
                                                    className="h-12 w-12 object-contain p-1"
                                                />
                                            </div>
                                            {/* Vertical divider */}
                                            <div className="hidden md:block w-px h-12 border border-tertiaryContainer mx-3" />
                                            {/* Manufacturer Name and Vehicle Name */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-onSurface/70 truncate">
                                                    {vehicle.manufacturer.name}
                                                </p>
                                                <h3 className="text-lg font-bold text-onSurface truncate">
                                                    {vehicle.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-12 flex justify-between">
                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-3 rounded-xl flex items-center bg-surfaceContainer text-onSurface hover:bg-surfaceContainerHigh transition-colors duration-200 font-medium"
                        >
                            <FiChevronLeft className="mr-2" /> Back
                        </button>
                        <button
                            onClick={proceedToOptions}
                            disabled={!selectedVehicle}
                            className={`px-8 py-3 rounded-xl flex items-center font-medium transition-all duration-200 ${
                                selectedVehicle
                                    ? "bg-primary text-surfaceContainer hover:bg-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    : "bg-surfaceContainer text-onSurface/50 cursor-not-allowed"
                            }`}
                        >
                            Next: Setup Options{" "}
                            <FiChevronRight className="ml-2" />
                        </button>
                    </div>

                    {/* Selected Vehicle Preview */}
                    {selectedVehicle && (
                        <div className="mt-8 p-6 bg-surfaceContainer rounded-xl border border-surfaceContainerHigh">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <img
                                        src={selectedVehicle.imgPath}
                                        alt={selectedVehicle.name}
                                        className="h-16 w-16 object-contain"
                                    />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-onSurface">
                                        {selectedVehicle.name} Selected
                                    </h3>
                                    <p className="text-sm text-onSurface/70">
                                        Ready to configure setup options for
                                        this vehicle
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
