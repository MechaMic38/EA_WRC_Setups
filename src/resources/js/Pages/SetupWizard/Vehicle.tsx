import { Head, Link, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import useAxiosForm from "@/Hooks/useAxiosForm";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiTruck } from "react-icons/fi";
import { PaginatedData, Vehicle } from "@/types";

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
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-onSurface mb-2">
                        Create New Setup
                    </h1>
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-primary text-surfaceContainer flex items-center justify-center font-bold">
                                1
                            </div>
                            <span className="text-sm mt-2 text-onSurface">
                                Location
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-primary text-surfaceContainer flex items-center justify-center font-bold">
                                2
                            </div>
                            <span className="text-sm mt-2 text-primary font-medium">
                                Vehicle
                            </span>
                        </div>
                        <div className="h-1 w-20 bg-surfaceContainer rounded-full" />
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-surfaceContainer text-onSurface flex items-center justify-center font-bold">
                                3
                            </div>
                            <span className="text-sm mt-2 text-onSurface">
                                Options
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center text-primary hover:text-primary-600"
                        >
                            <FiChevronLeft className="mr-1" /> Back to Locations
                        </button>
                        <h2 className="text-xl font-semibold text-onSurface flex items-center">
                            <FiTruck className="mr-2 text-primary" />
                            Select Vehicle
                        </h2>
                        <div className="w-24"></div> {/* Spacer */}
                    </div>

                    {isProcessing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-surfaceContainer rounded-lg p-4 h-40 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vehicles.map((vehicle) => (
                                <button
                                    key={vehicle.id}
                                    onClick={() => setSelectedVehicle(vehicle)}
                                    className={`bg-surfaceContainer rounded-lg overflow-hidden transition-all ${
                                        selectedVehicle?.id === vehicle.id
                                            ? "ring-2 ring-primary"
                                            : "hover:bg-surfaceContainer/80"
                                    }`}
                                >
                                    <div className="h-32 w-full relative">
                                        <img
                                            src={vehicle.imgPath}
                                            alt={vehicle.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surfaceContainer to-transparent h-16" />
                                        <div className="absolute bottom-2 left-2 text-onSurface font-medium">
                                            {vehicle.name}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center">
                                            <img
                                                src={
                                                    vehicle.manufacturer.imgPath
                                                }
                                                alt={vehicle.manufacturer.name}
                                                className="h-6 w-6 object-contain mr-2"
                                            />
                                            <span className="text-sm text-onSurface">
                                                {vehicle.manufacturer.name}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex justify-between">
                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-3 rounded-md flex items-center bg-surfaceContainer text-onSurface hover:bg-surfaceContainer/80"
                        >
                            <FiChevronLeft className="mr-2" /> Back
                        </button>
                        <button
                            onClick={proceedToOptions}
                            disabled={!selectedVehicle}
                            className={`px-6 py-3 rounded-md flex items-center ${
                                selectedVehicle
                                    ? "bg-primary text-surfaceContainer hover:bg-primary-600"
                                    : "bg-surfaceContainer text-onSurface/50 cursor-not-allowed"
                            }`}
                        >
                            Next: Setup Options{" "}
                            <FiChevronRight className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
