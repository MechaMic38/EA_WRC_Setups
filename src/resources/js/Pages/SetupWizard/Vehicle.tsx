import { Head, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PaginatedData, Vehicle } from "@/types";
import { LiaCarSideSolid } from "react-icons/lia";
import VehicleCard from "@/Components/Cards/VehicleCard";
import VehicleCardSkeleton from "@/Components/Skeletons/VehicleCardSkeleton";

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
                                <VehicleCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vehicles.map((vehicle) => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    mode="selection"
                                    selected={
                                        selectedVehicle?.id === vehicle.id
                                    }
                                    onSelect={setSelectedVehicle}
                                />
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
