import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Location, PageProps, PaginatedData } from "@/types";
import { Head } from "@inertiajs/react";
import axios from "axios";
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

const Locations = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("/api/locations");
                setLocations(response.data.data);
            } catch (error) {
                console.error("Error fetching locations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Locations
                </h2>
            }
        >
            <Head title="Locations" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <table className="min-w-full border border-gray-200 dark:border-gray-600 bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-900">
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Banner
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Name
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Description
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-gray-100">
                                    Surface
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading
                                ? Array.from({ length: 10 }, (_, i) => (
                                      <SkeletonRow key={i} />
                                  ))
                                : locations.map((location) => (
                                      <tr
                                          key={location.id}
                                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                      >
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                                              <img
                                                  src={location.img_banner_path}
                                                  alt={location.name}
                                                  className="w-20 h-auto object-cover rounded"
                                              />
                                          </td>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                              {location.name}
                                          </td>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                              {location.description}
                                          </td>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                              {location.surface_type}
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

export default Locations;
