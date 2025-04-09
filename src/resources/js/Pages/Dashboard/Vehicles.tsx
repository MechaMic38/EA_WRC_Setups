import useAxiosForm from "@/Hooks/useAxiosForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, PaginatedData, Vehicle } from "@/types";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

const SkeletonRow = () => (
    <tr>
        <td className="py-3 px-4">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </td>
        <td className="py-3 px-4">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </td>
    </tr>
);

const Vehicles = () => {
    const { get, isProcessing } = useAxiosForm<PaginatedData<Vehicle>>([]);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            get(route("api.vehicles.index"), {
                onSuccess: (response) => {
                    setVehicles(response.data.data);
                },
                onError: (error) => {
                    console.error("Error fetching vehicles:", error);
                },
            });
        };

        fetchVehicles();
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Vehicles
                </h2>
            }
        >
            <Head title="Vehicles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <table className="min-w-full border border-gray-200 dark:border-gray-600 bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-900">
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Image
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Name
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Category
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isProcessing
                                ? Array.from({ length: 10 }).map((_, i) => (
                                      <SkeletonRow key={i} />
                                  ))
                                : vehicles.map((vehicle) => (
                                      <tr
                                          key={vehicle.id}
                                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                      >
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                              <div className="max-w-[20%] h-12 flex items-center justify-center">
                                                  <img
                                                      src={
                                                          vehicle.manufacturer
                                                              .imgPath
                                                      }
                                                      alt={
                                                          vehicle.manufacturer
                                                              .name
                                                      }
                                                      className="max-h-[100%] object-contain mx-auto"
                                                  />
                                              </div>
                                          </td>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                              {vehicle.name}
                                          </td>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                              {vehicle.category.name}
                                          </td>
                                      </tr>
                                  ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Vehicles;
