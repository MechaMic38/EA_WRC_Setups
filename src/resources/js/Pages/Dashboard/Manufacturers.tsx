import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Manufacturer, PageProps, PaginatedData } from "@/types";
import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import useAxiosForm from "@/Hooks/useAxiosForm";

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

const Manufacturers = () => {
    const { get, isProcessing } = useAxiosForm<PaginatedData<Manufacturer>>([]);

    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

    useEffect(() => {
        const fetchManufacturers = async () => {
            get(route("api.manufacturers.index"), {
                onSuccess: (response) => {
                    setManufacturers(response.data.data);
                },
                onError: (error) => {
                    console.error("Error fetching manufacturers:", error);
                },
            });
        };

        fetchManufacturers();
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Manufacturers
                </h2>
            }
        >
            <Head title="Manufacturers" />

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
                            </tr>
                        </thead>
                        <tbody>
                            {isProcessing
                                ? Array.from({ length: 10 }, (_, index) => (
                                      <SkeletonRow key={index} />
                                  ))
                                : manufacturers.map((manufacturer) => (
                                      <tr
                                          key={manufacturer.id}
                                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                      >
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                                              <div className="max-w-[20%] h-12 flex items-center justify-center">
                                                  <img
                                                      src={manufacturer.imgPath}
                                                      alt={manufacturer.name}
                                                      className="max-h-[100%] object-contain mx-auto"
                                                  />
                                              </div>
                                          </td>
                                          <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                              {manufacturer.name}
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

export default Manufacturers;
